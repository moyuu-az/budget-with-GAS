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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ChevronUp, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Income } from "../types";

interface IncomeListProps {
  incomes: Income[];
  onUpdate: (incomes: Income[]) => void;
  isLoading: boolean;
}

export function IncomeList({ incomes, onUpdate, isLoading }: IncomeListProps) {
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [receiptDate, setReceiptDate] = useState(1);
  const [isRecurring, setIsRecurring] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddIncome = () => {
    setEditingIncome(null);
    setName("");
    setAmount(0);
    setReceiptDate(1);
    setIsRecurring(true);
    setIsDialogOpen(true);
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setName(income.name);
    setAmount(income.amount);
    setReceiptDate(income.receiptDate);
    setIsRecurring(income.isRecurring);
    setIsDialogOpen(true);
  };

  const handleDeleteIncome = (id: string | undefined) => {
    if (!id) return;
    onUpdate(incomes.filter((income) => income.id !== id));
  };

  const handleSubmit = () => {
    if (editingIncome) {
      // 編集モード
      onUpdate(
        incomes.map((income) =>
          income.id === editingIncome.id
            ? {
                ...income,
                name,
                amount,
                paymentDate: receiptDate,
                receiptDate,
                isRecurring,
              }
            : income,
        ),
      );
    } else {
      // 新規追加モード
      const newIncome: Income = {
        id: Date.now().toString(), // 簡易的なID生成
        name,
        amount,
        paymentDate: receiptDate, // 支払日を受取日と同じに設定
        receiptDate,
        isRecurring,
      };
      onUpdate([...incomes, newIncome]);
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-gray-900">
              収入
            </CardTitle>
            <CardDescription className="text-sm font-medium text-gray-600">
              定期的な収入項目
            </CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 p-2">
            <ChevronUp className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {incomes.length === 0 ? (
            <div className="flex h-[140px] items-center justify-center rounded-md border border-dashed p-8 bg-gray-50">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">
                  登録された収入項目はありません。
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[240px] overflow-y-auto">
              {incomes.map((income) => (
                <div
                  key={income.id}
                  className="flex items-center justify-between rounded-xl border p-4 text-sm bg-white hover:shadow-md transition-all"
                >
                  <div className="grid gap-1">
                    <div className="font-semibold text-gray-900">
                      {income.name}
                    </div>
                    <div className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
                      毎月{income.receiptDate}日
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-lg">
                      ¥{income.amount.toLocaleString()}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-gray-100"
                        onClick={() => handleEditIncome(income)}
                        disabled={isLoading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                        <span className="sr-only">編集</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500"
                        onClick={() => handleDeleteIncome(income.id)}
                        disabled={isLoading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        <span className="sr-only">削除</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full border-gray-300 hover:bg-gray-100 font-medium"
            onClick={handleAddIncome}
            disabled={isLoading}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            収入項目を追加
          </Button>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {editingIncome ? "収入項目を編集" : "収入項目を追加"}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              定期的な収入項目を登録してください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-base font-medium text-gray-800"
                >
                  項目名
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="給料"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="receiptDate"
                  className="text-base font-medium text-gray-800"
                >
                  入金日
                </label>
                <div className="relative">
                  <Input
                    id="receiptDate"
                    type="number"
                    min={1}
                    max={31}
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(Number(e.target.value))}
                    className="h-12 text-base pr-12 bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="25"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    日
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="text-base font-medium text-gray-800"
                >
                  金額
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ¥
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-12 text-base pl-8 bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="250000"
                  />
                </div>
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 border-gray-300 bg-white">
                <div className="space-y-0.5">
                  <label
                    htmlFor="isRecurring"
                    className="text-base font-medium text-gray-800"
                  >
                    定期収入
                  </label>
                  <p className="text-sm text-gray-600">
                    毎月自動的に発生する収入として計算します
                  </p>
                </div>
                <Switch
                  id="isRecurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                  className="scale-125 data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="h-12 min-w-[120px] text-base px-6 border-gray-300"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-primary text-white hover:bg-primary/90 h-12 min-w-[120px] text-base px-6 shadow-md"
            >
              {isLoading ? "処理中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
