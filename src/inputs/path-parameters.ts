import { ParamKinds, type PathParamDescriptor } from "../descriptors";
import { type ArrayOrRecord, applyParameters } from "../utils/parameter-normalizer";

type PathInput = ArrayOrRecord<typeof ParamKinds.Path, PathParamDescriptor>;

export const applyPathParameters = (input: PathInput): PathParamDescriptor[] => {
    return applyParameters<typeof ParamKinds.Path, PathParamDescriptor>(ParamKinds.Path, input);
};
