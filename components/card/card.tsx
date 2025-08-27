import React, { useState } from "react";
import { CardProps } from "./card.types";
import Image from "next/image";
import styles from "@/components/card/card.module.css";

export default function Card({ imgUrl, size = "medium" }: CardProps) {
  const [imgSrc, setImgSrc] = useState(imgUrl); // handle image errors while showing default image

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleError = () => {
    console.log("hi error");
    setImgSrc("/static/clifford.webp");
  };

  return (
    <div className={styles.container}>
      Cards
      <div className={classMap[size]}>
        <Image
          src={imgSrc}
          alt="clifford picture"
          layout="fill"
          onError={handleError}
          className={styles.cardImg}
          placeholder="blur"
          blurDataURL={imgUrl}
        />
      </div>
    </div>
  );
}
