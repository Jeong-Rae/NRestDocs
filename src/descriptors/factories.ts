import { type Builder, createBuilder } from "./builder";
import { ParamKinds } from "./types";
import type {
    FieldDescriptor,
    HeaderDescriptor,
    PartDescriptor,
    PathParamDescriptor,
    QueryParamDescriptor,
} from "./types";

/** Path Parameter */
export const pathParam = (
    name: string
): Builder<
    Partial<PathParamDescriptor> & { kind: typeof ParamKinds.Path; name: string },
    unknown
> => createBuilder(ParamKinds.Path, name);

/** Query Parameter */
export const queryParam = (
    name: string
): Builder<
    Partial<QueryParamDescriptor> & { kind: typeof ParamKinds.Query; name: string },
    unknown
> => createBuilder(ParamKinds.Query, name);

/** Header */
export const header = (
    name: string
): Builder<Partial<HeaderDescriptor> & { kind: typeof ParamKinds.Header; name: string }, unknown> =>
    createBuilder(ParamKinds.Header, name);

/** JSON Field */
export const field = (
    name: string
): Builder<Partial<FieldDescriptor> & { kind: typeof ParamKinds.Field; name: string }, unknown> =>
    createBuilder(ParamKinds.Field, name);

/** Multipart Part */
export const part = (
    name: string
): Builder<Partial<PartDescriptor> & { kind: typeof ParamKinds.Part; name: string }, unknown> =>
    createBuilder(ParamKinds.Part, name);
