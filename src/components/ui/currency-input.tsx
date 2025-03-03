"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as React from "react";

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
}

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(({ value, onChange, className, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 数字とカンマ以外の文字を除去
    let inputValue = e.target.value.replace(/[^\d,]/g, "");

    // カンマを全て除去
    inputValue = inputValue.replace(/,/g, "");

    if (inputValue === "") {
      onChange("");
      return;
    }

    // 数値として処理
    const numberValue = parseInt(inputValue, 10);

    if (isNaN(numberValue)) {
      onChange("");
      return;
    }

    // カンマ区切りの文字列に変換
    const formattedValue = numberValue.toLocaleString("ja-JP");
    onChange(formattedValue);
  };

  // 表示値の正規化
  const displayValue = React.useMemo(() => {
    if (value === "" || value === undefined || value === null) return "";

    // 数値の場合、文字列に変換してカンマ区切りに
    if (typeof value === "number") {
      return value.toLocaleString("ja-JP");
    }

    // 文字列の場合、数値に変換できればカンマ区切りに
    const numValue = parseInt(value.toString().replace(/,/g, ""), 10);
    return isNaN(numValue) ? "" : numValue.toLocaleString("ja-JP");
  }, [value]);

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        ¥
      </span>
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={cn("pl-8", className)}
        {...props}
      />
    </div>
  );
});

CurrencyInput.displayName = "CurrencyInput";
