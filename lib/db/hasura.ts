import { GraphQLResponse } from "./hasura.types";

async function fetchGraphQL<T>(
  operationsDoc: string,
  operationName: string,
  variables?: Record<string, unknown>
): Promise<GraphQLResponse<T>> {
  const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT;
  const secret = process.env.HASURA_ADMIN_SECRET;
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

const operationsDoc = `
  query MyQuery {
    users {
      id
      email
      issuer
    }
  }
`;

function fetchMyQuery() {
  return fetchGraphQL(operationsDoc, "MyQuery", {});
}

export async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
}
