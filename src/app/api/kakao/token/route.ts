import { NextRequest, NextResponse } from "next/server";

const KAKAO_TOKEN_ENDPOINT = "https://kauth.kakao.com/oauth/token";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    const clientId =
      process.env.KAKAO_REST_API_KEY ?? process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    const redirectUri =
      process.env.KAKAO_REDIRECT_URI ??
      process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ??
      "http://localhost:3000/auth/callback";
    const clientSecret = process.env.KAKAO_CLIENT_SECRET;

    if (!clientId) {
      return NextResponse.json(
        { error: "Kakao REST API key is not configured" },
        { status: 500 }
      );
    }

    if (!redirectUri) {
      return NextResponse.json(
        { error: "Kakao redirect URI is not configured" },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
    });

    if (clientSecret) {
      params.append("client_secret", clientSecret);
    }

    const kakaoResponse = await fetch(KAKAO_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: params,
    });

    const payload = await kakaoResponse.json();

    if (!kakaoResponse.ok) {
      return NextResponse.json(payload, { status: kakaoResponse.status });
    }

    return NextResponse.json({
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token,
      expiresIn: payload.expires_in,
      refreshTokenExpiresIn: payload.refresh_token_expires_in,
      scope: payload.scope,
      tokenType: payload.token_type,
    });
  } catch (error) {
    console.error("Failed to exchange Kakao token", error);
    return NextResponse.json(
      { error: "Failed to exchange Kakao token" },
      { status: 500 }
    );
  }
}
