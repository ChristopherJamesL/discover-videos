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
