import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/SetupApi")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(err));

app.get("/", async (req, res) => {
  try {
    res.json({ message: "Backend Are Connected To Mongodb" });
  } catch (err) {
    res.status(500).json({ message: "Server Not Response" });
  }
});

app.listen(5000, () => console.log("Server Port Running 5000"));
