import type { NRestDocsConfig } from "@/config";

function safeExtension(extension: string) {
    return extension.startsWith(".") ? extension : `.${extension}`;
}

export function getOutputFileName(
    config: NRestDocsConfig,
    { name, identifier, extension }: { name: string; identifier: string; extension: string }
) {
    return config.directoryStructure === "flat"
        ? `${identifier}-${name}${safeExtension(extension)}`
        : `${identifier}/${name}${safeExtension(extension)}`;
}
