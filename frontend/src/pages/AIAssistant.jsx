import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const res = await API.post("/ai/chat", {
        message,
      });

      setResponse(res.data.response);
    } catch (error) {
      console.error(error);

      setResponse(
        "Unable to get AI response. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="AI Assistant" subtitle="Ask health-related questions or get medical insights.">
      <div className="dashboard-panel">
        <h1 className="text-3xl font-bold mb-6">
          MedSync AI Assistant
        </h1>

        <textarea
          className="w-full border rounded-lg p-4 h-40"
          placeholder="Ask a health question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "100%", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1", minHeight: "150px", marginBottom: "16px", fontFamily: "inherit" }}
        />

        <button
          onClick={sendMessage}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
          style={{ padding: "12px 24px", background: "#2563eb", color: "white", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {response && (
          <div className="mt-6 border rounded-lg p-4 bg-gray-50" style={{ marginTop: "24px", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
            <h2 className="font-semibold mb-2" style={{ marginBottom: "12px", fontSize: "18px", color: "#0f172a" }}>
              AI Response
            </h2>

            <p style={{ color: "#334155", lineHeight: "1.6" }}>{response}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AIAssistant;