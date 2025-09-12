import React from "react";
import { useRouter } from "next/router";
import Modal from "react-modal";
import clsx from "classnames";
import styles from "@/styles/Video.module.css";

Modal.setAppElement("#__next");

export default function Video() {
  const router = useRouter();
  const { videoId } = router.query;

  const video = {
    title: "Hi cute dog",
    publishTime: "2021-01-01",
    description:
      "A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?A big red dog that is super cute, can he get any bigger?",
    channelTitle: "Paramount Pictures",
    viewCount: 10000,
  };

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
          // width={640}
          // height={390}
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
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
