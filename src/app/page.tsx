import Link from "next/link";
import {
  ScanSearch,
  ArrowRight,
  Youtube,
  FileText,
  MessageCircle,
  Shield,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      {/* Hero */}
      <div className="text-center animate-fade-in-up">
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 mb-6">
          <ScanSearch className="h-8 w-8 text-sky-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Think critically.{" "}
          <span className="text-sky-400">Sift through the noise.</span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
          Paste any YouTube video or article URL and get an AI-powered analysis
          of reasoning, rhetoric, fallacies, and speaker reliability.
        </p>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 mt-8 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/25"
        >
          Start Analyzing
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-2 gap-4 mt-20">
        {[
          {
            icon: Youtube,
            title: "YouTube Videos",
            desc: "Extracts captions and transcripts automatically for analysis.",
            color: "text-red-400",
            bg: "bg-red-500/10 border-red-500/20",
            delay: "delay-100",
          },
          {
            icon: FileText,
            title: "Articles & Blogs",
            desc: "Parses article text from any URL for critical review.",
            color: "text-blue-400",
            bg: "bg-blue-500/10 border-blue-500/20",
            delay: "delay-200",
          },
          {
            icon: Shield,
            title: "Fallacy Detection",
            desc: "Identifies logical fallacies, rhetorical tricks, and bias.",
            color: "text-amber-400",
            bg: "bg-amber-500/10 border-amber-500/20",
            delay: "delay-300",
          },
          {
            icon: MessageCircle,
            title: "Co-Pilot Chat",
            desc: "Ask follow-up questions with a Socratic thinking partner.",
            color: "text-sky-400",
            bg: "bg-sky-500/10 border-sky-500/20",
            delay: "delay-400",
          },
        ].map((f) => (
          <div
            key={f.title}
            className={`relative bg-gray-900/60 border border-gray-800 rounded-xl p-5 animate-fade-in-up ${f.delay} overflow-hidden`}
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
            <div
              className={`inline-flex p-2 rounded-lg ${f.bg} border mb-3`}
            >
              <f.icon className={`h-4 w-4 ${f.color}`} />
            </div>
            <h3 className="font-semibold text-white">{f.title}</h3>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-gray-800/50 text-center text-xs text-gray-600">
        <p>
          Powered by Anthropic&apos;s Claude API. Nothing is stored permanently.
        </p>
      </footer>
    </div>
  );
}
