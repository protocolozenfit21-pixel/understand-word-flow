import { useState } from "react";
import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/types";
import { cn } from "@/lib/utils";

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const correct = questions.filter((q) => answers[q.id] === q.answer).length;
  const answered = Object.keys(answers).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Opcional e sem pressão — serve só para fixar o que você leu.</p>

      {questions.map((q, idx) => {
        const chosen = answers[q.id];
        return (
          <div key={q.id} className="rounded-2xl border border-border/70 bg-card p-4">
            <p className="text-sm font-medium">
              {idx + 1}. {q.question}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, i) => {
                const isChosen = chosen === i;
                const isRight = i === q.answer;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={chosen !== undefined}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-xl border border-border/70 px-3 py-2.5 text-left text-sm transition-colors",
                      chosen === undefined && "hover:bg-secondary",
                      isChosen && isRight && "border-sage bg-sage/20",
                      isChosen && !isRight && "border-destructive/50 bg-destructive/10",
                      chosen !== undefined && !isChosen && isRight && "border-sage/50",
                    )}
                  >
                    {opt}
                    {isChosen ? isRight ? <Check className="size-4 shrink-0" /> : <X className="size-4 shrink-0" /> : null}
                  </button>
                );
              })}
            </div>
            {chosen !== undefined ? (
              <p className="mt-3 rounded-xl bg-insight p-3 text-sm leading-relaxed text-insight-foreground">
                {q.explanation}
              </p>
            ) : null}
          </div>
        );
      })}

      {answered === questions.length ? (
        <div className="rounded-2xl bg-secondary p-4 text-sm">
          Você acertou {correct} de {questions.length}. Independente do resultado, o mais importante é o que ficou com
          você desta leitura. 🌱
        </div>
      ) : null}
    </div>
  );
}
