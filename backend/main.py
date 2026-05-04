from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
import os
import json

app = FastAPI(title="Mold AI Backend")

# =========================
# 🌐 解决前后端通信问题（必须）
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 开发阶段全放开
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🧬 分类标签
# =========================
class_names = [
    "Aspergillus niger",
    "Aspergillus flavus",
    "Cladosporium",
    "Paenibacillus polymyxa"
]

# =========================
# 🧠 AI预测接口（核心）
# =========================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img_bytes = await file.read()
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # =========================
    # 🎲 模拟AI模型（后续可替换ResNet/VGG）
    # =========================
    seed = len(img_bytes) % 1000
    np.random.seed(seed)

    scores = np.random.dirichlet(np.ones(len(class_names)))

    result = []
    for i, name in enumerate(class_names):
        result.append({
            "label": name,
            "score": float(scores[i])
        })

    # Top1结果
    top = max(result, key=lambda x: x["score"])

    # =========================
    # 🧪 混合菌识别逻辑（核心升级点）
    # =========================
    MIX_THRESHOLD = 0.25
    mixed = [r for r in result if r["score"] > MIX_THRESHOLD]

    return {
        "top": top,
        "all": result,
        "mixed": mixed if len(mixed) > 1 else []
    }

# =========================
# 🧠 训练数据接收接口（你UI已经做了）
# =========================
@app.post("/train/upload")
async def upload_training_data(
    file: UploadFile = File(...),
    label: str = "unknown"
):
    save_dir = f"dataset/{label}"
    os.makedirs(save_dir, exist_ok=True)

    file_path = os.path.join(save_dir, file.filename)

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    return {
        "status": "success",
        "file_saved": file_path,
        "label": label
    }

# =========================
# 📊 模型状态接口（前端可显示）
# =========================
@app.get("/model/info")
def model_info():
    return {
        "model": "Mock CNN (replaceable)",
        "device": "cpu",
        "classes": class_names,
        "status": "running"
    }

# =========================
# 🧪 健康检查接口
# =========================
@app.get("/")
def root():
    return {
        "message": "Mold AI Backend Running",
        "status": "ok"
    }