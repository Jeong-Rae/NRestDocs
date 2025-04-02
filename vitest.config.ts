import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            reportsDirectory: "./coverage",
            // 커버리지 임계값 설정
            thresholds: {
                lines: 85,
                functions: 85,
                branches: 85,
                statements: 85,
            },
            include: ["src/**/*.ts"], // 커버리지 측정 대상 파일
            exclude: [
                "src/**/*.spec.ts", // 테스트 파일 제외
                "src/**/types.ts", // 타입 정의 파일 제외
                "src/**/index.ts", // 인덱스 파일 제외
            ],
        },
    },
});
