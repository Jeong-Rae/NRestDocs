import { type FieldDescriptor, ParamKinds } from "@/descriptors";
import { applyNormalize } from "@/utils/normalizer";
import type { FieldInput } from "./input.type";

export const applyFields = (input: FieldInput): FieldDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Field, FieldDescriptor>(ParamKinds.Field, input);
};
