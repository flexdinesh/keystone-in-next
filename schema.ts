import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, password, timestamp } from "@keystone-6/core/fields";
import type { Lists } from ".keystone/types";

const permissions = {
  authenticatedUser: ({ session }: any) => !!session?.data,
  public: () => true,
  readOnly: {
    operation: {
      query: () => true,
      create: () => false,
      update: () => false,
      delete: () => false,
    },
  },
};

export const lists: Lists = {
  User: list({
    // readonly for demo purpose
    access: permissions.readOnly,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        access: {
          read: permissions.authenticatedUser,
        },
      }),
      password: password({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: "now" },
      }),
    },
  }),
};
