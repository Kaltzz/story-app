import L from 'leaflet';
import { postStory } from '../../data/storyModel.js';

export class FormPresenter {
  constructor(view) {
    this.view = view;
    this.lat = null;
    this.lng = null;
  }

  async init() {
    this.view.render();
    this.view.initElements();
    await this.view.startCamera();
    this.view.onCapture(() => this.view.captureImage());
    this.view.onSubmit(e => this.handleSubmit(e));
    this.initMap();
  }

  initMap() {
    const map = L.map('map').setView([-2.5, 118], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    map.on('click', e => {
      this.lat = e.latlng.lat;
      this.lng = e.latlng.lng;
      L.marker([this.lat, this.lng]).addTo(map)
        .bindPopup('Lokasi terpilih').openPopup();
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const data = this.view.getFormData();

    if (!data.image) {
      return this.view.showAlert("Silakan ambil gambar terlebih dahulu.");
    }

    if (!this.lat || !this.lng) {
      return this.view.showAlert("Silakan pilih lokasi pada peta.");
    }

    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("lat", this.lat);
    formData.append("lon", this.lng);
    formData.append("photo", this.dataURItoBlob(data.image), 'foto.jpg');

    try {
      const result = await postStory(formData);

      if (result.error) {
        throw new Error(result.message);
      }

      this.view.showSuccess("Cerita berhasil dikirim!");
      this.view.navigateTo("#/" );
    } catch (error) {
      console.error("Gagal mengirim cerita:", error);
      this.view.showAlert("Gagal mengirim cerita. Periksa koneksi atau data Anda.");
    }
  }

  dataURItoBlob(uri) {
    if (!uri || !uri.includes(',')) {
      throw new Error("Data gambar tidak valid.");
    }
    const byte = atob(uri.split(',')[1]);
    const mime = uri.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byte.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byte.length; i++) {
      ia[i] = byte.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
  }

  destroy() {
    this.view.cleanup();
  }
}