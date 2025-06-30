import L from 'leaflet';


export default class HomeView {
  constructor() {
    this.map = null;
    this.stories = [];
  }

  renderTemplate() {
    return `
      <section class="container">
        <h2>Daftar Cerita</h2>
        <div id="story-list" class="story-grid"></div>
        <div id="story-map" style="height: 400px;"></div>
      </section>
    `;
  }

  render() {
    document.getElementById('app-view').innerHTML = this.renderTemplate();
  }

  displayStories(stories) {
    this.stories = stories;
    const storyList = document.getElementById('story-list');
    storyList.innerHTML = stories.map(story => `
      <article class="story-card">
        <img src="${story.imageUrl || story.photoUrl}" alt="Gambar untuk cerita ${story.title || story.name}" class="story-image">
        <h3>${story.title || story.name}</h3>
        <p class="author">Oleh: ${story.author || story.name}</p>
        <p class="description">${story.description}</p>
        <p class="date">Dibuat: ${new Date(story.createdAt).toLocaleDateString('id-ID', {
          year: 'numeric', month: 'long', day: 'numeric'
        })}</p>
        <div class="story-actions">
          <button class="btn-save" data-id="${story.id}">Simpan untuk Offline</button>
        </div>
      </article>
    `).join('');
  }


  initMap(stories) {
    const mapContainer = document.getElementById('story-map');
    if (!mapContainer) return;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.map = L.map(mapContainer).setView([-2.5, 118], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    stories.forEach(story => {
      if (story.lat && story.lng) {
        L.marker([story.lat, story.lng])
          .bindPopup(`<h4>${story.title}</h4><p>${story.description}</p>`)
          .addTo(this.map);
      }
    });
  }

  navigateTo(path) {
    location.hash = path;
  }

  cleanup() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}