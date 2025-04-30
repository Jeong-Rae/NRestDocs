/** Element kinds */
export const DescriptorKinds = {
    Query: "query",
    Form: "form",
    Path: "path",
    Header: "header",
    Cookie: "cookie",
    Field: "field",
    Part: "part",
} as const;

export type DescriptorKind = (typeof DescriptorKinds)[keyof typeof DescriptorKinds];
