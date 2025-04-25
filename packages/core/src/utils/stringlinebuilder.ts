export class StringLineBuilder {
    private lines: string[] = [];
    private separator: string;

    constructor(separator: string = "\n") {
        this.separator = separator;
    }

    append(line: string): this {
        this.lines.push(line);
        return this;
    }

    toString(): string {
        return this.lines.join(this.separator);
    }
}
