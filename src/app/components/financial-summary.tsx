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
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-bold text-gray-900">
          財務サマリー
        </CardTitle>
        <CardDescription className="text-sm font-medium text-gray-600">
          今月の収支状況
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">月間収入</p>
              <div className="rounded-full p-1.5 bg-green-100">
                <ChevronUp className="h-3.5 w-3.5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ¥{monthlyIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">月間支出</p>
              <div className="rounded-full p-1.5 bg-red-100">
                <TrendingDown className="h-3.5 w-3.5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ¥{monthlyExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">月間貯蓄</p>
              <div className="rounded-full p-1.5 bg-blue-100">
                <DollarSign className="h-3.5 w-3.5 text-blue-600" />
              </div>
            </div>
            <p
              className={`text-2xl font-bold ${monthlySavings >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ¥{monthlySavings.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">カード負債</p>
              <div className="rounded-full p-1.5 bg-orange-100">
                <CreditCard className="h-3.5 w-3.5 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ¥{creditCardDebt.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border-t border-dashed">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">
              月末まで残り {daysLeft}日
            </p>
            <div className="rounded-full p-1.5 bg-purple-100">
              <BarChart className="h-3.5 w-3.5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ¥{currentBalance.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
