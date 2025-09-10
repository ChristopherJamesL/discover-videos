import { useRouter } from "next/router";
import React from "react";

export default function Video() {
  const router = useRouter();
  console.log("router query: ", router);

  const { videoId } = router.query;
  return (
    <div>
      <div>
        <h1>{`Video Page: ${videoId}`}</h1>
      </div>
    </div>
  );
}
