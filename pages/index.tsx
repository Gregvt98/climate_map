import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import BaseMap from "@/components/basemap";
import Header from "@/components/header";
import Layout from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Climate Map</title>
        <meta name="description" content="Climate anxiety map" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <BaseMap/>
      </Layout>
    </>
  );
}
