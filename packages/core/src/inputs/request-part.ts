import { ParamKinds, type PartDescriptor } from "@/descriptors";
import { type ArrayOrRecord, applyNormalize } from "@/utils/normalizer";

type PartInput = ArrayOrRecord<typeof ParamKinds.Part, PartDescriptor>;

export const applyRequestPart = (input: PartInput): PartDescriptor[] => {
    return applyNormalize<typeof ParamKinds.Part, PartDescriptor>(ParamKinds.Part, input);
};
