module.exports = {
  mode: "jit",
  content: [
    "./**/*.html",
    "./*.html",
    "./**/*.js",
    "./*.js",
    "./**/*.ts",
    "./*.ts",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        kitt: {
          primary: "#07889b",
          "primary-focus": "#086b7d",
          "primary-content": "#ffffff",
          secondary: "#71879b",
          "secondary-focus": "#364A5A",
          "secondary-content": "#ffffff",
          accent: "#f8fafb",
          "accent-focus": "#d7d9db",
          "accent-content": "#ffffff",
          neutral: "#3d4451",
          "neutral-focus": "#2a2e37",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#d1d5db",
          "base-content": "#1f2937",

          info: "#2094f3",
          success: "#009485",
          warning: "#ff9900",
          error: "#ff5724",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
