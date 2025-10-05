import { VideosType } from "@/components/card/section-cards.types";

export interface MyListProps {
  myListVideos: VideosType[] | [];
}

export interface DBStatsVideoProps {
  favorited: number;
  id: number;
  user_id: string;
  video_id: string;
}
