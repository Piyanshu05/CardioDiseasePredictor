document.addEventListener("DOMContentLoaded", () => {
    loadComparison();

    document.getElementById("predictionForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = document.getElementById("predictBtn");
        btn.classList.add("loading");
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

        const data = {
            age: +document.getElementById("age").value,
            gender: +document.getElementById("gender").value,
            height: +document.getElementById("height").value,
            weight: +document.getElementById("weight").value,
            ap_hi: +document.getElementById("ap_hi").value,
            ap_lo: +document.getElementById("ap_lo").value,
            cholesterol: +document.getElementById("cholesterol").value,
            gluc: +document.getElementById("gluc").value,
            smoke: document.getElementById("smoke").checked ? 1 : 0,
            alco: document.getElementById("alco").checked ? 1 : 0,
            active: document.getElementById("active").checked ? 1 : 0,
            model: document.getElementById("model").value
        };

        try {
            const res = await fetch("/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            displayResults(result);
        } catch (err) {
            alert("Prediction failed: " + err.message);
        } finally {
            btn.classList.remove("loading");
            btn.innerHTML = '<i class="fas fa-stethoscope"></i> Predict Risk';
        }
    });
});

function displayResults(result) {
    const section = document.getElementById("results");
    const container = document.getElementById("resultsContainer");
    section.style.display = "block";

    let html = '<div class="results-grid">';
    const predictions = result.predictions;

    predictions.forEach((pred, idx) => {
        const isHealthy = pred.prediction === 0;
        const statusClass = isHealthy ? "healthy" : "disease";
        const icon = isHealthy ? "fa-heart" : "fa-heart-broken";
        const label = isHealthy ? "Low Risk" : "High Risk";
        const conf = (pred.confidence * 100).toFixed(1);
        const barColor = isHealthy ? "#10b981" : "#ef4444";

        html += `
            <div class="result-card" style="animation-delay: ${idx * 0.1}s">
                <div class="model-name"><i class="fas fa-brain" style="color: var(--accent-primary)"></i> ${pred.model}</div>
                <div class="prediction ${statusClass}">
                    <i class="fas ${icon}"></i> ${label}
                </div>
                <div class="confidence">Confidence: ${conf}%</div>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${conf}%; background: ${barColor}"></div>
                </div>
            </div>`;
    });

    html += "</div>";
    container.innerHTML = html;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadComparison() {
    try {
        const res = await fetch("/comparison");
        const data = await res.json();
        renderComparisonChart(data);
        renderComparisonTable(data);
    } catch (err) {
        console.error("Failed to load comparison:", err);
    }
}

function renderComparisonChart(data) {
    const models = data.map(d => d.model);

    const metrics = ["accuracy", "precision", "recall", "f1_score"];
    const labels = ["Accuracy", "Precision", "Recall", "F1 Score"];
    const barColors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b"];

    const traces = metrics.map((m, i) => ({
        x: models,
        y: data.map(d => d[m]),
        name: labels[i],
        type: "bar",
        marker: { color: barColors[i], opacity: 0.85 },
        text: data.map(d => d[m].toFixed(3)),
        textposition: "auto"
    }));

    Plotly.newPlot("comparisonChart", traces, {
        barmode: "group",
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: { color: "#94a3b8", family: "Inter" },
        yaxis: { range: [0.5, 0.85], gridcolor: "rgba(99,102,241,0.1)" },
        xaxis: { gridcolor: "rgba(99,102,241,0.1)" },
        margin: { l: 50, r: 20, t: 20, b: 80 },
        legend: { orientation: "h", y: -0.2 },
        height: 400
    }, { responsive: true, displayModeBar: false });
}

function renderComparisonTable(data) {
    const sorted = [...data].sort((a, b) => b.accuracy - a.accuracy);

    let html = `<table class="comparison-table">
        <thead><tr>
            <th>Rank</th><th>Model</th><th>Accuracy</th><th>Precision</th><th>Recall</th><th>F1 Score</th>
        </tr></thead><tbody>`;

    sorted.forEach((d, i) => {
        const badgeClass = d.accuracy >= 0.73 ? "accuracy-high" : d.accuracy >= 0.70 ? "accuracy-mid" : "accuracy-low";
        html += `<tr>
            <td>${i === 0 ? "\u{1F947}" : i === 1 ? "\u{1F948}" : i === 2 ? "\u{1F949}" : i + 1}</td>
            <td><strong>${d.model}</strong></td>
            <td><span class="accuracy-badge ${badgeClass}">${(d.accuracy * 100).toFixed(2)}%</span></td>
            <td>${(d.precision * 100).toFixed(2)}%</td>
            <td>${(d.recall * 100).toFixed(2)}%</td>
            <td>${(d.f1_score * 100).toFixed(2)}%</td>
        </tr>`;
    });

    html += "</tbody></table>";
    document.getElementById("comparisonTable").innerHTML = html;
}
