import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { LangProvider } from '@/context/LangContext';
import { MenuProvider } from '@/context/MenuContext';
import { fetchProducts } from '@/lib/supabase-server';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

// FIXME: Replace 'https://your-domain.com' with your actual domain name
const DOMAIN = 'https://your-domain.com';

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: 'Суши Ашкелон | Mistorsush Доставка запеченных роллов',
  description: 'Заказывайте лучшие суши и роллы в Ашкелоне от Mistorsush! Доставка вкусных классических и запеченных сетов. Скидка 2+1 каждую пятницу!',
  keywords: 'суши ашкелон, доставка суши ашкелон, роллы ашкелон, запеченные ролы, мисторсуш, mistorsush, заказать суши ашкелон',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: DOMAIN,
    title: 'Mistorsush | Доставка суши в Ашкелоне',
    description: 'Лучшие запеченные роллы в городе. Заказывай прямо сейчас через удобный сайт!',
    images: [{ url: `${DOMAIN}/img/mistorsush_logo.webp` }],
  },
  icons: {
    icon: '/img/mistorsush_favicon.svg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch products on server for SSR
  const initialProducts = await fetchProducts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Mistorsush Ashkelon",
    "image": `${DOMAIN}/img/mistorsush_logo.webp`,
    "@id": DOMAIN,
    "url": DOMAIN,
    "telephone": "+972559284670",
    "priceRange": "₪₪",
    "servesCuisine": "Sushi, Japanese",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ashkelon",
      "addressRegion": "Israel",
      "addressCountry": "IL"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
        "opens": "11:00",
        "closes": "23:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Friday",
        "opens": "11:00",
        "closes": "16:00"
      }
    ]
  };

  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.variable} bg-dark text-white antialiased pb-28`}>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LangProvider>
          <MenuProvider initialData={initialProducts}>
            <CartProvider>
              {children}
            </CartProvider>
          </MenuProvider>
        </LangProvider>
      </body>
    </html>
  );
}
