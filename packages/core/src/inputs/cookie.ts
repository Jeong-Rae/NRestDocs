import { type CookieDescriptor, ParamKinds } from "@/descriptors";
import { applyNormalize } from "@/utils/normalizer";
import type { RequestCookieInput } from "./input.type";

export const applyRequestCookie = (input: RequestCookieInput): CookieDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Cookie, CookieDescriptor>(ParamKinds.Cookie, input);
};
