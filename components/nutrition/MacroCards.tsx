interface Macro {
  name: string;
  value: number;
  target: number;
  unit: string;
}

interface MacroCardsProps {
  macros: Macro[];
}

export default function MacroCards({ macros }: MacroCardsProps) {
  return (
    <div className="space-y-6">
    <div className="rounded-2xl border bg-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Macronutrients</h2>

        <p className="text-sm text-muted-foreground">
          Track your daily protein, carbs and fats.
        </p>
      </div>

      <div className="space-y-6">
        {macros.map((macro) => {
          const percentage = Math.min(
            (macro.value / macro.target) * 100,
            100
          );

          return (
            <div key={macro.name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{macro.name}</span>

                <span className="text-sm text-muted-foreground">
                  {macro.value}
                  {macro.unit} / {macro.target}
                  {macro.unit}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <div className="mt-1 text-right text-xs text-muted-foreground">
                {Math.round(percentage)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}