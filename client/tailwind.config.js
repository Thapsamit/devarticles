/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      colors: {
        /* Every themeable colour is a CSS variable so the light/dark swap is
           a single attribute on <html>. The rgb(var(--x) / <alpha-value>)
           form keeps Tailwind's opacity modifiers working. */

        /* ---- legacy tokens (kept, now themed) ---- */
        darkBg: "rgb(var(--c-bg) / <alpha-value>)",
        lightBg: "rgb(var(--c-surface) / <alpha-value>)",
        mainColor: "rgb(var(--c-accent-500) / <alpha-value>)",
        fontDark: "rgb(var(--c-ink-700) / <alpha-value>)",
        primaryText1: "rgb(var(--c-text-1) / <alpha-value>)",
        primaryText2: "rgb(var(--c-text-2) / <alpha-value>)",
        primaryText3: "rgb(var(--c-text-3) / <alpha-value>)",
        primaryText4: "rgb(var(--c-text-4) / <alpha-value>)",
        primary: "rgb(var(--c-cyan) / <alpha-value>)",
        danger: "rgb(var(--c-danger) / <alpha-value>)",
        secondary: "rgb(var(--c-violet) / <alpha-value>)",
        light: "#F1F1FB",
        fontColor: "rgb(var(--c-text-2) / <alpha-value>)",
        clearBtn: "rgb(var(--c-ink-600) / <alpha-value>)",

        /* ---- surfaces ---- */
        ink: {
          950: "rgb(var(--c-ink-950) / <alpha-value>)",
          900: "rgb(var(--c-ink-900) / <alpha-value>)",
          850: "rgb(var(--c-ink-850) / <alpha-value>)",
          800: "rgb(var(--c-ink-800) / <alpha-value>)",
          750: "rgb(var(--c-ink-750) / <alpha-value>)",
          700: "rgb(var(--c-ink-700) / <alpha-value>)",
          600: "rgb(var(--c-ink-600) / <alpha-value>)",
          500: "rgb(var(--c-ink-500) / <alpha-value>)",
        },

        /* hairlines and subtle fills: white in dark, slate in light, so the
           same alpha reads as "subtly separated" in both themes */
        hair: "rgb(var(--c-hair) / <alpha-value>)",

        /* always-dark scrim, for chrome that sits on top of cover imagery */
        scrim: "rgb(var(--c-scrim) / <alpha-value>)",

        accent: {
          50: "rgb(var(--c-accent-50) / <alpha-value>)",
          100: "rgb(var(--c-accent-100) / <alpha-value>)",
          200: "rgb(var(--c-accent-200) / <alpha-value>)",
          300: "rgb(var(--c-accent-300) / <alpha-value>)",
          400: "rgb(var(--c-accent-400) / <alpha-value>)",
          500: "rgb(var(--c-accent-500) / <alpha-value>)",
          600: "rgb(var(--c-accent-600) / <alpha-value>)",
          700: "rgb(var(--c-accent-700) / <alpha-value>)",
          800: "rgb(var(--c-accent-800) / <alpha-value>)",
          900: "rgb(var(--c-accent-900) / <alpha-value>)",
        },
        violet2: "rgb(var(--c-violet) / <alpha-value>)",
        mint: "rgb(var(--c-mint) / <alpha-value>)",
        amber2: "rgb(var(--c-amber) / <alpha-value>)",
        dangerText: "rgb(var(--c-danger-text) / <alpha-value>)",
      },

      borderRadius: {
        xl2: '0.875rem',
        '4xl': '2rem',
      },

      boxShadow: {
        card: 'var(--shadow-card)',
        cardHover: 'var(--shadow-card-hover)',
        glow: '0 0 0 1px rgba(79,141,249,.35), 0 12px 40px -12px rgba(79,141,249,.45)',
        inner1: 'inset 0 1px 0 0 rgba(255,255,255,.06)',
      },

      backgroundImage: {
        bgGrad: 'linear-gradient(120deg, #4F8DF9 0%, #8B5CF6 55%, #22D3EE 100%)',
        brand: 'linear-gradient(120deg, #4F8DF9 0%, #8B5CF6 100%)',
        brandSoft:
          'linear-gradient(120deg, rgb(var(--c-accent-500) / .16) 0%, rgb(var(--c-violet) / .14) 100%)',
        surface:
          'linear-gradient(180deg, rgb(var(--c-hair) / .045) 0%, rgb(var(--c-hair) / 0) 100%)',
        grid:
          'linear-gradient(to right, rgb(var(--c-hair) / .05) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--c-hair) / .05) 1px, transparent 1px)',
        shimmer:
          'linear-gradient(90deg, rgb(var(--c-hair) / 0) 0%, rgb(var(--c-hair) / .09) 50%, rgb(var(--c-hair) / 0) 100%)',
      },

      backgroundSize: {
        gridcell: '48px 48px',
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(.22,1,.36,1)',
      },

      keyframes: {
        loaderBar: {
          '0%': { height: '14px', opacity: '.5' },
          '50%': { height: '44px', opacity: '1' },
          '100%': { height: '14px', opacity: '.5' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '.55' },
          '50%': { opacity: '1' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      animation: {
        loaderBar1: 'loaderBar 1s ease-in-out infinite',
        loaderBar2: 'loaderBar 1s ease-in-out infinite .1s',
        loaderBar3: 'loaderBar 1s ease-in-out infinite .2s',
        loaderBar4: 'loaderBar 1s ease-in-out infinite .3s',
        loaderBar5: 'loaderBar 1s ease-in-out infinite .4s',
        fadeUp: 'fadeUp .5s cubic-bezier(.22,1,.36,1) both',
        fadeIn: 'fadeIn .4s ease both',
        shimmer: 'shimmer 1.6s linear infinite',
        floaty: 'floaty 7s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
        popIn: 'popIn .18s cubic-bezier(.22,1,.36,1) both',
      },
    },
  },
  plugins: [require('tailwindcss-all')],
};
