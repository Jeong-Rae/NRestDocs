import { type FormParamDescriptor, ParamKinds } from "@/descriptors";
import { type ArrayOrRecord, applyNormalize } from "@/utils/normalizer";

type FormInput = ArrayOrRecord<typeof ParamKinds.Form, FormParamDescriptor>;

export const applyFormParameters = (input: FormInput): FormParamDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Form, FormParamDescriptor>(ParamKinds.Form, input);
};
