import React from "react";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Navbar from "@/components/navbar/navbar";
import SectionCards from "@/components/card/section-cards";
import redirectUser from "@/utils/redirect-user";
import { getMyListVideos } from "@/lib/videos";
import { MyListProps } from "./my-list.types";
import styles from "@/styles/MyList.module.css";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const result = await redirectUser(context);
  // console.log("RESULT", result);

  if ("redirect" in result) return result;
  const {
    token,
    user: { issuer },
  } = result;

  const myListVideos = await getMyListVideos(token, issuer);

  return {
    props: {
      myListVideos,
    },
  };
}

export default function MyList({ myListVideos }: MyListProps) {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={myListVideos}
            size="small"
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
}
