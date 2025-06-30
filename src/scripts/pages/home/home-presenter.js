import { clearUserSession } from '../../data/storyModel.js';
import StoryIdb from '../../utils/db.js';

export default class HomePresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async init() {
    this.view.render();

    try {
      const stories = await this.model.getStories();
      this.view.displayStories(stories);
      this.view.initMap(stories);
      this._initializeSaveButtons(stories);

    } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('User not found') || error.message.includes('unauthorized')) {
        clearUserSession();
        this.view.navigateTo('#/login');
      }
    }
  }

  _initializeSaveButtons(stories) {
    const saveButtons = document.querySelectorAll('.btn-save');
    saveButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const storyId = event.target.dataset.id;
        const storyToSave = stories.find(story => story.id === storyId);

        if (storyToSave) {
          try {
            await StoryIdb.putStory(storyToSave);
            alert(`Cerita "${storyToSave.name || storyToSave.title}" berhasil disimpan!`);
            event.target.innerText = 'Tersimpan';
            event.target.disabled = true;
          } catch (error) {
            console.error('Gagal menyimpan cerita ke IndexedDB:', error);
            alert('Gagal menyimpan cerita.');
          }
        }
      });
    });
  }

  destroy() {
    this.view.cleanup();
  }
}
