import Link from "next/link";
import {
  ArrowRight,
  Youtube,
  FileText,
  MessageCircle,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Youtube,
    title: "YouTube Videos",
    desc: "Extracts captions and transcripts automatically for analysis.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: FileText,
    title: "Articles & Blogs",
    desc: "Parses article text from any URL for critical review.",
    color: "text-sky-500",
    bg: "bg-sky-50",
  },
  {
    icon: Shield,
    title: "Fallacy Detection",
    desc: "Identifies logical fallacies, rhetorical tricks, and bias.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: MessageCircle,
    title: "Co-Pilot Chat",
    desc: "Ask follow-up questions with a Socratic thinking partner.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      {/* Hero */}
      <div className="text-center animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-serif italic text-foreground leading-tight">
          Sift through the noise.
        </h1>
        <p className="mt-4 text-muted max-w-lg mx-auto leading-relaxed">
          Paste any YouTube video or article URL and get an AI-powered analysis
          of reasoning, rhetoric, fallacies, and speaker reliability.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
        {features.map((f, i) => {
          const delay = ["delay-100", "delay-200", "delay-300", "delay-400"][i];
          return (
            <div
              key={f.title}
              className={`bg-card border border-border rounded-xl p-5 animate-fade-in-up ${delay}`}
            >
              <div
                className={`inline-flex p-2.5 rounded-xl ${f.bg} mb-4`}
              >
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted mt-1.5 leading-relaxed">
                {f.desc}
              </p>
              <Link
                href="/analyze"
                className={`inline-flex items-center gap-1 text-sm font-medium mt-4 ${f.color} hover:opacity-70 transition-opacity`}
              >
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="mt-24 text-center text-sm text-muted">
        Sift helps you think more clearly. It grades reasoning, not truth.
      </footer>
    </div>
  );
}
