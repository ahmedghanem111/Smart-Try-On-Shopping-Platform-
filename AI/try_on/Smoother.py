"""
Landmark Smoother
Keeps a rolling buffer of the last N frames of landmark positions
and returns the average. Eliminates jitter from raw MediaPipe output.

Supports two landmark formats:
  - Tuple format: {"left_shoulder": (x, y), ...}  ← used by body_tracker
  - Dict format:  {"left_eye": {"x": 265, "y": 200, "z": -0.034}, ...}  ← used by face_tracker
"""

from collections import deque
import numpy as np


class LandmarkSmoother:
    def __init__(self, buffer_size=5):
        """
        buffer_size → how many past frames to average.
        5 = smooth but still responsive to real movement.
        """
        self.buffer_size = buffer_size
        self._buffers: dict[str, deque] = {}

    def smooth(self, landmarks: dict | None) -> dict | None:
        """
        Accept landmarks in either format and return smoothed version.

        Tuple format: {"key": (x, y)}
          → buffers (x, y), returns (x, y)

        Dict format:  {"key": {"x": int, "y": int, "z": float}}
          → buffers (x, y, z), returns {"x": int, "y": int, "z": float}

        Returns None if input is None.
        """
        if landmarks is None:
            return None

        smoothed = {}

        for key, val in landmarks.items():
            if key not in self._buffers:
                self._buffers[key] = deque(maxlen=self.buffer_size)

            # ── Detect format ─────────────────────────────────────────────────
            if isinstance(val, dict):
                # Dict format: {x, y, z}
                self._buffers[key].append((val["x"], val["y"], val["z"]))
                arr = np.array(self._buffers[key])
                smoothed[key] = {
                    "x": int(arr[:, 0].mean()),
                    "y": int(arr[:, 1].mean()),
                    "z": round(float(arr[:, 2].mean()), 4),
                }
            else:
                # Tuple format: (x, y)
                self._buffers[key].append((val[0], val[1]))
                arr = np.array(self._buffers[key])
                smoothed[key] = (int(arr[:, 0].mean()), int(arr[:, 1].mean()))

        return smoothed

    def reset(self):
        """Clear all buffers."""
        self._buffers.clear()