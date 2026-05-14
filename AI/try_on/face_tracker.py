"""
Phase 3 — Face Tracker (updated for Phase 5 + 3D improvements)
Uses MediaPipe FaceLandmarker (Tasks API) to detect face landmarks in real time.

Updated landmarks for improved glasses placement:
  - Eye centers (inner + outer midpoints)
  - Nose bridge MID (168) — better vertical anchor than top (6)
  - Face edges (234, 454) — temple anchor points, encode head rotation
  - Arm anchors (162, 93, 389, 323) — hinge and ear tip for glasses arms

Z coordinate added to every landmark:
  MediaPipe gives a Z value for each face landmark representing approximate depth.
  Z=0 is the face surface plane, negative = further from camera (behind face),
  positive = closer to camera (in front of face).
  The frontend uses this to tilt the 3D glasses model correctly when the
  person turns their head — without Z we only know left/right/up/down,
  not how far each point is from the camera.
"""

import os
import cv2
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python.vision import FaceLandmarker, FaceLandmarkerOptions, RunningMode


# ── Landmark indices ──────────────────────────────────────────────────────────
LEFT_EYE_INNER    = 133
LEFT_EYE_OUTER    = 33
RIGHT_EYE_INNER   = 362
RIGHT_EYE_OUTER   = 263
NOSE_BRIDGE_TOP   = 6      # very top of nose bridge
NOSE_BRIDGE_MID   = 168    # middle of nose bridge — better anchor for glasses
LEFT_FACE_EDGE    = 234    # leftmost face point — left cheekbone
RIGHT_FACE_EDGE   = 454    # rightmost face point — right cheekbone
LEFT_ARM_HINGE    = 162    # left temple — where arm leaves the frame
LEFT_EAR_TIP      = 93     # left tragus — where arm hooks behind ear
RIGHT_ARM_HINGE   = 389    # right temple — where arm leaves the frame
RIGHT_EAR_TIP     = 323    # right tragus — where arm hooks behind ear
# ─────────────────────────────────────────────────────────────────────────────

_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "face_landmarker.task")


class FaceTracker:
    def __init__(self, detection_confidence=0.7, tracking_confidence=0.7):
        model_path = os.path.abspath(_MODEL_PATH)
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"face_landmarker.task not found at: {model_path}\n"
                "Download it from: https://storage.googleapis.com/mediapipe-models/"
                "face_landmarker/face_landmarker/float16/1/face_landmarker.task"
            )

        base_options = mp_python.BaseOptions(model_asset_path=model_path)
        options = FaceLandmarkerOptions(
            base_options=base_options,
            running_mode=RunningMode.IMAGE,
            num_faces=1,
            min_face_detection_confidence=detection_confidence,
            min_face_presence_confidence=detection_confidence,
            min_tracking_confidence=tracking_confidence,
            output_face_blendshapes=False,
            output_facial_transformation_matrixes=False,
        )
        self.landmarker = FaceLandmarker.create_from_options(options)

    def detect(self, frame):
        """Run face detection on a single BGR frame."""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image  = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        return self.landmarker.detect(mp_image)

    def get_landmarks(self, results, frame_width, frame_height):
        """
        Extract landmarks needed for glasses placement.

        Each landmark is now a dict with x, y (pixels) AND z (depth):
          {
            "left_eye":        {"x": 265, "y": 200, "z": -0.034},
            "right_eye":       {"x": 375, "y": 200, "z": -0.031},
            "nose_bridge":     {"x": 320, "y": 220, "z":  0.012},
            "left_face_edge":  {"x": 160, "y": 210, "z": -0.082},
            "right_face_edge": {"x": 480, "y": 210, "z": -0.079},
            "left_arm_hinge":  {"x": 180, "y": 208, "z": -0.071},
            "left_ear_tip":    {"x": 130, "y": 230, "z": -0.120},
            "right_arm_hinge": {"x": 460, "y": 208, "z": -0.068},
            "right_ear_tip":   {"x": 510, "y": 230, "z": -0.115},
          }

        Z coordinate meaning:
          - MediaPipe normalizes Z relative to the face size
          - Z ≈ 0   → on the face surface plane
          - Z < 0   → behind/into the face (ears, sides of head)
          - Z > 0   → in front of the face (tip of nose)
          - The ear tips have large negative Z because they are
            on the SIDE of the head, far from the camera

        The frontend uses Z to:
          1. Compute the glasses model's Y rotation (head turn left/right)
             by comparing Z of left_face_edge vs right_face_edge
          2. Correctly position the arm endpoints in 3D space
          3. Determine how much perspective foreshortening to apply

        Returns None if no face is detected.
        """
        if not results or not results.face_landmarks:
            return None

        lm = results.face_landmarks[0]

        def to_pixel(idx):
            """
            Convert one landmark to pixel x/y + raw z depth.
            x and y are multiplied by frame dimensions to get pixel coords.
            z is kept as the raw MediaPipe value (not scaled by frame size)
            because z is already normalized relative to face size.
            """
            return {
                "x": int(lm[idx].x * frame_width),
                "y": int(lm[idx].y * frame_height),
                "z": round(float(lm[idx].z), 4),   # 4 decimal places is enough
            }

        def midpoint_3d(a_idx, b_idx):
            """
            Average x, y, z of two landmarks.
            Used for eye centers — we want the center of inner and outer eye corners
            in all 3 dimensions.
            """
            a = lm[a_idx]
            b = lm[b_idx]
            return {
                "x": int(((a.x + b.x) / 2) * frame_width),
                "y": int(((a.y + b.y) / 2) * frame_height),
                "z": round(float((a.z + b.z) / 2), 4),
            }

        return {
            # ── Core glasses anchors ──────────────────────────────────────────
            "left_eye":        midpoint_3d(LEFT_EYE_INNER,  LEFT_EYE_OUTER),
            "right_eye":       midpoint_3d(RIGHT_EYE_INNER, RIGHT_EYE_OUTER),
            "nose_bridge":     to_pixel(NOSE_BRIDGE_MID),
            "left_face_edge":  to_pixel(LEFT_FACE_EDGE),
            "right_face_edge": to_pixel(RIGHT_FACE_EDGE),
            # ── Arm anchors ───────────────────────────────────────────────────
            # hinge = where the arm leaves the frame (at the temple)
            # ear_tip = where the arm ends (at the tragus, behind ear)
            # Z difference between hinge and ear_tip tells the frontend
            # how far the arm needs to extend back in 3D space
            "left_arm_hinge":  to_pixel(LEFT_ARM_HINGE),
            "left_ear_tip":    to_pixel(LEFT_EAR_TIP),
            "right_arm_hinge": to_pixel(RIGHT_ARM_HINGE),
            "right_ear_tip":   to_pixel(RIGHT_EAR_TIP),
        }

    def draw_mesh(self, frame, results):
        """Draw all face landmark dots for visual debugging."""
        if results and results.face_landmarks:
            h, w = frame.shape[:2]
            for lm_list in results.face_landmarks:
                for lm in lm_list:
                    x, y = int(lm.x * w), int(lm.y * h)
                    cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)
        return frame

    def draw_key_points(self, frame, landmarks):
        """
        Draw our key points as colored circles.

        Note: landmarks are now dicts with x/y/z keys, not tuples.
        We extract (x, y) for drawing — z is not visible in 2D.

        Color coding:
          Cyan    = eye centers       (lens anchors)
          Magenta = nose bridge       (vertical anchor)
          Yellow  = face edges        (temple anchors)
          Orange  = arm hinges        (where arm starts)
          Red     = ear tips          (where arm ends)
        """
        if not landmarks:
            return frame

        colors = {
            "left_eye":        (255, 255, 0),
            "right_eye":       (255, 255, 0),
            "nose_bridge":     (255, 0, 255),
            "left_face_edge":  (0, 255, 255),
            "right_face_edge": (0, 255, 255),
            "left_arm_hinge":  (0, 165, 255),
            "right_arm_hinge": (0, 165, 255),
            "left_ear_tip":    (0, 0, 255),
            "right_ear_tip":   (0, 0, 255),
        }

        for name, lm in landmarks.items():
            # Extract pixel point — landmarks are now dicts
            pt = (lm["x"], lm["y"])
            cv2.circle(frame, pt, 6, colors[name], -1)
            cv2.circle(frame, pt, 6, (0, 0, 0), 1)
            # Show name and Z value for debugging
            label = f"{name.replace('_', ' ')} z={lm['z']:.3f}"
            cv2.putText(frame, label, (pt[0] + 8, pt[1]),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.28, (255, 255, 255), 1)

        def pt(name):
            return (landmarks[name]["x"], landmarks[name]["y"])

        # Eye line
        cv2.line(frame, pt("left_eye"), pt("right_eye"), (255, 255, 0), 2)
        # Face edge line (temple width)
        cv2.line(frame, pt("left_face_edge"), pt("right_face_edge"), (0, 255, 255), 1)
        # Arm lines: hinge → ear tip
        cv2.line(frame, pt("left_arm_hinge"),  pt("left_ear_tip"),  (0, 165, 255), 2)
        cv2.line(frame, pt("right_arm_hinge"), pt("right_ear_tip"), (0, 165, 255), 2)

        return frame

    def close(self):
        """Release MediaPipe resources."""
        self.landmarker.close()