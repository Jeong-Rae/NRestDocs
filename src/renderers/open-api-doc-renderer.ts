import { isEmpty } from "es-toolkit/compat";

import type { OpenAPI_V3_1 } from "../types/open-api-spec";

type OpenAPIDocumentRendererOptions = {
    info?: OpenAPI_V3_1.Info;
    servers?: OpenAPI_V3_1.Server[];
    webhooks?: Record<string, OpenAPI_V3_1.PathItem>;
    paths?: OpenAPI_V3_1.Paths;
    components?: OpenAPI_V3_1.Components;
    tags?: OpenAPI_V3_1.Tag[];
    externalDocs?: OpenAPI_V3_1.ExternalDocumentation;
};

export class OpenAPIDocumentRenderer {
    render({
        info,
        servers,
        webhooks,
        paths,
        components,
        tags,
        externalDocs,
    }: OpenAPIDocumentRendererOptions): OpenAPI_V3_1.OpenAPI {
        const doc: Partial<OpenAPI_V3_1.OpenAPI> = {
            openapi: "3.1.0",
            jsonSchemaDialect: "https://json-schema.org/draft-07/schema",
        };

        doc.info = this.renderInfo(info);

        if (!isEmpty(servers)) {
            doc.servers = this.renderServers(servers);
        }
        if (!isEmpty(paths)) {
            doc.paths = this.renderPaths(paths);
        }
        if (!isEmpty(webhooks)) {
            doc.webhooks = this.renderWebhooks(webhooks);
        }
        if (!isEmpty(components)) {
            doc.components = this.renderComponents(components);
        }
        if (!isEmpty(tags)) {
            doc.tags = this.renderTags(tags);
        }
        if (!isEmpty(externalDocs)) {
            doc.externalDocs = this.renderExternalDocs(externalDocs);
        }

        return doc as OpenAPI_V3_1.OpenAPI;
    }

    private renderInfo(info?: OpenAPI_V3_1.Info): OpenAPI_V3_1.Info {
        return info ?? { title: "API", version: "1.0.0" };
    }

    private renderServers(servers: OpenAPI_V3_1.Server[]): OpenAPI_V3_1.Server[] {
        return servers;
    }

    private renderPaths(paths: OpenAPI_V3_1.Paths): OpenAPI_V3_1.Paths {
        return paths;
    }

    private renderWebhooks(
        webhooks: Record<string, OpenAPI_V3_1.PathItem>
    ): Record<string, OpenAPI_V3_1.PathItem> {
        return webhooks;
    }

    private renderComponents(components: OpenAPI_V3_1.Components): OpenAPI_V3_1.Components {
        return components;
    }

    // private renderSecurity(
    //     security: OpenAPI_V3_1.SecurityRequirement
    // ): OpenAPI_V3_1.SecurityRequirement {
    //     return security;
    // }

    private renderTags(tags: OpenAPI_V3_1.Tag[]): OpenAPI_V3_1.Tag[] {
        return tags;
    }

    private renderExternalDocs(
        externalDocs: OpenAPI_V3_1.ExternalDocumentation
    ): OpenAPI_V3_1.ExternalDocumentation {
        return externalDocs;
    }
}
