import { useState } from "react";
import API from "../services/api";

function TransactionForm({ refresh }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "Expense",
    category: "Food",
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
        category: "Food",
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

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;