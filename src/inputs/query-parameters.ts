import { ParamKinds, type QueryParamDescriptor } from "@/descriptors";
import { type ArrayOrRecord, applyParameters } from "../utils/parameter-normalizer";

type QueryInput = ArrayOrRecord<typeof ParamKinds.Query, QueryParamDescriptor>;

/** 배열,Record,Builder -> QueryParamDescriptor[] 로 정규화 */
export const applyQueryParameters = (input: QueryInput): QueryParamDescriptor[] => {
    return applyParameters<typeof ParamKinds.Query, QueryParamDescriptor>(ParamKinds.Query, input);
};
