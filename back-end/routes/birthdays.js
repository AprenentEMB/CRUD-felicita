const express = require("express");
const router = express.Router();
const Birthday = require("../models/birthdays");
const auth = require("../middlewares/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { name, date, notes } = req.body;
    const newBirthday = new Birthday({
      name,
      date,
      notes,
      userId: req.user.id,
    });
    await newBirthday.save();
    res.status(201).json(newBirthday);
  } catch (error) {
    res.status(500).json({ message: "Error creating birthday", error });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const allBirthdays = await Birthday.find({ userId: req.user.id }).sort({
      date: 1,
    });
    res.json(allBirthdays);
  } catch (error) {
    res.status(500).json({ message: "Error fetching birthdays", error });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Birthday.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Birthday deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting birthday", error });
  }
});

module.exports = router;
