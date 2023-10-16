
import { updatePhotoList } from './markup';

const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '40064667-dee000e37b39a04836075971b';

export const getPhotos = async  (query, page = 1) => {
  try {
    const res = await fetch(`${ENDPOINT}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=20`);
    const response = await res.json();

    if (response.hits && response.hits.length > 0) {
      const tags = response.hits.map(hit => hit.tags); 

     
     

      return response.hits;
    } else {
      updatePhotoList('<p>No results found.</p>');
    }
  } catch (err) {
    updatePhotoList(`<p>${err}</p>`);
    console.error(err);
  }
};

export default { getPhotos };