import { Balance, CreditCard, Expense, Income } from "../types";

const GAS_ENDPOINT = process.env.NEXT_PUBLIC_GAS_ENDPOINT;

export async function fetchData() {
  const response = await fetch(`${GAS_ENDPOINT}`, {
    method: "GET",
  });
  return response.json();
}

export async function updateData(data: {
  creditCards?: CreditCard[];
  expenses?: Expense[];
  incomes?: Income[];
  balances?: Balance[];
}) {
  const response = await fetch(`${GAS_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
