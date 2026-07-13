function SummaryCard({ balance, income, expense }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        margin: "20px 0",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          flex: 1,
          background: "#3498db",
          color: "#fff",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h3>Balance</h3>
        <h2>₹ {balance}</h2>
      </div>

      <div
        style={{
          flex: 1,
          background: "#2ecc71",
          color: "#fff",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h3>Income</h3>
        <h2>₹ {income}</h2>
      </div>

      <div
        style={{
          flex: 1,
          background: "#e74c3c",
          color: "#fff",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h3>Expense</h3>
        <h2>₹ {expense}</h2>
      </div>
    </div>
  );
}

export default SummaryCard;