import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, password, timestamp } from "@keystone-6/core/fields";
import type { Lists } from ".keystone/types";

const permissions = {
  authenticatedUser: ({ session }: any) => !!session?.data,
};

export const lists: Lists = {
  User: list({
    access: allowAll,
    // this is the fields for our User list
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        access: {
          read: permissions.authenticatedUser,
          create: permissions.authenticatedUser,
          update: permissions.authenticatedUser,
        },
      }),
      password: password({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },
  }),
};
