/**
 * Starlight plugin: Mermaid diagrams that match the wiki's design.
 *
 * Usage in Markdown/MDX:
 *
 *   ```mermaid title="Request flow"
 *   flowchart LR
 *     A --> B
 *   ```
 *
 * - Build time: a Sätteri mdast plugin turns `mermaid` code blocks into an
 *   accessible <figure> (with optional caption from `title="…"`).
 * - Run time: a small script lazy-loads Mermaid only on pages with diagrams,
 *   renders them with the site's colour tokens, re-renders on theme change and
 *   provides a full-screen "Expand" view with zoom.
 */
import { fileURLToPath } from 'node:url';
import { isSatteriProcessor, satteri } from '@astrojs/markdown-satteri';
import type { StarlightPlugin } from '@astrojs/starlight/types';
import { mermaidMdastPlugin } from './transform.ts';

const clientModule = fileURLToPath(new URL('./client.ts', import.meta.url)).replaceAll('\\', '/');
const stylesheet = fileURLToPath(new URL('./styles.css', import.meta.url));

export default function starlightMermaid(): StarlightPlugin {
  return {
    name: 'wiki-mermaid',
    hooks: {
      'config:setup'({ addIntegration, updateConfig, config }) {
        updateConfig({ customCss: [...(config.customCss ?? []), stylesheet] });

        addIntegration({
          name: 'wiki-mermaid',
          hooks: {
            'astro:config:setup'({
              config: astroConfig,
              updateConfig: updateAstroConfig,
              injectScript,
            }) {
              const processor = astroConfig.markdown.processor;
              if (!isSatteriProcessor(processor)) {
                throw new Error(
                  '[wiki-mermaid] Requires the Sätteri Markdown processor (Astro’s default).',
                );
              }
              updateAstroConfig({
                markdown: {
                  processor: satteri({
                    ...processor.options,
                    mdastPlugins: [...processor.options.mdastPlugins, mermaidMdastPlugin],
                  }),
                },
              });
              injectScript('page', `import ${JSON.stringify(clientModule)};`);
            },
          },
        });
      },
    },
  };
}
