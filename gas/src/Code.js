// シート名の定義
const SHEET_NAMES = {
  SETTINGS: "Settings",
  CREDIT_CARDS: "CreditCards",
  EXPENSES: "Expenses",
  INCOME: "Income",
  MONTHLY_DATA: "MonthlyData",
};

// 初期化関数
function initializeSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Settingsシートの作成
  let settingsSheet =
    ss.getSheetByName(SHEET_NAMES.SETTINGS) ||
    ss.insertSheet(SHEET_NAMES.SETTINGS);
  settingsSheet.clear();
  settingsSheet.getRange("A1:B1").setValues([["項目", "値"]]);
  settingsSheet.getRange("A2:B2").setValues([["現在の残高", 0]]);

  // CreditCardsシートの作成
  let creditCardsSheet =
    ss.getSheetByName(SHEET_NAMES.CREDIT_CARDS) ||
    ss.insertSheet(SHEET_NAMES.CREDIT_CARDS);
  creditCardsSheet.clear();
  creditCardsSheet
    .getRange("A1:E1")
    .setValues([["ID", "カード名", "利用限度額", "支払日", "現在の利用額"]]);

  // Expensesシートの作成
  let expensesSheet =
    ss.getSheetByName(SHEET_NAMES.EXPENSES) ||
    ss.insertSheet(SHEET_NAMES.EXPENSES);
  expensesSheet.clear();
  expensesSheet
    .getRange("A1:E1")
    .setValues([["ID", "名称", "支払額", "支払日", "定期支払"]]);

  // Incomeシートの作成
  let incomeSheet =
    ss.getSheetByName(SHEET_NAMES.INCOME) || ss.insertSheet(SHEET_NAMES.INCOME);
  incomeSheet.clear();
  incomeSheet
    .getRange("A1:E1")
    .setValues([["ID", "名称", "金額", "支払日", "定期収入"]]);

  // MonthlyDataシートの作成
  let monthlyDataSheet =
    ss.getSheetByName(SHEET_NAMES.MONTHLY_DATA) ||
    ss.insertSheet(SHEET_NAMES.MONTHLY_DATA);
  monthlyDataSheet.clear();
  monthlyDataSheet.getRange("A1:C1").setValues([["日付", "残高", "メモ"]]);

  return true;
}

// スプレッドシートが初期化されているかチェック
function checkAndInitializeIfNeeded() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 必要なシートが全て存在するかチェック
  const allSheetsExist = Object.values(SHEET_NAMES).every((sheetName) => {
    return ss.getSheetByName(sheetName) !== null;
  });

  // いずれかのシートが存在しない場合は初期化
  if (!allSheetsExist) {
    return initializeSpreadsheet();
  }

  return true;
}

// データ取得関数
function getData() {
  // まずスプレッドシートが初期化されているか確認
  checkAndInitializeIfNeeded();

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 現在の残高を取得
  const settingsSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  const currentBalance = settingsSheet.getRange("B2").getValue();

  // クレジットカード情報を取得
  const creditCardsSheet = ss.getSheetByName(SHEET_NAMES.CREDIT_CARDS);
  const creditCardsData = creditCardsSheet.getDataRange().getValues();
  const creditCards = creditCardsData
    .slice(1)
    .filter((row) => row[0])
    .map((row) => ({
      id: row[0],
      name: row[1],
      limit: row[2],
      paymentDate: row[3],
      currentBalance: row[4],
    }));

  // 支出情報を取得
  const expensesSheet = ss.getSheetByName(SHEET_NAMES.EXPENSES);
  const expensesData = expensesSheet.getDataRange().getValues();
  const expenses = expensesData
    .slice(1)
    .filter((row) => row[0])
    .map((row) => ({
      id: row[0],
      name: row[1],
      amount: row[2],
      dueDate: row[3],
      isRecurring: row[4],
    }));

  // 収入情報を取得
  const incomeSheet = ss.getSheetByName(SHEET_NAMES.INCOME);
  const incomeData = incomeSheet.getDataRange().getValues();
  const incomes = incomeData
    .slice(1)
    .filter((row) => row[0])
    .map((row) => ({
      id: row[0],
      name: row[1],
      amount: row[2],
      paymentDate: row[3],
      isRecurring: row[4],
    }));

  return {
    currentBalance,
    creditCards,
    expenses,
    incomes,
  };
}

// データ更新関数
function updateData(data) {
  // まずスプレッドシートが初期化されているか確認
  checkAndInitializeIfNeeded();

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 現在の残高を更新
  if (data.currentBalance !== undefined) {
    const settingsSheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
    settingsSheet.getRange("B2").setValue(data.currentBalance);
  }

  // クレジットカード情報を更新
  if (data.creditCards) {
    const creditCardsSheet = ss.getSheetByName(SHEET_NAMES.CREDIT_CARDS);
    // まず既存のデータをクリアする（ヘッダー行は残す）
    const lastRow = Math.max(2, creditCardsSheet.getLastRow());
    if (lastRow > 2) {
      creditCardsSheet.getRange(2, 1, lastRow - 1, 5).clearContent();
    }

    // 新しいデータを書き込む
    const values = data.creditCards.map((card) => [
      card.id,
      card.name,
      card.limit,
      card.paymentDate,
      card.currentBalance,
    ]);
    if (values.length > 0) {
      creditCardsSheet.getRange(2, 1, values.length, 5).setValues(values);
    }
  }

  // 支出情報を更新
  if (data.expenses) {
    const expensesSheet = ss.getSheetByName(SHEET_NAMES.EXPENSES);
    // まず既存のデータをクリアする（ヘッダー行は残す）
    const lastRow = Math.max(2, expensesSheet.getLastRow());
    if (lastRow > 2) {
      expensesSheet.getRange(2, 1, lastRow - 1, 5).clearContent();
    }

    // 新しいデータを書き込む
    const values = data.expenses.map((expense) => [
      expense.id,
      expense.name,
      expense.amount,
      expense.dueDate,
      expense.isRecurring,
    ]);
    if (values.length > 0) {
      expensesSheet.getRange(2, 1, values.length, 5).setValues(values);
    }
  }

  // 収入情報を更新
  if (data.incomes) {
    const incomeSheet = ss.getSheetByName(SHEET_NAMES.INCOME);
    // まず既存のデータをクリアする（ヘッダー行は残す）
    const lastRow = Math.max(2, incomeSheet.getLastRow());
    if (lastRow > 2) {
      incomeSheet.getRange(2, 1, lastRow - 1, 5).clearContent();
    }

    // 新しいデータを書き込む
    const values = data.incomes.map((income) => [
      income.id,
      income.name,
      income.amount,
      income.paymentDate,
      income.isRecurring,
    ]);
    if (values.length > 0) {
      incomeSheet.getRange(2, 1, values.length, 5).setValues(values);
    }
  }

  return getData();
}

// Web APIとして公開するための関数
function doGet() {
  try {
    // スプレッドシートが初期化されているか確認
    checkAndInitializeIfNeeded();

    // データを取得してJSONに変換
    const data = getData();

    // 正常な応答を返す
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (e) {
    // エラーが発生しても適切なレスポンスを返す
    console.error("エラーが発生しました: " + e.toString());
    return ContentService.createTextOutput(
      JSON.stringify({
        error: true,
        message: e.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    // スプレッドシートが初期化されているか確認
    checkAndInitializeIfNeeded();

    // リクエストデータを解析
    const data = JSON.parse(e.postData.contents);

    // データを更新
    const updatedData = updateData(data);

    // 更新したデータをJSONに変換して返す
    return ContentService.createTextOutput(
      JSON.stringify(updatedData),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    // エラーが発生しても適切なレスポンスを返す
    console.error("エラーが発生しました: " + e.toString());
    return ContentService.createTextOutput(
      JSON.stringify({
        error: true,
        message: e.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// CORSプリフライトリクエストに対応
function doOptions() {
  return ContentService.createTextOutput("").setMimeType(
    ContentService.MimeType.TEXT,
  );
}
