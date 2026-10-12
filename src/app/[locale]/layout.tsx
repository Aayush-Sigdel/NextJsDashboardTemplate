import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "../../i18n/routing";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AntdThemeProvider } from "./antd-theme-provider";

export const metadata: Metadata = { title: "Dashboard" };

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const Layout = async ({ children, params }: LayoutProps<"/[locale]">) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${inter.variable} ${oswald.variable}`}>
      <body>
        <NextIntlClientProvider>
          <AntdRegistry layer>
            <AntdThemeProvider>{children}</AntdThemeProvider>
          </AntdRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default Layout;
