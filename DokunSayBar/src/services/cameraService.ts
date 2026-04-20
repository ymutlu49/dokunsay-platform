/**
 * Camera Service
 * Manages camera access via getUserMedia for AR features.
 */

export function checkCameraSupport(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

export async function requestCamera(
  facingMode: "user" | "environment" = "environment"
): Promise<MediaStream> {
  if (!checkCameraSupport()) {
    throw new Error("Camera not supported on this device");
  }
  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: facingMode },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  });
}

export function stopCamera(stream: MediaStream): void {
  stream.getTracks().forEach((track) => track.stop());
}

export function getVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): ImageData | null {
  if (video.readyState < 2) return null;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function getDownscaledFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  targetWidth = 320,
  targetHeight = 240
): ImageData | null {
  if (video.readyState < 2) return null;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}
