import { deepFreeze } from "@/utils/freeze";
import type { NRestDocsConfig } from "./docs-config";

async function loadConfig(): Promise<NRestDocsConfig> {
    return {
        output: "./docs",
        format: "adoc",
        strict: false,
        directoryStructure: "nested",
    };
}

export class ConfigService {
    private static instance: Readonly<NRestDocsConfig>;

    /**
     * initialize config (once only)
     */
    static async init(): Promise<void> {
        if (!this.instance) {
            const config = await loadConfig();
            this.instance = deepFreeze(config);
        }
    }

    /**
     * return initialized config
     */
    static get(): Readonly<NRestDocsConfig> {
        if (!this.instance) {
            throw new Error("ConfigService not initialized");
        }
        return this.instance;
    }

    /**
     * update config (internal, create immutable object)
     */
    static update(config: Partial<NRestDocsConfig>): Readonly<NRestDocsConfig> {
        if (!this.instance) {
            throw new Error("ConfigService not initialized");
        }
        this.instance = deepFreeze({
            ...this.instance,
            ...config,
        });
        return this.instance;
    }
}
