const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const connectDB = require("./db");
const employeeRoutes = require("./routes/employeeRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
