import { config } from "@keystone-6/core";
import path from "path";
import { KeystoneContext } from "@keystone-6/core/types";
import { TypeInfo } from ".keystone/types";
import { lists } from "./schema";
import { withAuth, session } from "./auth";

const demoUsers = [
  {
    email: "clark@dc.com",
    password: "passw0rd",
    name: "Clark Kent",
  },
  {
    email: "bruce@dc.com",
    password: "passw0rd",
    name: "Bruce Wayne",
  },
  {
    email: "diana@dc.com",
    password: "passw0rd",
    name: "Diana Prince",
  },
] as const;

const upsertUser = async ({
  context,
  user,
}: {
  context: KeystoneContext<TypeInfo>;
  user: { email: string; password: string; name: string };
}) => {
  const userInDb = await context.db.User.findOne({
    where: { email: user.email },
  });
  if (userInDb) {
    return userInDb;
  }

  return context.db.User.createOne({ data: user });
};

// because next deploys need absolute path to sqlite db
// not needed for postgres db
const dbFilePath = path.join(process.cwd(), "keystone.db");
export default withAuth(
  config({
    db: {
      provider: "sqlite",
      url: `file:${dbFilePath}`,
      onConnect: async (context) => {
        const sudoContext = context.sudo() as KeystoneContext<TypeInfo>;
        demoUsers.forEach((u) => upsertUser({ context: sudoContext, user: u }));
      },
    },
    lists,
    session,
  })
);
