import { getContext } from "@keystone-6/core/context";
import config from "../keystone";
import * as PrismaModule from ".prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var keystoneContext: ReturnType<typeof getContext>;
}

export const keystoneContext =
  global.keystoneContext || getContext(config, PrismaModule);

if (process.env.NODE_ENV !== "production") {
  global.keystoneContext = keystoneContext;
}
