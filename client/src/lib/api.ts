const WORKER_BASE = "https://qmailtemp-inbox.coz-dita.workers.dev";

function randomLocalPart(length = 10) {
  return Math.random().toString(36).slice(2, 2 + length);
}

export async function createSession() {
  const address = `${randomLocalPart(10)}@qmailtemp.com`;

  return {
    address,
    token: address,
  };
}

export async function getInbox(addressOrToken: string) {
  const email = addressOrToken;

  const res = await fetch(
    `${WORKER_BASE}/api/inbox?to=${encodeURIComponent(email)}`
  );

  if (!res.ok) {
    throw new Error(`inbox failed: ${res.status}`);
  }

  return res.json();
}

export async function clearInbox(addressOrToken: string) {
  const email = addressOrToken;

  const res = await fetch(
    `${WORKER_BASE}/api/clear?to=${encodeURIComponent(email)}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    throw new Error(`clear failed: ${res.status}`);
  }

  return res.json();
}

export async function getMessage(_token: string, _id: string) {
  return null;
}