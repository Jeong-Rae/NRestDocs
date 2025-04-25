export function format(strings: TemplateStringsArray, ...values: unknown[]): string {
    return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
}
