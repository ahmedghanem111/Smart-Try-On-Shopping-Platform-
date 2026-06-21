"""
Face Tracker — Phase 5/6
Uses MediaPipe FaceLandmarker (Tasks API).

Ear tip strategy (critical for glasses arm placement):
  No single MediaPipe landmark sits reliably "behind" the hinge in the
  direction the arm needs to go. Landmark-based ear tips always end up
  too low (jaw area) or co-located with the hinge (cheekbone area),
  giving a near-zero or downward hinge→ear vector.

  Fix: compute ear_tip ANALYTICALLY from face geometry:
    1. Take the face-edge direction vector (left_face_edge → right_face_edge).
       This is the horizontal axis of the face.
    2. Extend outward from the hinge along that axis by arm_length.
       arm_length = face_width * ARM_REACH_FACTOR (tunable).
    3. Add a small upward offset along the perpendicular face-up vector
       so the arm angles slightly up toward the top of the ear
       (realistic glasses placement).

  Because the face direction vector is derived from the actual landmark
  positions in image space, it naturally accounts for both mirrored and
  unmirrored frames — no separate mirroring assumption needed.

ARM_REACH_FACTOR = 0.55 means the arm extends 55% of face width beyond
the hinge. Increase to push the arm endpoint further behind the head.

ARM_UP_FRACTION = 0.15 controls how much the arm tip angles upward along
the face-perpendicular axis. 0.15 = 15% of arm_reach pushed toward the
forehead (slight upward angle toward the ear).
"""

import os
import math
import cv2
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python.vision import FaceLandmarker, FaceLandmarkerOptions, RunningMode


# ── Landmark indices ──────────────────────────────────────────────────────────
LEFT_EYE_INNER    = 133
LEFT_EYE_OUTER    = 33
RIGHT_EYE_INNER   = 362
RIGHT_EYE_OUTER   = 263
NOSE_BRIDGE_MID   = 168
LEFT_FACE_EDGE    = 234   # leftmost cheekbone point  — horizontal face axis
RIGHT_FACE_EDGE   = 454   # rightmost cheekbone point — horizontal face axis
LEFT_ARM_HINGE    = 162   # where left arm leaves the frame
RIGHT_ARM_HINGE   = 389   # where right arm leaves the frame
# ─────────────────────────────────────────────────────────────────────────────

# How far beyond the hinge the arm tip is placed, as a fraction of face width.
# 0.5 = arm extends half a face-width outward from the hinge.
# Increase if arms look too short, decrease if they overshoot.
ARM_REACH_FACTOR = 0.50   # fraction of face_width; arm extends this far outward from hinge
ARM_UP_FRACTION  = 0.15   # fraction of arm_reach; slight upward angle toward ear

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
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image  = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        return self.landmarker.detect(mp_image)

    def get_landmarks(self, results, frame_width, frame_height):
        """
        Extract landmarks for glasses placement.

        ear_tip landmarks are computed analytically from the face direction
        vector so the arm always points correctly outward along the face
        plane, regardless of head tilt, turn, or image mirroring.
        """
        if not results or not results.face_landmarks:
            return None

        lm = results.face_landmarks[0]

        def to_pixel(idx):
            return {
                "x": int(lm[idx].x * frame_width),
                "y": int(lm[idx].y * frame_height),
                "z": round(float(lm[idx].z), 4),
            }

        def midpoint_3d(a_idx, b_idx):
            a = lm[a_idx]; b = lm[b_idx]
            return {
                "x": int(((a.x + b.x) / 2) * frame_width),
                "y": int(((a.y + b.y) / 2) * frame_height),
                "z": round(float((a.z + b.z) / 2), 4),
            }

        lfe = to_pixel(LEFT_FACE_EDGE)
        rfe = to_pixel(RIGHT_FACE_EDGE)
        lah = to_pixel(LEFT_ARM_HINGE)
        rah = to_pixel(RIGHT_ARM_HINGE)

        # ── Face geometry ─────────────────────────────────────────────────────
        # Face-edge vector: left_face_edge → right_face_edge
        # This is the horizontal axis of the face, already accounting for tilt.
        # Because it is derived from actual landmark positions in image space,
        # it naturally adapts to both mirrored and unmirrored frames.
        face_dx   = rfe["x"] - lfe["x"]
        face_dy   = rfe["y"] - lfe["y"]
        face_width = math.sqrt(face_dx * face_dx + face_dy * face_dy)

        # Unit vector pointing from LEFT_FACE_EDGE → RIGHT_FACE_EDGE
        # (i.e. from subject's left → subject's right along the face plane)
        if face_width > 0:
            ux = face_dx / face_width
            uy = face_dy / face_width
        else:
            ux, uy = 1.0, 0.0

        # Unit vector pointing UP along the face plane (perpendicular to face axis).
        # In image coords y increases downward, so rotating the face direction
        # 90° clockwise gives the "up" direction: (uy, -ux).
        up_x =  uy
        up_y = -ux

        arm_reach = face_width * ARM_REACH_FACTOR

        # ── Ear tip computation ───────────────────────────────────────────────
        #
        # Each ear tip extends OUTWARD from its hinge along the face direction
        # vector, plus a small upward offset along the face-perpendicular vector
        # (ears sit slightly above the temple corners).
        #
        # Left hinge extends OPPOSITE to face_dir (outward from subject's left).
        # Right hinge extends ALONG face_dir (outward from subject's right).
        #
        # This works correctly regardless of image mirroring because face_dir
        # is computed from actual pixel positions — if the image is flipped,
        # the vector flips too, so "outward" always points the right way.

        left_ear = {
            "x": int(lah["x"] - ux * arm_reach + up_x * arm_reach * ARM_UP_FRACTION),
            "y": int(lah["y"] - uy * arm_reach + up_y * arm_reach * ARM_UP_FRACTION),
            "z": round(lah["z"] - 0.03, 4),
        }

        right_ear = {
            "x": int(rah["x"] + ux * arm_reach + up_x * arm_reach * ARM_UP_FRACTION),
            "y": int(rah["y"] + uy * arm_reach + up_y * arm_reach * ARM_UP_FRACTION),
            "z": round(rah["z"] - 0.03, 4),
        }

        return {
            "left_eye":        midpoint_3d(LEFT_EYE_INNER,  LEFT_EYE_OUTER),
            "right_eye":       midpoint_3d(RIGHT_EYE_INNER, RIGHT_EYE_OUTER),
            "nose_bridge":     to_pixel(NOSE_BRIDGE_MID),
            "left_face_edge":  lfe,
            "right_face_edge": rfe,
            "left_arm_hinge":  lah,
            "left_ear_tip":    left_ear,
            "right_arm_hinge": rah,
            "right_ear_tip":   right_ear,
        }

    def draw_mesh(self, frame, results):
        if results and results.face_landmarks:
            h, w = frame.shape[:2]
            for lm_list in results.face_landmarks:
                for lm in lm_list:
                    x, y = int(lm.x * w), int(lm.y * h)
                    cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)
        return frame

    def draw_key_points(self, frame, landmarks):
        if not landmarks:
            return frame

        colors = {
            "left_eye":        (255, 255,   0),
            "right_eye":       (255, 255,   0),
            "nose_bridge":     (255,   0, 255),
            "left_face_edge":  (  0, 255, 255),
            "right_face_edge": (  0, 255, 255),
            "left_arm_hinge":  (  0, 165, 255),
            "right_arm_hinge": (  0, 165, 255),
            "left_ear_tip":    (  0,   0, 255),
            "right_ear_tip":   (  0,   0, 255),
        }

        for name, lm in landmarks.items():
            pt = (lm["x"], lm["y"])
            cv2.circle(frame, pt, 6, colors[name], -1)
            cv2.circle(frame, pt, 6, (0, 0, 0), 1)
            label = f"{name.replace('_', ' ')} z={lm['z']:.3f}"
            cv2.putText(frame, label, (pt[0] + 8, pt[1]),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.28, (255, 255, 255), 1)

        def pt(name):
            return (landmarks[name]["x"], landmarks[name]["y"])

        cv2.line(frame, pt("left_eye"),        pt("right_eye"),       (255, 255,   0), 2)
        cv2.line(frame, pt("left_face_edge"),  pt("right_face_edge"), (  0, 255, 255), 1)
        cv2.line(frame, pt("left_arm_hinge"),  pt("left_ear_tip"),    (  0, 165, 255), 2)
        cv2.line(frame, pt("right_arm_hinge"), pt("right_ear_tip"),   (  0, 165, 255), 2)

        return frame

    def close(self):
        self.landmarker.close()