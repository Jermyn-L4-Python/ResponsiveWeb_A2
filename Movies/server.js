const express = require('express');
const axios = require('axios');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));


const API_KEY = 'a59b01a38c311dff0332dc71414dd307';
const TMDB_URL = 'https://api.themoviedb.org/3';


app.get('/api/search', async (req, res) => {
  const searchTerm = req.query.query;
  try {
    const response = await axios.get(`${TMDB_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}`);
    res.json(response.data.results); 
  } catch (error) {
    res.status(500).json({ error: 'Error fetching movie data from TMDB' });
  }
});


app.get('/api/movie/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(`${TMDB_URL}/movie/${movieId}?api_key=${API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching movie details from TMDB' });
  }
});


app.get('/api/trending', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_URL}/movie/popular?api_key=${API_KEY}`);
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching trending movies from TMDB' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

