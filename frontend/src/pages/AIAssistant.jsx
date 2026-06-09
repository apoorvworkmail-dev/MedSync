import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError("Enter a question before asking the assistant.");
      setReply("");
      return;
    }

    setIsLoading(true);
    setError("");
    setReply("");

    try {
      const response = await API.post("/ai/chat", { message: trimmedMessage });
      setReply(response.data?.response || "No response received from the assistant.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          requestError.message ||
          "AI assistant request failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="AI Assistant"
      subtitle="Ask for general health guidance, report explanations, and next-step suggestions."
    >
      <section className="dashboard-grid single-focus ai-assistant-grid">
        <article className="dashboard-panel ai-assistant-panel">
          <div className="panel-heading">
            <h2>Ask MedSync AI</h2>
          </div>

          <form className="ai-assistant-form" onSubmit={handleSubmit}>
            <label htmlFor="ai-message">Question</label>
            <textarea
              id="ai-message"
              rows="7"
              placeholder="Example: I have had a headache and mild fever for two days. What should I consider?"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Thinking..." : "Ask Assistant"}
            </button>
          </form>
        </article>

        <article className="dashboard-panel ai-response-panel">
          <div className="panel-heading">
            <h2>Response</h2>
          </div>

          {error && <p className="ai-error">{error}</p>}
          {!error && reply && <p className="ai-response">{reply}</p>}
          {!error && !reply && (
            <p className="empty-state">
              The assistant response will appear here after you ask a question.
            </p>
          )}
        </article>
      </section>
    </DashboardLayout>
  );
}

export default AIAssistant;
