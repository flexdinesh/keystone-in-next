# Keystone and Next.js in a single server

> Moved to [github.com/keystonejs/keystone/tree/main/examples/nextjs-keystone](https://github.com/keystonejs/keystone/tree/main/examples/nextjs-keystone)

- Keystone can be used within Next.js server environments without even starting the Keystone server using `getContext` API.
- However since we don't start the Keystone server we won't have access to Keystone's Admin UI.
- You can use the generated Keystone GraphQL schema to setup your own GraphQL API as a Next.js route. (refer to [/pages/api/graphql-apollo.ts](/pages/api/graphql-apollo.ts))

## Notes

- The `keystone.db` committed with this repo has my login setup. Demo user email is `bruce@dc.com`, password is `passw0rd`.
- You start your Next.js app by running `yarn dev`. You don't need to start the keystone server since `getContext` will work without starting the Keystone server.
- In local, when you update your Keystone schema, you should run `yarn keystone:dev` or `yarn keystone:build` to rebuild your `schema.graphql` and `schema.prisma` files.
- When you deploy your Next.js app, just remember to run `yarn keystone:build` once to make sure you have the latest schema built for `getContext` API within your Next.js app.

## FAQ

### 1. Why won't Admin UI work?

Because of the way Keytone's current Admin UI is built. Your app is a Next.js app. Keystone's Admin UI is also a Next.js app. You can't have two Next.js apps running in a single server. So if we don't start Keystone server, we won't have access to Keystone's Admin UI. You can access it in local (use the command `yarn keystone:dev`) because you can easily start two servers in your local but once you deploy your Next.js app you won't have access to the Admin UI or the GraphQL API.

### 2. What should I do to both use Keystone in my Next.js app and have a fully functioning Admin UI?

Easy. Deploy your app twice to two different servers.

1. Deploy your Next.js app to one instance
2. Deploy the Keystone server (commands in package.json) to another instance

Both these apps communicate with the same database and are built with the same Keystone code so everything will work as is.

### 3. I want the full Keystone experience with Next.js

The only way to do that now is to use Keystone as a standalone server and build your Next.js app separately.

1. Develop and deploy Keystone to a separate server. You will now have both the Admin UI and GraphQL API.
2. Develop your Next.js app independently without Keystone dependencies and send network requests to your Keystone GraphQL API for data.
