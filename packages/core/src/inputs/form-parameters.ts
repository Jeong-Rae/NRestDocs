import { type FormParamDescriptor, ParamKinds } from "@/descriptors";
import { type ArrayOrRecord, applyParameters } from "@/utils/parameter-normalizer";

type FormInput = ArrayOrRecord<typeof ParamKinds.Form, FormParamDescriptor>;

export const applyFormParameters = (input: FormInput): FormParamDescriptor[] => {
    return applyParameters<typeof ParamKinds.Form, FormParamDescriptor>(ParamKinds.Form, input);
};
