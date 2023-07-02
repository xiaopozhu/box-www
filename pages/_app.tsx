import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import { request } from "@/utils/request";

export default function App({ Component, pageProps }: AppProps) {
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    request("/api/v1/user/profile", {
      method: "GET",
    }).then((resp) => {
      if (resp.code === 0) {
        setProfile(resp.data);
      }
    });
  }, []);
  return (
    <Layout profile={profile}>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} profile={profile} />
    </Layout>
  );
}
