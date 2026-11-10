import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "trw_admin_session";

export interface AdminUser {
  email: string;
  role: string;
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);

  if (!session || !session.value) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(session.value, "base64").toString("utf-8"));
    if (parsed && parsed.email && parsed.exp > Date.now()) {
      return { email: parsed.email, role: "admin" };
    }
  } catch {
    return null;
  }

  return null;
}

export async function setAdminSession(email: string, secureCookie?: boolean) {
  const cookieStore = await cookies();
  const sessionData = {
    email,
    role: "admin",
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  const token = Buffer.from(JSON.stringify(sessionData)).toString("base64");

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookie ?? process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
