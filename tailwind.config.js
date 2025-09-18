/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
      extend: {
         colors: {
        "white-45": "rgba(255,255,255,0.45)",
        "white-70": "rgba(255,255,255,0.70)",
        "white-90": "rgba(255,255,255,0.90)",
      },
      }
  },
  plugins: [],
}