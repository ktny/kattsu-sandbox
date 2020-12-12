import Typography from "typography"

const typography = new Typography({
  baseFontSize: "16px",
  baseLineHeight: 1.8,
  bodyFontFamily: ["YuGothic", "游ゴシック", "Meiryo", "メイリオ", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴシック", "sans-serif"],
  bodyColor: "#3c3c3c",
})

// Export helper functions
export const { scale, rhythm, options } = typography
export default typography
