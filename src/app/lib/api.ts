import { CreditCard, Expense, Income } from "../types";

// ローカルAPIプロキシのエンドポイント
const API_PROXY = "/api/gas";

/**
 * 予算データを取得する
 */
export async function fetchBudgetData() {
  try {
    // ローカルAPIプロキシを使用
    console.log("APIプロキシを使用してデータを取得しています...");

    const response = await fetch(API_PROXY, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    console.log("取得したデータ:", data);
    return data;
  } catch (error) {
    console.error("API呼び出しエラー:", error);
    // エラーを呼び出し元に伝播させる
    throw error;
  }
}

/**
 * 予算データを更新する
 */
export async function updateBudgetData(data: {
  currentBalance?: number;
  creditCards?: CreditCard[];
  expenses?: Expense[];
  incomes?: Income[];
}) {
  try {
    console.log("更新データをAPIプロキシに送信:", data);

    // ローカルAPIプロキシを使用
    const response = await fetch(API_PROXY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`データの更新に失敗しました: ${response.status}`);
    }

    const updatedData = await response.json();
    console.log("更新後のデータ:", updatedData);
    return updatedData;
  } catch (error) {
    console.error("API呼び出しエラー:", error);
    // エラーを呼び出し元に伝播させる
    throw error;
  }
}

/**
 * モックデータを提供する関数（テスト・開発用）
 */
export function getMockData() {
  return {
    currentBalance: 100000,
    creditCards: [
      {
        id: "1",
        name: "JCBカード",
        limit: 200000,
        paymentDate: 15,
        currentBalance: 50000,
      },
      {
        id: "2",
        name: "VISAカード",
        limit: 300000,
        paymentDate: 25,
        currentBalance: 75000,
      },
    ],
    expenses: [
      {
        id: "1",
        name: "家賃",
        amount: 80000,
        dueDate: 5,
        isRecurring: true,
      },
      {
        id: "2",
        name: "光熱費",
        amount: 15000,
        dueDate: 10,
        isRecurring: true,
      },
      {
        id: "3",
        name: "通信費",
        amount: 8000,
        dueDate: 15,
        isRecurring: true,
      },
    ],
    incomes: [
      {
        id: "1",
        name: "給与",
        amount: 280000,
        paymentDate: 25,
        isRecurring: true,
      },
      {
        id: "2",
        name: "ボーナス（夏）",
        amount: 500000,
        paymentDate: 15,
        isRecurring: false,
      },
    ],
  };
}
