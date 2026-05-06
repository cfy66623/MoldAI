"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

/* ===== 类型 ===== */
type MixedItem = {
  label: string;
  score: number;
};

/* ===== 粒子背景（简化版）===== */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let p: any[] = [];

    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      p.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: Math.random() - 0.5,
        vy: Math.random() - 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);

      p.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return <canvas ref={ref} className="particles" />;
}

/* ===== 主页面 ===== */
export default function Home() {
  const [tab, setTab] = useState("Home");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [mixed, setMixed] = useState<MixedItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [logs, setLogs] = useState<string[]>([]);

  const [kpi] = useState({
    accuracy: 89,
    precision: 87,
    recall: 85,
    f1: 86,
  });

  /* ===== 训练状态（保留但不展示UI动画）===== */
  const [epoch, setEpoch] = useState(1);
  const [loss, setLoss] = useState(1);
  const [acc, setAcc] = useState(0.5);

  useEffect(() => {
    const t = setInterval(() => {
      setEpoch((e) => (e < 50 ? e + 1 : 1));
      setLoss((l) => Math.max(0.1, l - 0.02));
      setAcc((a) => Math.min(0.95, a + 0.01));
    }, 500);
    return () => clearInterval(t);
  }, []);

  /* ===== 上传 ===== */
  const handleUpload = async () => {
    if (!file) return alert("请选择图片");

    const form = new FormData();
    form.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "https://moldai.onrender.com/predict",
        form
      );

      setResult(res.data.top.label);
      setConfidence(res.data.top.score);
      setMixed(res.data.mixed);

      setLogs((prev) => [
        ...prev,
        `#${prev.length + 1} ResNet acc=${(
          res.data.top.score * 100
        ).toFixed(1)}%`,
      ]);
    } catch {
      alert("后端未连接");
    } finally {
      setLoading(false);
    }
  };

  const menus = [
    "Home",
    "ModelViz",
    "GradCAM",
    "Dataset",
    "Training",
    "AI+Expert",
    "Log",
  ];

  return (
    <>
      <Particles />

      <div className="app">
        {/* 左侧 */}
        <div className="sidebar">
          <h2 className="logo">🧬 BioAI</h2>

          {menus.map((m) => (
            <div
              key={m}
              className={`menu ${tab === m ? "active" : ""}`}
              onClick={() => setTab(m)}
            >
              {m}
            </div>
          ))}
        </div>

        {/* 右侧 */}
        <div className="main">
          {tab === "Home" && (
            <div className="home-wrap">

              {/* 顶部统计 */}
              <div className="top-stats">
                {[
                  { label: "Total Images", value: "12,458" },
                  { label: "Classes", value: "4" },
                  { label: "Model", value: "ResNet50" },
                  { label: "Accuracy", value: "89%" },
                  { label: "Risk Samples", value: "12" },
                ].map((s, i) => (
                  <div key={i} className="stat-card-pro">
                    <div className="stat-number-pro">{s.value}</div>
                    <div className="stat-label-pro">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* 中间 */}
              <div className="home-grid">
                <div className="card">
                  <h2>AI Bacteria System</h2>
                  <p>
                    A deep learning–based bacterial strain identification system that enables automated detection, multi-model comparison, and intelligent analytical insights.
                  </p>
                  <p>
                    It integrates Grad-CAM interpretability, training visualization, and expert-driven recommendations.
                  </p>
                </div>

                <div className="card">
                  <h2>Quick Analyze</h2>

                  <input
                    type="file"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setFile(f);
                        setPreview(URL.createObjectURL(f));
                      }
                    }}
                  />

                  {preview && <img src={preview} className="preview" />}

                  <button className="btn" onClick={handleUpload}>
                    Analyze
                  </button>

                  {loading && <p>Analyzing...</p>}

                  {result && (
                    <div>
                      <h3>{result}</h3>
                      <p>{(confidence * 100).toFixed(1)}%</p>

                      <div className="bar-bg">
                        <div
                          className="bar-fill"
                          style={{ width: `${confidence * 100}%` }}
                        />
                      </div>

                      {mixed.map((m, i) => (
                        <div key={i}>
                          <span>{m.label}</span>
                          <div className="bar-bg">
                            <div
                              className="bar-fill"
                              style={{ width: `${m.score * 100}%` }}
                            />
                          </div>
                          <span>{(m.score * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 底部 */}
              <div className="bottom-panel">
                <div className="card">
                  <h2>Experiment Log</h2>
                  {logs.map((l, i) => (
                    <div key={i} className="log">{l}</div>
                  ))}
                </div>

                <div className="card kpi-panel">
                  <h2>KPI</h2>

                  {Object.entries(kpi).map(([k, v], i) => (
                    <div key={i} className="kpi-card">
                      <div className="kpi-value">{v}%</div>
                      <div className="kpi-label">{k.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}