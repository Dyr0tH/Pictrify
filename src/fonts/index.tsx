import localFont from 'next/font/local';

// General Sans - A modern, versatile sans-serif typeface
export const generalSans = localFont({
  src: [
    {
      path: '../../public/fonts/GeneralSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeneralSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeneralSans-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeneralSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-general-sans',
  display: 'swap',
});

// Satoshi - A premium geometric sans-serif with a tech feel
export const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

// Cabinet Grotesk - A modern, premium display typeface for headings
export const cabinetGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/CabinetGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CabinetGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CabinetGrotesk-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-cabinet-grotesk',
  display: 'swap',
}); 