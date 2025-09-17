import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const API_KEY = process.env.YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error(`Missing YOUTUBE_API_KEY in env variables!`);
  process.exit(1);
}

const dataDir = path.resolve(process.cwd(), "data");

const fallbackFiles = [
  "disney.videos.json",
  "travel.videos.json",
  "productivity.videos.json",
  "popular.videos.json",
];

async function fetchViewCount(videoId: string): Promise<number | null> {
  const url = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Error fetching videoId ${videoId}: ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();
    const viewCountStr = data.items?.[0]?.statistics?.viewCount;

    if (!viewCountStr) return null;

    return parseInt(viewCountStr, 10);
  } catch (e) {
    console.error(`Fetch failed for videoId ${videoId}: `, e);
    return null;
  }
}

async function enrichFallbackFile(filename: string) {
  const filePath = path.join(dataDir, filename);

  console.log(`Processing ${filename}...`);

  try {
    const rawData = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    for (const video of jsonData.items) {
      let videoId = "";

      if (typeof video.id === "string") {
        videoId = video.id;
      } else if (typeof video.id === "object" && video.id.videoId) {
        videoId = video.id.videoId;
      }

      if (!videoId) {
        console.warn(`No videoId found for a video item, skipping...`);
        continue;
      }

      const viewCount = await fetchViewCount(videoId);

      if (viewCount !== null) {
        if (!video.statistics) video.statistics = {};
        video.statistics.viewCount = String(viewCount);
        console.log(`Updated viewCount for ${videoId}: ${viewCount}`);
      } else {
        console.warn(`No viewCount for videoId: ${videoId}`);
      }
    }
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    console.log(`Finished enriching ${filename}`);
  } catch (e) {
    console.error(`Error processing file ${filename}: `, e);
  }
}

async function main() {
  for (const file of fallbackFiles) {
    await enrichFallbackFile(file);
  }
  console.log(`All fallback files enriched!`);
}

main().catch((e) => {
  console.error(`Script failed: `, e);
  process.exit(1);
});
