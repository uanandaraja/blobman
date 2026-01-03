import * as queries from "./queries";
import * as schema from "./schema";
import type * as types from "./types";

export namespace BucketObject {
  // Schemas
  export const List = schema.List;
  export type List = schema.List;

  // Types
  export type Info = types.Info;
  export type ListResult = types.ListResult;

  // Queries
  export const list = queries.list;
}
