import { type HeaderDescriptor, ParamKinds } from "@/descriptors";
import { applyNormalize } from "@/utils/normalizer";
import type { HeaderInput } from "./input.type";

export const applyHeader = (input: HeaderInput): HeaderDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Header, HeaderDescriptor>(ParamKinds.Header, input);
};
