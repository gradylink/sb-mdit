import type { PluginWithOptions } from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";
import { JSDOM } from "jsdom";
import scratchblocks from "scratchblocks/index.js";
import scratchblocks3CSS from "scratchblocks/scratch3/style.css.js";
import scratchblocks2CSS from "scratchblocks/scratch2/style.css.js";
import { inline } from "@css-inline/css-inline";

export const scratchblocksPlugin: PluginWithOptions<
  { style?: "scratch3" | "scratch2" }
> = (md, pluginOptions) => {
  pluginOptions = pluginOptions || {};
  pluginOptions.style = pluginOptions.style || "scratch3";

  const originalRender = md.renderer.render.bind(md.renderer);
  md.renderer.render = (tokens, options, env) => {
    return inline(
      `<style>${scratchblocks3CSS}</style><style>${scratchblocks2CSS}</style>${
        originalRender(tokens, options, env)
      }`,
    );
  };

  const originalFence = md.renderer.rules.fence as RenderRule;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    if (
      /^(scratchblocks|sb)(2|3)?$/.test(tokens[idx]?.info.trim() as string)
    ) {
      const dom = new JSDOM(
        `<pre class='blocks'>${tokens[idx]?.content.trim()}</pre>`,
      );
      const sb = scratchblocks(dom.window);
      sb.renderMatching("pre.blocks", {
        style: /^(scratchblocks|sb)$/.test(tokens[idx]?.info.trim() as string)
          ? pluginOptions.style
          : `scratch${
            tokens[idx]?.info.trim()[tokens[idx]?.info.trim()?.length - 1]
          }`,
        languages: ["en"],
      });
      return dom.window.document.querySelector("div.scratchblocks")
        ?.innerHTML as string;
    }

    return originalFence(tokens, idx, options, env, self);
  };
};
