import { useState, useMemo } from "react";
import { useHealthStore } from "@/lib/store";
import { Plus, Activity, Zap, Droplets, Moon, Smile } from "lucide-react";

export default function HealthPage() {
  const [newMetric, setNewMetric] = useState({
    sleep: "",
    steps: "",
    calories: "",
    water: "",
    exercise: "",
    mood: "",
  });

  const metrics = useHealthStore((state) => state.metrics);
  const addMetric = useHealthStore((state) => state.addMetric);
  const getLatestMetric = useHealthStore((state) => state.getLatestMetric);

  const handleAddMetric = () => {
    if (newMetric.sleep || newMetric.steps || newMetric.mood) {
      addMetric({
        sleep: parseFloat(newMetric.sleep) || 0,
        steps: parseInt(newMetric.steps) || 0,
        calories: parseInt(newMetric.calories) || 0,
        water: parseInt(newMetric.water) || 0,
        exercise: parseInt(newMetric.exercise) || 0,
        mood: parseInt(newMetric.mood) || 5,
      });
      setNewMetric({
        sleep: "",
        steps: "",
        calories: "",
        water: "",
        exercise: "",
        mood: "",
      });
    }
  };

  const latestMetric = getLatestMetric();

  const avgMetrics = useMemo(() => {
    if (metrics.length === 0)
      return {
        sleep: 0,
        steps: 0,
        water: 0,
        exercise: 0,
        mood: 0,
      };

    const sum = metrics.reduce(
      (acc, m) => ({
        sleep: acc.sleep + m.sleep,
        steps: acc.steps + m.steps,
        water: acc.water + m.water,
        exercise: acc.exercise + m.exercise,
        mood: acc.mood + m.mood,
      }),
      { sleep: 0, steps: 0, water: 0, exercise: 0, mood: 0 }
    );

    return {
      sleep: (sum.sleep / metrics.length).toFixed(1),
      steps: Math.round(sum.steps / metrics.length),
      water: Math.round(sum.water / metrics.length),
      exercise: Math.round(sum.exercise / metrics.length),
      mood: Math.round(sum.mood / metrics.length),
    };
  }, [metrics]);

  const MetricCard = ({
    label,
    value,
    unit,
    icon: Icon,
    target,
    color,
  }: any) => {
    const percentage = target ? Math.min((value / target) * 100, 100) : 0;
    return (
      <div className="glass rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-foreground/70 text-xs md:text-sm font-medium">{label}</p>
          <Icon className={`w-4 h-4 md:w-5 md:h-5 text-${color}`} />
        </div>
        <div className="mb-3">
          <p className="text-2xl md:text-3xl font-bold">
            {value}
            <span className="text-sm md:text-lg text-foreground/60 ml-1">{unit}</span>
          </p>
          {target && (
            <p className="text-[10px] md:text-xs text-foreground/60 mt-1">Target: {target}{unit}</p>
          )}
        </div>
        {target && (
          <div className="w-full h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 bg-gradient-to-r from-${color} to-${color}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 w-full flex flex-col min-h-0 bg-background text-foreground">
      {/* Header */}
      <div className="glass border-b border-white/10 shrink-0">
        <div className="px-4 md:px-6 py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl font-bold">Health</h1>
          <p className="text-foreground/60 text-sm mt-1">
            Track your wellness metrics
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Current Metrics */}
          {latestMetric && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              <MetricCard
                label="Sleep"
                value={latestMetric.sleep}
                unit="h"
                icon={Moon}
                target={8}
                color="blue-500"
              />
              <MetricCard
                label="Steps"
                value={latestMetric.steps}
                unit=""
                icon={Activity}
                target={10000}
                color="green-500"
              />
              <MetricCard
                label="Water"
                value={latestMetric.water}
                unit=" cups"
                icon={Droplets}
                target={8}
                color="cyan-500"
              />
              <MetricCard
                label="Exercise"
                value={latestMetric.exercise}
                unit=" min"
                icon={Zap}
                target={30}
                color="purple-500"
              />
              <MetricCard
                label="Mood"
                value={latestMetric.mood}
                unit="/10"
                icon={Smile}
                color="pink-500"
              />
            </div>
          )}

          {/* Weekly Averages */}
          <div className="glass-accent rounded-2xl p-6 md:p-8 glow-accent">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">This Week's Average</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-foreground/70 text-xs md:text-sm mb-2">Sleep</p>
                <p className="text-2xl md:text-3xl font-bold">{avgMetrics.sleep}h</p>
              </div>
              <div className="text-center">
                <p className="text-foreground/70 text-xs md:text-sm mb-2">Steps</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {(avgMetrics.steps / 1000).toFixed(1)}k
                </p>
              </div>
              <div className="text-center">
                <p className="text-foreground/70 text-xs md:text-sm mb-2">Water</p>
                <p className="text-2xl md:text-3xl font-bold">{avgMetrics.water}</p>
              </div>
              <div className="text-center">
                <p className="text-foreground/70 text-xs md:text-sm mb-2">Exercise</p>
                <p className="text-2xl md:text-3xl font-bold">{avgMetrics.exercise}min</p>
              </div>
              <div className="text-center">
                <p className="text-foreground/70 text-xs md:text-sm mb-2">Mood</p>
                <p className="text-2xl md:text-3xl font-bold">{avgMetrics.mood}/10</p>
              </div>
            </div>
          </div>

          {/* Log Today */}
          <div className="glass rounded-xl p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4 md:mb-6">Log Today</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
              <div>
                <label className="text-xs md:text-sm text-foreground/70 block mb-1 md:mb-2">
                  Sleep (hours)
                </label>
                <input
                  type="number"
                  value={newMetric.sleep}
                  onChange={(e) =>
                    setNewMetric({ ...newMetric, sleep: e.target.value })
                  }
                  step="0.5"
                  placeholder="0"
                  className="w-full px-3 md:px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground/50 focus:border-primary/50 focus:outline-none transition-all text-sm md:text-base"
                />
              </div>

              <div>
                <label className="text-xs md:text-sm text-foreground/70 block mb-1 md:mb-2">
                  Steps
                </label>
                <input
                  type="number"
                  value={newMetric.steps}
                  onChange={(e) =>
                    setNewMetric({ ...newMetric, steps: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-3 md:px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground/50 focus:border-primary/50 focus:outline-none transition-all text-sm md:text-base"
                />
              </div>

              <div>
                <label className="text-xs md:text-sm text-foreground/70 block mb-1 md:mb-2">
                  Water (cups)
                </label>
                <input
                  type="number"
                  value={newMetric.water}
                  onChange={(e) =>
                    setNewMetric({ ...newMetric, water: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-3 md:px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground/50 focus:border-primary/50 focus:outline-none transition-all text-sm md:text-base"
                />
              </div>

              <div>
                <label className="text-xs md:text-sm text-foreground/70 block mb-1 md:mb-2">
                  Exercise (minutes)
                </label>
                <input
                  type="number"
                  value={newMetric.exercise}
                  onChange={(e) =>
                    setNewMetric({ ...newMetric, exercise: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-3 md:px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground/50 focus:border-primary/50 focus:outline-none transition-all text-sm md:text-base"
                />
              </div>

              <div>
                <label className="text-xs md:text-sm text-foreground/70 block mb-1 md:mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  value={newMetric.calories}
                  onChange={(e) =>
                    setNewMetric({ ...newMetric, calories: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-3 md:px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground/50 focus:border-primary/50 focus:outline-none transition-all text-sm md:text-base"
                />
              </div>

              <div>
                <label className="text-xs md:text-sm text-foreground/70 block mb-1 md:mb-2">
                  Mood (1-10)
                </label>
                <input
                  type="number"
                  value={newMetric.mood}
                  onChange={(e) =>
                    setNewMetric({ ...newMetric, mood: e.target.value })
                  }
                  min="1"
                  max="10"
                  placeholder="5"
                  className="w-full px-3 md:px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground/50 focus:border-primary/50 focus:outline-none transition-all text-sm md:text-base"
                />
              </div>
            </div>

            <button
              onClick={handleAddMetric}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Plus className="w-5 h-5" /> Log Metrics
            </button>
          </div>

          {/* History */}
          <div className="glass rounded-xl p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Recent History</h3>
            <div className="space-y-2">
              {metrics.length === 0 ? (
                <p className="text-foreground/60 text-center py-8">
                  No health logs yet
                </p>
              ) : (
                metrics
                  .slice()
                  .reverse()
                  .slice(0, 7)
                  .map((metric, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 md:p-4 hover:bg-white/5 rounded-lg transition-all"
                    >
                      <div>
                        <p className="font-medium text-sm md:text-base">
                          {metric.date.toLocaleDateString()}
                        </p>
                        <p className="text-[10px] md:text-xs text-foreground/60 mt-1">
                          Sleep: {metric.sleep}h • Steps: {metric.steps} •
                          Water: {metric.water} • Mood: {metric.mood}/10
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
