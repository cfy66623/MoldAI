"use client";

import { useState } from "react";
import { predictAPI } from "@/lib/api";

export default function UploadBox({ onResult }: any) {
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const res = await predictAPI(file);
        setLoading(false);

        onResult(res.data);
    };

    return (
        <div className="glass p-6">
            <input type="file" onChange={handleUpload} />

            {loading && <p>AI analyzing...</p>}
        </div>
    );
}