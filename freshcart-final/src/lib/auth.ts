export interface JwtUser {
  id: string;
  name: string;
  role?: string;
}

export function decodeToken(token: string | null): JwtUser | null {
  if (!token) {
    return null;
  }

  try {
    const payload = token
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const bytes = Uint8Array.from(atob(payload), (char) =>
      char.charCodeAt(0)
    );

    const decoded = new TextDecoder().decode(bytes);

    return JSON.parse(decoded) as JwtUser;
  } catch {
    return null;
  }
}
