export { docRequest } from "./core/doc-builder";
export { setNRestDocsConfig, getNRestDocsConfig } from "./core/config";
export {
    NRestDocsConfig,
    DocumentFormat,
    FieldDescriptor,
    DocOptions,
} from "./types";
export {
    withField,
    FieldBuilder,
    FieldBuilderStart,
    FieldBuilderOptional,
} from "./core/withField";

// errors
export { MissingFieldError } from "./errors/MissingFieldError";
export { TypeInvalidError } from "./errors/TypeInvalidError";
export { ExtraFieldError } from "./errors/ExtraFieldError";
export { ValidationError } from "./errors/ValidationError";
