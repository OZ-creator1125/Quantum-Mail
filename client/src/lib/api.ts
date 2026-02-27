const API_BASE = "https://tempmail-backend-production.up.railway.app";

export async function createSession() {
  const res = await fetch(`${API_BASE}/api/session/new`, { method: "POST" });
  if (!res.ok) throw new Error(`session/new failed: ${res.status}`);
  return res.json();
}

export async function getInbox(token: string) {
  const res = await fetch(`${API_BASE}/api/inbox`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`inbox failed: ${res.status}`);
  return res.json();
}

export async function getMessage(token: string, id: string) {
  const res = await fetch(`${API_BASE}/api/message/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`message failed: ${res.status}`);
  return res.json();
}