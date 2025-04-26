import { ParamKinds, type QueryParamDescriptor } from "@/descriptors";
import { applyNormalize } from "@/utils/normalizer";
import type { QueryParamsInput } from "./input.type";

export const applyQueryParameters = (input: QueryParamsInput): QueryParamDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Query, QueryParamDescriptor>(ParamKinds.Query, input);
};
