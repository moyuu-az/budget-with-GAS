"use client";

import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import BalanceComponent from "./components/Balance";
import CreditCards from "./components/CreditCards";
import Expenses from "./components/Expenses";
import Incomes from "./components/Income";
import { fetchBudgetData, updateBudgetData } from "./lib/api";
import { CreditCard, Expense, Income } from "./types";

// グラフコンポーネントを動的にインポートして、クライアントサイドでのみレンダリング
const BalanceChart = dynamic(() => import("./components/BalanceChart"), {
  ssr: false,
  loading: () => (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <CircularProgress />
    </Box>
  ),
});

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // fetchData関数を先に定義する
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchBudgetData();
      setCurrentBalance(data.currentBalance);
      setCreditCards(data.creditCards || []);
      setExpenses(data.expenses || []);
      setIncomes(data.incomes || []);
      setError(null);
    } catch (err) {
      setError("データの取得に失敗しました。再度お試しください。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  // マウントされていない場合は空のコンテンツを返す
  if (!mounted) {
    return null;
  }

  const handleUpdateBalance = async (newBalance: number) => {
    try {
      setLoading(true);
      const data = await updateBudgetData({ currentBalance: newBalance });
      setCurrentBalance(data.currentBalance);
      setSuccessMessage("残高を更新しました");
    } catch (err) {
      setError("残高の更新に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCreditCards = async (newCreditCards: CreditCard[]) => {
    try {
      setLoading(true);
      const data = await updateBudgetData({ creditCards: newCreditCards });
      setCreditCards(data.creditCards);
      setSuccessMessage("クレジットカード情報を更新しました");
    } catch (err) {
      setError("クレジットカード情報の更新に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExpenses = async (newExpenses: Expense[]) => {
    try {
      setLoading(true);
      const data = await updateBudgetData({ expenses: newExpenses });
      setExpenses(data.expenses);
      setSuccessMessage("固定支出情報を更新しました");
    } catch (err) {
      setError("固定支出情報の更新に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIncomes = async (newIncomes: Income[]) => {
    try {
      setLoading(true);
      const data = await updateBudgetData({ incomes: newIncomes });
      setIncomes(data.incomes);
      setSuccessMessage("収入情報を更新しました");
    } catch (err) {
      setError("収入情報の更新に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  return mounted ? (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            家計簿アプリ
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            予算管理
          </Typography>
          <Typography variant="body1" paragraph>
            現在の残高、クレジットカード、固定支出、収入を管理して、予算計画を立てましょう。
          </Typography>
        </Paper>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
            <CircularProgress />
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BalanceComponent
              currentBalance={currentBalance}
              onUpdateBalance={handleUpdateBalance}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CreditCards
              creditCards={creditCards}
              onUpdate={handleUpdateCreditCards}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Expenses expenses={expenses} onUpdate={handleUpdateExpenses} />
          </Grid>
          <Grid item xs={12}>
            <Incomes incomes={incomes} onUpdate={handleUpdateIncomes} />
          </Grid>
          <Grid item xs={12}>
            <BalanceChart
              currentBalance={currentBalance}
              creditCards={creditCards}
              expenses={expenses}
              incomes={incomes}
            />
          </Grid>
        </Grid>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  ) : null;
}
