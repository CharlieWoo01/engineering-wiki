/**
 * Maps the site's Starlight colour tokens to Mermaid `base` theme variables,
 * so diagrams match the wiki in both light and dark mode and pick up any
 * future palette change in `src/styles/custom.css` automatically.
 */

/** Returns the computed value of a CSS custom property, e.g. `--sl-color-accent`. */
export type TokenReader = (name: string) => string;

const FALLBACKS = {
  light: {
    bg: '#ffffff',
    text: '#252528',
    heading: '#18181b',
    accent: '#b91c1c',
    accentLow: '#fde8e8',
    accentHigh: '#7f1d1d',
    muted: '#ededee',
    border: '#c4c4c8',
    line: '#57575e',
  },
  dark: {
    bg: '#18181b',
    text: '#c4c4c8',
    heading: '#ffffff',
    accent: '#ef4444',
    accentLow: '#3b1214',
    accentHigh: '#fecaca',
    muted: '#252528',
    border: '#57575e',
    line: '#8e8e96',
  },
} as const;

export function mermaidThemeVariables(
  mode: 'light' | 'dark',
  read: TokenReader,
): Record<string, string | boolean> {
  const fallback = FALLBACKS[mode];
  const token = (name: string, fallbackValue: string) => {
    const value = read(name).trim();
    return value === '' ? fallbackValue : value;
  };

  const bg = token('--sl-color-bg', fallback.bg);
  const text = token('--sl-color-text', fallback.text);
  const heading = token('--sl-color-white', fallback.heading);
  const accent = token('--sl-color-accent', fallback.accent);
  const accentLow = token('--sl-color-accent-low', fallback.accentLow);
  const accentHigh = token('--sl-color-accent-high', fallback.accentHigh);
  const muted = token(mode === 'dark' ? '--sl-color-gray-6' : '--sl-color-gray-7', fallback.muted);
  const border = token('--sl-color-gray-5', fallback.border);
  const line = token('--sl-color-gray-3', fallback.line);
  const font = token('--sl-font', 'system-ui, sans-serif');

  return {
    darkMode: mode === 'dark',
    background: bg,
    fontFamily: font,
    fontSize: '15px',
    // Nodes
    primaryColor: accentLow,
    primaryBorderColor: accent,
    primaryTextColor: heading,
    secondaryColor: muted,
    secondaryBorderColor: border,
    secondaryTextColor: heading,
    tertiaryColor: bg,
    tertiaryBorderColor: border,
    tertiaryTextColor: text,
    mainBkg: accentLow,
    nodeBorder: accent,
    nodeTextColor: heading,
    textColor: text,
    titleColor: heading,
    // Edges
    lineColor: line,
    edgeLabelBackground: bg,
    // Subgraphs
    clusterBkg: muted,
    clusterBorder: border,
    // Sequence diagrams
    actorBkg: accentLow,
    actorBorder: accent,
    actorTextColor: heading,
    actorLineColor: line,
    signalColor: text,
    signalTextColor: text,
    labelBoxBkgColor: muted,
    labelBoxBorderColor: border,
    labelTextColor: heading,
    loopTextColor: text,
    activationBkgColor: muted,
    activationBorderColor: accent,
    sequenceNumberColor: bg,
    noteBkgColor: muted,
    noteBorderColor: border,
    noteTextColor: heading,
    // State diagrams
    labelColor: heading,
    altBackground: muted,
    // Git graphs
    git0: accent,
    git1: accentHigh,
    gitBranchLabel0: bg,
    commitLabelColor: heading,
    commitLabelBackground: muted,
  };
}
