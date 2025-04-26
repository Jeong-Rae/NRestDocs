/** 리터럴을 제공하면서 string 전체도 허용하는 유틸리티 */
export type WidenString<T extends string> = T | (string & {});

/** 리터럴을 제공하면서 number 전체도 허용하는 유틸리티 */
export type WidenNumber<T extends number> = T | (number & {});
