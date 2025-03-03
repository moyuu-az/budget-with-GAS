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
import { CreditCard as CreditCardIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import { CreditCard } from "../types";

interface CreditCardListProps {
  creditCards: CreditCard[];
  onUpdate: (cards: CreditCard[]) => void;
  isLoading: boolean;
}

export function CreditCardList({
  creditCards,
  onUpdate,
  isLoading,
}: CreditCardListProps) {
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [name, setName] = useState("");
  const [limit, setLimit] = useState(0);
  const [paymentDate, setPaymentDate] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCard = () => {
    setEditingCard(null);
    setName("");
    setLimit(0);
    setPaymentDate(1);
    setCurrentBalance(0);
    setIsDialogOpen(true);
  };

  const handleEditCard = (card: CreditCard) => {
    setEditingCard(card);
    setName(card.name);
    setLimit(card.limit);
    setPaymentDate(card.paymentDate);
    setCurrentBalance(card.currentBalance);
    setIsDialogOpen(true);
  };

  const handleDeleteCard = (id: string | undefined) => {
    if (!id) return;
    onUpdate(creditCards.filter((card) => card.id !== id));
  };

  const handleSubmit = () => {
    if (editingCard) {
      // 編集モード
      onUpdate(
        creditCards.map((card) =>
          card.id === editingCard.id
            ? { ...card, name, limit, paymentDate, currentBalance }
            : card,
        ),
      );
    } else {
      // 新規追加モード
      const newCard: CreditCard = {
        id: Date.now().toString(), // 簡易的なID生成
        name,
        limit,
        paymentDate,
        currentBalance,
      };
      onUpdate([...creditCards, newCard]);
    }
    setIsDialogOpen(false);
  };

  const getPaymentStatusClass = (date: number) => {
    const today = new Date().getDate();
    const daysUntilPayment = date >= today ? date - today : date + 30 - today;

    if (daysUntilPayment <= 3) return "text-red-500 font-bold";
    if (daysUntilPayment <= 7) return "text-orange-500 font-bold";
    return "text-green-500";
  };

  // 使用率に基づく色を取得
  const getUtilizationClass = (balance: number, limit: number) => {
    const utilization = limit > 0 ? (balance / limit) * 100 : 0;
    if (utilization > 80) return "text-red-500";
    if (utilization > 50) return "text-orange-500";
    return "text-green-500";
  };

  // 使用率に基づくプログレスバーの色を取得
  const getUtilizationBarClass = (balance: number, limit: number) => {
    const utilization = limit > 0 ? (balance / limit) * 100 : 0;
    if (utilization > 80) return "bg-red-500";
    if (utilization > 50) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <>
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-gray-900">
              クレジットカード
            </CardTitle>
            <CardDescription className="text-sm font-medium text-gray-600">
              登録されたクレジットカード一覧
            </CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 p-2">
            <CreditCardIcon className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {creditCards.length === 0 ? (
            <div className="flex h-[140px] items-center justify-center rounded-md border border-dashed p-8 bg-gray-50">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">
                  登録されたクレジットカードはありません。
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {creditCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">
                        {card.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-gray-200"
                        onClick={() => handleEditCard(card)}
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
                          className="h-3.5 w-3.5"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                        <span className="sr-only">編集</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-red-50 hover:text-red-500"
                        onClick={() => handleDeleteCard(card.id)}
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
                          className="h-3.5 w-3.5"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        <span className="sr-only">削除</span>
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">利用枠</div>
                        <div className="font-semibold">
                          ¥{card.limit.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">支払日</div>
                        <div
                          className={`font-semibold ${getPaymentStatusClass(card.paymentDate)}`}
                        >
                          {card.paymentDate}日
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">現在の利用額</div>
                        <div
                          className={`font-semibold ${getUtilizationClass(card.currentBalance, card.limit)}`}
                        >
                          ¥{card.currentBalance.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getUtilizationBarClass(card.currentBalance, card.limit)}`}
                        style={{
                          width: `${Math.min(100, card.limit > 0 ? (card.currentBalance / card.limit) * 100 : 0)}%`,
                        }}
                      />
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
            onClick={handleAddCard}
            disabled={isLoading}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            クレジットカードを追加
          </Button>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {editingCard
                ? "クレジットカードを編集"
                : "クレジットカードを追加"}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              クレジットカードの情報を入力してください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-base font-medium text-gray-800"
                >
                  カード名
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="JCBカード"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="paymentDate"
                  className="text-base font-medium text-gray-800"
                >
                  支払日
                </label>
                <div className="relative">
                  <Input
                    id="paymentDate"
                    type="number"
                    min={1}
                    max={31}
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(Number(e.target.value))}
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
                  htmlFor="limit"
                  className="text-base font-medium text-gray-800"
                >
                  利用限度額
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ¥
                  </span>
                  <Input
                    id="limit"
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="h-12 text-base pl-8 bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="1000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="currentBalance"
                  className="text-base font-medium text-gray-800"
                >
                  現在の利用額
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ¥
                  </span>
                  <Input
                    id="currentBalance"
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(Number(e.target.value))}
                    className="h-12 text-base pl-8 bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="250000"
                  />
                </div>

                {limit > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                      <span className="font-medium">
                        利用率: {Math.round((currentBalance / limit) * 100)}%
                      </span>
                      <span>
                        {currentBalance.toLocaleString()} /{" "}
                        {limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getUtilizationBarClass(currentBalance, limit)}`}
                        style={{
                          width: `${Math.min(100, limit > 0 ? (currentBalance / limit) * 100 : 0)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
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
