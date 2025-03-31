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
export { InvalidTypeError } from "./errors/InvalidTypeError";
export { UnexpectedFieldError } from "./errors/UnexpectedFieldError";
export { ValidationError } from "./errors/ValidationError";
