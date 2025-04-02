export interface DocWriter {
    /**
     * 특정 스니펫을 파일로 저장
     * @param _identifier API 식별자
     * @param _snippetName 스니펫 파일 명
     * @param _content 파일에 쓸 내용
     */
    writeSnippet(_identifier: string, _snippetName: string, _content: string): Promise<void>;
}
