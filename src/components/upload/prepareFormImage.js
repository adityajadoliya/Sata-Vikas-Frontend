const MAX_DIMENSION = 1800;
const JPEG_QUALITY = 0.82;

/** Produces an OCR-friendly image without uploading a phone camera's full-resolution photo. */
export async function prepareFormImage(file) {
  if (!file?.type?.startsWith('image/') || file.size <= 900 * 1024) return file;

  let objectUrl;
  try {
    objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d', { alpha: false })?.drawImage(image, 0, 0, width, height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
    if (!blob || blob.size >= file.size) return file;

    const name = (file.name || 'form-photo').replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg', lastModified: file.lastModified });
  } catch {
    return file;
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

/** Fill only blank fields so OCR never overwrites an operator's in-progress edits. */
export function fillBlankValues(current, extracted) {
  if (Array.isArray(current) && Array.isArray(extracted)) {
    return current.map((value, index) => fillBlankValues(value, extracted[index]));
  }
  if (current && extracted && typeof current === 'object' && typeof extracted === 'object') {
    const result = { ...current };
    for (const [key, value] of Object.entries(extracted)) {
      result[key] = key in current ? fillBlankValues(current[key], value) : value;
    }
    return result;
  }
  return current === '' || current === null || current === undefined ? extracted : current;
}
