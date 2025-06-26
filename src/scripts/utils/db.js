import { openDB } from 'idb';

const DATABASE_NAME = 'story-app-db';
const DATABASE_VERSION = 1;

const db = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database, oldVersion, newVersion) {
    if (oldVersion === 0) {
      database.createObjectStore('stories', { keyPath: 'id' });
      database.createObjectStore('liked-stories', { keyPath: 'id' });
    }
  },
});

const StoryIdb = {
  async getStory(id) {
    return (await db).get('stories', id);
  },
  async getAllStories() {
    return (await db).getAll('stories');
  },
  async putStory(story) {
    return (await db).put('stories', story);
  },
  async deleteStory(id) {
    return (await db).delete('stories', id);
  },
  async putLikedStory(story) {
    return (await db).put('liked-stories', story);
  },
  async getLikedStory(id) {
    return (await db).get('liked-stories', id);
  },
  async getAllLikedStories() {
    return (await db).getAll('liked-stories');
  },
  async deleteLikedStory(id) {
    return (await db).delete('liked-stories', id);
  },
};

export default StoryIdb;
