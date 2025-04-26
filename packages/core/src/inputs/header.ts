import { type HeaderDescriptor, ParamKinds } from "@/descriptors";
import { applyNormalize } from "@/utils/normalizer";
import type { RequestHeaderInput } from "./input.type";

export const applyRequestHeader = (input: RequestHeaderInput): HeaderDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Header, HeaderDescriptor>(ParamKinds.Header, input);
};
