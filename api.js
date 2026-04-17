const API_KEY = "6ad27088";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

function buildUrl(params) {
  const url = new URL(OMDB_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

async function requestOmdb(params) {
  const url = buildUrl({ apikey: API_KEY, ...params });

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Something went wrong. Please try again.");
    }

    if (data.Response === "False") {
      throw new Error(data.Error || "No results found.");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Unable to fetch movie data.");
  }
}

export async function searchMoviesByTitle(title, filters = {}) {
  const payload = await requestOmdb({
    s: title,
    type: filters.type || "",
    y: filters.year || ""
  });

  return payload.Search || [];
}

export async function getMovieDetailsByImdbId(imdbId) {
  return requestOmdb({
    i: imdbId,
    plot: "short"
  });
}
