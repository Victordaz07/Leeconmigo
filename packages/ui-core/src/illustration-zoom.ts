/** Image-space geometry shared by touch gestures, buttons and orientation changes. */
export interface ArtSize { width: number; height: number }
export interface ArtPose { zoom: number; x: number; y: number }
export const MAX_ART_ZOOM = 4;
export const INITIAL_ART_POSE: ArtPose = { zoom: 1, x: 0, y: 0 };
export function fitArt(image: ArtSize, viewport: ArtSize): ArtSize {
  const scale = Math.min(viewport.width / image.width, viewport.height / image.height);
  return { width: image.width * scale, height: image.height * scale };
}
export function constrainArt(pose: ArtPose, fitted: ArtSize, viewport: ArtSize): ArtPose {
  const zoom = Math.max(1, Math.min(MAX_ART_ZOOM, pose.zoom));
  const limitX = Math.max(0, (fitted.width * zoom - viewport.width) / 2);
  const limitY = Math.max(0, (fitted.height * zoom - viewport.height) / 2);
  return { zoom, x: Math.max(-limitX, Math.min(limitX, pose.x)), y: Math.max(-limitY, Math.min(limitY, pose.y)) };
}
/** Keep the point beneath the fingers still while they spread and move. Points are relative to viewport center. */
export function pinchArt(start: ArtPose, from: { x: number; y: number }, to: { x: number; y: number }, ratio: number): ArtPose {
  const zoom = Math.max(1, Math.min(MAX_ART_ZOOM, start.zoom * ratio));
  return { zoom, x: to.x - (from.x - start.x) * zoom / start.zoom, y: to.y - (from.y - start.y) * zoom / start.zoom };
}
