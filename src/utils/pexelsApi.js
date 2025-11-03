// src/utils/pexelsApi.js
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export async function searchMedia(keyword, perPage = 5) {
  const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=${perPage}`, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });
  const data = await res.json();
  return data.photos?.map((p) => ({
    type: "image",
    src: p.src.medium,
    photographer: p.photographer,
  })) || [];
}
