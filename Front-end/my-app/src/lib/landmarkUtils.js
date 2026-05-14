/**
 * landmarkUtils.js — with Z depth support
 *
 * Converts Flask landmark pixel coordinates + Z depth into Three.js transforms.
 *
 * Landmark format from Flask (updated):
 *   Each landmark is now { x, y, z } instead of [x, y]
 *   x, y = pixel coordinates (origin top-left, y increases downward)
 *   z     = MediaPipe depth value, normalized to face size
 *             ~0   = face surface plane
 *             < 0  = behind face (ears, temples — negative Z = further back)
 *             > 0  = in front of face (nose tip)
 *
 * How Z is used for glasses:
 *   The Y rotation of the glasses model encodes how much the head is turned.
 *   We compute this from the Z difference between left and right face edges:
 *     - Face forward: left_z ≈ right_z (both at same depth)
 *     - Face turned right: left_z becomes more negative (left side goes back)
 *     - Face turned left: right_z becomes more negative
 *   This gives us the head yaw angle without needing a full 3D pose estimate.
 */

const CAMERA_Z   = 5;
const CAMERA_FOV = 50;   // degrees — must match TryOnCamera.jsx Canvas camera

function computeWorldWidth(canvasWidth, canvasHeight) {
  const fovRad        = (CAMERA_FOV * Math.PI) / 180;
  const visibleHeight = 2 * Math.tan(fovRad / 2) * CAMERA_Z;
  return visibleHeight * (canvasWidth / canvasHeight);
}

/**
 * Convert {x, y, z} landmark to Three.js world coords.
 * x is NEGATED to correct the double-mirror (CSS scaleX(-1) on video).
 * z is scaled for use as a Three.js Z offset.
 *
 * @param {{ x, y, z }} lm        - landmark from Flask
 * @param {number} frameWidth
 * @param {number} frameHeight
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @returns {{ x, y, z }}
 */
export function landmarkToWorld(lm, frameWidth, frameHeight, canvasWidth, canvasHeight) {
  const worldWidth  = computeWorldWidth(canvasWidth, canvasHeight);
  const worldHeight = worldWidth * (frameHeight / frameWidth);

  const nx = lm.x / frameWidth  - 0.5;
  const ny = lm.y / frameHeight - 0.5;

  return {
    x: -nx * worldWidth,    // negated: fix double-mirror
    y: -ny * worldHeight,   // negated: image y-down → Three.js y-up
    z:  lm.z * worldWidth,  // scale z same as x so units are consistent
  };
}

/**
 * Pixel distance between two landmarks → Three.js world units.
 * Uses only x/y (ignores z) — for measuring screen-space distances.
 */
export function pixelDistanceToWorld(a, b, frameWidth, canvasWidth, canvasHeight) {
  const dx        = a.x - b.x;
  const dy        = a.y - b.y;
  const pixelDist = Math.sqrt(dx * dx + dy * dy);
  const worldWidth = computeWorldWidth(canvasWidth, canvasHeight);
  return (pixelDist / frameWidth) * worldWidth;
}

/**
 * Compute glasses model transform from face landmarks (with Z depth).
 *
 * Returns:
 *   position  { x, y, z }  — world-space center (eye midpoint)
 *   scale     number        — world-space glasses width (face edge to face edge)
 *   rotationZ number        — Z rotation in radians (head tilt left/right)
 *   rotationY number        — Y rotation in radians (head turn, from Z depth)
 *
 * rotationY is the key new output — it makes the glasses model rotate
 * in 3D when the user turns their head, so the arms follow the ears.
 *
 * How rotationY is computed:
 *   MediaPipe z is normalized to face size. When the face turns right,
 *   the left face edge goes backward (z becomes more negative) and the
 *   right face edge comes forward (z becomes less negative).
 *   The difference left_z - right_z gives us the turn direction and amount.
 *   We scale by a factor to convert from MediaPipe z units to radians.
 */
export function computeGlassesTransform(
  landmarks,
  frameWidth,
  frameHeight,
  canvasWidth,
  canvasHeight,
) {
  const lfe = landmarks.left_face_edge;
  const rfe = landmarks.right_face_edge;
  const le  = landmarks.left_eye;
  const re  = landmarks.right_eye;

  // ── Position: eye midpoint in world space ─────────────────────────────────
  const eyeMid = {
    x: (le.x + re.x) / 2,
    y: (le.y + re.y) / 2,
    z: (le.z + re.z) / 2,
  };
  const position = landmarkToWorld(eyeMid, frameWidth, frameHeight, canvasWidth, canvasHeight);

  // ── Scale: face edge to face edge distance ────────────────────────────────
  const scale = pixelDistanceToWorld(lfe, rfe, frameWidth, canvasWidth, canvasHeight);

  // ── Z rotation: head tilt (from x/y of face edges) ───────────────────────
  const dx        = rfe.x - lfe.x;
  const dy        = rfe.y - lfe.y;
  const rotationZ = Math.atan2(-dy, dx);   // negated dy: image y-down → Three.js y-up

  // ── Y rotation: head turn (from Z depth difference) ──────────────────────
  // lfe.z and rfe.z are MediaPipe depth values (~0 = face surface)
  // When face turns right: lfe.z decreases (left side goes back)
  //                        rfe.z increases (right side comes forward)
  // zDiff > 0 → face turned right → positive Y rotation (clockwise from above)
  // zDiff < 0 → face turned left  → negative Y rotation
  //
  // Scale factor: MediaPipe z range is roughly -0.15 to +0.05 for a 90° turn.
  // We want ~PI/2 radians (90°) for that range → scale ≈ PI/2 / 0.15 ≈ 10.5
  // But glasses should be less extreme → use 6.0 for a natural look.
  const zDiff    = lfe.z - rfe.z;    // positive = face turned right
  const rotationY = zDiff * 6.0;    // tune this if head turn looks too extreme

  return { position, scale, rotationZ, rotationY };
}

/**
 * Compute shirt model transform from body measurements.
 * Unchanged — shirts don't need Z depth for basic placement.
 */
export function computeShirtTransform(
  measurements,
  frameWidth,
  frameHeight,
  canvasWidth,
  canvasHeight,
) {
  const worldWidth = computeWorldWidth(canvasWidth, canvasHeight);

  const nb = measurements.shoulder_mid;
  const nx = nb[0] / frameWidth  - 0.5;
  const ny = nb[1] / frameHeight - 0.5;

  const position = {
    x: -nx * worldWidth,
    y: -ny * worldWidth * (frameHeight / frameWidth),
  };

  const scaleX   = (measurements.shoulder_width / frameWidth)  * worldWidth;
  const scaleY   = (measurements.torso_height   / frameHeight) * worldWidth * (frameHeight / frameWidth);
  const rotation = -(measurements.torso_angle_deg * Math.PI) / 180;

  return { position, scaleX, scaleY, rotation };
}