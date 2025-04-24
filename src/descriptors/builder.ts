import type { BaseDescriptor, FieldType } from "./type";

/** 빌더 상태 태그 타입 */
type TypeUnset = { __state: "TYPE_UNSET" };
type TypeSet = { __state: "TYPE_SET" };

/** 공통 Builder 인터페이스 */
export interface Builder<D extends Partial<BaseDescriptor>, S> {
    // type 호출을 required 하므로, Omit으로 안전한 정의가 필요
    type<T extends FieldType>(type: T): Builder<Omit<D, "type"> & { type: T }, TypeSet>;

    description(desc: string): Builder<D & { description: string }, S>;

    optional(): Builder<D & { optional: true }, S>;

    build(this: Builder<D & BaseDescriptor, TypeSet>): Readonly<D & BaseDescriptor>;
}

/** 빌더 생성 함수 */
export function createBuilder<K extends string, N extends string>(
    kind: K,
    name: N,
    draft: Partial<BaseDescriptor> = { kind, name }
): Builder<Partial<BaseDescriptor> & { kind: K; name: N }, TypeUnset> {
    const arg: any = {
        type(t: FieldType) {
            return createBuilder(kind, name, { ...draft, type: t });
        },
        description(description: string) {
            return createBuilder(kind, name, { ...draft, description });
        },
        optional() {
            return createBuilder(kind, name, { ...draft, optional: true });
        },
        build() {
            return draft as Readonly<any>;
        },
    };
    return arg as Builder<Partial<BaseDescriptor> & { kind: K; name: N }, TypeUnset>;
}
