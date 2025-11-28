import express from "express";
import cors from "cors";
import { supabase } from "../lib/database/supabaseClient";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- GET all groups ---
app.get("/groups", async (req, res) => {
  const { data, error } = await supabase.from("groups").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// --- GET single group ---
app.get("/groups/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("groups").select("*").eq("id", id).single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// --- CREATE group ---
app.post("/groups", async (req, res) => {
  const { name, professor_name, timing } = req.body;
  const { data, error } = await supabase
    .from("groups")
    .insert([{ name, professor_name, timing }])
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// --- UPDATE group ---
app.put("/groups/:id", async (req, res) => {
  const { id } = req.params;
  const { name, professor_name, timing } = req.body;
  const { data, error } = await supabase
    .from("groups")
    .update({ name, professor_name, timing })
    .eq("id", id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// --- DELETE group ---
app.delete("/groups/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("groups").delete().eq("id", id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
