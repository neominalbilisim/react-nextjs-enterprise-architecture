import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import "@/styles/globals.css";

// Pages Router nested layout: sayfalar isteğe bağlı getLayout tanımlar.
export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
}
