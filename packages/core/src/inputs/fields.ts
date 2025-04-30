import { DescriptorKinds, type FieldDescriptor } from "@/core";
import { applyNormalize } from "@/utils/normalizer";
import type { FieldInput } from "./input.type";

export const applyFields = (input: FieldInput): FieldDescriptor[] => {
    return applyNormalize<typeof DescriptorKinds.Field, FieldDescriptor>(
        DescriptorKinds.Field,
        input
    );
};
