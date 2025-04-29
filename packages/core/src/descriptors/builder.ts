import { isBuilder } from "@/utils/is-builder";
import type { CompositeDescriptor, CompositeMixin } from "./composite-builder";
import type { TypeBuilder, TypeSchema } from "./type-builder";
import type { AllowedType, BaseDescriptor, FormatFor, ParamKind } from "./types";

/** 빌더 상태 태그 타입 */
export const TypeState = {
    Unset: "TYPE_UNSET",
    Set: "TYPE_SET",
} as const;

export type TypeUnset = { __state: typeof TypeState.Unset };
export type TypeSet = { __state: typeof TypeState.Set };

/** 공통 Builder 인터페이스 */
export interface Builder<
    D extends Partial<BaseDescriptor<K, AllowedType<K>>>,
    S,
    K extends ParamKind,
> extends CompositeMixin<D, K> {
    // Kind 별 AllowedType 설정
    type<T extends AllowedType<K>>(
        type: T
    ): Builder<Omit<D, "type" | "format"> & { type: T }, TypeSet, K>;

    // type이 정의된 이후 호출가능
    format<T extends NonNullable<D["type"]>, F extends FormatFor<T & AllowedType<K>>>(
        this: Builder<D & { type: T }, TypeSet, K>,
        format: F
    ): Builder<D & { format: F }, TypeSet, K>;

    description(description: string): Builder<D & { description: string }, S, K>;

    optional(): Builder<D & { optional: true }, S, K>;

    build(
        this: Builder<D & BaseDescriptor<K, AllowedType<K>>, TypeSet, K>
    ): Readonly<D & BaseDescriptor<K, AllowedType<K>>>;
}

type Draft<K extends ParamKind, N extends string> = Partial<BaseDescriptor<K, AllowedType<K>>> &
    Partial<CompositeDescriptor<K>> & { kind: K; name: N };

/** 빌더 생성 함수 */
export function createBuilder<K extends ParamKind, N extends string>(
    kind: K,
    name: N,
    draft: Draft<K, N> = { kind, name }
): Builder<typeof draft, TypeUnset, K> {
    const arg: unknown = {
        type(type: AllowedType<K>) {
            return createBuilder(kind, name, { ...draft, type });
        },
        format(format: FormatFor<AllowedType<K>>) {
            return createBuilder(kind, name, { ...draft, format });
        },
        description(description: string) {
            return createBuilder(kind, name, { ...draft, description });
        },
        optional() {
            return createBuilder(kind, name, { ...draft, optional: true });
        },
        oneOf(arr: (TypeBuilder<TypeSchema> | TypeSchema)[]) {
            const variants = arr.map((builder) =>
                isBuilder<TypeBuilder<TypeSchema>>(builder) ? builder.build() : builder
            );
            return createBuilder(kind, name, { ...draft, mode: "oneOf", variants });
        },
        anyOf(arr: (TypeBuilder<TypeSchema> | TypeSchema)[]) {
            const variants = arr.map((builder) =>
                isBuilder<TypeBuilder<TypeSchema>>(builder) ? builder.build() : builder
            );
            return createBuilder(kind, name, { ...draft, mode: "anyOf", variants });
        },
        build(
            this: Builder<typeof draft & BaseDescriptor<K, AllowedType<K>>, TypeSet, K>
        ): Readonly<typeof draft & BaseDescriptor<K, AllowedType<K>>> {
            return draft as Readonly<typeof draft & BaseDescriptor<K, AllowedType<K>>>;
        },
    };
    return arg as Builder<typeof draft, TypeUnset, K>;
}
