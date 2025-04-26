import { type Builder, type TypeUnset, createBuilder } from "./builder";
import {
    type CookieDescriptor,
    type FieldDescriptor,
    type FormParamDescriptor,
    type HeaderDescriptor,
    type ParamKind,
    ParamKinds,
    type PartDescriptor,
    type PathParamDescriptor,
    type QueryParamDescriptor,
} from "./types";

type Factory<N extends string, K extends ParamKind, D> = Builder<
    Partial<D> & { kind: K; name: N },
    TypeUnset,
    K
>;

const factory =
    <K extends ParamKind>(k: K) =>
    <N extends string>(name: N) =>
        createBuilder(k, name) as Factory<
            N,
            K,
            K extends "query"
                ? QueryParamDescriptor
                : K extends "form"
                  ? FormParamDescriptor
                  : K extends "path"
                    ? PathParamDescriptor
                    : K extends "header"
                      ? HeaderDescriptor
                      : K extends "cookie"
                        ? CookieDescriptor
                        : K extends "part"
                          ? PartDescriptor
                          : FieldDescriptor
        >;

/** 정의 DSL */
export const defineQuery = factory(ParamKinds.Query);
export const defineForm = factory(ParamKinds.Form);
export const definePath = factory(ParamKinds.Path);
export const defineHeader = factory(ParamKinds.Header);
export const defineCookie = factory(ParamKinds.Cookie);
export const definePart = factory(ParamKinds.Part);
export const defineField = factory(ParamKinds.Field);
