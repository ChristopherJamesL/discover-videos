export interface VideoProps {
  video: {
    id: string;
    title: string;
    publishTime: string;
    description: string;
    channelTitle: string;
    viewCount: number;
    thumbnails: {
      high: {
        url: string;
        width: string;
        height: string;
      };
    };
  };
}

export interface FallbackVideo {
  id: string | { videoId: string };
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
  };
  statistics: {
    viewCount?: string;
  };
}
