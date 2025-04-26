import { type FormParamDescriptor, ParamKinds } from "@/descriptors";
import { applyNormalize } from "@/utils/normalizer";
import type { FormParamsInput } from "./input.type";

export const applyFormParameters = (input: FormParamsInput): FormParamDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Form, FormParamDescriptor>(ParamKinds.Form, input);
};
