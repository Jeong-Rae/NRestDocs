export type DocWriterConfig = {
    /** 스니펫 파일을 저장할 루트 디렉토리*/
    outputDir: string;

    /** 파일 확장자 (예: ".adoc" or ".md") */
    extension: string;

    /**
     * 스니펫 저장 방식:
     * - "nested": {outputDir}/{identifier}/{snippetName}.{extension}
     * - "flat": {outputDir}/{identifier}-{snippetName}.{extension}
     */
    directoryStructure?: "nested" | "flat";
};
