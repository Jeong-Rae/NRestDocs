import { DescriptorKinds, type QueryParamDescriptor } from "@/core";
import { applyNormalize } from "@/utils/normalizer";
import type { QueryParamsInput } from "./input.type";

export const applyQueryParameters = (input: QueryParamsInput): QueryParamDescriptor[] => {
    return applyNormalize<typeof DescriptorKinds.Query, QueryParamDescriptor>(
        DescriptorKinds.Query,
        input
    );
};
