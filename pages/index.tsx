import { useEffect, useState } from "react";
import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { request, gql } from "graphql-request";
import { keystoneContext } from "../lib/keystone-context";
import { Header } from "../src/components/Header";

const ServerRenderedContent = ({
  users,
}: {
  users: { id: string; name: string; email: string | null }[];
}) => {
  return (
    <div>
      <p>
        <strong>Users fetched from the server (in getServerSideProps)</strong>
      </p>
      <ol>
        {users.map((u) => {
          return (
            <li key={u.id}>
              {u.name}{" "}
              {u.email ? `(email: ${u.email})` : `(email: not authenticated)`}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const ClientRenderedContent = ({}: {}) => {
  const [users, setUsers] = useState<
    Array<{ id: string; name: string; email: string | null }>
  >([]);

  // Fetch users from REST api route
  useEffect(() => {
    const query = gql`
      {
        users {
          id
          name
          email
        }
      }
    `;

    request("/api/graphql-yoga/", query).then((data) => {
      setUsers(data.users);
    });
  }, []);

  return (
    <div>
      <p>
        <strong>Users fetched from the browser (in useEffect())</strong>
      </p>
      {users.length ? (
        <ol>
          {users.map((u) => {
            return (
              <li key={u.id}>
                {u.name}{" "}
                {u.email ? `(email: ${u.email})` : `(email: not authenticated)`}
              </li>
            );
          })}
        </ol>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
};

const Home: NextPage = ({
  users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div
      style={{
        padding: "0 2rem",
      }}
    >
      <Head>
        <title>Keystone + Next.js</title>
        <meta
          name="description"
          content="Example to use Keystone APIs in a Next.js server environment."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main style={{ display: "flex", justifyContent: "center" }}>
        <section>
          <h1>Keystone 🤝 Next.js</h1>
          <p>
            Keystone can be used as a data engine in Next.js applications. This
            is made possible by Keystone&apos;s `getContext` API. However the
            Admin UI will not be available since we are not starting the
            Keystone server. To CRUD data from the server `getContext` can be
            used but to CRUD data from the browser we will need to manually wire
            the generated GraphQL schema to a custom Next.js API route (refer
            `pages/api/graphql-apollo.ts`).
          </p>
          <p>
            <a href="https://github.com/flexdinesh/keystone-in-next/blob/main/README.md">
              Read the repo `Readme.md` for more info.
            </a>
          </p>

          <p>
            Demo: This page has both server rendered content and client
            rendered content.
          </p>
          <ul>
            <li>
              If you are <strong>not logged in</strong>, you can <strong>only see the name</strong> of all users in the
              database.
            </li>
            <li>
              User.email is behind access control and only visible for logged in
              users. So <strong>once you log in, you can see both the name and email of
              all users</strong> in the database.
            </li>
          </ul>

          <ServerRenderedContent users={users} />
          <ClientRenderedContent />
        </section>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // keystone session cookie is automatically unwrapped
  const context = await keystoneContext.withRequest(req, res);
  const users = await context.query.User.findMany({
    query: "id name email",
  });
  return {
    props: { users: users }, // will be passed to the page component as props
  };
};

export default Home;
