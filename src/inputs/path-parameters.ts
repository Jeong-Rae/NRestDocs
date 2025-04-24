import { ParamKinds, type PathParamDescriptor } from "../descriptors";
import { makeApply } from "../utils/parameter-normalizer";

export const applyPathParameters = makeApply<typeof ParamKinds.Path>()<PathParamDescriptor>(
    ParamKinds.Path
);
