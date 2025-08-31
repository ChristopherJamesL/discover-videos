import React, { useEffect, useRef } from "react";
import Card from "./card";
import styles from "./section-cards.module.css";
import { SectionCardsProps } from "./section-cards.types";

export default function SectionCards({
  title,
  videos,
  size = "medium",
}: SectionCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  console.log("size: ", size);

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
            thumbnails: {
              high: { url },
            },
          } = video;
          const hoverStyle = i === 0 || i === videos.length - 1 ? 1 : 2;
          return (
            <Card
              key={i}
              id={id}
              hoverStyle={hoverStyle}
              imgUrl={url}
              size={size}
            />
          );
        })}
      </div>
    </section>
  );
}
