import { clearUserSession } from '../../data/storyModel.js';

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
    } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('User not found') || error.message.includes('unauthorized')) {
        clearUserSession();
        this.view.navigateTo('#/login');
      }
    }
  }

  destroy() {
    this.view.cleanup();
  }
}
