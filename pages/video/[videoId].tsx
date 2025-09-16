import React from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import clsx from "classnames";
import { GetStaticPaths, GetStaticProps } from "next";
import { VideoProps } from "./video.types";
import styles from "@/styles/Video.module.css";
import disneyvideos from "@/data/disney.videos.json";
import { getYoutubeVideoById } from "@/lib/videos";

Modal.setAppElement("#__next");

const API_KEY = process.env.YOUTUBE_API_KEY;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  //
  // const videoId = params?.videoId;

  // if (!videoId || typeof videoId !== "string") return { notFound: true };
  // fetch data from API or fallback
  // const res = await fetch(
  //   `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
  // );
  // const data = res.json();
  // const videos = res.json();
  const videoId = "4zH5iYM4wJo";
  const video = await getYoutubeVideoById(videoId);
  console.log("Video: ", video);

  // const video = {
  //   title: "Hi cute dog",
  //   publishTime: "2021-01-01",
  //   description: "A big red dog that is super cute, can he get any bigger?",
  //   channelTitle: "Paramount Pictures",
  //   viewCount: 10000,
  // };
  if (!video) return { notFound: true };

  return {
    props: {
      video,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // const videosList = ["hJnAHzo4-KI", "BjkIOU5PhyQ", "ETVi5_cnnaE"];
  const videosList = disneyvideos.items;
  const paths = videosList.map((videos) => ({
    params: { videoId: videos.id.videoId },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export default function Video({ video }: VideoProps) {
  const router = useRouter();
  const { videoId } = router.query;

  const { title, publishTime, description, channelTitle, viewCount } = video;

  const closeModal = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://example.com";

  return (
    <div className={styles.container}>
      <Modal
        className={styles.modal}
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={closeModal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="player"
          className={clsx(styles.videoPlayer, styles.borderBoxShadow)}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=${origin}&controls=0&autoplay=1$`}
          allowFullScreen
          allow="autoplay; fullscreen"
        ></iframe>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>
                  {viewCount?.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
