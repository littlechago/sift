import Anthropic from "@anthropic-ai/sdk";
import type { ContentExtraction, ChatMessage } from "@/lib/types";

const client = new Anthropic();

function buildSystemPrompt(content: ContentExtraction): string {
  return `You are a Socratic critical thinking co-pilot. The user has just analyzed the following content and may have follow-up questions.

Content Type: ${content.contentType === "youtube" ? "YouTube Video" : "Article"}
Title: ${content.title}
${content.author ? `Author/Speaker: ${content.author}` : ""}

--- CONTENT ---
${content.text.slice(0, 10_000)}
--- END CONTENT ---

Guidelines:
- Help the user think critically about this content
- When they ask questions, guide them to reason through the answer rather than just giving it
- Point out nuances, counterarguments, and things they might be missing
- If they ask about claims, help them evaluate evidence quality
- Be concise and conversational — this is a chat, not an essay
- Use specific quotes from the content when relevant`;
}

export async function POST(req: Request) {
  try {
    const { messages, content } = (await req.json()) as {
      messages: ChatMessage[];
      content: ContentExtraction;
    };

    if (!messages?.length || !content?.text) {
      return new Response("Messages and content are required.", { status: 400 });
    }

    const stream = client.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: buildSystemPrompt(content),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          console.error("[chat stream]", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("[chat]", err);
    return new Response("Chat failed.", { status: 500 });
  }
}
