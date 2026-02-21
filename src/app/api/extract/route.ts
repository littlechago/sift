import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import type { ContentExtraction } from "@/lib/types";

const MAX_TEXT_LENGTH = 15_000;
const INNERTUBE_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";

function isYouTubeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === "www.youtube.com" ||
      u.hostname === "youtube.com" ||
      u.hostname === "m.youtube.com" ||
      u.hostname === "youtu.be"
    );
  } catch {
    return false;
  }
}

function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

async function extractYouTube(url: string): Promise<ContentExtraction> {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) throw new Error("Could not extract YouTube video ID from URL.");

  // Use InnerTube ANDROID client to get caption URLs that work server-side
  const playerRes = await fetch(
    `https://www.youtube.com/youtubei/v1/player?key=${INNERTUBE_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "ANDROID",
            clientVersion: "19.09.37",
            androidSdkVersion: 30,
          },
        },
        videoId,
      }),
    },
  );

  if (!playerRes.ok) throw new Error("Failed to fetch video data.");
  const playerData = await playerRes.json();

  const videoDetails = playerData?.videoDetails;
  const title = videoDetails?.title || "YouTube Video";
  const author = videoDetails?.author || undefined;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  // Get caption tracks
  const captionTracks = playerData?.captions?.playerCaptionsTracklistRenderer
    ?.captionTracks as { baseUrl: string; languageCode: string }[] | undefined;

  if (!captionTracks || captionTracks.length === 0) {
    throw new Error(
      "This video has no captions/subtitles available. Try a video with closed captions enabled.",
    );
  }

  const track =
    captionTracks.find((t) => t.languageCode.startsWith("en")) ||
    captionTracks[0];

  // Fetch captions XML
  const captionRes = await fetch(track.baseUrl);
  if (!captionRes.ok) throw new Error("Failed to fetch video captions.");
  const captionXml = await captionRes.text();

  // Parse caption XML with cheerio
  // Supports both format="3" (<p>/<s> tags) and legacy (<text> tags)
  const xml$ = cheerio.load(captionXml, { xmlMode: true });

  let segments: string[];
  if (xml$("p").length > 0) {
    // Format 3: <p> elements containing <s> word segments
    segments = xml$("p")
      .map((_, el) => xml$(el).text().replace(/\n/g, " ").trim())
      .get();
  } else {
    // Legacy format: <text> elements
    segments = xml$("text")
      .map((_, el) => xml$(el).text().replace(/\n/g, " ").trim())
      .get();
  }

  if (segments.length === 0) {
    throw new Error("Could not parse caption data.");
  }

  const text = segments
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .slice(0, MAX_TEXT_LENGTH);

  return { url, title, contentType: "youtube", text, author, thumbnailUrl };
}

async function extractArticle(url: string): Promise<ContentExtraction> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SiftBot/1.0)",
      Accept: "text/html",
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch article (HTTP ${res.status}).`);
  const html = await res.text();
  const $ = cheerio.load(html);

  $("script, style, nav, footer, header, aside, iframe, noscript, svg").remove();
  $('[role="navigation"], [role="banner"], [role="contentinfo"]').remove();

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().trim() ||
    $("h1").first().text().trim() ||
    "Article";

  const author =
    $('meta[name="author"]').attr("content") ||
    $('meta[property="article:author"]').attr("content") ||
    $('[rel="author"]').first().text().trim() ||
    undefined;

  const thumbnailUrl =
    $('meta[property="og:image"]').attr("content") || undefined;

  const container = $("article").length
    ? $("article")
    : $("main").length
      ? $("main")
      : $("body");

  const paragraphs: string[] = [];
  container.find("p, h1, h2, h3, h4, h5, h6, li, blockquote").each((_, el) => {
    const t = $(el).text().trim();
    if (t.length > 20) paragraphs.push(t);
  });

  const text = paragraphs.join("\n\n").slice(0, MAX_TEXT_LENGTH);
  if (text.length < 100) {
    throw new Error(
      "Could not extract enough text from this URL. The page may be behind a paywall or use heavy JavaScript rendering.",
    );
  }

  return { url, title, contentType: "article", text, author, thumbnailUrl };
}

export async function POST(req: Request) {
  try {
    const { url } = (await req.json()) as { url: string };
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required." }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
    }

    const extraction = isYouTubeUrl(url)
      ? await extractYouTube(url)
      : await extractArticle(url);

    return NextResponse.json(extraction);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to extract content.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
