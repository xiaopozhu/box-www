import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ConfigProvider } from "antd";
import type { Locale } from "antd/es/locale";
// import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import Script from "next/script";

import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import { request } from "@/utils/request";

export default function App({ Component, pageProps, router }: AppProps) {
  const [profile, setProfile] = useState(undefined);
  const [locale, setLocal] = useState<Locale>(zhCN);

  useEffect(() => {
    if (router.pathname != "/login/[idp]") {
      request("/box-api/v1/user/profile", {
        method: "GET",
      }).then((resp) => {
        if (resp.code === 0) {
          setProfile(resp.data);
        }
      });
    }
  }, [router.pathname]);
  return (
    <>
      <Head>
        <meta name="description" content="CryptoBox 专注于加密工具制作" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-2196H74MLK" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-2196H74MLK');
        `}
      </Script>
      <ConfigProvider locale={locale}>
        {router.pathname != "/login/[idp]" ? (
          <Layout profile={profile}>
            <Component {...pageProps} profile={profile} />
          </Layout>
        ) : (
          <Component {...pageProps} profile={profile} />
        )}
      </ConfigProvider>
    </>
  );
}
