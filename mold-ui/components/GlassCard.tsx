"use client";

export default function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backdropFilter: "blur(20px)",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </div>
  );
}