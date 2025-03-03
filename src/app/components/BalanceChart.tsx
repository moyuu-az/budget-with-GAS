"use client";

import { Card, CardContent, Typography } from "@mui/material";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { CreditCard, Expense, Income } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface BalanceChartProps {
  currentBalance: number;
  creditCards: CreditCard[];
  expenses: Expense[];
  incomes: Income[];
}

export default function BalanceChart({
  currentBalance,
  creditCards,
  expenses,
  incomes,
}: BalanceChartProps) {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    generateChartData();
  }, [currentBalance, creditCards, expenses, incomes]);

  const generateChartData = () => {
    // 今日の日付を取得
    const today = new Date();
    const labels: string[] = [];
    const balanceData: number[] = [];

    // 現在月から3ヶ月先までの残高推移を計算
    let currentBalanceValue = currentBalance;

    // 次の90日間の残高を計算
    for (let i = 0; i < 90; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dateString = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;

      // その日の収入を加算
      incomes.forEach((income) => {
        if (
          income.isRecurring &&
          income.paymentDate === currentDate.getDate()
        ) {
          currentBalanceValue += income.amount;
        }
      });

      // その日の支出を減算
      expenses.forEach((expense) => {
        if (expense.isRecurring && expense.dueDate === currentDate.getDate()) {
          currentBalanceValue -= expense.amount;
        }
      });

      // クレジットカードの支払いを減算
      creditCards.forEach((card) => {
        if (card.paymentDate === currentDate.getDate()) {
          currentBalanceValue -= card.currentBalance;
        }
      });

      // 10日ごとに表示（データポイントが多すぎないように）
      if (i % 10 === 0 || i === 89) {
        labels.push(dateString);
        balanceData.push(currentBalanceValue);
      }
    }

    setChartData({
      labels,
      datasets: [
        {
          label: "残高推移",
          data: balanceData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "残高推移予測",
      },
    },
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          残高推移
        </Typography>
        <Line options={options} data={chartData} />
      </CardContent>
    </Card>
  );
}
