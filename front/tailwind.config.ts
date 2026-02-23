import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}",
    ],
    darkMode: "class", // class 戦略
    plugins: [],
};

export default config;
