/*
 * Front‑end logic for the Gstanzl website.
 *
 * This script loads song data from the local JSON file, initialises
 * a Fuse.js search index and renders the search results dynamically.
 * Users can filter Gstanzln by title, lyrics, tags, region, mood or
 * dialect in real time.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch the songs data
  fetch('songs.json')
    .then((response) => response.json())
    .then((songs) => {
      // Initialise Fuse.js for fuzzy search
      const fuse = new Fuse(songs, {
        includeScore: false,
        keys: ['title', 'lyrics', 'tags', 'region', 'mood', 'dialect'],
        threshold: 0.4,
      });

      const searchInput = document.getElementById('searchInput');
      const resultsContainer = document.getElementById('results');

      // Render a list of songs to the page
      function render(list) {
        resultsContainer.innerHTML = '';
        list.forEach((song) => {
          const card = document.createElement('div');
          card.className = 'card';

          const title = document.createElement('h3');
          title.textContent = song.title;
          card.appendChild(title);

          const meta = document.createElement('p');
          meta.textContent = `${song.region} · ${song.mood}`;
          card.appendChild(meta);

          const lyrics = document.createElement('p');
          lyrics.textContent = song.lyrics.join(' ');
          card.appendChild(lyrics);

          const tagsDiv = document.createElement('div');
          tagsDiv.className = 'tags';
          song.tags.forEach((tag) => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            tagsDiv.appendChild(span);
          });
          card.appendChild(tagsDiv);

          resultsContainer.appendChild(card);
        });
      }

      // Initial render
      render(songs);

      // Update the list on each search input
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (!query) {
          render(songs);
          return;
        }
        const results = fuse.search(query).map((r) => r.item);
        render(results);
      });
    })
    .catch((error) => {
      console.error('Error loading songs:', error);
    });
});
