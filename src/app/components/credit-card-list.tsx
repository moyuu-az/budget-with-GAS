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
import {
  CreditCard as CreditCardIcon,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";
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
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">
                クレジットカード
              </CardTitle>
              <CardDescription>登録されたクレジットカード一覧</CardDescription>
            </div>
            <div className="rounded-full bg-primary/10 p-2">
              <CreditCardIcon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {creditCards.length === 0 ? (
            <div className="flex h-[140px] items-center justify-center rounded-md border border-dashed p-8 bg-muted/50">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  登録されたクレジットカードはありません。
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {creditCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-md border bg-card overflow-hidden"
                >
                  <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{card.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditCard(card)}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">編集</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteCard(card.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">削除</span>
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          利用可能枠
                        </p>
                        <p className="text-sm font-medium">
                          ¥{card.limit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          支払日
                        </p>
                        <p
                          className={`text-sm font-medium ${getPaymentStatusClass(
                            card.paymentDate,
                          )}`}
                        >
                          毎月{card.paymentDate}日
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">
                          現在の利用額
                        </p>
                        <p
                          className={`text-sm font-medium ${getUtilizationClass(
                            card.currentBalance,
                            card.limit,
                          )}`}
                        >
                          ¥{card.currentBalance.toLocaleString()} (
                          {card.limit > 0
                            ? Math.round(
                                (card.currentBalance / card.limit) * 100,
                              )
                            : 0}
                          %)
                        </p>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getUtilizationBarClass(
                            card.currentBalance,
                            card.limit,
                          )}`}
                          style={{
                            width: `${
                              card.limit > 0
                                ? Math.min(
                                    (card.currentBalance / card.limit) * 100,
                                    100,
                                  )
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2 border-t">
          <Button
            onClick={handleAddCard}
            className="w-full"
            size="sm"
            disabled={isLoading}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            カードを追加
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCard
                ? "クレジットカードを編集"
                : "クレジットカードを追加"}
            </DialogTitle>
            <DialogDescription>
              クレジットカードの情報を入力してください。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                カード名
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="楽天カード、JCBカードなど"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="paymentDate" className="text-sm font-medium">
                支払日
              </label>
              <Input
                id="paymentDate"
                type="number"
                min={1}
                max={31}
                value={paymentDate}
                onChange={(e) => setPaymentDate(Number(e.target.value))}
                placeholder="毎月の支払日"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="limit" className="text-sm font-medium">
                利用限度額
              </label>
              <Input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                placeholder="利用限度額を入力"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="currentBalance" className="text-sm font-medium">
                現在の利用額
              </label>
              <Input
                id="currentBalance"
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Number(e.target.value))}
                placeholder="現在の利用額を入力"
                disabled={isLoading}
              />
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
              {isLoading ? "処理中..." : editingCard ? "更新" : "追加"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
