import * as schema from "./schema";
import type * as types from "./types";
import * as queries from "./queries";

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
