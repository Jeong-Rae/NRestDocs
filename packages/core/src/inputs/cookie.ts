import { type CookieDescriptor, DescriptorKinds } from "@/core";
import { applyNormalize } from "@/utils/normalizer";
import type { CookieInput } from "./input.type";

export const applyCookie = (input: CookieInput): CookieDescriptor[] => {
    return applyNormalize<typeof DescriptorKinds.Cookie, CookieDescriptor>(
        DescriptorKinds.Cookie,
        input
    );
};
