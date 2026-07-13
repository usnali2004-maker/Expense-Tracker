import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../Components/Navbar";
import SummaryCard from "../Components/SummaryCard";
import TransactionForm from "../Components/TransactionForm";
import TransactionList from "../Components/TransactionList";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

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

  const income = transactions
    .filter((item) => item.type === "Income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter((item) => item.type === "Expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

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