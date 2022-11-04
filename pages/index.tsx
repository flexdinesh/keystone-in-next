import { useEffect, useState } from "react";
import type { NextPage, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { keystoneContext } from "../lib/keystone-context";

const ServerRenderedContent = ({
  users,
}: {
  users: { id: string; name: string }[];
}) => {
  return (
    <div>
      <p>
        <strong>Users fetched from the server (in getStaticProps)</strong>
      </p>
      <ol>
        {users.map((u: { id: string; name: string }) => {
          return <li key={u.id}>{u.name}</li>;
        })}
      </ol>
    </div>
  );
};

const ClientRenderedContent = ({}: {}) => {
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch users from REST api route
  useEffect(() => {
    fetch("/api/user/findMany", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "id name",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  return (
    <div>
      <p>
        <strong>Users fetched from the browser (using fetch())</strong>
      </p>
      {users.length ? (
        <ol>
          {users.map((u) => {
            return <li key={u.id}>{u.name}</li>;
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
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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

      <main style={{ display: "flex", justifyContent: "center" }}>
        <section>
          <h1>Keystone 🤝 Next.js</h1>
          <p>
            Keystone can be used as a data engine in Next.js server environments
            without even starting the Keystone server. This is powered by
            Keystone&apos;s `getContext` API. However the Admin UI will not be
            available since we are not starting the Keystone server. To CRUD
            data from the server `getContext` can be used but to CRUD data from
            the browser we will need to manually wire schema to Next.js API
            routes (refer `pages/api/user/findMany.ts` or
            `pages/api/apollo-graphql.ts`).
          </p>
          <p>
            <em>
              Note: Authentication and authenticated requests won&apos;t work
              yet. We&apos;re experimenting around getting it to work.
            </em>
          </p>
          <p>
            <a href="https://github.com/flexdinesh/keystone-in-next/blob/main/README.md">
              Read the repo `Readme.md` for more info.
            </a>
          </p>

          <ServerRenderedContent users={users} />
          <ClientRenderedContent />
        </section>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const users = await keystoneContext.query.User.findMany({
    query: "id name",
  });
  return {
    props: { users: users }, // will be passed to the page component as props
  };
};

export default Home;
