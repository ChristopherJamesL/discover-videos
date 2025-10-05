import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import clsx from "classnames";
import { GetStaticPaths, GetStaticProps } from "next";
import { FallbackVideo, VideoProps } from "./video.types";
import { getVideos, getYoutubeVideoById, fallbackMap } from "@/lib/videos";
import {
  normalizeFallbackVideo,
  normalizeFallbackVideos,
} from "../../lib/video-fallback-normalize";

import disneyvideos from "@/data/disney.videos.json";
import popularvideos from "@/data/popular.videos.json";
import productivityvideos from "@/data/productivity.videos.json";
import travelvideos from "@/data/travel.videos.json";
import { VideosType } from "@/components/card/section-cards.types";
import Navbar from "@/components/navbar/navbar";
import Like from "@/components/icons/like-icon";
import Dislike from "@/components/icons/dislike-icon";
import styles from "@/styles/Video.module.css";

Modal.setAppElement("#__next");

const categories = ["disney", "popular", "productivity", "travel"] as const;

const allFallbacks: FallbackVideo[] = [
  ...disneyvideos.items,
  ...popularvideos.items,
  ...productivityvideos.items,
  ...travelvideos.items,
];

export const getStaticPaths: GetStaticPaths = async () => {
  let allVideos: VideosType[] = [];

  for (const category of categories) {
    try {
      const videos = await getVideos(category);
      if (videos.length) {
        allVideos = allVideos.concat(videos);
      } else {
        console.warn(
          `No videos from API for category ${category}, using fallback`
        );
        allVideos = allVideos.concat(
          normalizeFallbackVideos(fallbackMap[category].items)
        );
      }
    } catch (e) {
      console.warn(
        `API fetch failed for category ${category}, using fallback.`
      );
      allVideos = allVideos.concat(
        normalizeFallbackVideos(fallbackMap[category].items)
      );
    }
  }

  const paths = allVideos.map((video) => {
    const videoId = typeof video.id === "string" ? video.id : video.id.videoId;
    return { params: { videoId } };
  });
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const videoId = params?.videoId;
  if (!videoId || Array.isArray(videoId)) return { notFound: true };

  let video = await getYoutubeVideoById(videoId);

  if (!video) {
    const fallbackVideo = allFallbacks.find((video) => {
      const id = typeof video.id === "string" ? video.id : video.id.videoId;
      return id === videoId;
    });

    if (fallbackVideo) {
      video = normalizeFallbackVideo(fallbackVideo);
    }
  }

  if (!video) {
    return { notFound: true };
  }

  return {
    props: {
      video,
    },
    revalidate: 10,
  };
};

export default function Video({ video }: VideoProps) {
  const [origin, setOrigin] = useState("");
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);

  const router = useRouter();
  const { videoId } = router.query;
  const isValidVideoId =
    typeof videoId === "string" && videoId.trim().length > 0;

  const { title, publishTime, description, channelTitle, viewCount } = video;

  const modifiedPublishTime = new Date(publishTime).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const closeModal = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const runRatingService = async (favorited: number) => {
    const response = await fetch("/api/stats/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        favorited,
        videoId,
      }),
    });

    return response.json();
  };

  const handleToggleLike = async () => {
    console.log("Like");
    const likeValue = !toggleLike;
    setToggleLike(likeValue);
    setToggleDislike(false);

    const favorited = likeValue ? 1 : 0;

    const updateOrCreate = await runRatingService(favorited);
    console.log("Data: ", updateOrCreate);
  };

  const handleToggleDislike = async () => {
    console.log("Dislike");
    const dislikeValue = !toggleDislike;
    setToggleDislike(dislikeValue);
    setToggleLike(false);

    const updateOrCreate = await runRatingService(0);
    console.log("Data: ", updateOrCreate);
  };

  useEffect(() => {
    async function getStats() {
      const stats = await fetch(`/api/stats/stats?videoId=${videoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const response = await stats.json();
      const videoStats = response?.findVideoId?.[0];

      if (videoStats) {
        const { favorited } = videoStats;

        if (favorited === 1) {
          setToggleLike(true);
          setToggleDislike(false);
        } else if (favorited === 0) {
          setToggleLike(false);
          setToggleDislike(true);
        } else {
          setToggleLike(false);
          setToggleDislike(false);
        }
      } else {
        console.log("No stats found for this video, possibly unwatched");
      }
    }

    getStats();
  }, [videoId]);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      {isValidVideoId && (
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
          <div className={styles.likeDislikeBtnWrapper}>
            <button
              className={styles.likeBtnWrapper}
              onClick={handleToggleLike}
            >
              <div className={styles.btnWrapper}>
                <Like fill="white" selected={toggleLike} />
              </div>
            </button>
            <button onClick={handleToggleDislike}>
              <div className={styles.btnWrapper}>
                <Dislike fill="white" selected={toggleDislike} />
              </div>
            </button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.modalBodyContent}>
              <div className={styles.col1}>
                <p className={styles.publishTime}>{modifiedPublishTime}</p>
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
      )}
    </div>
  );
}
