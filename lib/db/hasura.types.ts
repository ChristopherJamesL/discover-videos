export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLErrors;
}

type GraphQLErrors = {
  message: string;
  locations?: { line: number; column: number }[];
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
};

export type UsersQueryResponse = {
  users: {
    id: string;
    email: string;
    issuer: string;
  }[];
};

export type StatsQueryResponse = {
  stats: [
    {
      favorited: number;
      id: number;
      user_id: string;
      video_id: string;
      watched: boolean;
    },
  ];
};

export type UserMutationResponse = {
  insert_users: {
    returning: {
      email: string;
      id: string;
      issuer: string;
    }[];
  };
};

export interface MagicUserMetadata {
  issuer: string | null;
  publicAddress: string | null;
  email: string | null;
}
