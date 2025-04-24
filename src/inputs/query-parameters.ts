import { ParamKinds, type QueryParamDescriptor } from "../descriptors";
import { makeApply } from "../utils/parameter-normalizer";

/** 배열,Record,Builder -> QueryParamDescriptor[] 로 정규화 */
export const applyQueryParameters = makeApply<typeof ParamKinds.Query>()<QueryParamDescriptor>(
    ParamKinds.Query
);
