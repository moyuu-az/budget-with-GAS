import { NextRequest, NextResponse } from "next/server";

const GAS_ENDPOINT = process.env.NEXT_PUBLIC_GAS_ENDPOINT || "";

export async function GET() {
  try {
    if (!GAS_ENDPOINT) {
      return NextResponse.json(
        { error: "GAS_ENDPOINTが設定されていません" },
        { status: 500 },
      );
    }

    console.log("Proxy: GASエンドポイントにリクエストを送信:", GAS_ENDPOINT);

    const response = await fetch(GAS_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `GASからのレスポンスエラー: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("プロキシでエラーが発生:", error);
    return NextResponse.json(
      {
        error: `データの取得に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!GAS_ENDPOINT) {
      return NextResponse.json(
        { error: "GAS_ENDPOINTが設定されていません" },
        { status: 500 },
      );
    }

    const body = await request.json();
    console.log("Proxy: GASエンドポイントにデータを送信:", body);

    // Google Apps ScriptではGETリクエストを使用してデータを送信
    // クエリパラメータとしてデータを追加
    const urlWithParams = new URL(GAS_ENDPOINT);
    urlWithParams.searchParams.append("action", "update");
    urlWithParams.searchParams.append("data", JSON.stringify(body));

    console.log("GETリクエスト先:", urlWithParams.toString());

    const response = await fetch(urlWithParams.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `GASからのレスポンスエラー: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("プロキシでエラーが発生:", error);
    return NextResponse.json(
      {
        error: `データの更新に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    );
  }
}
