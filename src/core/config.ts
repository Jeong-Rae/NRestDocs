import { NRestDocsConfig } from "../types/doc-options";

let globalNRestDocsConfig: NRestDocsConfig = {
    output: "./docs",
    format: "adoc",
    strict: false,
};

/**
 * 전역 설정을 갱신
 */
export function setNRestDocsConfig(config: Partial<NRestDocsConfig>) {
    globalNRestDocsConfig = { ...globalNRestDocsConfig, ...config };
}

/**
 * 현재 전역 설정을 반환
 */
export function getNRestDocsConfig(): NRestDocsConfig {
    return globalNRestDocsConfig;
}
