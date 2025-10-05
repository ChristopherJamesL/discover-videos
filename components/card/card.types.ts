export interface CardProps {
  id?: string | { videoId: string };
  imgUrl: string;
  size: CardSize;
  hoverStyle: number;
  shouldScale?: boolean;
}

export type CardSize = "large" | "medium" | "small";
