// Verifies a file is actually one of the image formats we accept by
// checking its magic bytes (file signature), instead of trusting the
// browser-supplied `file.type` / filename extension — both of which are
// trivially spoofable by a client. In particular this rejects SVG (an
// XML/text format that can carry a <script> tag — a stored-XSS vector if
// ever opened directly rather than rendered as <img>) even if someone
// labels it "image/svg+xml" or renames it to cover.jpg.
export function detectImageType(buffer: Buffer): "jpeg" | "png" | "gif" | "webp" | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpeg";

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }

  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return "gif";
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "webp";
  }

  return null;
}

export function isAllowedImage(buffer: Buffer): boolean {
  return detectImageType(buffer) !== null;
}
