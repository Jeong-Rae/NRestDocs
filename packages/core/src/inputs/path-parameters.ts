import { ParamKinds, type PathParamDescriptor } from "@/descriptors";
import { applyNormalize } from "@/utils/normalizer";
import type { PathParamsInput } from "./input.type";

export const applyPathParameters = (input: PathParamsInput): PathParamDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Path, PathParamDescriptor>(ParamKinds.Path, input);
};
