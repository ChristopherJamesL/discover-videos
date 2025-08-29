import React, { useEffect, useRef } from "react";
import Card from "./card";
import styles from "./section-cards.module.css";
import { SectionCardsProps } from "./section-cards.types";

export default function SectionCards({ title }: SectionCardsProps) {
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
        <Card id={0} imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card id={13} imgUrl="/static/clifford.webp" size="large" />
      </div>
    </section>
  );
}
