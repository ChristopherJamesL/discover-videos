import { CardSize } from "./card.types";

export interface SectionCardsProps {
  title: string;
  videos: VideosType[];
  size: CardSize;
}

export type VideosType = {
  id: string | { videoId: string };
  title: string;
  description: string;
  thumbnails: {
    high: {
      url: string;
      width: string;
      height: string;
    };
  };
  channelTitle: string;
  publishTime: string;
  viewCount?: number;
};
