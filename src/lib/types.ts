export interface ContentExtraction {
  url: string;
  title: string;
  contentType: "youtube" | "article";
  text: string;
  author?: string;
  thumbnailUrl?: string;
}

export interface FallacyItem {
  name: string;
  explanation: string;
  quote: string;
  severity: "high" | "medium" | "low";
}

export interface RhetoricalTrick {
  name: string;
  explanation: string;
  quote: string;
}

export interface ContentAnalysis {
  summary: string;
  speakerReliability: {
    score: number;
    assessment: string;
    factors: string[];
  };
  fallacies: FallacyItem[];
  rhetoricalTricks: RhetoricalTrick[];
  credibilityScore: number;
  credibilityExplanation: string;
  keyTakeaways: string[];
  howToAvoid: { mistake: string; advice: string }[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
