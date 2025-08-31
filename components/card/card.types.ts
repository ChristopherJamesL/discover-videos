export interface CardProps {
  id?: string | undefined;
  imgUrl: string;
  size: CardSize;
  hoverStyle: number;
}

export type CardSize = "large" | "medium" | "small";
