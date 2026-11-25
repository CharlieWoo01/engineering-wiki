// Expressive Code configuration (code blocks). Lives in its own file because
// pages render code with Starlight's <Code> component.
// https://starlight.astro.build/reference/configuration/#expressivecode
import { defineEcConfig } from '@astrojs/starlight/expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default defineEcConfig({
  plugins: [pluginLineNumbers()],
  // Opt in per block with `showLineNumbers`, e.g. ```yaml showLineNumbers
  defaultProps: { showLineNumbers: false },
  styleOverrides: {
    borderRadius: '0.625rem',
    borderColor: 'var(--sl-color-hairline)',
    codeFontFamily: 'var(--sl-font-mono)',
    codeFontSize: '0.875rem',
    codeLineHeight: '1.7',
    uiFontFamily: 'var(--sl-font)',
    // The plugin's default gutter colour is below 4.5:1 contrast; gray-3 is
    // also just short (4.48:1) on the dark code background.
    lineNumbers: {
      foreground: 'var(--sl-color-gray-2)',
      highlightForeground: 'var(--sl-color-white)',
    },
    frames: {
      shadowColor: 'transparent',
      editorActiveTabIndicatorTopColor: 'var(--sl-color-accent)',
      frameBoxShadowCssValue: 'none',
    },
  },
});
