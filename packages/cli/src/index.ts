import { parseArgs, runCli } from "./cli.js";

const args = parseArgs(process.argv.slice(2));

runCli(args).catch((err) => {
  console.error(err);
  process.exit(1);
});
