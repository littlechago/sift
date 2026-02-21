"use client";

import { useState } from "react";
import {
  FileText,
  UserCheck,
  AlertTriangle,
  Sparkles,
  Lightbulb,
  Shield,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import type { ContentAnalysis } from "@/lib/types";

function ConfidenceMeter({ score }: { score: number }) {
  const color =
    score >= 70
      ? "from-green-500 to-emerald-500"
      : score >= 40
        ? "from-amber-500 to-yellow-500"
        : "from-red-500 to-rose-500";

  const textColor =
    score >= 70
      ? "text-green-400"
      : score >= 40
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-sm font-bold ${textColor} tabular-nums`}>
        {score}/100
      </span>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  accent,
  delay,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  accent?: string;
  delay: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative bg-gray-900/80 border border-gray-800 rounded-xl p-5 animate-fade-in-up ${delay} overflow-hidden ${accent ? `border-l-2 ${accent}` : ""}`}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-sky-400" />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SeverityBadge({ severity }: { severity: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-stone-500/10 text-stone-400 border-stone-500/20",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

export function AnalysisResult({ analysis }: { analysis: ContentAnalysis }) {
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card icon={FileText} title="Summary" delay="delay-100">
        <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
      </Card>

      {/* Speaker Reliability */}
      <Card
        icon={UserCheck}
        title="Speaker Reliability"
        accent="border-l-sky-400"
        delay="delay-100"
      >
        <ConfidenceMeter score={analysis.speakerReliability.score} />
        <p className="text-gray-300 leading-relaxed mt-3">
          {analysis.speakerReliability.assessment}
        </p>
        {analysis.speakerReliability.factors.length > 0 && (
          <ul className="mt-2 space-y-1">
            {analysis.speakerReliability.factors.map((f, i) => (
              <li
                key={i}
                className="text-sm text-gray-400 flex items-start gap-2"
              >
                <span className="text-sky-400 mt-1">&bull;</span>
                {f}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Logical Fallacies */}
      {analysis.fallacies.length > 0 && (
        <Card icon={AlertTriangle} title="Logical Fallacies" delay="delay-200">
          <div className="space-y-3">
            {analysis.fallacies.map((f, i) => (
              <div
                key={i}
                className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white text-sm">
                    {f.name}
                  </span>
                  <SeverityBadge severity={f.severity} />
                </div>
                <p className="text-sm text-gray-300">{f.explanation}</p>
                {f.quote && (
                  <blockquote className="mt-2 text-xs text-gray-500 italic border-l-2 border-gray-700 pl-2">
                    &ldquo;{f.quote}&rdquo;
                  </blockquote>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Rhetorical Tricks */}
      {analysis.rhetoricalTricks.length > 0 && (
        <Card icon={Sparkles} title="Rhetorical Tricks" delay="delay-200">
          <div className="space-y-3">
            {analysis.rhetoricalTricks.map((t, i) => (
              <div
                key={i}
                className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30"
              >
                <span className="font-medium text-white text-sm">{t.name}</span>
                <p className="text-sm text-gray-300 mt-1">{t.explanation}</p>
                {t.quote && (
                  <blockquote className="mt-2 text-xs text-gray-500 italic border-l-2 border-gray-700 pl-2">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Credibility Score */}
      <Card icon={Shield} title="Credibility Score" delay="delay-300">
        <ConfidenceMeter score={analysis.credibilityScore} />
        <p className="text-gray-300 leading-relaxed mt-3">
          {analysis.credibilityExplanation}
        </p>
      </Card>

      {/* Key Takeaways */}
      {analysis.keyTakeaways.length > 0 && (
        <Card icon={Lightbulb} title="Key Takeaways" delay="delay-300">
          <ul className="space-y-2">
            {analysis.keyTakeaways.map((t, i) => (
              <li
                key={i}
                className="text-sm text-gray-300 flex items-start gap-2"
              >
                <span className="text-sky-400 mt-0.5">&bull;</span>
                {t}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* How to Avoid */}
      {analysis.howToAvoid.length > 0 && (
        <Card
          icon={Shield}
          title="How to Avoid These Mistakes"
          delay="delay-400"
        >
          <div className="space-y-3">
            {analysis.howToAvoid.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">{item.mistake}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ArrowRight className="h-3 w-3 text-sky-400 flex-shrink-0" />
                    <p className="text-sm text-gray-200">{item.advice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Learn More */}
      <div className="animate-fade-in-up delay-500">
        <button
          onClick={() => setLearnMoreOpen(!learnMoreOpen)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${learnMoreOpen ? "rotate-180" : ""}`}
          />
          Learn more about critical thinking
        </button>
        {learnMoreOpen && (
          <div className="mt-3 bg-gray-900/60 border border-gray-800 rounded-xl p-5 text-sm text-gray-400 leading-relaxed space-y-2">
            <p>
              <strong className="text-gray-300">Logical fallacies</strong> are
              errors in reasoning that undermine the logic of an argument. They
              can be intentional (to persuade) or unintentional (due to sloppy
              thinking).
            </p>
            <p>
              <strong className="text-gray-300">Rhetorical tricks</strong> are
              persuasion techniques that appeal to emotions rather than logic.
              They&apos;re not always bad, but recognizing them helps you
              evaluate arguments more objectively.
            </p>
            <p>
              <strong className="text-gray-300">Speaker reliability</strong>{" "}
              considers the speaker&apos;s expertise, track record, potential
              biases, and whether they cite credible sources.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
