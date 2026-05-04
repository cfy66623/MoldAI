"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

type MixedItem = {
  label: string;
  score: number;
};

/* ===== 粒子系统 ===== */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(59,130,246,0.25)";
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return <canvas ref={canvasRef} className="particles" />;
}

/* ===== 主页面 ===== */
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [mixed, setMixed] = useState<MixedItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [trainFile, setTrainFile] = useState<File | null>(null);
  const [label, setLabel] = useState("Aspergillus niger");

  /* ===== 预测函数 ===== */
  const handleUpload = async () => {
    if (!file) return alert("请选择图片");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      // ✅ 真实 Render 后端地址
      const res = await axios.post(
        "https://moldai.onrender.com/predict",
        formData
      );

      setResult(res.data.top.label);
      setConfidence(res.data.top.score);
      setMixed(res.data.mixed);
    } catch (err) {
      console.error(err);
      alert("后端未运行或无法访问！");
    } finally {
      setLoading(false);
    }
  };

  /* ===== 训练上传函数 ===== */
  const handleTrain = async () => {
    if (!trainFile) return alert("请选择训练图片");

    const formData = new FormData();
    formData.append("file", trainFile);
    formData.append("label", label);

    try {
      await axios.post(
        "https://moldai.onrender.com/train/upload",
        formData
      );
      alert("✅ 数据集更新成功！");
    } catch (err) {
      console.error(err);
      alert("训练上传失败！");
    }
  };

  return (
    <>
      <div className="tech-bg"></div>
      <Particles />

      <div className="page">
        <h1 className="title">🧬 Mold AI Intelligence System</h1>

        {/* ===== 预测区域 ===== */}
        <div className="card">
          <h2>🔬 AI Prediction</h2>

          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                const f = e.target.files[0];
                setFile(f);
                setPreview(URL.createObjectURL(f));
              }
            }}
          />

          {preview && <img src={preview} className="preview" />}

          <br />
          <br />

          <button className="btn" onClick={handleUpload}>
            开始分析
          </button>

          {loading && <p className="loading">🧠 AI分析中...</p>}

          {result && (
            <div className="result">
              <div className="main-result">{result}</div>

              <p>置信度：{(confidence * 100).toFixed(1)}%</p>

              <div className="bar-bg">
                <div
                  className="bar-fill"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>

              {mixed.map((m, i) => (
                <div key={i} className="bar-box">
                  <div className="bar-label">
                    {m.label} ({(m.score * 100).toFixed(1)}%)
                  </div>

                  <div className="bar-bg">
                    <div
                      className="bar-fill"
                      style={{ width: `${m.score * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== 训练区域 ===== */}
        <div className="card">
          <h2>🧠 AI Training</h2>

          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                setTrainFile(e.target.files[0]);
              }
            }}
          />

          <br />
          <br />

          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          >
            <option>Aspergillus niger</option>
            <option>Aspergillus flavus</option>
            <option>Cladosporium</option>
            <option>Paenibacillus polymyxa</option>
          </select>

          <br />
          <br />

          <button className="btn" onClick={handleTrain}>
            上传训练数据
          </button>
        </div>
      </div>
    </>
  );
}