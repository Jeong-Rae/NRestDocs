/** document format type */
export type DocumentFormat = "adoc" | "md";

/** global config type */
export type NRestDocsConfig = {
    /** document snippet output path */
    output: string;
    /** document format */
    format: DocumentFormat;
    /** strict mode, fail when document definition and actual request/response mismatch */
    strict: boolean;

    /** directory structure */
    directoryStructure: "flat" | "nested";
};
