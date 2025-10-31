import "./index.css";

const InsightsPanel = ({ insights }) => {
  if (!insights) {
    return (
      <div className="insights">
        <div className="loading">Loading task insights...</div>
      </div>
    );
  }

  const hasSummary = insights.summary && insights.summary.trim() !== "";

  return (
    <div className={`insights ${!hasSummary ? "empty" : ""}`}>
      <h2>Task Overview</h2>
      <p className="summary">
        {hasSummary
          ? insights.summary
          : "No insights available yet. Create some tasks to see analytics."}
      </p>
    </div>
  );
};

export default InsightsPanel;
