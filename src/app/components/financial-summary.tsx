"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  GradientCard,
} from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCardIcon,
  DollarSignIcon,
} from "lucide-react";
import { CreditCard, Expense, Income } from "../types";

interface FinancialSummaryProps {
  currentBalance: number;
  creditCards: CreditCard[];
  expenses: Expense[];
  incomes: Income[];
}

export function FinancialSummary({
  currentBalance,
  creditCards,
  expenses,
  incomes,
}: FinancialSummaryProps) {
  // 総クレジットカード残高
  const totalCreditCard = creditCards.reduce(
    (sum, card) => sum + card.balance,
    0
  );

  // 月間固定支出
  const monthlyExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // 月間収入
  const monthlyIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  // 月間収支
  const monthlyBalance = monthlyIncome - monthlyExpenses;

  // 支払い可能か確認
  const isAffordable = currentBalance >= monthlyExpenses;

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden shadow-md transition-all hover:shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white pb-2">
          <CardTitle className="text-lg font-medium">財務サマリー</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <SummaryItem
              title="クレジットカード残高"
              value={`¥${totalCreditCard.toLocaleString()}`}
              icon={
                <div className="rounded-full bg-red-100 p-1.5">
                  <CreditCardIcon className="h-4 w-4 text-red-500" />
                </div>
              }
              textColor="text-red-600"
            />

            <SummaryItem
              title="月間固定支出"
              value={`¥${monthlyExpenses.toLocaleString()}`}
              icon={
                <div className="rounded-full bg-orange-100 p-1.5">
                  <ArrowDownIcon className="h-4 w-4 text-orange-500" />
                </div>
              }
              textColor="text-orange-600"
            />

            <SummaryItem
              title="月間収入"
              value={`¥${monthlyIncome.toLocaleString()}`}
              icon={
                <div className="rounded-full bg-green-100 p-1.5">
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                </div>
              }
              textColor="text-green-600"
            />

            <div className="border-t pt-3 mt-3">
              <SummaryItem
                title="月間収支"
                value={`¥${monthlyBalance.toLocaleString()}`}
                icon={
                  <div className="rounded-full bg-blue-100 p-1.5">
                    <DollarSignIcon className="h-4 w-4 text-blue-500" />
                  </div>
                }
                textColor={monthlyBalance >= 0 ? "text-green-600" : "text-red-600"}
                isImportant
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        <StatusCard
          title="支払い能力"
          status={isAffordable ? "良好" : "注意"}
          variant={isAffordable ? "green" : "orange"}
          description={
            isAffordable
              ? "現在の残高で今月の支出をカバーできます"
              : "現在の残高では今月の支出をカバーできません"
          }
        />

        <StatusCard
          title="収支バランス"
          status={monthlyBalance >= 0 ? "黒字" : "赤字"}
          variant={monthlyBalance >= 0 ? "blue" : "red"}
          description={
            monthlyBalance >= 0
              ? "月間収入が支出を上回っています"
              : "月間支出が収入を上回っています"
          }
        />
      </div>
    </div>
  );
}

interface SummaryItemProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  textColor?: string;
  isImportant?: boolean;
}

function SummaryItem({
  title,
  value,
  icon,
  textColor = "text-foreground",
  isImportant = false,
}: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {icon}
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <span
        className={`font-semibold ${textColor} ${isImportant ? "text-lg" : "text-sm"
          }`}
      >
        {value}
      </span>
    </div>
  );
}

interface StatusCardProps {
  title: string;
  status: string;
  description: string;
  variant: "blue" | "green" | "red" | "orange";
}

function StatusCard({
  title,
  status,
  description,
  variant,
}: StatusCardProps) {
  const variantStyles = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      text: "text-blue-50",
    },
    green: {
      bg: "from-green-500 to-green-600",
      text: "text-green-50",
    },
    red: {
      bg: "from-red-500 to-red-600",
      text: "text-red-50",
    },
    orange: {
      bg: "from-orange-500 to-orange-600",
      text: "text-orange-50",
    },
  };

  return (
    <GradientCard gradient={variant} className="p-3.5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-white/90">{title}</h3>
        <span className="text-sm font-bold">{status}</span>
      </div>
      <p className="text-xs text-white/80">{description}</p>
    </GradientCard>
  );
}
