import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@mantine/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {},
};

export default config;
