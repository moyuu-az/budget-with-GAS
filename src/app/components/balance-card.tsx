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
    <Card className="overflow-hidden shadow-md transition-all hover:shadow-lg">
      <CardHeader className="pb-2 space-y-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">現在の残高</CardTitle>
          <div className="rounded-full bg-white/10 p-2">
            <WalletIcon className="h-5 w-5 text-white" />
          </div>
        </div>
        <CardDescription className="text-blue-100">あなたの現在の利用可能な資金</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {editMode ? (
          <div className="space-y-4">
            <Input
              type="number"
              value={newBalance}
              onChange={(e) => setNewBalance(Number(e.target.value))}
              className="text-lg font-medium form-input"
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-md border border-blue-100">
            <span className="text-sm font-medium text-blue-600 mb-1">
              利用可能残高
            </span>
            <span className="text-3xl font-bold tracking-tight text-blue-700">
              ¥{currentBalance.toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t bg-gray-50">
        {editMode ? (
          <div className="flex justify-between w-full">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isLoading}
              size="sm"
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-colors"
            >
              {isLoading ? "更新中..." : "保存"}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setEditMode(true)}
            variant="outline"
            className="ml-auto border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
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
