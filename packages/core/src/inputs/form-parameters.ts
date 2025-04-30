import { DescriptorKinds, type FormParamDescriptor } from "@/core";
import { applyNormalize } from "@/utils/normalizer";
import type { FormParamsInput } from "./input.type";

export const applyFormParameters = (input: FormParamsInput): FormParamDescriptor[] => {
    return applyNormalize<typeof DescriptorKinds.Form, FormParamDescriptor>(
        DescriptorKinds.Form,
        input
    );
};
