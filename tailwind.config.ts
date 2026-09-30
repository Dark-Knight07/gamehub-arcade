import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#06070d",
        deep: "#0b0d18",
        panel: "#11142a",
        edge: "rgba(148, 163, 255, 0.14)",
        ink: "#e8ebff",
        dim: "#8f96bf",
        cyan: { neon: "#40e0ff" },
        violet: { neon: "#8b6bff" },
        rose: { neon: "#ff4fa3" },
        lime: { neon: "#9dff6a" },
      },
      fontFamily: {
        display: ['"Chakra Petch"', "system-ui", "sans-serif"],
        sans: ['"Sora Variable"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(64,224,255,.35), 0 10px 40px -10px rgba(64,224,255,.45)",
        card: "0 20px 50px -24px rgba(0,0,0,.9)",
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(4%,-6%,0) scale(1.08)" },
        },
        gridmove: { to: { backgroundPosition: "0 64px" } },
        rise: { from: { opacity: "0", transform: "translateY(18px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        drift: "drift 16s ease-in-out infinite",
        drift2: "drift 22s ease-in-out infinite reverse",
        gridmove: "gridmove 3s linear infinite",
        rise: "rise .8s cubic-bezier(.2,.7,.2,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
