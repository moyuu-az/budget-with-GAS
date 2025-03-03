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
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">
            現在の残高
          </CardTitle>
          <CardDescription className="text-sm font-medium text-gray-600">
            あなたの現在の利用可能な資金
          </CardDescription>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <WalletIcon className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {editMode ? (
          <div className="space-y-4">
            <Input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(Number(e.target.value))}
              className="text-xl font-bold rounded-lg border-gray-300 focus:border-primary"
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl shadow-inner">
            <span className="text-sm font-medium text-gray-500 mb-2">
              利用可能残高
            </span>
            <span className="text-4xl font-bold text-gray-900 tracking-tight">
              ¥{currentBalance.toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        {editMode ? (
          <>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isLoading}
              className="border-gray-300 font-medium"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-primary text-white hover:bg-primary/90 font-medium"
            >
              {isLoading ? "更新中..." : "保存"}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setEditMode(true)}
            variant="outline"
            className="ml-auto border-gray-300 hover:bg-gray-100 font-medium"
            disabled={isLoading}
          >
            残高を編集
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
