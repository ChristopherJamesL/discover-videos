import { VideosType } from "@/components/card/section-cards.types";

export interface HomeProps {
  disneyVideos: VideosType[] | [];
  travelVideos: VideosType[] | [];
  productivityVideos: VideosType[] | [];
  popularVideos: VideosType[] | [];
}

export interface YoutubeVideoResponse {
  items: YoutubeVideoItem[];
  error?: {
    code: number;
    message: string;
    errors: {
      message: string;
      domain: string;
      reason: string;
    }[];
  };
}

export interface YoutubeVideoItem {
  id:
    | {
        videoId?: string;
        channelId?: string;
        kind: string;
      }
    | string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    publishTime?: string;
  };
  statistics?: {
    viewCount?: string;
  };
}
