const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

// Get all tags
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }], // Include associated Products via ProductTag
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single tag by ID
router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }], // Include associated Products via ProductTag
    });

    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new tag
router.post("/", async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update a tag's name by ID
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Tag.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedTag = await Tag.findByPk(req.params.id, {
        include: [{ model: Product, through: ProductTag }],
      });
      res.status(200).json(updatedTag);
    } else {
      res.status(404).json({ message: "Tag not found" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a tag by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Tag.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(204).json({ message: "Tag deleted" });
    } else {
      res.status(404).json({ message: "Tag not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
