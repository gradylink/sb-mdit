import markdownit from "markdown-it";
import { scratchblocksPlugin } from "../index.ts";

const md = markdownit().use(scratchblocksPlugin);
await Bun.write(
  "test.html",
  md.render(`# This is a test

Some words

\`\`\`sb
when green flag clicked
say [this is a test]
\`\`\``),
);
