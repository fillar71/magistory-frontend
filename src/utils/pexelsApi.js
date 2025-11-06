const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_KEY;
export async function searchMedia(keyword, limit = 1) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(keyword)}&per_page=${limit}`;
  const res = await fetch(url, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });
  const data = await res.json();
  return data.videos.map((v) => ({
    src: v.video_files[0]?.link,
    thumbnail: v.image,
  }));
}
