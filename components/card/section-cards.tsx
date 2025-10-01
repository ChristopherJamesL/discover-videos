import React, { useEffect, useRef } from "react";
import Card from "./card";
import styles from "./section-cards.module.css";
import { SectionCardsProps } from "./section-cards.types";
import Link from "next/link";

export default function SectionCards({
  title,
  videos = [],
  size = "medium",
}: SectionCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper} ref={scrollRef}>
        {videos.map((video, i) => {
          const {
            id,
            title,
            thumbnails,
            // thumbnails: {
            //   high: { url },
            // },
          } = video;
          const imgUrl =
            thumbnails?.high?.url ??
            "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1159&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
          const hoverStyle = i === 0 || i === videos.length - 1 ? 1 : 2;
          return (
            <Link href={`/video/${id}`} key={i}>
              <Card
                id={id}
                hoverStyle={hoverStyle}
                imgUrl={imgUrl}
                size={size}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
