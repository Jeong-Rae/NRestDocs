export const TypeState = { Unset: "TYPE_UNSET", Set: "TYPE_SET" } as const;
export type TypeUnset = { __state: typeof TypeState.Unset };
export type TypeSet = { __state: typeof TypeState.Set };
