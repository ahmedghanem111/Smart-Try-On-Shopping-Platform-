/**
 * landmarkUtils.js  — Fixed
 *
 * Converts Flask landmark pixel coordinates into Three.js world-space values.
 *
 * Three bugs fixed:
 *
 *  Bug 1 — Double mirror
 *    The <video> is mirrored in CSS with scaleX(-1). sendFrame ALSO mirrors
 *    the canvas before sending to Flask. So Flask landmarks are in the
 *    correctly-mirrored space, but the Three.js Canvas sits on top of the
 *    CSS-mirrored video — making the x axis appear flipped.
 *    Fix: negate x when converting pixel → world so the 3D model tracks
 *    the mirrored video correctly.
 *
 *  Bug 2 — Wrong world scale
 *    The old WORLD_SCALE=4.0 was a guess. The Three.js camera (z=5, fov=50)
 *    has a specific visible world width at z=0. We must compute the actual
 *    frustum width and use that as our scale factor so landmarks map to the
 *    correct screen position regardless of aspect ratio.
 *    Fix: compute world width from camera fov and distance.
 *         worldWidth = 2 * tan(fov/2) * cameraZ * aspectRatio
 *
 *  Bug 3 — Wrong vertical anchor for glasses
 *    glasses position was anchored to nose_bridge, which sits BELOW the eyes.
 *    Real glasses sit centered on the eyes (midpoint of left+right eye).
 *    Fix: use eye midpoint as the vertical anchor for glasses position.
 */

// ── Three.js camera parameters (must match TryOnCamera.jsx Canvas camera) ────
// camera={{ position: [0, 0, 5], fov: 50 }}
const CAMERA_Z   = 5;
const CAMERA_FOV = 50;  // degrees

/**
 * Compute the visible world width at z=0 for the given camera and canvas size.
 * This is the key number — it maps the full frame width to world units correctly.
 *
 * Formula: visibleHeight = 2 * tan(fov/2) * cameraZ
 *          visibleWidth  = visibleHeight * aspectRatio
 *
 * @param {number} canvasWidth   - actual canvas pixel width (from canvas.width)
 * @param {number} canvasHeight  - actual canvas pixel height
 * @returns {number} world width in Three.js units
 */
function computeWorldWidth(canvasWidth, canvasHeight) {
  const fovRad         = (CAMERA_FOV * Math.PI) / 180;
  const visibleHeight  = 2 * Math.tan(fovRad / 2) * CAMERA_Z;
  const aspectRatio    = canvasWidth / canvasHeight;
  return visibleHeight * aspectRatio;
}

/**
 * Convert a single [x, y] pixel point to Three.js [x, y] world coords.
 *
 * Fixes applied:
 *  - x is NEGATED to correct the double-mirror issue (Bug 1)
 *  - worldWidth computed from camera frustum instead of fixed WORLD_SCALE (Bug 2)
 *
 * @param {number[]} point        - [x, y] in pixels
 * @param {number}   frameWidth   - width of the camera frame Flask used
 * @param {number}   frameHeight  - height of the camera frame Flask used
 * @param {number}   canvasWidth  - actual Three.js canvas width in pixels
 * @param {number}   canvasHeight - actual Three.js canvas height in pixels
 * @returns {{ x: number, y: number }}
 */
export function pixelToWorld(point, frameWidth, frameHeight, canvasWidth, canvasHeight) {
  const worldWidth  = computeWorldWidth(canvasWidth, canvasHeight);
  const worldHeight = worldWidth * (frameHeight / frameWidth);

  // Normalize to [-0.5, +0.5]
  const nx = point[0] / frameWidth  - 0.5;
  const ny = point[1] / frameHeight - 0.5;

  return {
    x: -nx * worldWidth,    // NEGATED — fixes double-mirror bug
    y: -ny * worldHeight,   // negated — image y-down to Three.js y-up
  };
}

/**
 * Pixel distance → Three.js world units.
 * Used to compute the scale of the 3D model.
 *
 * @param {number[]} a            - [x, y] pixel point
 * @param {number[]} b            - [x, y] pixel point
 * @param {number}   frameWidth   - Flask frame width
 * @param {number}   canvasWidth  - Three.js canvas width
 * @param {number}   canvasHeight - Three.js canvas height
 * @returns {number} distance in world units
 */
export function pixelDistanceToWorld(a, b, frameWidth, canvasWidth, canvasHeight) {
  const dx        = a[0] - b[0];
  const dy        = a[1] - b[1];
  const pixelDist = Math.sqrt(dx * dx + dy * dy);
  const worldWidth = computeWorldWidth(canvasWidth, canvasHeight);
  return (pixelDist / frameWidth) * worldWidth;
}

/**
 * Compute the glasses model transform from face landmarks.
 *
 * Fix 3 applied: position uses eye MIDPOINT (not nose_bridge) as vertical anchor.
 * The eye midpoint is where the glasses frame crosses the face horizontally —
 * exactly where a real pair of glasses rests.
 *
 * We still use nose_bridge x for the horizontal center because it sits between
 * the eyes naturally, but we take the y from the eye midpoint.
 *
 * @param {object} landmarks    - landmarks from Flask (pixel coords)
 * @param {number} frameWidth   - Flask frame width
 * @param {number} frameHeight  - Flask frame height
 * @param {number} canvasWidth  - Three.js canvas pixel width
 * @param {number} canvasHeight - Three.js canvas pixel height
 * @returns {{ position: {x,y}, scale: number, rotation: number }}
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
  const nb  = landmarks.nose_bridge;

  // ── Position ─────────────────────────────────────────────────────────────
  // x: horizontal center of nose_bridge (sits between eyes)
  // y: midpoint of both eyes — glasses rest HERE, not at the nose bridge (Bug 3)
  const eyeMidX = (le[0] + re[0]) / 2;
  const eyeMidY = (le[1] + re[1]) / 2;

  const position = pixelToWorld(
    [eyeMidX, eyeMidY],
    frameWidth, frameHeight,
    canvasWidth, canvasHeight,
  );

  // ── Scale ─────────────────────────────────────────────────────────────────
  // Distance between face edges = full glasses width in world units
  const scale = pixelDistanceToWorld(
    lfe, rfe,
    frameWidth,
    canvasWidth, canvasHeight,
  );

  // ── Rotation ──────────────────────────────────────────────────────────────
  // Angle of the left→right face edge line = head tilt
  // Note: negate dy because image y is downward, Three.js y is upward
  const dx       = rfe[0] - lfe[0];
  const dy       = rfe[1] - lfe[1];
  const rotation = Math.atan2(-dy, dx);   // negated dy for correct tilt direction

  return { position, scale, rotation };
}

/**
 * Compute the shirt model transform from body measurements.
 *
 * @param {object} measurements  - measurements from Flask shirt endpoint
 * @param {number} frameWidth
 * @param {number} frameHeight
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @returns {{ position: {x,y}, scaleX: number, scaleY: number, rotation: number }}
 */
export function computeShirtTransform(
  measurements,
  frameWidth,
  frameHeight,
  canvasWidth,
  canvasHeight,
) {
  const position = pixelToWorld(
    measurements.shoulder_mid,
    frameWidth, frameHeight,
    canvasWidth, canvasHeight,
  );

  const worldWidth = computeWorldWidth(canvasWidth, canvasHeight);

  const scaleX = (measurements.shoulder_width / frameWidth)  * worldWidth;
  const scaleY = (measurements.torso_height   / frameHeight) * worldWidth * (frameHeight / frameWidth);

  // torso_angle_deg: negate because Three.js Z rotation is counter-clockwise
  const rotation = -(measurements.torso_angle_deg * Math.PI) / 180;

  return { position, scaleX, scaleY, rotation };
}