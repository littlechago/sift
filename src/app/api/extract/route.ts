import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import type { ContentExtraction } from "@/lib/types";

const MAX_TEXT_LENGTH = 15_000;

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

  const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!pageRes.ok) throw new Error("Failed to fetch YouTube page.");
  const html = await pageRes.text();

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch
    ? titleMatch[1].replace(" - YouTube", "").trim()
    : "YouTube Video";

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const authorMatch = html.match(/"author":"([^"]+)"/);
  const author = authorMatch ? authorMatch[1] : undefined;

  // Extract captions from ytInitialPlayerResponse
  const playerMatch = html.match(
    new RegExp(
      "ytInitialPlayerResponse\\s*=\\s*(\\{.+?\\});(?:\\s*var\\s|<\\/script>)",
      "s",
    ),
  );
  if (!playerMatch) {
    throw new Error(
      "Could not access video data. The video may be private, age-restricted, or unavailable.",
    );
  }

  let playerResponse: Record<string, unknown>;
  try {
    playerResponse = JSON.parse(playerMatch[1]);
  } catch {
    throw new Error("Could not parse YouTube video data.");
  }

  const captions = (playerResponse as Record<string, unknown>).captions as
    | Record<string, unknown>
    | undefined;
  const renderer = captions?.playerCaptionsTracklistRenderer as
    | Record<string, unknown>
    | undefined;
  const captionTracks = renderer?.captionTracks as
    | { baseUrl: string; languageCode: string }[]
    | undefined;

  if (!captionTracks || captionTracks.length === 0) {
    throw new Error(
      "This video has no captions/subtitles available. Try a video with closed captions enabled.",
    );
  }

  const track =
    captionTracks.find((t) => t.languageCode.startsWith("en")) ||
    captionTracks[0];

  const captionRes = await fetch(track.baseUrl);
  if (!captionRes.ok) throw new Error("Failed to fetch video captions.");
  const captionXml = await captionRes.text();

  const textSegments = captionXml.match(/<text[^>]*>([^<]*)<\/text>/g);
  if (!textSegments) throw new Error("Could not parse caption data.");

  const text = textSegments
    .map((seg) => {
      const content = seg.replace(/<[^>]+>/g, "");
      return content
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n/g, " ")
        .trim();
    })
    .filter(Boolean)
    .join(" ")
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
