"use client";

type Fit = {
  targetPages: number;
  estimatedPages: number;
  compactLevel: number;
  exceedsTarget: boolean;
  suggestions: string[];
};

export function FitAdvisor({ fit }: { fit: Fit }) {
  return (
    <div className="advisor">
      <div className="advisor-metric">
        <span>页数</span>
        <strong className={fit.exceedsTarget ? "danger" : "ok"}>
          {fit.estimatedPages}/{fit.targetPages}
        </strong>
      </div>
      <ul>
        {fit.suggestions.slice(0, 5).map((suggestion) => (
          <li key={suggestion}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
}
