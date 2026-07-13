import API from "../services/api";

function TransactionList({ transactions, refresh }) {
  const deleteTransaction = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);

      alert("Transaction Deleted");

      refresh();
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  return (
    <div className="card">
      <h2>Transaction History</h2>

      {transactions.length === 0 ? (
        <p>No Transactions Found</p>
      ) : (
        <table
          width="100%"
          border="1"
          cellPadding="10"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>₹ {item.amount}</td>
                <td>{item.type}</td>
                <td>{item.category || "Other"}</td>
                <td>
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td>
                  <button
                    style={{
                      background: "red",
                      color: "#fff",
                      border: "none",
                      padding: "8px 15px",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                    onClick={() =>
                      deleteTransaction(item._id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionList;