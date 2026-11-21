/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    // Remove the following screen breakpoint or add other breakpoints
    // if one breakpoint is not enough for you
    screens: {
      sm: "640px",
    },

    // Uncomment the following extend
    // if existing Tailwind color palette will be used

    // extend: {
    textColor: {
      skin: {
        base: withOpacity("--color-text-base"),
        accent: withOpacity("--color-accent"),
        inverted: withOpacity("--color-fill"),
        muted: withOpacity("--color-muted"),
      },
    },
    backgroundColor: {
      skin: {
        fill: withOpacity("--color-fill"),
        accent: withOpacity("--color-accent"),
        inverted: withOpacity("--color-text-base"),
        card: withOpacity("--color-card"),
        "card-muted": withOpacity("--color-card-muted"),
      },
    },
    outlineColor: {
      skin: {
        fill: withOpacity("--color-accent"),
        base: withOpacity("--color-text-base"),
      },
    },
    borderColor: {
      skin: {
        line: withOpacity("--color-border"),
        fill: withOpacity("--color-text-base"),
        accent: withOpacity("--color-accent"),
      },
    },
    fill: {
      skin: {
        base: withOpacity("--color-text-base"),
        accent: withOpacity("--color-accent"),
      },
      transparent: "transparent",
    },
    fontFamily: {
      sans: [
        "IBM Plex Sans",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
      ],
      mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
    },
    // },
  },
  plugins: [require("@tailwindcss/typography")],
};
