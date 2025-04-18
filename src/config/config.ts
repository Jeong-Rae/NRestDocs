import type { NRestDocsConfig } from "../types";

let globalNRestDocsConfig: NRestDocsConfig = {
    output: "./docs",
    format: "adoc",
    strict: false,
};

/**
 * 전역 설정을 갱신
 */
export function setNRestDocsConfig(config: Partial<NRestDocsConfig>): NRestDocsConfig {
    globalNRestDocsConfig = { ...globalNRestDocsConfig, ...config };
    return globalNRestDocsConfig;
}

/**
 * 현재 전역 설정을 반환
 */
export function getNRestDocsConfig(): NRestDocsConfig {
    return globalNRestDocsConfig;
}
