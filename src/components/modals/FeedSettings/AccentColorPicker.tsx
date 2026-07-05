import { Box } from "@mui/material";
import { useCallback, useRef } from "react";
import {
  DEFAULT_ACCENT_COLOR,
  hexToHsv,
  hsvToHex,
  parseColorInput,
} from "@/theme/accentColor";

type AccentColorPickerProps = {
  color: string;
  onChange: (hex: string) => void;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function pickerThumbSx(size = 18) {
  return {
    width: size,
    height: size,
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
    position: "absolute" as const,
    transform: "translate(-50%, -50%)",
    pointerEvents: "none" as const,
  };
}

export function AccentColorPicker({ color, onChange }: AccentColorPickerProps) {
  const svAreaRef = useRef<HTMLDivElement>(null);
  const hueTrackRef = useRef<HTMLDivElement>(null);

  const parsed = parseColorInput(color) ?? DEFAULT_ACCENT_COLOR;
  const hsv = hexToHsv(parsed) ?? { h: 0, s: 100, v: 100 };
  const hueColor = hsvToHex(hsv.h, 100, 100);

  const updateFromSv = useCallback(
    (clientX: number, clientY: number) => {
      const rect = svAreaRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const saturation = clamp((clientX - rect.left) / rect.width) * 100;
      const value = (1 - clamp((clientY - rect.top) / rect.height)) * 100;
      onChange(hsvToHex(hsv.h, saturation, value));
    },
    [hsv.h, onChange]
  );

  const updateFromHue = useCallback(
    (clientX: number) => {
      const rect = hueTrackRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const hue = clamp((clientX - rect.left) / rect.width) * 360;
      onChange(hsvToHex(hue, hsv.s, hsv.v));
    },
    [hsv.s, hsv.v, onChange]
  );

  const bindDrag = useCallback(
    (move: (x: number, y: number) => void) => (event: React.PointerEvent) => {
      event.preventDefault();
      const target = event.currentTarget as HTMLElement;
      target.setPointerCapture(event.pointerId);
      move(event.clientX, event.clientY);

      const handleMove = (moveEvent: PointerEvent) => {
        move(moveEvent.clientX, moveEvent.clientY);
      };

      const handleUp = () => {
        target.releasePointerCapture(event.pointerId);
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
    },
    []
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box
        ref={svAreaRef}
        onPointerDown={bindDrag(updateFromSv)}
        sx={{
          position: "relative",
          width: "100%",
          height: 120,
          borderRadius: 2,
          overflow: "hidden",
          cursor: "crosshair",
          touchAction: "none",
          background: `
            linear-gradient(to top, #000, transparent),
            linear-gradient(to right, #fff, ${hueColor})
          `,
        }}
      >
        <Box
          sx={{
            ...pickerThumbSx(),
            left: `${hsv.s}%`,
            top: `${100 - hsv.v}%`,
            bgcolor: parsed,
          }}
        />
      </Box>

      <Box
        ref={hueTrackRef}
        onPointerDown={bindDrag((clientX) => updateFromHue(clientX))}
        sx={{
          position: "relative",
          width: "100%",
          height: 12,
          borderRadius: 999,
          cursor: "pointer",
          touchAction: "none",
          background:
            "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
        }}
      >
        <Box
          sx={{
            ...pickerThumbSx(16),
            left: `${(hsv.h / 360) * 100}%`,
            top: "50%",
            bgcolor: hueColor,
          }}
        />
      </Box>
    </Box>
  );
}
