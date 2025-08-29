export interface CardProps {
  id?: number;
  imgUrl: string;
  size: CardSize;
}

export type CardSize = "large" | "medium" | "small";
