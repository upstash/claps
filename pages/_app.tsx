import { AppProps } from "next/app";
import Head from "next/head";

import "styles/global.css";
import "components/claps/style.css";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>
          Add a claps button (like medium) to any page for your Next.js apps
        </title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
