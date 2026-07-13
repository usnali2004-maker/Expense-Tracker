import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../Components/Navbar";
import SummaryCard from "../Components/SummaryCard";
import TransactionForm from "../Components/TransactionForm";
import TransactionList from "../Components/TransactionList";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  const normalizeType = (value) => {
    const text = String(value || "").trim().toLowerCase();
    if (text === "income") return "Income";
    if (text === "expense") return "Expense";
    return text;
  };

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const income = transactions.reduce((acc, curr) => {
    return normalizeType(curr.type) === "Income"
      ? acc + Number(curr.amount || 0)
      : acc;
  }, 0);

  const expense = transactions.reduce((acc, curr) => {
    return normalizeType(curr.type) === "Expense"
      ? acc + Number(curr.amount || 0)
      : acc;
  }, 0);

  const balance = income - expense;

  return (
    <div>

      <Navbar />

      <div className="container">

        <h1>Dashboard</h1>

        <SummaryCard
          balance={balance}
          income={income}
          expense={expense}
        />

        <TransactionForm refresh={fetchTransactions} />

        <TransactionList
          transactions={transactions}
          refresh={fetchTransactions}
        />

      </div>

    </div>
  );
}

export default Dashboard;