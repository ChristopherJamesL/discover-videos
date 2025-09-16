import { YoutubeVideoResponse } from "@/pages/index.types";
import disneyFallback from "@/data/disney.videos.json";
import travelFallback from "@/data/travel.videos.json";
import productivityFallback from "@/data/productivity.videos.json";
import popularFallback from "@/data/popular.videos.json";
import { VideosType } from "@/components/card/section-cards.types";

const API_KEY = process.env.YOUTUBE_API_KEY;

const fallbackMap: Record<string, YoutubeVideoResponse> = {
  disney: disneyFallback,
  travel: travelFallback,
  productivity: productivityFallback,
  popular: popularFallback,
};

export const getVideos = async (searchQuery: string, urlOverride?: string) => {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = `https://youtube.googleapis.com/youtube/v3`;

  const endpoint =
    searchQuery === "popular"
      ? `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US`
      : `search?part=snippet&type=video&maxResults=25&q=${searchQuery}`;

  // const URL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=[YOUR_API_KEY]`
  const url = urlOverride || `${BASE_URL}/${endpoint}&key=${API_KEY}`;

  try {
    const response = await fetch(url);

    const videos: YoutubeVideoResponse = await response.json();

    if (!videos.items) {
      const errorReason = videos.error?.errors?.[0]?.reason;

      if (errorReason === "quotaExceeded") {
        console.warn(
          `Quota exceeded, falling back to static JSON: `,
          searchQuery
        );

        const fallback = fallbackMap[searchQuery.toLowerCase()];
        if (fallback?.items) {
          return filterVideos(fallback.items);
        }
      }
      console.error("Youtube API error: ", videos.error);
      return [];
    }

    return filterVideos(videos.items);
  } catch (e) {
    console.error("Request failed (non-Youtube error): ", e);
    return [];
  }
};

const filterVideos = (items: YoutubeVideoResponse["items"]): VideosType[] => {
  return items
    .map((video) => {
      const {
        id,
        snippet: {
          title,
          description,
          thumbnails: { high },
          channelTitle,
          publishTime,
          publishedAt,
        },
        statistics: { viewCount } = { viewCount: "0" },
      } = video;

      const videoId =
        typeof id === "object" ? (id.videoId ?? id.channelId) : id;
      if (!videoId) return null;

      return {
        id: videoId,
        title,
        description,
        thumbnails: {
          high: {
            url: high.url,
            width: String(high.width),
            height: String(high.height),
          },
        },
        channelTitle,
        publishTime: publishTime ?? publishedAt,
        viewCount: parseInt(viewCount ?? "0"),
      };
    })
    .filter(Boolean) as VideosType[];
};

export const getYoutubeVideoById = async (
  videoId: string
): Promise<VideosType | undefined> => {
  const URL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;

  const results = await getVideos("videoById", URL);
  return results[0];
};
