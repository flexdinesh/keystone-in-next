import { useState, useRef, useEffect, Fragment } from "react";
import { request, gql } from "graphql-request";

const authenticateUser = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const mutation = gql`
    mutation authenticate($email: String!, $password: String!) {
      authenticateUserWithPassword(email: $email, password: $password) {
        ... on UserAuthenticationWithPasswordSuccess {
          item {
            id
            name
          }
        }
        ... on UserAuthenticationWithPasswordFailure {
          message
        }
      }
    }
  `;

  // session token is automatically saved to cookie
  return request("/api/graphql-yoga/", mutation, {
    email: email,
    password: password,
  });
};

const endUserSession = () => {
  const mutation = gql`
    mutation endUserSession {
      endSession
    }
  `;

  return request("/api/graphql-yoga/", mutation);
};

const getCurrentLoggedInUser = () => {
  const query = gql`
    query authenticate {
      authenticatedItem {
        __typename
        ... on User {
          id
          name
        }
      }
    }
  `;

  // session token is automatically accessed from cookie
  return request("/api/graphql-yoga/", query);
};

export function Header() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    getCurrentLoggedInUser().then((data) => {
      if (data?.authenticatedItem?.id) {
        setUser(data.authenticatedItem);
      }
    });
  }, []);

  const login = () => {
    // @ts-ignore
    const email = emailRef?.current?.value;
    // @ts-ignore
    const password = passwordRef?.current?.value;

    authenticateUser({ email, password }).then((data) => {
      if (data?.authenticateUserWithPassword?.item?.id) {
        window.location.reload();
      }
    });
  };

  const logout = () => {
    endUserSession().then((data) => {
      window.location.reload();
    });
  };

  return !user ? (
    <div style={{ display: "flex", gap: "1em" }}>
      <label>
        email: <input name="email" type="email" ref={emailRef}></input>
      </label>
      <label>
        password:{" "}
        <input name="password" type="password" ref={passwordRef}></input>
      </label>
      <button onClick={login}>login</button>
    </div>
  ) : (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>Hello, {user.name}!</div>
      <button onClick={logout}>logout</button>
    </div>
  );
}
