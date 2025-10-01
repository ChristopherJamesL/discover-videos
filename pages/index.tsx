import Head from "next/head";
import Banner from "@/components/banner/banner";
import Navbar from "@/components/navbar/navbar";
import SectionCards from "@/components/card/section-cards";
import { getVideos, getWatchItAgainVideos } from "@/lib/videos";
import { HomeProps } from "./index.types";
import styles from "@/styles/Home.module.css";

export async function getServerSideProps() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJkaWQ6ZXRocjoweEVBOTE2RmEwNENkYmFGMDRlMzljOTY0MTgxNjM2Mzc1NGZkZWMwMDUiLCJwdWJsaWNBZGRyZXNzIjoiMHhFQTkxNkZhMDRDZGJhRjA0ZTM5Yzk2NDE4MTYzNjM3NTRmZGVjMDA1IiwiZW1haWwiOiJhbmJjaHJpc0BnbWFpbC5jb20iLCJvYXV0aFByb3ZpZGVyIjpudWxsLCJwaG9uZU51bWJlciI6bnVsbCwidXNlcm5hbWUiOm51bGwsIndhbGxldHMiOltdLCJpYXQiOjE3NTkyNjc2NjgsImV4cCI6MTc1OTg3MjQ2OCwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwieC1oYXN1cmEtdXNlci1pZCI6ImRpZDpldGhyOjB4RUE5MTZGYTA0Q2RiYUYwNGUzOWM5NjQxODE2MzYzNzU0ZmRlYzAwNSJ9fQ.9USd7Wiua926WZwp5vvPyGfypmWCX_thMtV639KouYk";
  const userId = "did:ethr:0xEA916Fa04CdbaF04e39c9641816363754fdec005";

  const disneyVideos = await getVideos("disney");
  const travelVideos = await getVideos("travel");
  const productivityVideos = await getVideos("productivity");
  const popularVideos = await getVideos("popular");
  const watchItAgainVideos = await getWatchItAgainVideos(token, userId);
  console.log("Watch it Again Videos: ", watchItAgainVideos);

  return {
    props: {
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
}

export default function Home({
  disneyVideos,
  travelVideos,
  productivityVideos,
  popularVideos,
  watchItAgainVideos,
}: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <Navbar />
        <Banner
          id="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards
            title="Watch It Again"
            videos={watchItAgainVideos}
            size="small"
          />
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
