import Typography from "typography"

const typography = new Typography({
  title: "kattsu-sandbox",
  baseFontSize: "16px",
  baseLineHeight: 2.0,
  scaleRatio: 2.2,
  googleFonts: [
    {
      name: 'M+PLUS+Rounded+1c',
      styles: ['400'],
    },
    {
      name: 'Noto+Sans+JP',
      styles: ['400'],
    },
  ],
  headerFontFamily: ["M PLUS Rounded 1c", "sans-serif"],
  bodyFontFamily: ["Noto Sans JP", "sans-serif"],
  headerColor: "hsl(210,50%,20%)",
  bodyColor: "hsl(210,50%,20%)",
  blockMarginBottom: 1,
  includeNormalize: true,
  overrideStyles: ({ adjustFontSizeTo, rhythm, scale }, options, styles) => ({
    h1: {
      lineHeight: 1.2,
      letterSpacing: "0.01rem",
      marginBottom: rhythm(2/16),
    },
    "h2,h3": {
      lineHeight: 1.2,
      paddingBottom: rhythm(2/16),
      borderBottom: "1px solid #ddd",
      marginTop: rhythm(32/16),
      marginBottom: rhythm(10/16),
    },
    "h4,h5,h6": {
      lineHeight: 1.2,
      marginTop: rhythm(24/16),
      marginBottom: rhythm(10/16),
    },
    h4: {
      ...adjustFontSizeTo('20px'),
    },
    h5: {
      ...adjustFontSizeTo('18px'),
    },
    h6: {
      ...adjustFontSizeTo('16px'),
    },
    p: {
      wordBreak: "break-all",
    },
    a: {
      textDecoration: "none",
      color: "#0073bc",
    },
    li: {
      marginBottom: 0,
    },
    hr: {
      marginBottom: rhythm(10/16),
    },
    blockquote: {
      ...adjustFontSizeTo('16px'),
      fontStyle: 'italic',
      paddingLeft: rhythm(13/16),
      marginLeft: rhythm(-1),
      marginBottom: rhythm(8/16),
      borderLeft: `${rhythm(3/16)} solid #ccc`,
    },
    "pre[class*='language-']": {
      marginBottom: rhythm(16/16),
    },
  })
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

// Export helper functions
export const { scale, rhythm, options } = typography
export default typography
