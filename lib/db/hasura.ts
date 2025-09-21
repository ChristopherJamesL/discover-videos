import { GraphQLResponse } from "./hasura.types";

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
      "Content-Type": "application/json",
      "x-hasura-admin-secret": secret,
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

function fetchMyQuery() {
  const operationsDoc = `
    query MyQuery {
      users {
        id
        email
        issuer
      }
    }
  `;
  return fetchGraphQL(operationsDoc, "MyQuery", {});
}
