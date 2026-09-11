export interface DecodedFirebaseToken {
  uid: string;
  sub: string;
  phone_number?: string;
  email?: string;
  [key: string]: any;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedFirebaseToken> {
  // 1. Primary Strategy: Google Identity Toolkit REST API
  // Lightweight, zero-dependency, works on all serverless environments without CJS/bundler crashes
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.replace(/^["']|["']$/g, "").trim();
  if (apiKey) {
    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const user = data.users?.[0];
        if (user) {
          return {
            uid: user.localId,
            sub: user.localId,
            phone_number: user.phoneNumber,
            email: user.email,
            ...user,
          };
        }
      }
    } catch (e) {
      console.warn("Google identitytoolkit lookup failed, trying Firebase Admin SDK fallback:", e);
    }
  }

  // 2. Fallback: Firebase Admin SDK with lazy dynamic import
  try {
    const { getApps, initializeApp, cert, getApp } = await import("firebase-admin/app");
    const { getAuth } = await import("firebase-admin/auth");

    if (!getApps().length) {
      const rawPk = process.env.FIREBASE_PRIVATE_KEY;
      const privateKey = rawPk
        ? rawPk.replace(/^["']|["']$/g, "").replace(/\\n/g, "\n")
        : undefined;

      const projectId = process.env.FIREBASE_PROJECT_ID?.replace(/^["']|["']$/g, "").trim();
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.replace(/^["']|["']$/g, "").trim();

      if (projectId && clientEmail && privateKey) {
        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      }
    }

    const adminAuth = getAuth(getApp());
    return (await adminAuth.verifyIdToken(idToken)) as DecodedFirebaseToken;
  } catch (err: any) {
    console.error("Firebase Admin SDK verification failed:", err.message || err);
    throw new Error(err.message || "Invalid or expired Firebase ID token");
  }
}

export const auth = {
  verifyIdToken: async (idToken: string) => {
    return verifyFirebaseIdToken(idToken);
  },
};

