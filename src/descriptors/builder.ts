import type { AllowedType, BaseDescriptor, ParamKind } from "./types";

/** 빌더 상태 태그 타입 */
export const BuilderState = {
    Unset: "TYPE_UNSET",
    Set: "TYPE_SET",
} as const;

export type TypeUnset = { __state: typeof BuilderState.Unset };
export type TypeSet = { __state: typeof BuilderState.Set };

/** 공통 Builder 인터페이스 */
export interface Builder<
    D extends Partial<BaseDescriptor<K, AllowedType<K>>>,
    S,
    K extends ParamKind,
> {
    type<T extends AllowedType<K>>(type: T): Builder<Omit<D, "type"> & { type: T }, TypeSet, K>;

    description(description: string): Builder<D & { description: string }, S, K>;

    optional(): Builder<D & { optional: true }, S, K>;

    build(
        this: Builder<D & BaseDescriptor<K, AllowedType<K>>, TypeSet, K>
    ): Readonly<D & BaseDescriptor<K, AllowedType<K>>>;
}

/** 빌더 생성 함수 */
export function createBuilder<K extends ParamKind, N extends string>(
    kind: K,
    name: N,
    draft: Partial<BaseDescriptor<K, AllowedType<K>>> & { kind: K; name: N } = { kind, name }
): Builder<typeof draft, TypeUnset, K> {
    const api: unknown = {
        type(type: AllowedType<K>) {
            return createBuilder(kind, name, { ...draft, type });
        },
        description(description: string) {
            return createBuilder(kind, name, { ...draft, description });
        },
        optional() {
            return createBuilder(kind, name, { ...draft, optional: true });
        },
        build(
            this: Builder<typeof draft & BaseDescriptor<K, AllowedType<K>>, TypeSet, K>
        ): Readonly<typeof draft & BaseDescriptor<K, AllowedType<K>>> {
            return draft as Readonly<typeof draft & BaseDescriptor<K, AllowedType<K>>>;
        },
    };
    return api as Builder<typeof draft, TypeUnset, K>;
}
