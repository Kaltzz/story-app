class FormView {
  render() {
    document.getElementById('app-view').innerHTML = this.getTemplate();
  }

  getTemplate() {
    return `
      <section class="form-container">
        <h2>Tambah Cerita</h2>
        <form id="story-form">
          <div class="form-group">
            <label for="title">Judul</label>
            <input type="text" id="title" name="title" required />
          </div>

          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" required></textarea>
          </div>

          <div class="form-group">
            <label>Ambil Gambar</label>
            <video id="video" autoplay playsinline width="200"></video>
            <button type="button" id="capture">Ambil Gambar</button>
            <canvas id="canvas" style="display:none;"></canvas>
            <input type="hidden" id="image" name="image" />
          </div>

          <div class="form-group">
            <label for="map">Pilih Lokasi</label>
            <div id="map" style="height:300px;"></div>
          </div>

          <button type="submit">Kirim</button>
        </form>
      </section>
    `;
  }

  initElements() {
    this.form = document.getElementById('story-form');
    this.video = document.getElementById('video');
    this.canvas = document.getElementById('canvas');
    this.imageInput = document.getElementById('image');
    this.captureBtn = document.getElementById('capture');
    this.titleInput = document.getElementById('title');
    this.descriptionInput = document.getElementById('description');
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.srcObject = this.stream;
      await new Promise(resolve => {
        this.video.onloadedmetadata = () => {
          this.video.play();
          resolve();
        };
      });
    } catch (err) {
      this.showAlert('Gagal mengakses kamera: ' + err.message);
    }
  }

  captureImage() {
    if (!this.video || !this.canvas || this.video.videoWidth === 0) {
      this.showAlert("Kamera belum siap. Coba lagi.");
      return;
    }

    const aspectRatio = this.video.videoWidth / this.video.videoHeight;
    const maxWidth = 400;

    this.canvas.width = maxWidth;
    this.canvas.height = maxWidth / aspectRatio;

    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.maxWidth = `${maxWidth}px`;

    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    const base64 = this.canvas.toDataURL('image/jpeg', 0.8);
    this.imageInput.value = base64;

    this.stopCamera();
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  cleanup() {
    this.stopCamera();
  }

  onCapture(callback) {
    if (this.captureBtn) {
      this.captureBtn.onclick = callback;
    }
  }

  onSubmit(callback) {
    if (this.form) {
      this.form.onsubmit = callback;
    }
  }

  getFormData() {
    return {
      title: this.titleInput?.value.trim() || '',
      description: this.descriptionInput?.value.trim() || '',
      image: this.imageInput?.value || ''
    };
  }

  showAlert(msg) {
    alert(msg);
  }

  showSuccess(msg) {
    alert(msg);
  }

  navigateTo(path) {
    location.hash = path;
  }
}

export default FormView;
