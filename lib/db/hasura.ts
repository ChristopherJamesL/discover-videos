import { GraphQLResponse, UsersQueryResponse } from "./hasura.types";

export async function fetchGraphQL<T>(
  operationsDoc: string,
  operationName: string,
  variables?: Record<string, unknown>
): Promise<GraphQLResponse<T>> {
  const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT;
  const secret = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;
  if (!endpoint || !secret)
    throw new Error(
      "Missing required hasura environment endpoint or secret variable"
    );

  const result = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFua3kiLCJpYXQiOjE3NTg1MDEwMDEsImV4cCI6MTc1OTEwNTk0NSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwieC1oYXN1cmEtdXNlci1pZCI6IkFua3kifX0.gYCIq9RJ9rhnTQyXLeKhA9xwQkcp_mKPehrEOAdNDnk",
      // "Content-Type": "application/json",
      // "x-hasura-admin-secret": secret,
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export async function fetchMyQuery() {
  const operationsDoc = `
    query MyQuery {
      users {
        id
        email
        issuer
      }
    }
  `;
  return await fetchGraphQL<UsersQueryResponse>(operationsDoc, "MyQuery", {});
}
