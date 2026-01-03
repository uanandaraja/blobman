import * as mutations from "./mutations";
import * as queries from "./queries";
import * as schema from "./schema";
import type * as types from "./types";

export namespace Bucket {
  // Schemas
  export const Create = schema.Create;
  export type Create = schema.Create;

  // Types
  export type Info = types.Info;

  // Queries
  export const list = queries.list;
  export const get = queries.get;

  // Mutations
  export const create = mutations.create;
  export const remove = mutations.remove;
  export const testConnection = mutations.testConnection;
}
