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
import { Input } from "@/components/ui/input";
import { WalletIcon } from "lucide-react";
import { useState } from "react";

interface BalanceCardProps {
  currentBalance: number;
  onUpdateBalance: (amount: number) => void;
  isLoading: boolean;
}

export function BalanceCard({
  currentBalance,
  onUpdateBalance,
  isLoading,
}: BalanceCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [newBalance, setNewBalance] = useState(currentBalance);

  const handleSubmit = () => {
    onUpdateBalance(newBalance);
    setEditMode(false);
  };

  const handleCancel = () => {
    setNewBalance(currentBalance);
    setEditMode(false);
  };

  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader className="pb-2 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">現在の残高</CardTitle>
          <div className="rounded-full bg-primary/10 p-2">
            <WalletIcon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <CardDescription>あなたの現在の利用可能な資金</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {editMode ? (
          <div className="space-y-4">
            <Input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(Number(e.target.value))}
              className="text-lg font-medium"
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-md">
            <span className="text-sm font-medium text-muted-foreground mb-1">
              利用可能残高
            </span>
            <span className="text-3xl font-bold tracking-tight">
              ¥{currentBalance.toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t">
        {editMode ? (
          <div className="flex justify-between w-full">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isLoading}
              size="sm"
            >
              キャンセル
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} size="sm">
              {isLoading ? "更新中..." : "保存"}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setEditMode(true)}
            variant="outline"
            className="ml-auto"
            size="sm"
            disabled={isLoading}
          >
            残高を編集
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
