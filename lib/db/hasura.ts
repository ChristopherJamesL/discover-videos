import { GraphQLResponse, UsersQueryResponse } from "./hasura.types";

function getHasuraConfig() {
  const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT;
  const adminSecret = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET;

  if (!endpoint || !adminSecret) {
    throw new Error("Missing required HASURA environment variables.");
  }

  return { endpoint, adminSecret };
}

export async function isNewUser(token: string, issuer: string) {
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        email
        id
        issuer
        publicAddress
      }
    }
  `;

  const response = await fetchHasuraGraphQL<UsersQueryResponse>(
    operationsDoc,
    "isNewUser",
    token,
    { issuer }
  );
  const user = response?.data?.users[0];
  console.log({ user, issuer });

  return response?.data?.users?.length === 0;
}

export async function fetchHasuraGraphQL<T>(
  operationsDoc: string,
  operationName: string,
  token: string,
  variables?: Record<string, unknown>
): Promise<GraphQLResponse<T>> {
  const { endpoint } = getHasuraConfig();

  const result = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
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
