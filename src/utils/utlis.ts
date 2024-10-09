// Import the 'node-fetch' module for Node.js environments
import fetch from 'node-fetch';

// Your API key and Custom Search Engine ID
const API_KEY = 'AIzaSyCqeTR5yu2eglPEcaqbS2SiCTaW3FAs2rA';
const SEARCH_ENGINE_ID = '223cd482c94b54d39';

// // Function to search images using Google Custom Search API
// export async function searchImages(query: string, numResults: number = 1) {
//     const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&searchType=image&q=${query}&num=${numResults}`;

//     try {
//         const response = await fetch(apiUrl);
//         const data = await response.json();
        
//         // Extract image URLs from the response
//         const imageUrls = data.items.map(item: => item.link);
//         return imageUrls;
//     } catch (error) {
//         console.error('Error fetching data from API:', error);
//     }
// }
