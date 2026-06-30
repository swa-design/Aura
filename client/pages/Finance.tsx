import { useState, useMemo } from "react";
import { useFinanceStore } from "@/lib/store";
import { Plus, Trash2, PieChart, Edit2, X, Check, Pencil } from "lucide-react";

export default function FinancePage() {
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "Food",
    description: "",
    paymentMethod: "card" as const,
  });
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState({
    amount: "",
    category: "Food",
    description: "",
    paymentMethod: "card" as const,
  });
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  const expenses = useFinanceStore((state) => state.expenses);
  const budget = useFinanceStore((state) => state.budget);
  const addExpense = useFinanceStore((state) => state.addExpense);
  const deleteExpense = useFinanceStore((state) => state.deleteExpense);
  const updateExpense = useFinanceStore((state) => state.updateExpense);
  const setBudget = useFinanceStore((state) => state.setBudget);

  const handleAddExpense = () => {
    if (newExpense.amount && newExpense.description) {
      addExpense({
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        description: newExpense.description,
        date: new Date(),
        paymentMethod: newExpense.paymentMethod,
      });
      setNewExpense({
        amount: "",
        category: "Food",
        description: "",
        paymentMethod: "card",
      });
    }
  };

  const handleStartEditExpense = (expense: any) => {
    setEditingExpenseId(expense.id);
    setEditingExpense({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      paymentMethod: expense.paymentMethod,
    });
  };

  const handleSaveEditExpense = () => {
    if (!editingExpenseId) return;
    updateExpense(editingExpenseId, {
      amount: parseFloat(editingExpense.amount),
      category: editingExpense.category,
      description: editingExpense.description,
      paymentMethod: editingExpense.paymentMethod,
    });
    setEditingExpenseId(null);
  };

  const handleSaveBudget = () => {
    if (budgetInput) {
      setBudget(parseFloat(budgetInput));
      setEditingBudget(false);
    }
  };

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const balance = budget - totalSpent;
  const spentPercentage = (totalSpent / budget) * 100;

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const categoryColors = {
    Food: "from-red-500 to-red-600",
    Transport: "from-blue-500 to-blue-600",
    Entertainment: "from-purple-500 to-purple-600",
    Shopping: "from-pink-500 to-pink-600",
    Health: "from-green-500 to-green-600",
    Other: "from-gray-500 to-gray-600",
  };

  return (
    <div className="flex-1 w-full flex flex-col min-h-0 bg-background text-foreground">
      {/* Header */}
      <div className="glass border-b border-white/10 shrink-0">
        <div className="px-4 md:px-6 py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl font-bold">Finance</h1>
          <p className="text-foreground/60 text-sm mt-1">Track expenses and manage budget</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Budget Overview */}
          <div className="glass-accent rounded-2xl p-6 md:p-8 glow-accent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <p className="text-foreground/70 text-sm mb-1">Monthly Budget</p>
                <div className="flex items-center gap-2">
                  {editingBudget ? (
                    <>
                      <input
                        type="number"
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                        className="w-32 px-2 py-1 rounded bg-white/10 border border-white/20 text-white text-3xl md:text-4xl font-bold focus:outline-none"
                        onBlur={handleSaveBudget}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveBudget();
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveBudget}
                        className="p-2 rounded hover:bg-white/10"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl md:text-4xl font-bold">${budget.toFixed(2)}</h2>
                      <button
                        onClick={() => {
                          setBudgetInput(budget.toString());
                          setEditingBudget(true);
                        }}
                        className="p-2 rounded hover:bg-white/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                <p className="text-xs md:text-sm text-foreground/60 mt-1">
                  Remaining: ${balance.toFixed(2)}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-foreground/70 text-sm mb-1">Spent</p>
                <p className="text-2xl md:text-3xl font-bold text-accent">${totalSpent.toFixed(2)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  spentPercentage < 50
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : spentPercentage < 80
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                    : "bg-gradient-to-r from-red-500 to-red-600"
                }`}
                style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              {spentPercentage.toFixed(0)}% of budget used
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Expense Form */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-foreground/70 block mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground/50 focus:border-primary/50 focus:outline-none transition-all text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground/70 block mb-2">
                      Category
                    </label>
                    <select
                      value={newExpense.category}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all cursor-pointer text-sm md:text-base"
                    >
                      <option>Food</option>
                      <option>Transport</option>
                      <option>Entertainment</option>
                      <option>Shopping</option>
                      <option>Health</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-foreground/70 block mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newExpense.description}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          description: e.target.value,
                        })
                      }
                      placeholder="What was it for?"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-foreground/50 focus:border-primary/50 focus:outline-none transition-all text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground/70 block mb-2">
                      Payment Method
                    </label>
                    <select
                      value={newExpense.paymentMethod}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          paymentMethod: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-primary/50 focus:outline-none transition-all cursor-pointer text-sm md:text-base"
                    >
                      <option value="card">Card</option>
                      <option value="cash">Cash</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>

                  <button
                    onClick={handleAddExpense}
                    className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-all font-medium flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Plus className="w-5 h-5" /> Add Expense
                  </button>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-4 md:p-6 h-full">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-accent" />
                  Category Breakdown
                </h3>
                <div className="space-y-4">
                  {categoryTotals.length === 0 ? (
                    <p className="text-foreground/60 text-center py-8">No expenses to analyze</p>
                  ) : (
                    categoryTotals.map((item) => {
                      const percentage = (item.amount / totalSpent) * 100;
                      return (
                        <div key={item.category}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm md:text-base">{item.category}</span>
                            <span className="text-xs md:text-sm text-foreground/70">
                              ${item.amount.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 bg-gradient-to-r ${
                                categoryColors[item.category as keyof typeof categoryColors] ||
                                categoryColors.Other
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className="text-[10px] md:text-xs text-foreground/60 mt-1">
                            {percentage.toFixed(0)}% of spending
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="glass rounded-xl p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
            <div className="space-y-2">
              {expenses.length === 0 ? (
                <p className="text-foreground/60 text-center py-8">No expenses yet</p>
              ) : (
                expenses
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((expense) => (
                    <div
                      key={expense.id}
                      className="flex flex-wrap sm:flex-nowrap items-center justify-between p-3 md:p-4 hover:bg-white/5 rounded-lg transition-all group gap-2"
                    >
                      {editingExpenseId === expense.id ? (
                        <div className="w-full space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="number"
                              value={editingExpense.amount}
                              onChange={(e) =>
                                setEditingExpense({ ...editingExpense, amount: e.target.value })
                              }
                              className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white focus:outline-none"
                            />
                            <select
                              value={editingExpense.category}
                              onChange={(e) =>
                                setEditingExpense({ ...editingExpense, category: e.target.value })
                              }
                              className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white focus:outline-none"
                            >
                              <option>Food</option>
                              <option>Transport</option>
                              <option>Entertainment</option>
                              <option>Shopping</option>
                              <option>Health</option>
                              <option>Other</option>
                            </select>
                            <input
                              type="text"
                              value={editingExpense.description}
                              onChange={(e) =>
                                setEditingExpense({ ...editingExpense, description: e.target.value })
                              }
                              className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white focus:outline-none sm:col-span-2"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={handleSaveEditExpense}
                              className="p-2 rounded bg-green-500/20 hover:bg-green-500/30 text-green-400"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingExpenseId(null)}
                              className="p-2 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm md:text-base truncate">{expense.description}</p>
                              <p className="text-[10px] md:text-xs text-foreground/60 truncate">
                                {expense.category} •{" "}
                                {expense.date.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <span className="font-semibold text-base md:text-lg">
                              ${expense.amount.toFixed(2)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleStartEditExpense(expense)}
                                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-2 hover:bg-blue-500/20 rounded"
                              >
                                <Edit2 className="w-4 h-4 text-blue-400" />
                              </button>
                              <button
                                onClick={() => deleteExpense(expense.id)}
                                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
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
