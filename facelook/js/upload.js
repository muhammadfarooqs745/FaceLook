/**
 * FACELOOK FILE UPLOAD & MEDIA PROCESSOR
 */

const Upload = {
  // Validate file size and type
  validateMedia(file, maxMb = 15) {
    if (!file) return { valid: false, error: "No file selected." };

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: "Unsupported format. Use JPG, PNG, WEBP, GIF, or MP4." };
    }

    if (file.size > maxMb * 1024 * 1024) {
      return { valid: false, error: `File exceeds maximum allowed size of ${maxMb}MB.` };
    }

    return { valid: true };
  },

  // Read file as Base64 data URL
  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
};

window.Upload = Upload;
