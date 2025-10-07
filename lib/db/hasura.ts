import {
  GraphQLResponse,
  UsersQueryResponse,
  StatsQueryResponse,
  MagicUserMetadata,
  UserMutationResponse,
} from "./hasura.types";

function getHasuraConfig() {
  const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT;

  if (!endpoint) {
    throw new Error("Missing required HASURA environment variables.");
  }

  return { endpoint };
}

export async function isNewUser(token: string, issuer: string) {
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        id
        issuer
        publicAddress
        email
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
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export async function findVideoIdByUserId(
  token: string,
  issuer: string,
  videoId: string
) {
  const operationsDoc = `
    query findVideoIdByUserId($user_id: String!, $video_id: String!) {
      stats(where: {user_id: {_eq: $user_id}, video_id: {_eq: $video_id}}) {
        id
        user_id
        video_id
        favorited
        watched
      }
    }
  `;

  const response = await fetchHasuraGraphQL<StatsQueryResponse>(
    operationsDoc,
    "findVideoIdByUserId",
    token,
    { video_id: videoId, user_id: issuer }
  );

  return response?.data?.stats;
}

export async function createStats(
  token: string,
  issuer: string,
  videoId: string,
  favorited: number = 0,
  watched: boolean = true
) {
  const operationsDoc = `
    mutation createStats($favorited: Int!, $user_id: String!, $watched: Boolean!, $video_id: String!) {
      insert_stats_one(object: {
        favorited: $favorited, 
        user_id: $user_id, 
        video_id: $video_id, 
        watched: $watched
      }) {
        id
        user_id
        video_id
        favorited
        watched
      }
    }
  `;

  const response = await fetchHasuraGraphQL<StatsQueryResponse>(
    operationsDoc,
    "createStats",
    token,
    { favorited, user_id: issuer, video_id: videoId, watched }
  );

  return response;
}

export async function updateStats(
  token: string,
  issuer: string,
  videoId: string,
  favorited: number,
  watched: boolean
) {
  const operationsDoc = `
    mutation updateStats($favorited: Int!, $user_id: String!, $video_id: String!, $watched: Boolean!) {
      update_stats(
        where: {user_id: {_eq: $user_id}, video_id: {_eq: $video_id}}, 
        _set: {favorited: $favorited, watched: $watched}) {
        returning {
          id
          user_id
          video_id
          favorited
          watched
        }
      }
    }
  `;

  const response = await fetchHasuraGraphQL<StatsQueryResponse>(
    operationsDoc,
    "updateStats",
    token,
    { favorited, user_id: issuer, video_id: videoId, watched }
  );

  return response;
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
          id
          issuer
          email
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

  return response;
}

export async function getWatchedVideos(token: string, issuer: string) {
  const operationsDoc = `
  query watchedVideos($user_id: String!) {
    stats(where: {
      watched: {_eq: true}, 
      user_id: {_eq: $user_id}, 
    }) {
      video_id
    }
  }
`;

  const response = await fetchHasuraGraphQL<StatsQueryResponse>(
    operationsDoc,
    "watchedVideos",
    token,
    { user_id: issuer }
  );

  return response;
}

export async function myListVideos(token: string, issuer: string) {
  const operationsDoc = `
  query MyList($user_id: String!) {
    stats(where: {user_id: {_eq: $user_id}, favorited: {_eq: 1}}) {
      favorited
      id
      user_id
      video_id      
    }
  }
`;

  const response = await fetchHasuraGraphQL<StatsQueryResponse>(
    operationsDoc,
    "MyList",
    token,
    { user_id: issuer }
  );

  return response;
}
