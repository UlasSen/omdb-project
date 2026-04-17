import { searchMoviesByTitle, getMovieDetailsByImdbId } from "./api.js";
import { renderMovies, showFeedback, clearFeedback } from "./ui.js";

const STORAGE_KEY = "omdb-search-state";
const DEBOUNCE_DELAY = 500;

const searchInput = document.querySelector("#search-input");
const typeFilter = document.querySelector("#type-filter");
const yearFilter = document.querySelector("#year-filter");
const resultsEl = document.querySelector("#results");
const feedbackEl = document.querySelector("#feedback");

let activeRequestId = 0;

function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function fetchDetailedMovies(basicMovies) {
  const details = await Promise.all(
    basicMovies.map((movie) =>
      getMovieDetailsByImdbId(movie.imdbID).catch(() => ({
        ...movie,
        Genre: "Not available",
        Director: "Not available"
      }))
    )
  );

  return details;
}

async function runSearch() {
  const title = searchInput.value.trim();
  const type = typeFilter.value.trim();
  const year = yearFilter.value.trim();

  saveState({ title, type, year });

  if (!title) {
    renderMovies(resultsEl, []);
    showFeedback(feedbackEl, "Start typing a movie title to search.");
    return;
  }

  const requestId = ++activeRequestId;
  showFeedback(feedbackEl, "Searching...");

  try {
    const movies = await searchMoviesByTitle(title, { type, year });
    const detailedMovies = await fetchDetailedMovies(movies);

    if (requestId !== activeRequestId) {
      return;
    }

    renderMovies(resultsEl, detailedMovies);
    clearFeedback(feedbackEl);
  } catch (error) {
    if (requestId !== activeRequestId) {
      return;
    }

    renderMovies(resultsEl, []);
    showFeedback(
      feedbackEl,
      error.message || "Could not retrieve movie data. Please try again.",
      true
    );
  }
}

const debouncedSearch = debounce(runSearch, DEBOUNCE_DELAY);

function restoreStateAndSearch() {
  const savedState = loadState();
  if (!savedState) {
    showFeedback(feedbackEl, "Start typing a movie title to search.");
    return;
  }

  searchInput.value = savedState.title || "";
  typeFilter.value = savedState.type || "";
  yearFilter.value = savedState.year || "";

  if (searchInput.value.trim()) {
    runSearch();
  } else {
    showFeedback(feedbackEl, "Start typing a movie title to search.");
  }
}

searchInput.addEventListener("input", debouncedSearch);
typeFilter.addEventListener("change", runSearch);
yearFilter.addEventListener("input", debouncedSearch);

restoreStateAndSearch();
