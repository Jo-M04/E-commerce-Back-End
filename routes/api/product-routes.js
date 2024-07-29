const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category }, // Include associated Category
        { model: Tag, through: ProductTag }, // Include associated Tags via ProductTag
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category }, // Include associated Category
        { model: Tag, through: ProductTag }, // Include associated Tags via ProductTag
      ],
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated) {
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = await ProductTag.findAll({
          where: { product_id: req.params.id },
        });

        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => ({
            product_id: req.params.id,
            tag_id,
          }));

        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);

        await Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      }

      const updatedProduct = await Product.findByPk(req.params.id, {
        include: [{ model: Category }, { model: Tag, through: ProductTag }],
      });

      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(204).json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
