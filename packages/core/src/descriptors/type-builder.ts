import type { FieldType, FormatFor } from "./types";

/* 결과 스키마 타입 */
export interface TypeSchema {
    type: FieldType;
    format?: string;
    description?: string;
}

export interface TypeBuilder<D extends Partial<TypeSchema>> {
    format<T extends FieldType, F extends FormatFor<T>>(
        this: TypeBuilder<D>,
        format: F
    ): TypeBuilder<D & { format: F }>;

    description(
        this: TypeBuilder<D>,
        description: string
    ): TypeBuilder<D & { description: string }>;

    build(this: TypeBuilder<TypeSchema>): Readonly<TypeSchema>;
}

function createTypeBuilder<D extends Partial<TypeSchema>>(draft: D): TypeBuilder<D> {
    return {
        format<T extends FieldType, F extends FormatFor<T>>(
            this: TypeBuilder<D>,
            format: F
        ): TypeBuilder<D & { format: F }> {
            return createTypeBuilder({ ...draft, format });
        },

        description(
            this: TypeBuilder<D>,
            description: string
        ): TypeBuilder<D & { description: string }> {
            return createTypeBuilder({ ...draft, description });
        },

        build(this: TypeBuilder<TypeSchema>): Readonly<TypeSchema> {
            return draft as Readonly<TypeSchema>;
        },
    };
}

export function defineType(initial: FieldType): TypeBuilder<{ type: FieldType }> {
    return createTypeBuilder({ type: initial });
}
