export class HomeModel {
  constructor(storyService) {
    this.storyService = storyService;
  }

  async getStories() {
    return await this.storyService.getStories();
  }
}