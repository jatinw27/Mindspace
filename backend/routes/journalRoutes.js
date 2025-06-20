const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const protect = require('../middleware/authMiddleware');
const Journal = require('../models/Journal');
const adminOnly = require('../middleware/adminMiddleware')


// ✅ Admin-only route to get ALL journal entries
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const allEntries = await Journal.find().populate('user', 'username email');
    res.json(allEntries);
  } catch (error) {
    console.error("Error fetching all journal entries:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE journal entry
router.post(
  '/',
  protect,
  [
    body('mood', 'Mood is required').notEmpty(),
    body('content', 'Content must be at least 10 characters').isLength({ min: 10 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mood, content, public: isPublic } = req.body; // 'public' is a reserved word in JS, so rename it

    try {
      const entry = new Journal({
        user: req.user._id,
        mood,
        content,
        public: isPublic, // 👈 match schema field name
      });

      await entry.save();
      res.status(201).json({ entry });
    } catch (error) {
      console.error("Error saving journal entry:", error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET a single journal entry by its ID
router.get('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    // Check if the logged-in user owns the journal entry
    if (journal.user.toString() !== req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json(journal);
  } catch (error) {
    console.error("Error fetching journal by ID:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET all journal entries
router.get('/', protect, async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user._id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// UPDATE a journal entry
router.put('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.user.toString() !== req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    journal.mood = req.body.mood || journal.mood;
    journal.content = req.body.content || journal.content;

    const updated = await journal.save();
    res.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.delete('/:id', protect, async (req, res) => {
  try {
    console.log("🧪 Deleting ID:", req.params.id);
    console.log("🧪 Requesting User ID:", req.user._id);

    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      console.log("❌ Journal not found");
      return res.status(404).json({ message: 'Journal not found' });
    }

    if (journal.user.toString() !== req.user._id) {
      console.log("❌ Unauthorized: This journal belongs to", journal.user.toString());
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await journal.deleteOne(); // Safer than .remove()
    console.log("✅ Journal deleted");
    res.json({ message: 'Journal deleted' });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


// public entry for journal
router.get('/public/all', async (req, res) => {
  try {
    const publicJournals = await Journal.find({ public: true }).sort({ date: -1 });
    res.json(publicJournals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
