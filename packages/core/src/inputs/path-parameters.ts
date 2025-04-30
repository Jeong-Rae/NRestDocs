import { DescriptorKinds, type PathParamDescriptor } from "@/core";
import { applyNormalize } from "@/utils/normalizer";
import type { PathParamsInput } from "./input.type";

export const applyPathParameters = (input: PathParamsInput): PathParamDescriptor[] => {
    return applyNormalize<typeof DescriptorKinds.Path, PathParamDescriptor>(
        DescriptorKinds.Path,
        input
    );
};
