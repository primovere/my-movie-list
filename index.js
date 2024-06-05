const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = `${BASE_URL}/api/movies/`;
const POSTER_URL = `${BASE_URL}/posters/`;
const MOVIES_PER_PAGE = 12;
const movieList = [];

const dataPanel = document.querySelector("#data-panel");
const searchInput = document.querySelector("#search-input");

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movieList.find((movie) => id === movie.id);
  // check if the movie is already in the favorite list stored in local storage
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已在收藏清單中！");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
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
                <button class="btn btn-info btn-add-favorite" data-id="${
                  item.id
                }">+</button>
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
axios
  .get(INDEX_URL)
  .then((response) => {
    movieList.push(...response.data.results);
    console.log(movieList);
    renderPaginator(movieList.length);
    renderMovieList(getMoviesByPage(1));
  })
  .catch((err) => console.log(err));

const searchForm = document.querySelector("#search-form");
let filteredList = [];
searchForm.addEventListener("click", function onSearchFormSubmitted(event) {
  const target = event.target;
  if (target.matches("#search-submit-button")) {
    event.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
      return alert("Please enter a valid string");
    }
    filteredList = movieList.filter((movie) =>
      movie.title.toLowerCase().includes(keyword)
    );

    if (filteredList.length === 0) {
      return alert(`Cannot find any movies with keyword: ${keyword}`);
    }
    renderPaginator(filteredList.length);
    renderMovieList(getMoviesByPage(1));
  }
});

function getMoviesByPage(page) {
  const data = filteredList.length ? filteredList : movieList;
  // get the start Index
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  // get new sliced array
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}
// make paginator with the number
const paginator = document.querySelector(".pagination");
function renderPaginator(amount) {
  // total page number
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
  `;
  }
  paginator.innerHTML = rawHTML;
}

// get data based on which page
paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;

  // get clicked page number by dataset
  const page = Number(event.target.dataset.page);

  renderMovieList(getMoviesByPage(page));
});
