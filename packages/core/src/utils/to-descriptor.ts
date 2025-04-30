import type { AllowedType, BaseDescriptor, DescriptorKind } from "@/core";
import { fromPairs, isEmpty, split, toPairs, trim } from "es-toolkit/compat";
import { inferFieldType } from "./infer-field-type";

/**
 * parse cookie string to record
 * @param cookieString cookie string
 * @returns record
 * @example
 * parseCookieStringToRecord("name=value; name2=value2");
 * // { name: "value", name2: "value2" }
 */
export function parseCookieStringToRecord(cookieString: string): Record<string, string> {
    if (isEmpty(cookieString)) return {};
    return fromPairs(
        split(cookieString, ";")
            .map((pair) => {
                const [rawKey, rawValue] = split(pair, "=");
                if (isEmpty(rawKey) || isEmpty(rawValue)) return null;

                try {
                    const key = decodeURIComponent(trim(rawKey));
                    const value = decodeURIComponent(trim(rawValue));
                    return [key, value];
                } catch {
                    return null;
                }
            })
            .filter((entry) => entry !== null)
    );
}

/**
 * convert record to descriptors
 * @param kind descriptor kind
 * @param record record
 * @returns descriptors
 * @example
 * toDescriptorsFromRecord(DescriptorKinds.Header, {
 *  "Content-Type": "application/json",
 *  "Authorization": "Bearer 1234567890",
 * });
 * // [{ kind: "header", name: "Content-Type", type: "string", description: "" },
 * //  { kind: "header", name: "Authorization", type: "string", description: "" }]
 */
export function toDescriptorsFromRecord<K extends DescriptorKind>(
    kind: K,
    record: Record<string, unknown>
): BaseDescriptor<K, AllowedType<K>>[] {
    return toPairs(record).map(([name, value]) => ({
        kind,
        name,
        type: inferFieldType(value) as AllowedType<K>,
        description: "",
    }));
}
