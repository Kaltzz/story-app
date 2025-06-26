import StoryIdb from '../../utils/db.js';

const SavedStories = {
  async render() {
    return `
      <div class="saved-stories">
        <h2>Cerita Tersimpan</h2>
        <div id="saved-stories-container" class="stories-grid"></div>
      </div>
    `;
  },

  async afterRender() {
    const stories = await StoryIdb.getAllStories();
    const container = document.querySelector('#saved-stories-container');

    if (stories.length === 0) {
      container.innerHTML = '<p>Belum ada cerita yang disimpan</p>';
      return;
    }

    container.innerHTML = stories.map((story) => `
      <div class="story-card" id="story-${story.id}">
        <img src="${story.photoUrl || story.imageUrl}" alt="${story.description}" class="story-image">
        <div class="story-content">
          <h3>${story.title}</h3>
          <p class="author">Oleh: ${story.author || 'Anonim'}</p>
          <p class="description">${story.description}</p>
          <p class="date">Dibuat: ${new Date(story.createdAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <div class="story-actions">
            <button class="btn-delete" data-id="${story.id}">Hapus</button>
          </div>
        </div>
      </div>
    `).join('');

    this._initializeDeleteButtons();
  },

  _initializeDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const storyId = event.target.dataset.id;
        
        if (confirm('Apakah Anda yakin ingin menghapus cerita ini?')) {
          await StoryIdb.deleteStory(storyId);
          const storyElement = document.querySelector(`#story-${storyId}`);
          storyElement.remove();

          // Periksa apakah masih ada cerita tersisa
          const remainingStories = await StoryIdb.getAllStories();
          if (remainingStories.length === 0) {
            document.querySelector('#saved-stories-container').innerHTML = 
              '<p>Belum ada cerita yang disimpan</p>';
          }
        }
      });
    });
  }
};

export default SavedStories;