export default function ResultPanel({ data }: any) {
    if (!data) return null;

    return (
        <div className="glass p-6 mt-4">
            <h2>Result: {data.result}</h2>
            <p>Confidence: {data.confidence}</p>

            {data.mixed && (
                <div>
                    <h3>Mixed Strains</h3>
                    {data.mixed.map((m: any, i: number) => (
                        <p key={i}>{m.name} ({m.score})</p>
                    ))}
                </div>
            )}
        </div>
    );
}