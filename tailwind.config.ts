import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './packages/components/**/*.{js,ts,jsx,tsx}',
    './packages/demo/**/*.{js,ts,jsx,tsx}',
    './packages/demo/src/**/*.{js,ts,jsx,tsx}',
    './packages/demo/index.html'
  ],
  theme: {
    extend: {},
  },
}