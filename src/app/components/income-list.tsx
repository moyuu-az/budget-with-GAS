"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { ChevronUp, Pencil, PlusCircle, Trash2 } from "lucide-react";
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
    const updatedIncomes = incomes.filter((income) => income.id !== id);
    onUpdate(updatedIncomes);
  };

  const handleSubmit = () => {
    if (name.trim() === "" || amount <= 0) {
      return;
    }

    if (editingIncome) {
      const updatedIncomes = incomes.map((income) =>
        income.id === editingIncome.id
          ? {
              ...income,
              name,
              amount,
              receiptDate,
              isRecurring,
            }
          : income,
      );
      onUpdate(updatedIncomes);
    } else {
      const newIncome: Income = {
        id: Date.now().toString(),
        name,
        amount,
        receiptDate,
        isRecurring,
      };
      onUpdate([...incomes, newIncome]);
    }

    setIsDialogOpen(false);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">収入</CardTitle>
            <CardDescription>毎月の収入項目</CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 p-2">
            <ChevronUp className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {incomes.length === 0 ? (
          <div className="flex h-[140px] items-center justify-center rounded-md border border-dashed p-8 bg-muted/50">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                登録された収入はありません。
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="rounded-md border bg-card overflow-hidden"
              >
                <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{income.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditIncome(income)}
                      disabled={isLoading}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">編集</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteIncome(income.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">削除</span>
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        金額
                      </p>
                      <p className="text-sm font-medium">
                        ¥{income.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        受取日
                      </p>
                      <p className="text-sm font-medium">
                        毎月{income.receiptDate}日
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      種類
                    </p>
                    <p className="text-sm font-medium">
                      {income.isRecurring ? "毎月の収入" : "一時的な収入"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <Button
          className="w-full"
          size="sm"
          onClick={handleAddIncome}
          disabled={isLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          収入項目を追加
        </Button>
      </CardFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingIncome ? "収入項目を編集" : "収入項目を追加"}
            </DialogTitle>
            <DialogDescription>
              収入項目の詳細を入力してください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                収入名
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="給料、ボーナスなど"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                金額
              </label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="金額を入力"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="receiptDate" className="text-sm font-medium">
                受取日
              </label>
              <Input
                id="receiptDate"
                type="number"
                min={1}
                max={31}
                value={receiptDate}
                onChange={(e) => setReceiptDate(Number(e.target.value))}
                placeholder="毎月の受取日"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
                disabled={isLoading}
              />
              <label htmlFor="isRecurring" className="text-sm font-medium">
                毎月の収入
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "処理中..." : editingIncome ? "更新" : "追加"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
