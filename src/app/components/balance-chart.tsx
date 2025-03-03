"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { CreditCard, Expense, Income } from "../types";

// Chart.jsのコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface BalanceChartProps {
  currentBalance: number;
  creditCards: CreditCard[];
  expenses: Expense[];
  incomes: Income[];
}

export function BalanceChart({
  currentBalance,
  creditCards,
  expenses,
  incomes,
}: BalanceChartProps) {
  const [activeTab, setActiveTab] = useState("monthly");
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [yearlyData, setYearlyData] = useState<any>(null);

  useEffect(() => {
    setMonthlyData(generateMonthlyData());
    setYearlyData(generateYearlyData());
  }, [currentBalance, creditCards, expenses, incomes]);

  // 今月の日付を取得
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // 月間グラフ用のデータを生成
  const generateMonthlyData = () => {
    // 今月の日数を取得
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 日付ラベルを生成
    const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}日`);

    // 初期残高を設定
    let balance = currentBalance;

    // 日々の残高を計算
    const balanceData = [balance];

    for (let day = 1; day < daysInMonth; day++) {
      // その日の収入を加算
      const dayIncomes = incomes.filter(
        (income) => income.receiptDate === day + 1,
      );
      for (const income of dayIncomes) {
        if (income.isRecurring) {
          balance += income.amount;
        }
      }

      // その日の支出を減算
      const dayExpenses = expenses.filter(
        (expense) => expense.dueDate === day + 1,
      );
      for (const expense of dayExpenses) {
        if (expense.isRecurring) {
          balance -= expense.amount;
        }
      }

      // クレジットカードの支払いを減算
      const dayCardPayments = creditCards.filter(
        (card) => card.paymentDate === day + 1,
      );
      for (const card of dayCardPayments) {
        balance -= card.currentBalance;
      }

      balanceData.push(balance);
    }

    return {
      labels,
      datasets: [
        {
          label: "予測残高",
          data: balanceData,
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  // 年間グラフ用のデータを生成
  const generateYearlyData = () => {
    const monthLabels = [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ];

    // 毎月の収入を計算
    const monthlyIncome = incomes.reduce((total, income) => {
      return income.isRecurring ? total + income.amount : total;
    }, 0);

    // 毎月の支出を計算
    const monthlyExpense = expenses.reduce((total, expense) => {
      return expense.isRecurring ? total + expense.amount : total;
    }, 0);

    // 月々の収支差額
    const monthlyNet = monthlyIncome - monthlyExpense;

    // 年間予測残高を計算
    let yearlyBalance = currentBalance;
    const yearlyBalances = [yearlyBalance];

    for (let i = 0; i < 11; i++) {
      yearlyBalance += monthlyNet;
      yearlyBalances.push(yearlyBalance);
    }

    return {
      labels: monthLabels,
      datasets: [
        {
          type: "bar" as const,
          label: "月間収入",
          data: Array(12).fill(monthlyIncome),
          backgroundColor: "rgba(34, 197, 94, 0.6)",
        },
        {
          type: "bar" as const,
          label: "月間支出",
          data: Array(12).fill(monthlyExpense),
          backgroundColor: "rgba(239, 68, 68, 0.6)",
        },
        {
          type: "bar" as const,
          label: "予測残高",
          data: yearlyBalances,
          backgroundColor: "rgba(99, 102, 241, 0.6)",
        },
      ],
    };
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">残高推移</CardTitle>
            <CardDescription>今後の残高予測</CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button
              variant={activeTab === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("monthly")}
              className="text-xs"
            >
              月間
            </Button>
            <Button
              variant={activeTab === "yearly" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("yearly")}
              className="text-xs"
            >
              年間
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px]">
          {activeTab === "monthly" && monthlyData && (
            <Line
              data={monthlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                    labels: {
                      boxWidth: 12,
                      usePointStyle: true,
                      pointStyle: "circle",
                    },
                  },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                      label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                          label += ": ";
                        }
                        if (context.parsed.y !== null) {
                          label += new Intl.NumberFormat("ja-JP", {
                            style: "currency",
                            currency: "JPY",
                            maximumFractionDigits: 0,
                          }).format(context.parsed.y);
                        }
                        return label;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    ticks: {
                      callback: function (value) {
                        return new Intl.NumberFormat("ja-JP", {
                          style: "currency",
                          currency: "JPY",
                          notation: "compact",
                          maximumFractionDigits: 0,
                        }).format(value as number);
                      },
                    },
                  },
                },
              }}
            />
          )}
          {activeTab === "yearly" && yearlyData && (
            <Bar
              data={yearlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                    labels: {
                      boxWidth: 12,
                      usePointStyle: true,
                      pointStyle: "circle",
                    },
                  },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                      label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                          label += ": ";
                        }
                        if (context.parsed.y !== null) {
                          label += new Intl.NumberFormat("ja-JP", {
                            style: "currency",
                            currency: "JPY",
                            maximumFractionDigits: 0,
                          }).format(context.parsed.y);
                        }
                        return label;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    ticks: {
                      callback: function (value) {
                        return new Intl.NumberFormat("ja-JP", {
                          style: "currency",
                          currency: "JPY",
                          notation: "compact",
                          maximumFractionDigits: 0,
                        }).format(value as number);
                      },
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
