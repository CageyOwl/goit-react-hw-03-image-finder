const BASE_URL = 'https://pixabay.com/api/';
const KEY = '33496732-1283670651f4c7d1c9074e6ca';
const PER_PAGE = 12;

export { PER_PAGE };

export default async function getImgsData(searchQuery, pageNum = 1) {
  const response = await fetch(
    `${BASE_URL}?q=${searchQuery}&key=${KEY}&image_type=photo&orientation=horizontal&page=${pageNum}&per_page=${PER_PAGE}`
  );

  if (!response.ok) {
    throw new Error('Bad request.');
  }

  return response.json();
}
