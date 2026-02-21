import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { ContentExtraction, ContentAnalysis } from "@/lib/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a world-class critical thinking expert. Analyze the following content and return a structured JSON assessment.

Your analysis must include:
1. A concise summary (2-3 sentences)
2. Speaker/author reliability assessment with a score 0-100, an assessment paragraph, and key factors
3. Logical fallacies found — for each: name, explanation of why it's a fallacy, direct quote, severity (high/medium/low)
4. Rhetorical tricks used — for each: name, explanation, direct quote
5. Overall credibility score 0-100 with explanation
6. Key takeaways (3-5 bullet points of what's actually true/useful)
7. "How to avoid" — pairs of { mistake, advice } teaching the reader how to spot these issues

Be thorough but fair. Not all content is misleading — if the content is well-reasoned, say so. Score honestly.

Return ONLY valid JSON matching this exact schema (no markdown, no code fences):
{
  "summary": "string",
  "speakerReliability": { "score": number, "assessment": "string", "factors": ["string"] },
  "fallacies": [{ "name": "string", "explanation": "string", "quote": "string", "severity": "high|medium|low" }],
  "rhetoricalTricks": [{ "name": "string", "explanation": "string", "quote": "string" }],
  "credibilityScore": number,
  "credibilityExplanation": "string",
  "keyTakeaways": ["string"],
  "howToAvoid": [{ "mistake": "string", "advice": "string" }]
}`;

export async function POST(req: Request) {
  try {
    const { content } = (await req.json()) as { content: ContentExtraction };
    if (!content?.text) {
      return NextResponse.json(
        { error: "Content with text is required." },
        { status: 400 },
      );
    }

    const userMessage = [
      `Content Type: ${content.contentType === "youtube" ? "YouTube Video Transcript" : "Article"}`,
      `Title: ${content.title}`,
      content.author ? `Author/Speaker: ${content.author}` : null,
      `\n--- CONTENT ---\n${content.text}`,
    ]
      .filter(Boolean)
      .join("\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    let analysis: ContentAnalysis;
    try {
      analysis = JSON.parse(text) as ContentAnalysis;
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Failed to parse analysis response.");
      }
      analysis = JSON.parse(jsonMatch[0]) as ContentAnalysis;
    }

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("[analyze]", err);
    const message =
      err instanceof Error ? err.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
