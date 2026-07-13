import { useState } from "react";
import API from "../services/api";

function TransactionForm({ refresh }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "Expense",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "amount"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const addTransaction = async (e) => {
    e.preventDefault();

    try {
      await API.post("/transactions", form);

      alert("Transaction Added Successfully");

      setForm({
        title: "",
        amount: "",
        type: "Expense",
      });

      refresh();
    } catch (err) {
      alert("Unable to Add Transaction");
      console.log(err);
    }
  };

  return (
    <div className="card">
      <h2>Add Transaction</h2>

      <form onSubmit={addTransaction}>
        <input
          type="text"
          name="title"
          placeholder="Transaction Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <button type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;