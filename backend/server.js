const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const Transaction = require("./Transaction");

const app = express();
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}
const JWT_SECRET = process.env.JWT_SECRET || "shahul2856_db_user";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.use(express.json());
app.use(cors());

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hash}`;
};

const normalizeType = (value) => {
  const text = String(value || "").trim().toLowerCase();
  if (text === "income") return "Income";
  if (text === "expense") return "Expense";
  return value;
};

const comparePassword = (password, storedPassword) => {
  const [salt, hash] = storedPassword.split(":");
  const derivedHash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");

  return derivedHash === hash;
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://shahul2856_db_user:rashid%40123@cluster0.pfjvjho.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.json({ message: "Backend Running" });
});

app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password: hashPassword(password),
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !comparePassword(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/transactions", authMiddleware, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      type: normalizeType(req.body.type),
      user: req.user.id,
    };

    const transaction = new Transaction(payload);
    const savedTransaction = await transaction.save();

    res.status(201).json({
      message: "Transaction Added Successfully",
      data: savedTransaction,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    const normalizedTransactions = transactions.map((item) => ({
      ...item.toObject(),
      type: normalizeType(item.type),
    }));

    res.status(200).json(normalizedTransactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/transactions/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction Not Found" });
    }

    res.status(200).json({ message: "Transaction Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/summary", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    let income = 0;
    let expense = 0;

    transactions.forEach((item) => {
      const type = normalizeType(item.type);
      if (type === "Income") {
        income += item.amount;
      } else if (type === "Expense") {
        expense += item.amount;
      }
    });

    res.json({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});