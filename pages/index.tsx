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
            Keystone&apos;s `getContext` API. However the GraphQL API will be
            unavailable since we are not running the Keystone server and there
            are some limitations around setting up Keystone&apos;s GraphQL API
            within Next.js routes for now (we&apos;ll soon figure it out. 🤞).
            So to CRUD data from the browser, we will need to manually write
            schema to Next.js API routes (refer `pages/api/user/findMany.ts`).
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
