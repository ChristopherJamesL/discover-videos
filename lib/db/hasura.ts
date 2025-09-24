import {
  GraphQLResponse,
  UsersQueryResponse,
  MagicUserMetadata,
  UserMutationResponse,
} from "./hasura.types";

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

export async function createNewUser(
  token: string,
  metadata: MagicUserMetadata
) {
  const { issuer, email, publicAddress } = metadata;

  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
  `;

  const response = await fetchHasuraGraphQL<UserMutationResponse>(
    operationsDoc,
    "createNewUser",
    token,
    { issuer, email, publicAddress }
  );
  const user = response;
  console.log({ user, metadata });

  return response;
}
