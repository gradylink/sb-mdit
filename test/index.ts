import markdownit from "markdown-it";
import { scratchblocksPlugin } from "..";

const md = markdownit().use(scratchblocksPlugin);
await Bun.write(
  "test.html",
  md.render(`\`\`\`sb
when green flag clicked
say [this is a test]
\`\`\``),
);
