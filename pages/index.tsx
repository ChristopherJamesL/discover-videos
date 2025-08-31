import Head from "next/head";
import Banner from "@/components/banner/banner";
import Navbar from "@/components/navbar/navbar";
import SectionCards from "@/components/card/section-cards";
import { getVideos } from "@/lib/videos";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const disneyVideos = getVideos();

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar username="chris@gmail.com" />
      <Banner
        title="Clifford the red dog"
        subTitle="a very cute dog"
        imgUrl="/static/clifford.webp"
      />
      <div className={styles.sectionWrapper}></div>
      <SectionCards title="Disney" videos={disneyVideos} size="large" />
      <SectionCards title="Productivity" videos={disneyVideos} size="medium" />
    </div>
  );
}
