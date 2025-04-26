import { ParamKinds, type PathParamDescriptor } from "@/descriptors";
import { type ArrayOrRecord, applyNormalize } from "@/utils/normalizer";

type PathInput = ArrayOrRecord<typeof ParamKinds.Path, PathParamDescriptor>;

export const applyPathParameters = (input: PathInput): PathParamDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Path, PathParamDescriptor>(ParamKinds.Path, input);
};
