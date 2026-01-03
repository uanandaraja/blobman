import * as schema from "./schema";
import type * as types from "./types";
import * as queries from "./queries";
import * as mutations from "./mutations";

export namespace Bucket {
  // Schemas
  export const Create = schema.Create;
  export type Create = schema.Create;
  export const ListObjects = schema.ListObjects;
  export type ListObjects = schema.ListObjects;

  // Types
  export type Info = types.Info;
  export type ObjectInfo = types.ObjectInfo;
  export type ListObjectsResult = types.ListObjectsResult;

  // Queries
  export const list = queries.list;
  export const get = queries.get;
  export const listObjects = queries.listObjects;

  // Mutations
  export const create = mutations.create;
  export const remove = mutations.remove;
  export const testConnection = mutations.testConnection;
}
