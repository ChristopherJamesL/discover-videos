import videoData from "@/data/videos.json";

export const getVideos = () => {
  const data = videoData.items;
  return data.map((video) => {
    const {
      id,
      snippet: {
        title,
        description,
        thumbnails: { high },
        channelTitle,
        publishTime,
      },
    } = video;
    return {
      id: id?.videoId,
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
      publishTime,
    };
  });
};
