import { type CookieDescriptor, ParamKinds } from "@/descriptors";
import { applyNormalize } from "@/utils/normalizer";
import type { CookieInput } from "./input.type";

export const applyCookie = (input: CookieInput): CookieDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Cookie, CookieDescriptor>(ParamKinds.Cookie, input);
};
