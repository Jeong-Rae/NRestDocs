/** Element kinds */
export const ElementKinds = {
    Query: "query",
    Form: "form",
    Path: "path",
    Header: "header",
    Cookie: "cookie",
    Field: "field",
    Part: "part",
} as const;

export type ElementKind = (typeof ElementKinds)[keyof typeof ElementKinds];
