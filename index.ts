import type { PluginSimple } from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";
import { JSDOM } from "jsdom";
import scratchblocks from "scratchblocks/index.js";
import scratchblocksCSS from "scratchblocks/scratch3/style.css.js";
import { inlineFragment } from "@css-inline/css-inline";

export const scratchblocksPlugin: PluginSimple = (md) => {
  const originalRender = md.renderer.render.bind(md.renderer);
  md.renderer.render = (tokens, options, env) => {
    return inlineFragment(
      originalRender(tokens, options, env),
      scratchblocksCSS,
    );
  };

  const originalFence = md.renderer.rules.fence as RenderRule;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    if (
      tokens[idx]?.info.trim() === "sb" ||
      tokens[idx]?.info.trim() === "scratchblocks"
    ) {
      const dom = new JSDOM(
        `<pre class='blocks'>${tokens[idx].content.trim()}</pre>`,
      );
      const sb = scratchblocks(dom.window);
      sb.renderMatching("pre.blocks", {
        style: "scratch3",
        languages: ["en"],
      });
      return dom.window.document.querySelector("div.scratchblocks")
        ?.innerHTML as string;
    }

    return originalFence(tokens, idx, options, env, self);
  };
};
