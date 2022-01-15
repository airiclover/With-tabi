const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        blue: colors.sky,
        orange: colors.orange,
        "hover-yellow": "#f58b0b",
      },
      fontSize: {
        xxs: ".625rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: { fontSize: theme("fontSize.3xl") },
        h2: { fontSize: theme("fontSize.2xl") },
        h3: { fontSize: theme("fontSize.xl") },
        h4: { fontSize: theme("fontSize.lg") },
        h5: { fontSize: theme("fontSize.base") },
        h6: { fontSize: theme("fontSize.sm") },
        blockquote: {
          backgroundColor: theme("backgroundColor.gray.200"),
        },
      });
    }),
  ],
};
