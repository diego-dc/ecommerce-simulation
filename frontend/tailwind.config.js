/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
  keyframes: {
    enter: {
      from: { opacity: "0", transform: "translateY(100%)" }, // Adjust as desired
      to: { opacity: "1", transform: "translateY(0)" },
    },
    leave: {
      from: { opacity: "1", transform: "translateY(0)" },
      to: { opacity: "0", transform: "translateY(100%)" }, // Adjust as desired
    },
  },
  animation: {
    enter: "enter 0.3s ease-out forwards",
    leave: "leave 0.3s ease-in forwards",
  },
};
