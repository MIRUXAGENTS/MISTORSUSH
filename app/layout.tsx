import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { LangProvider } from '@/context/LangContext';
import { MenuProvider } from '@/context/MenuContext';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Суши Ашкелон | Mistorsush Доставка запеченных роллов',
  description: 'Заказывайте лучшие суши и роллы в Ашкелоне от Mistorsush! Доставка вкусных классических и запеченных сетов. Скидка 2+1 каждую пятницу!',
  keywords: 'суши ашкелон, доставка суши ашкелон, роллы ашкелон, запеченные ролы, мисторсуш, mistorsush, заказать суши ашкелон',
  openGraph: {
    type: 'website',
    url: 'https://iceblinkil.github.io/MISTORSUSH/',
    title: 'Mistorsush | Доставка суши в Ашкелоне',
    description: 'Лучшие запеченные роллы в городе. Заказывай прямо сейчас через удобный сайт!',
    images: [{ url: 'https://iceblinkil.github.io/MISTORSUSH/img/mistorsush_logo.webp' }],
  },
  icons: {
    icon: '/img/mistorsush_favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.variable} bg-dark text-white antialiased pb-28`}>
        <LangProvider>
          <MenuProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </MenuProvider>
        </LangProvider>
      </body>
    </html>
  );
}
