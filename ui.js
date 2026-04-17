const PLACEHOLDER_POSTER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><rect width="300" height="450" fill="#111827"/><text x="50%" y="50%" fill="#9ca3af" font-size="24" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif">No Poster</text></svg>'
  );

function cardTemplate(movie) {
  const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : PLACEHOLDER_POSTER;
  const genre = movie.Genre || "Not available";
  const director = movie.Director || "Not available";
  const year = movie.Year || "Not available";

  return `
    <article class="movie-card">
      <div class="poster-wrap">
        <img src="${poster}" alt="${movie.Title} poster" loading="lazy" />
      </div>
      <div class="movie-meta">
        <h2>${movie.Title}</h2>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Director:</strong> ${director}</p>
      </div>
    </article>
  `;
}

export function renderMovies(container, movies) {
  if (!movies.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = movies.map(cardTemplate).join("");
}

export function showFeedback(feedbackEl, message, isError = false) {
  feedbackEl.textContent = message;
  feedbackEl.classList.toggle("error", isError);
}

export function clearFeedback(feedbackEl) {
  feedbackEl.textContent = "";
  feedbackEl.classList.remove("error");
}
