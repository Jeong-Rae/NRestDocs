import { type HeaderDescriptor, ParamKinds } from "@/descriptors";
import { type ArrayOrRecord, applyNormalize } from "@/utils/normalizer";

type HeaderInput = ArrayOrRecord<typeof ParamKinds.Header, HeaderDescriptor>;

export const applyRequestHeader = (input: HeaderInput): HeaderDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Header, HeaderDescriptor>(ParamKinds.Header, input);
};
