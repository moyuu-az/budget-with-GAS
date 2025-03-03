"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  ChevronUp,
  CreditCard,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import { CreditCard as CreditCardType, Expense, Income } from "../types";

interface FinancialSummaryProps {
  currentBalance: number;
  creditCards: CreditCardType[];
  expenses: Expense[];
  incomes: Income[];
}

export function FinancialSummary({
  currentBalance,
  creditCards,
  expenses,
  incomes,
}: FinancialSummaryProps) {
  // 月間支出の計算
  const monthlyExpenses = expenses.reduce((total, expense) => {
    return expense.isRecurring ? total + expense.amount : total;
  }, 0);

  // 月間収入の計算
  const monthlyIncome = incomes.reduce((total, income) => {
    return income.isRecurring ? total + income.amount : total;
  }, 0);

  // クレジットカード負債の計算
  const creditCardDebt = creditCards.reduce((total, card) => {
    return total + card.currentBalance;
  }, 0);

  // 月間貯蓄額の計算
  const monthlySavings = monthlyIncome - monthlyExpenses;

  // 予算の残りの日数（月末まで）
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysLeft = lastDayOfMonth.getDate() - today.getDate();

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">財務サマリー</CardTitle>
        <CardDescription>今月の収支状況</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-md p-3 border">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-muted-foreground">
                月間収入
              </p>
              <div className="rounded-full p-1 bg-green-100">
                <ChevronUp className="h-3 w-3 text-green-600" />
              </div>
            </div>
            <p className="text-lg font-semibold">
              ¥{monthlyIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-card rounded-md p-3 border">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-muted-foreground">
                月間支出
              </p>
              <div className="rounded-full p-1 bg-red-100">
                <TrendingDown className="h-3 w-3 text-red-600" />
              </div>
            </div>
            <p className="text-lg font-semibold">
              ¥{monthlyExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-md p-3 border">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-muted-foreground">
                月間貯蓄
              </p>
              <div className="rounded-full p-1 bg-blue-100">
                <DollarSign className="h-3 w-3 text-blue-600" />
              </div>
            </div>
            <p
              className={`text-lg font-semibold ${monthlySavings >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ¥{monthlySavings.toLocaleString()}
            </p>
          </div>
          <div className="bg-card rounded-md p-3 border">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-muted-foreground">
                カード負債
              </p>
              <div className="rounded-full p-1 bg-orange-100">
                <CreditCard className="h-3 w-3 text-orange-600" />
              </div>
            </div>
            <p className="text-lg font-semibold">
              ¥{creditCardDebt.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-md p-3 border">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-muted-foreground">
              月末まで残り {daysLeft}日
            </p>
            <div className="rounded-full p-1 bg-purple-100">
              <BarChart className="h-3 w-3 text-purple-600" />
            </div>
          </div>
          <p className="text-lg font-semibold">
            ¥{currentBalance.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
