import { type Builder, type TypeUnset, createBuilder } from "./builder";
import { ParamKinds } from "./types";
import type {
    FieldDescriptor,
    FormParamDescriptor,
    HeaderDescriptor,
    PartDescriptor,
    PathParamDescriptor,
    QueryParamDescriptor,
} from "./types";

type FactoryReturn<D, K extends keyof typeof ParamKinds, N extends string> = Builder<
    Partial<D> & { kind: (typeof ParamKinds)[K]; name: N },
    TypeUnset,
    (typeof ParamKinds)[K]
>;

export const queryParam = <N extends string = string>(
    name: N
): FactoryReturn<QueryParamDescriptor, "Query", N> => createBuilder(ParamKinds.Query, name);

export const formParam = <N extends string = string>(
    name: N
): FactoryReturn<FormParamDescriptor, "Form", N> => createBuilder(ParamKinds.Form, name);

export const pathParam = <N extends string = string>(
    name: N
): FactoryReturn<PathParamDescriptor, "Path", N> => createBuilder(ParamKinds.Path, name);

export const header = <N extends string = string>(
    name: N
): FactoryReturn<HeaderDescriptor, "Header", N> => createBuilder(ParamKinds.Header, name);

export const field = <N extends string = string>(
    name: N
): FactoryReturn<FieldDescriptor, "Field", N> => createBuilder(ParamKinds.Field, name);

export const part = <N extends string = string>(
    name: N
): FactoryReturn<PartDescriptor, "Part", N> => createBuilder(ParamKinds.Part, name);
