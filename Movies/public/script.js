const image_path = `https://image.tmdb.org/t/p/w1280`;

const input = document.querySelector('.search input');
const btn = document.querySelector('.search button');
const main_grid_title = document.querySelector('.favorites h1');
const main_grid = document.querySelector('.favorites .movies-grid');
const trending_el = document.querySelector('.trending .movies-grid');


function add_click_effect_to_card(cards) {
    cards.forEach(card => {
        card.addEventListener('click', () => show_popup(card));
    });
}

async function getMoviePoster(movieId) {
    const response = await fetch(`/api/movie/poster/${movieId}`);
    const data = await response.json();
  
    if (data.poster_url) {
      document.querySelector('#moviePoster').src = data.poster_url;
    } else {
      console.error('Poster not found');
    }
}

async function get_movie_by_search(search_term) {
    const resp = await fetch(`/api/search?query=${search_term}`);
    const respData = await resp.json();
    return respData;
}


input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        add_searched_movies_to_dom();  
    }
});


async function add_searched_movies_to_dom() {
    const data = await get_movie_by_search(input.value);

    main_grid_title.innerText = `Search: ${input.value}`;  
    main_grid.innerHTML = data.map(e => {
        return `
            <div class="card" data-id="${e.id}">
                <div class="img">
                    <img src="${image_path + e.poster_path}" alt="${e.title}">
                </div>
                <div class="info">
                    <h2>${e.title}</h2>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${e.release_date}</span>
                    </div>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${e.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Add to Favorites:</span>
                        <span class="heart-icon">&#9829;</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const cards = document.querySelectorAll('.card');
    add_click_effect_to_card(cards);

    handle_favorites(); 
}

function get_LS() {
    const movie_ids = JSON.parse(localStorage.getItem('movie-id'));
    return movie_ids === null ? [] : movie_ids;
}

function update_LS(id, add) {
    const movie_ids = get_LS();
    if (add) {
        if (!movie_ids.includes(id)) {
            movie_ids.push(id);  // Add to favorites
        }
    } else {
        const index = movie_ids.indexOf(id);
        if (index !== -1) {
            movie_ids.splice(index, 1);  // Remove from favorites
        }
    }
    localStorage.setItem('movie-id', JSON.stringify(movie_ids));
}


async function handle_favorites() {
    const heart_icons = document.querySelectorAll('.heart-icon');

    heart_icons.forEach(heart_icon => {
        const movie_id = heart_icon.closest('.card').getAttribute('data-id'); 

        
        const movie_ids = get_LS();
        if (movie_ids.includes(movie_id)) {
            heart_icon.classList.add('change-color'); 
        } 
        else {
            heart_icon.classList.remove('change-color');
        }

        
        heart_icon.addEventListener('click', (event) => {
            event.stopPropagation(); 
            if (heart_icon.classList.contains('change-color')) {
                update_LS(movie_id, false);
                heart_icon.classList.remove('change-color'); 
            } 
            else {
                update_LS(movie_id, true);
                heart_icon.classList.add('change-color'); 
            }
        });
    });
}


async function get_movie_by_id(id) {
    const resp = await fetch(`/api/movie/${id}`);
    const respData = await resp.json();
    return respData;
}


fetch_favorite_movies();
async function fetch_favorite_movies() {
    main_grid.innerHTML = '';  

    const movies_LS = get_LS();
    for (let i = 0; i <= movies_LS.length - 1; i++) {
        const movie_id = movies_LS[i];
        let movie = await get_movie_by_id(movie_id);
        add_favorites_to_dom_from_LS(movie);
    }
}


function add_favorites_to_dom_from_LS(movie_data) {
    main_grid.innerHTML += `
        <div class="card" data-id="${movie_data.id}">
            <div class="img">
                <img src="${image_path + movie_data.poster_path}">
            </div>
            <div class="info">
                <h2>${movie_data.title}</h2>
                <div class="single-info">
                    <span>Release Date: </span>
                    <span>${movie_data.release_date}</span>
                </div>
                <div class="single-info">
                    <span>Rate: </span>
                    <span>${movie_data.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Add to Favorites:</span>
                    <span class="heart-icon">&#9829;</span>
                </div>
            </div>
        </div>
    `;

    const cards = document.querySelectorAll('.card');
    add_click_effect_to_card(cards);
    handle_favorites();
}


async function get_trending_movies() {
    const resp = await fetch(`/api/trending`);
    const respData = await resp.json();
    handle_favorites();
    return respData;
}

async function add_to_dom_trending() {
    const data = await get_trending_movies();
    trending_el.innerHTML = data.slice(0, 5).map(e => {
        return `
            <div class="card" data-id="${e.id}">
                <div class="img">
                    <img src="${image_path + e.poster_path}">
                </div>
                <div class="info">
                    <h2>${e.title}</h2>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${e.release_date}</span>
                    </div>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${e.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Add to Favorites:</span>
                        <span class="heart-icon">&#9829;</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    handle_favorites();

}


add_to_dom_trending();

