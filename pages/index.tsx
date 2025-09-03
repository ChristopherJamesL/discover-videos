import Head from "next/head";
import Banner from "@/components/banner/banner";
import Navbar from "@/components/navbar/navbar";
import SectionCards from "@/components/card/section-cards";
import { getVideos } from "@/lib/videos";
import styles from "@/styles/Home.module.css";
import { HomeProps } from "./index.types";

export async function getServerSideProps() {
  const disneyVideos = await getVideos("disney");
  const travelVideos = await getVideos("travel");
  const productivityVideos = await getVideos("productivity");
  const popularVideos = await getVideos("popular");

  return {
    props: { disneyVideos, travelVideos, productivityVideos, popularVideos },
  };
}

export default function Home({
  disneyVideos,
  travelVideos,
  productivityVideos,
  popularVideos,
}: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <Navbar username="chris@gmail.com" />
        <Banner
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </div>
    </div>
  );
}
