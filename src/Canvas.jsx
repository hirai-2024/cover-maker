import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { BOOK_SIZES } from "./const/sizes";

function mmToPx(mm, dpi) {
  return Math.round((mm * dpi) / 25.4);
}

function getSize(bookSize, dpi, bleed) {
  const s = BOOK_SIZES[bookSize];

  return {
    width: mmToPx(s.widthMm + bleed * 2, dpi),
    height: mmToPx(s.heightMm + bleed * 2, dpi),
  };
}

export default function Canvas({ bookSize, dpi, bleed }) {
  const ref = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const size = getSize(bookSize, dpi, bleed);

    // 既存破棄（超重要）
    if (canvasRef.current) {
      canvasRef.current.dispose();
    }

    const canvas = new fabric.Canvas(ref.current, {
      width: size.width,
      height: size.height,
      backgroundColor: "#fff",
    });

    canvasRef.current = canvas;

    // =========================
    // 画面に収める（CSSじゃなくFabric zoom）
    // =========================
    const scale = Math.min(
      window.innerWidth * 0.7 / size.width,
      window.innerHeight * 0.8 / size.height
    );

    canvas.setZoom(scale);

    // =========================
    // 赤枠（塗り足し）
    // =========================
    const bleedPx = mmToPx(bleed, dpi);

    const guide = new fabric.Rect({
      left: bleedPx,
      top: bleedPx,
      width: size.width - bleedPx * 2,
      height: size.height - bleedPx * 2,
      fill: "transparent",
      stroke: "red",
      strokeWidth: 3,
      selectable: false,
      evented: false,
    });

    canvas.add(guide);

    // =========================
    // 画像追加
    // =========================
    const handleFile = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = async (ev) => {
        const img = await fabric.Image.fromURL(ev.target.result);

        img.scaleToWidth(size.width * 0.5);

        img.set({
          left: size.width / 2,
          top: size.height / 2,
          originX: "center",
          originY: "center",
        });

        canvas.add(img);
        canvas.setActiveObject(img);
      };

      reader.readAsDataURL(file);
    };

    window.__upload = handleFile; // 簡易（後でUI化）

    return () => {
      canvas.dispose();
    };
  }, [bookSize, dpi, bleed]);

  return (
    <div className="canvas-wrapper">
      <div className="button-area">
        <label className="btn-blue">
          画像追加
          <input type="file" onChange={(e) => window.__upload(e)} />
        </label>

        <button
          className="btn-green"
          onClick={() => {
            const canvas = canvasRef.current;
            const data = canvas.toDataURL({
              format: "png",
              multiplier: 1 / canvas.getZoom(), // 重要：元サイズ出力
            });

            const a = document.createElement("a");
            a.href = data;
            a.download = "cover.png";
            a.click();
          }}
        >
          ダウンロード
        </button>
      </div>

      <div className="canvas-box">
        <canvas ref={ref} />
      </div>
    </div>
  );
}