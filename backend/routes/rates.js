import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  const response = await fetch("https://api.frankfurter.app/latest?from=USD");
  const data = await response.json();
  res.json(data);
});

export default router;
