import markdwonit from "markdown-it";
import { scratchblocksPlugin } from "..";

const md = markdwonit().use(scratchblocksPlugin);
console.log(md.render(`\`\`\`sb
when green flag clicked
say [this is a test]
\`\`\``));
