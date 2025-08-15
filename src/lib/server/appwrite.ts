import env from "@/app/env";
import { Client, Account, Databases, Storage, Teams } from "node-appwrite"

const client = new Client();

client
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId)
  .setKey(env.appwrite.apiKey)
;

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const teams = new Teams(client);

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
    databases: new Databases(sessionClient),
    storage: new Storage(sessionClient),
    teams: new Teams(sessionClient),
    client: sessionClient
  };
}

export {
  client,
  account,
  databases,
  storage,
  teams,
  createSessionClient,
}