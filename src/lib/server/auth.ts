import { account, databases, client } from "./appwrite";
import { Client, Account, ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import env from "@/app/env";

// Types
export interface User {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  phone: string;
  phoneVerification: boolean;
  prefs: Record<string, any>;
  status: boolean;
  labels: string[];
  accessedAt: string;
  registration: string;
}

export interface Session {
  $id: string;
  userId: string;
  expire: string;
  provider: string;
  providerUid: string;
  providerAccessToken: string;
  providerAccessTokenExpiry: string;
  providerRefreshToken: string;
  ip: string;
  osCode: string;
  osName: string;
  osVersion: string;
  clientType: string;
  clientCode: string;
  clientName: string;
  clientVersion: string;
  clientEngine: string;
  clientEngineVersion: string;
  deviceName: string;
  deviceBrand: string;
  deviceModel: string;
  countryCode: string;
  countryName: string;
  current: boolean;
}

// Cookie configuration
const SESSION_COOKIE = "session";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: "/",
};

// Helper function to create authenticated client
function createSessionClient(session?: string) {
  const sessionClient = new Client()
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId);
  
  if (session) {
    sessionClient.setSession(session);
  } else {
    sessionClient.setKey(env.appwrite.apiKey);
  }
  
  return {
    account: new Account(sessionClient),
    client: sessionClient
  };
}
async function createAccount(email: string, password: string, name: string) {
    try {
        const user = await account.create(ID.unique(), email, password, name);
        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function createEmailSession(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE, session.secret, COOKIE_OPTIONS);

        return { success: true, session };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function getSessionCookie() {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE)?.value;
}

async function getCurrentSession() {
    try {
        const sessionSecret = await getSessionCookie();

        if (!sessionSecret) {
            return { success: false, error: "No session found" };
        }

        // Create client with session
        const { account: sessionAccount } = createSessionClient(sessionSecret);
        const session = await sessionAccount.getSession("current");

        return { success: true, session };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function getCurrentUser() {
    try {
        const sessionSecret = await getSessionCookie();
        if (!sessionSecret) {
            return { success: false, error: "No session found" };
        }

        // Create client with session
        const { account: sessionAccount } = createSessionClient(sessionSecret);
        const user = await sessionAccount.get();

        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function logout() {
    try {
        const sessionSecret = await getSessionCookie();
        if (sessionSecret) {
            const { account: sessionAccount } = createSessionClient(sessionSecret);
            await sessionAccount.deleteSession("current");
        }

        // Clear session cookie
        const cookieStore = await cookies();
        cookieStore.delete(SESSION_COOKIE);

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function logoutAll() {
    try {
        const sessionSecret = await getSessionCookie();
        if (sessionSecret) {
            const { account: sessionAccount } = createSessionClient(sessionSecret);
            await sessionAccount.deleteSessions();
        }

        // Clear session cookie
        const cookieStore = await cookies();
        cookieStore.delete(SESSION_COOKIE);

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function sendEmailVerification(url: string) {
    try {
        const sessionSecret = await getSessionCookie();
        if (!sessionSecret) {
            return { success: false, error: "No session found" };
        }

        const { account: sessionAccount } = createSessionClient(sessionSecret);
        await sessionAccount.createVerification(url);

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function verifyEmail(userId: string, secret: string) {
    try {
        await account.updateVerification(userId, secret);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function sendPasswordRecovery(email: string, url: string) {
    try {
        await account.createRecovery(email, url);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function resetPassword(userId: string, secret: string, password: string) {
    try {
        await account.updateRecovery(userId, secret, password);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function updateName(name: string) {
    try {
        const sessionSecret = await getSessionCookie();
        if (!sessionSecret) {
            return { success: false, error: "No session found" };
        }

        const { account: sessionAccount } = createSessionClient(sessionSecret);
        const user = await sessionAccount.updateName(name);

        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function updateEmail(email: string, password: string) {
    try {
        const sessionSecret = await getSessionCookie();
        if (!sessionSecret) {
            return { success: false, error: "No session found" };
        }

        const { account: sessionAccount } = createSessionClient(sessionSecret);
        const user = await sessionAccount.updateEmail(email, password);

        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function updatePassword(newPassword: string, oldPassword: string) {
    try {
        const sessionSecret = await getSessionCookie();
        if (!sessionSecret) {
            return { success: false, error: "No session found" };
        }

        const { account: sessionAccount } = createSessionClient(sessionSecret);
        const user = await sessionAccount.updatePassword(newPassword, oldPassword);

        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function getSessions() {
    try {
        const sessionSecret = await getSessionCookie();
        if (!sessionSecret) {
            return { success: false, error: "No session found" };
        }

        const { account: sessionAccount } = createSessionClient(sessionSecret);
        const sessions = await sessionAccount.listSessions();

        return { success: true, sessions: sessions.sessions };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function deleteSession(sessionId: string) {
    try {
        const sessionSecret = await getSessionCookie();
        if (!sessionSecret) {
            return { success: false, error: "No session found" };
        }

        const { account: sessionAccount } = createSessionClient(sessionSecret);
        await sessionAccount.deleteSession(sessionId);

        // If deleting current session, clear cookie
        if (sessionId === "current") {
            const cookieStore = await cookies();
            cookieStore.delete(SESSION_COOKIE);
        }

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function isAuthenticated() {
    const userResult = await getCurrentUser();
    return userResult.success;
}

async function requireAuth() {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
        throw new Error("Authentication required");
    }
    return userResult.user;
}

export {
    createAccount,
    createEmailSession,
    getSessionCookie,
    getCurrentSession,
    getCurrentUser,
    logout,
    logoutAll,
    sendEmailVerification,
    verifyEmail,
    sendPasswordRecovery,
    resetPassword,
    updateName,
    updateEmail,
    updatePassword,
    getSessions,
    deleteSession,
    isAuthenticated,
    requireAuth,
};

