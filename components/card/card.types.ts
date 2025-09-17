export interface CardProps {
  id?: string | { videoId: string };
  imgUrl: string;
  size: CardSize;
  hoverStyle: number;
}

export type CardSize = "large" | "medium" | "small";
