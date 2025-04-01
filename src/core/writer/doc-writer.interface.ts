export interface DocWriter {
    /**
     * 특정 스니펫을 파일로 저장
     * @param identifier API 식별자
     * @param snippetName 스니펫 파일 명
     * @param content 파일에 쓸 내용
     */
    writeSnippet(
        identifier: string,
        snippetName: string,
        content: string
    ): void;
}
