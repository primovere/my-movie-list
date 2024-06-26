const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = `${BASE_URL}/api/movies/`;
const POSTER_URL = `${BASE_URL}/posters/`;
const movieList = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

const dataPanel = document.querySelector("#data-panel");

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    // dataset value type is string
    showMovieModal(Number(event.target.dataset.id));
  }
  if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

function removeFromFavorite(id) {
  // end this function if the array is empty or isn't existed
  if (!movieList || !movieList.length) return;
  const removedIndex = movieList.findIndex((movie) => movie.id == id);
  // end this function if cannot find the movie's index
  if (removedIndex === -1) return;

  movieList.splice(removedIndex, 1);
  localStorage.setItem("favoriteMovies", JSON.stringify(movieList));
  renderMovieList(movieList);
}

function renderMovieList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${
                  item.id
                }">X</button>
              </div>
            </div>
          </div>
        </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.textContent = data.title;
    modalDate.textContent = `Release date: ${data.release_date}`;
    modalDescription.textContent = data.description;
    modalImage.innerHTML = `
    <img src="${
      POSTER_URL + data.image
    }" alt="Movie poster" class="img-fluid">`;
  });
}

renderMovieList(movieList);
