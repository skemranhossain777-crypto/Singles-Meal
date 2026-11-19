
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { mint: "#E7F1E9", forest: "#246B45", ink: "#17231C" },
    boxShadow: { soft: "0 12px 40px rgba(20, 55, 35, .08)" } } },
  plugins: []
};
export default config;
