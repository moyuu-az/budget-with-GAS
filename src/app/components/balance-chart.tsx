"use client";

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
  const [chartType, setChartType] = useState<"monthly" | "yearly">("monthly");
  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのみレンダリングされるようにする
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <CardTitle>収支予測</CardTitle>
          <CardDescription>データをロード中...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-pulse bg-muted h-full w-full rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

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

  const monthlyData = generateMonthlyData();
  const yearlyData = generateYearlyData();

  // チャートのオプション設定
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            family:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 12,
          },
        },
      },
      tooltip: {
        padding: 10,
        bodyFont: {
          size: 13,
        },
        titleFont: {
          size: 14,
        },
        callbacks: {
          label: function (context: {
            dataset: { label?: string };
            parsed: { y: number | null };
          }) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `¥${context.parsed.y.toLocaleString()}`;
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
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (tickValue: string | number) {
            return `¥${Number(tickValue).toLocaleString()}`;
          },
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
      },
    },
  };

  return (
    <Card className="border bg-white shadow-md rounded-lg overflow-hidden">
      <CardHeader className="pb-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-gray-900">
              収支予測
            </CardTitle>
            <CardDescription className="text-sm font-medium text-gray-600">
              今後の残高推移
            </CardDescription>
          </div>
          <div className="flex rounded-lg border p-1 text-sm bg-white shadow-sm">
            <button
              onClick={() => setChartType("monthly")}
              className={`rounded-md px-3 py-1 font-medium ${chartType === "monthly"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              月間
            </button>
            <button
              onClick={() => setChartType("yearly")}
              className={`rounded-md px-3 py-1 font-medium ${chartType === "yearly"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              年間
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[350px]">
          {chartType === "monthly" ? (
            <Line options={options} data={monthlyData} />
          ) : (
            <Bar options={options} data={yearlyData} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
