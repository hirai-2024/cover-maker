import { useState } from "react";
import Canvas from "./Canvas";

export default function App() {
  const [start, setStart] = useState(false);
  const [bookSize, setBookSize] = useState("A5");
  const [dpi, setDpi] = useState(350);
  const [bleed, setBleed] = useState(3);

  if (start) {
    return (
      <Canvas
        bookSize={bookSize}
        dpi={dpi}
        bleed={bleed}
      />
    );
  }

  return (
    <div className="container">
      <h1 className="title">同人誌タイトル入れツール</h1>
      <h2 className="pre">作成中のツールです。<br></br>完成をお楽しみに。</h2>

      <div className="form-area">
        <label>
          サイズ:
          <select value={bookSize} onChange={(e) => setBookSize(e.target.value)}>
            <option value="A5">A5</option>
            <option value="B5">B5</option>
            <option value="A6">A6</option>
          </select>
        </label>

        <label>
          dpi:
          <select value={dpi} onChange={(e) => setDpi(Number(e.target.value))}>
            <option value={350}>350</option>
            <option value={600}>600</option>
          </select>
        </label>

        <label>
          余白
          <select value={bleed} onChange={(e) => setBleed(Number(e.target.value))}>
            <option value={0}>0</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
          </select>
          mm
        </label>

        <button className="btn-primary" 
        //onClick={() => setStart(true)}
        >
          開始
        </button>
      </div>
    </div>
  );
}