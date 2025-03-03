"use client";

import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BalanceCard } from "./components/balance-card";
import { BalanceChart } from "./components/balance-chart";
import { CreditCardList } from "./components/credit-card-list";
import { ExpenseList } from "./components/expense-list";
import { FinancialSummary } from "./components/financial-summary";
import { IncomeList } from "./components/income-list";
import { Header } from "./components/ui/header";
import { fetchBudgetData, updateBudgetData } from "./lib/api";
import { CreditCard, Expense, Income } from "./types";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [mounted, setMounted] = useState(false);

  // fetchData関数を先に定義する
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchBudgetData();
      setCurrentBalance(data.currentBalance);
      setCreditCards(data.creditCards || []);
      setExpenses(data.expenses || []);
      setIncomes(data.incomes || []);
    } catch (err) {
      toast.error("データの取得に失敗しました。再度お試しください。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  // マウントされていない場合は空のコンテンツを返す
  if (!mounted) {
    return null;
  }

  const handleUpdateBalance = async (newBalance: number) => {
    try {
      setLoading(true);
      const data = await updateBudgetData({ currentBalance: newBalance });
      setCurrentBalance(data.currentBalance);
      toast.success("残高を更新しました");
    } catch (err) {
      toast.error("残高の更新に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCreditCards = async (newCreditCards: CreditCard[]) => {
    try {
      setLoading(true);
      const data = await updateBudgetData({ creditCards: newCreditCards });
      setCreditCards(data.creditCards);
      toast.success("クレジットカード情報を更新しました");
    } catch (err) {
      toast.error("クレジットカード情報の更新に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExpenses = async (newExpenses: Expense[]) => {
    try {
      setLoading(true);
      const data = await updateBudgetData({ expenses: newExpenses });
      setExpenses(data.expenses);
      toast.success("固定支出情報を更新しました");
    } catch (err) {
      toast.error("固定支出情報の更新に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIncomes = async (newIncomes: Income[]) => {
    try {
      setLoading(true);
      const data = await updateBudgetData({ incomes: newIncomes });
      setIncomes(data.incomes);
      toast.success("収入情報を更新しました");
    } catch (err) {
      toast.error("収入情報の更新に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 w-full">
        <div className="w-full py-6 md:py-8 lg:py-10 px-4 md:px-6 lg:px-8 max-w-[1200px] mx-auto">
          <div className="grid gap-6 md:grid-cols-12">
            {/* 左サイドバー - 残高と財務サマリー */}
            <div className="md:col-span-3 space-y-6">
              <BalanceCard
                currentBalance={currentBalance}
                onUpdateBalance={handleUpdateBalance}
                isLoading={loading}
              />
              <FinancialSummary
                currentBalance={currentBalance}
                creditCards={creditCards}
                expenses={expenses}
                incomes={incomes}
              />
            </div>

            {/* メインコンテンツエリア */}
            <div className="md:col-span-9 space-y-6">
              {/* クレジットカードセクション */}
              <div className="grid gap-6">
                <CreditCardList
                  creditCards={creditCards}
                  onUpdate={handleUpdateCreditCards}
                  isLoading={loading}
                />
              </div>

              {/* 支出と収入のセクション */}
              <div className="grid gap-6 md:grid-cols-2">
                <ExpenseList
                  expenses={expenses}
                  onUpdate={handleUpdateExpenses}
                  isLoading={loading}
                />
                <IncomeList
                  incomes={incomes}
                  onUpdate={handleUpdateIncomes}
                  isLoading={loading}
                />
              </div>

              {/* 残高チャートセクション */}
              <div className="grid gap-6">
                <BalanceChart
                  currentBalance={currentBalance}
                  creditCards={creditCards}
                  expenses={expenses}
                  incomes={incomes}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
