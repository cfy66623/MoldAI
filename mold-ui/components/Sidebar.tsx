"use client";

type Props = {
  current: string;
  setCurrent: (v: string) => void;
};

export default function Sidebar({ current, setCurrent }: Props) {
  const menus = [
    "预测分析",
    "模型对比",
    "Grad-CAM",
    "数据集",
    "训练过程",
    "AI报告",
    "专家系统",
    "实验日志",
  ];

  return (
    <div className="sidebar">
      <h2 className="logo">🧬 Mold AI</h2>

      {menus.map((m) => (
        <div
          key={m}
          className={`menu ${current === m ? "active" : ""}`}
          onClick={() => setCurrent(m)}
        >
          {m}
        </div>
      ))}
    </div>
  );
}