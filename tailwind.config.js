/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Tailwind'in tarayacağı dosya uzantıları ve yolları
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      // Font family eklemesi
      fontFamily: {
        // 'sans' fontunu senin verdiğin liste ile güncelliyoruz
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          '"Fira Sans"',
          '"Droid Sans"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
        // istersen code fontu da ekleyebilirsin
        code: [
          'source-code-pro',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Courier New"',
          'monospace',
        ],
      },
      // Animasyon ve keyframes tanımlaması
      animation: {
        pulse: 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
