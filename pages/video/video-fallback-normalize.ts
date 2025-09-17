import { VideosType } from "@/components/card/section-cards.types";
import { FallbackVideo, VideoProps } from "./video.types";
import { YoutubeVideoItem } from "../index.types";

export function normalizeFallbackVideo(
  fallbackVideo: FallbackVideo
): VideoProps["video"] {
  return {
    id:
      typeof fallbackVideo.id === "string"
        ? fallbackVideo.id
        : fallbackVideo.id.videoId,
    title: fallbackVideo.snippet.title,
    description: fallbackVideo.snippet.description,
    thumbnails: {
      high: {
        url: fallbackVideo.snippet.thumbnails.high.url,
        width: String(fallbackVideo.snippet.thumbnails.high.width),
        height: String(fallbackVideo.snippet.thumbnails.high.height),
      },
    },
    channelTitle: fallbackVideo.snippet.channelTitle,
    publishTime: fallbackVideo.snippet.publishedAt,
    viewCount: parseInt(fallbackVideo.statistics?.viewCount || "0", 10),
  };
}

export const normalizeFallbackVideos = (
  items: YoutubeVideoItem[]
): VideosType[] => {
  if (!items) return [];
  return items
    .map((item) => {
      // extract videoId safely
      const videoId =
        typeof item.id === "string" ? item.id : (item.id.videoId ?? ""); // fallback empty string if missing

      if (!videoId) return null; // filter out if no id

      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnails: {
          high: {
            url: item.snippet.thumbnails.high.url,
            width: item.snippet.thumbnails.high.width.toString(),
            height: item.snippet.thumbnails.high.height.toString(),
          },
        },
        channelTitle: item.snippet.channelTitle,
        publishTime: item.snippet.publishTime ?? item.snippet.publishedAt,
        viewCount: item.statistics?.viewCount
          ? parseInt(item.statistics.viewCount)
          : 0,
      };
    })
    .filter(Boolean) as VideosType[];
};
