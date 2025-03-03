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
import { CircleDollarSign, Pencil, PlusCircle, Trash2 } from "lucide-react";
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
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">固定支出</CardTitle>
            <CardDescription>毎月の固定支出項目</CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 p-2">
            <CircleDollarSign className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {expenses.length === 0 ? (
          <div className="flex h-[140px] items-center justify-center rounded-md border border-dashed p-8 bg-muted/50">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                登録された固定支出はありません。
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {expenses.map((expense, index) => (
              <div
                key={expense.id || index}
                className="rounded-md border bg-card overflow-hidden"
              >
                <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{expense.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(index)}
                      disabled={isLoading}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">編集</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(index)}
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
                        ¥{expense.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        支払日
                      </p>
                      <p className="text-sm font-medium">
                        毎月{expense.paymentDate}日
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      種類
                    </p>
                    <p className="text-sm font-medium">
                      {expense.isRecurring ? "毎月の支出" : "一時的な支出"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" size="sm" disabled={isLoading}>
              <PlusCircle className="h-4 w-4 mr-2" />
              支出項目を追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editIndex !== null ? "支出項目を編集" : "支出項目を追加"}
              </DialogTitle>
              <DialogDescription>
                毎月の固定支出項目を登録してください。
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>項目名</FormLabel>
                        <FormControl>
                          <Input placeholder="家賃、光熱費など" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>金額</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="金額を入力"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>支払日</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="支払日を選択" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (day) => (
                                <SelectItem key={day} value={day.toString()}>
                                  {day}日
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>締め日</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="締め日を選択" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (day) => (
                                <SelectItem key={day} value={day.toString()}>
                                  {day}日
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isRecurring"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>毎月の定期支払い</FormLabel>
                          <FormDescription>
                            毎月自動的に発生する支出として計算します
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isLoading}
                  >
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={isLoading}>
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
