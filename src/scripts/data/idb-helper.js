import { openDB } from 'idb';

const dbPromise = openDB('stories-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('stories')) {
      db.createObjectStore('stories', { keyPath: 'id' });
    }
  }
});

export const IDBHelper = {
  async saveStory(story) {
    const db = await dbPromise;
    await db.put('stories', story);
  },

  async getAllStories() {
    const db = await dbPromise;
    return await db.getAll('stories');
  },

  async deleteStory(id) {
    const db = await dbPromise;
    return await db.delete('stories', id);
  }
};