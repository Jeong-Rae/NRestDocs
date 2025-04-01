export function format(
    strings: TemplateStringsArray,
    ...values: any[]
): string {
    return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
}
