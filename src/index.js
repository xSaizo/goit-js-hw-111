
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
import Notiflix from 'notiflix';
import { getPhotos } from './api.js';
import { updatePhotoList } from "./markup.js";


const form = document.getElementById('search-form');
const gallery = document.querySelector(".gallery");
const loadMoreButton = document.querySelector(".load-more");
const lightbox = new SimpleLightbox('.gallery a', {
    animationSlide: false,
});

let page = 1;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    page = 1; 
    const form = e.currentTarget;
    const inputValue = form.elements.searchQuery.value;
    await searchImages(inputValue, page);
});

loadMoreButton.addEventListener("click", async () => {
    page += 1;
    const inputValue = form.elements.searchQuery.value;
    await searchImages(inputValue, page);
});

let hasValidImagesOnPage = false;

async function searchImages(query, page = 1) {
    try {
       
        if (page === 1) {
            gallery.innerHTML = "";
            hasValidImagesOnPage = false;
        }

        const response = await getPhotos(query, page);

        if (response.length === 0 && !hasValidImagesOnPage) {
            Notiflix.Report.failure('Sorry!', 'There are no images matching your search query.', 'Please try again.');
            return;
        }

        const keyword = query.toLowerCase();

        response.forEach((image) => {
            const tags = image.tags.toLowerCase();
            const tagWords = tags.split(',');

            const hasExactKeyword = tagWords.some((tagWord) => tagWord.trim() === keyword);

            if (hasExactKeyword) {
                hasValidImagesOnPage = true;

                const card = document.createElement("div");
                card.classList.add("photo-card");
                card.innerHTML = `
                    <a href="${image.largeImageURL}" title="${image.tags}">
                        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
                    </a>
                    <div class="info">
                        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                        <p class="info-item"><b>Views:</b> ${image.views}</p>
                        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
                    </div>
                `;
                gallery.appendChild(card);
            }
        });

        lightbox.refresh();

        if (page === 1) {
            loadMoreButton.style.display = "flex";
        }
    } catch (error) {
        console.error(error);
    }
}