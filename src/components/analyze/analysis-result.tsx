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
      ? "bg-emerald-500"
      : score >= 40
        ? "bg-amber-500"
        : "bg-rose-500";

  const textColor =
    score >= 70
      ? "text-emerald-600"
      : score >= 40
        ? "text-amber-600"
        : "text-rose-600";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-sm font-semibold ${textColor} tabular-nums`}>
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
      className={`bg-card border border-border rounded-xl p-5 animate-fade-in-up ${delay} ${accent ? `border-l-2 ${accent}` : ""}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-muted" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SeverityBadge({ severity }: { severity: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-rose-50 text-rose-600",
    medium: "bg-amber-50 text-amber-600",
    low: "bg-stone-100 text-stone-500",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[severity]}`}
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
        <p className="text-muted leading-relaxed">{analysis.summary}</p>
      </Card>

      {/* Speaker Reliability */}
      <Card
        icon={UserCheck}
        title="Speaker Reliability"
        accent="border-l-sky-400"
        delay="delay-100"
      >
        <ConfidenceMeter score={analysis.speakerReliability.score} />
        <p className="text-muted leading-relaxed mt-3">
          {analysis.speakerReliability.assessment}
        </p>
        {analysis.speakerReliability.factors.length > 0 && (
          <ul className="mt-2 space-y-1">
            {analysis.speakerReliability.factors.map((f, i) => (
              <li
                key={i}
                className="text-sm text-muted flex items-start gap-2"
              >
                <span className="text-stone-400 mt-1">&bull;</span>
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
                className="bg-stone-50 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground text-sm">
                    {f.name}
                  </span>
                  <SeverityBadge severity={f.severity} />
                </div>
                <p className="text-sm text-muted">{f.explanation}</p>
                {f.quote && (
                  <blockquote className="mt-2 text-xs text-stone-400 italic border-l-2 border-stone-200 pl-2">
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
                className="bg-stone-50 rounded-lg p-3"
              >
                <span className="font-medium text-foreground text-sm">
                  {t.name}
                </span>
                <p className="text-sm text-muted mt-1">{t.explanation}</p>
                {t.quote && (
                  <blockquote className="mt-2 text-xs text-stone-400 italic border-l-2 border-stone-200 pl-2">
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
        <p className="text-muted leading-relaxed mt-3">
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
                className="text-sm text-muted flex items-start gap-2"
              >
                <span className="text-stone-400 mt-0.5">&bull;</span>
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
              <div key={i}>
                <p className="text-sm text-muted">{item.mistake}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <ArrowRight className="h-3 w-3 text-stone-400 flex-shrink-0" />
                  <p className="text-sm text-foreground">{item.advice}</p>
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
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${learnMoreOpen ? "rotate-180" : ""}`}
          />
          Learn more about critical thinking
        </button>
        {learnMoreOpen && (
          <div className="mt-3 bg-stone-50 border border-border rounded-xl p-5 text-sm text-muted leading-relaxed space-y-2">
            <p>
              <strong className="text-foreground">Logical fallacies</strong> are
              errors in reasoning that undermine the logic of an argument. They
              can be intentional (to persuade) or unintentional (due to sloppy
              thinking).
            </p>
            <p>
              <strong className="text-foreground">Rhetorical tricks</strong> are
              persuasion techniques that appeal to emotions rather than logic.
              They&apos;re not always bad, but recognizing them helps you
              evaluate arguments more objectively.
            </p>
            <p>
              <strong className="text-foreground">Speaker reliability</strong>{" "}
              considers the speaker&apos;s expertise, track record, potential
              biases, and whether they cite credible sources.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
