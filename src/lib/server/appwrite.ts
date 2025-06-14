import env from "@/app/env";
import { Client, Account, Databases, Teams, Storage, Messaging } from "node-appwrite"

let client = new Client();

client
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId)
  .setKey(env.appwrite.apiKey)
;

const account = new Account(client);
const databases = new Databases(client);
const teams = new Teams(client);
const storage = new Storage(client);
const messaging = new Messaging(client);

export {
  client,
  account,
  databases,
  teams,
  storage,
  messaging
}
