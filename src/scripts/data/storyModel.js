const API_URL = 'https://story-api.dicoding.dev/v1/stories';

export function getToken() {
  return localStorage.getItem('token');
}

export function clearUserSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function getStories() {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Unauthorized: Please login first');
    }

    const res = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('User not found');
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    if (json.error) {
      throw new Error(json.message);
    }

    return json.listStory.map(story => ({
      title: story.name,
      description: story.description,
      author: story.name,
      imageUrl: story.photoUrl,
      createdAt: story.createdAt,
      lat: story.lat,
      lng: story.lon
    }));
  } catch (err) {
    console.error('Gagal memuat data:', err);
    throw err; // Re-throw untuk ditangani oleh presenter
  }
}

export async function postStory(formData) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Silakan login terlebih dahulu');
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const json = await res.json();
    if (!res.ok || json.error) {
      throw new Error(json.message || 'Terjadi kesalahan saat mengirim data');
    }

    return json;
  } catch (err) {
    console.error('Gagal mengirim data:', err);
    throw err;
  }
}
