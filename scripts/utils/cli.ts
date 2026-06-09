export function getCliArg(name: string, fallback = "") {
  const prefix = `--${name}=`;
  const arg = process.argv.find((item) => item.startsWith(prefix));
  return arg ? arg.replace(prefix, "") : fallback;
}
