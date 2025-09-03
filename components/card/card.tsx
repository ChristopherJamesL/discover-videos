import React, { useState } from "react";
import { CardProps } from "./card.types";
import Image from "next/image";
import * as motion from "motion/react-client";
import styles from "@/components/card/card.module.css";

const DEFAULT_IMG_URL =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1159&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function Card({
  id,
  imgUrl = DEFAULT_IMG_URL,
  size = "medium",
  hoverStyle,
}: CardProps) {
  const [imgSrc, setImgSrc] = useState(imgUrl); // handle image errors while showing default image
  const [isHovered, setIsHovered] = useState(false);

  const sizeProps =
    size === "small" ? "300px" : size === "medium" ? "158px" : "218px";

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleError = () => {
    console.log("hi error");
    setImgSrc(
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1159&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    );
  };

  const motionStyles = {
    zIndex: isHovered ? 999 : 1,
    position: "relative" as const,
  };

  const scale = hoverStyle === 1 ? { scaleY: 1.1 } : { scale: 1.1 };

  const motionProps = {
    whileHover: { ...scale },
    whileTap: { scale: 0.95 },
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={classMap[size]}
        style={motionStyles}
        {...motionProps}
      >
        <Image
          src={imgSrc}
          alt="clifford picture"
          fill
          onError={handleError}
          className={styles.cardImg}
          sizes={sizeProps}
        />
      </motion.div>
    </div>
  );
}
