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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleDollarSign, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Expense } from "../types";

interface ExpenseListProps {
  expenses: Expense[];
  onUpdate: (expenses: Expense[]) => Promise<void>;
  isLoading: boolean;
}

const ExpenseFormSchema = z.object({
  name: z.string().min(1, {
    message: "支出項目名は必須です",
  }),
  amount: z.coerce.number().positive({
    message: "金額は0より大きい数値を入力してください",
  }),
  paymentDate: z.coerce.number().min(1).max(31, {
    message: "支払日は1から31の間で入力してください",
  }),
  dueDate: z.coerce.number().min(1).max(31, {
    message: "締め日は1から31の間で入力してください",
  }),
  isRecurring: z.boolean().default(true),
});

export function ExpenseList({
  expenses,
  onUpdate,
  isLoading,
}: ExpenseListProps) {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof ExpenseFormSchema>>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      name: "",
      amount: 0,
      paymentDate: 1,
      dueDate: 1,
      isRecurring: true,
    },
  });

  const handleDelete = (index: number) => {
    const newExpenses = [...expenses];
    newExpenses.splice(index, 1);
    onUpdate(newExpenses);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    const expense = expenses[index];
    form.reset({
      name: expense.name,
      amount: expense.amount,
      paymentDate: expense.paymentDate,
      dueDate: expense.dueDate,
      isRecurring: expense.isRecurring,
    });
    setOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof ExpenseFormSchema>) => {
    const newExpense: Expense = {
      name: values.name,
      amount: values.amount,
      paymentDate: values.paymentDate,
      dueDate: values.dueDate,
      isRecurring: values.isRecurring,
    };

    let newExpenses: Expense[];
    if (editIndex !== null) {
      newExpenses = [...expenses];
      newExpenses[editIndex] = newExpense;
    } else {
      newExpenses = [...expenses, newExpense];
    }

    await onUpdate(newExpenses);
    setOpen(false);
    setEditIndex(null);
    form.reset({
      name: "",
      amount: 0,
      paymentDate: 1,
      dueDate: 1,
      isRecurring: true,
    });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-gray-900">
            固定支出
          </CardTitle>
          <CardDescription className="text-sm font-medium text-gray-600">
            定期的な支払い項目
          </CardDescription>
        </div>
        <div className="rounded-full bg-primary/10 p-2">
          <CircleDollarSign className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        {expenses.length === 0 ? (
          <div className="flex h-[140px] items-center justify-center rounded-md border border-dashed p-8 bg-gray-50">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">
                登録された支出項目はありません。
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
            {expenses.map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border p-4 text-sm bg-white hover:shadow-md transition-all"
              >
                <div className="grid gap-1">
                  <div className="font-semibold text-gray-900">
                    {expense.name}
                  </div>
                  <div className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
                    毎月{expense.paymentDate}日
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-gray-900 bg-primary/10 px-3 py-1 rounded-lg">
                    ¥{expense.amount.toLocaleString()}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-gray-100"
                      onClick={() => handleEdit(index)}
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
                      onClick={() => handleDelete(index)}
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
      <CardFooter className="border-t">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-100 font-medium"
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              支出項目を追加
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {editIndex !== null ? "支出項目を編集" : "支出項目を追加"}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">
                毎月の固定支出項目を登録してください。
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-gray-800">
                          支出項目名
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="家賃"
                            className="h-12 text-base bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-gray-800">
                          金額
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                              ¥
                            </span>
                            <Input
                              {...field}
                              type="number"
                              placeholder="50000"
                              min={1}
                              className="h-12 text-base pl-8 bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-gray-800">
                          支払日
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 text-base bg-white border-gray-300 focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="支払日を選択" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-80 bg-white">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (day) => (
                                <SelectItem
                                  key={day}
                                  value={day.toString()}
                                  className="text-base"
                                >
                                  {day}日
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-gray-800">
                          締め日
                        </FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 text-base bg-white border-gray-300 focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="締め日を選択" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-80 bg-white">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (day) => (
                                <SelectItem
                                  key={day}
                                  value={day.toString()}
                                  className="text-base"
                                >
                                  {day}日
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isRecurring"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 border-gray-300 bg-white">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium text-gray-800">
                            毎月の定期支払い
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-600">
                            毎月自動的に発生する支出として計算します
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="scale-125 data-[state=checked]:bg-primary"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary text-white hover:bg-primary/90 min-w-[120px] h-12 text-base px-6 shadow-md"
                  >
                    {isLoading
                      ? "処理中..."
                      : editIndex !== null
                        ? "更新"
                        : "追加"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
