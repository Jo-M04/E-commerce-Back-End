const router = require("express").Router();
const { Category, Product, ProductTag } = require("../../models");
const sequelize = require("../../config/connection"); // Import Sequelize

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  try {
    const categoriesData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
  // find all categories
  // be sure to include its associated Products
});

router.get("/:id", async (req, res) => {
  try {
    const categoriesData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoriesData) {
      res.status(404).json({ message: "No categories found with this id!" });
      return;
    }

    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post("/", async (req, res) => {
  // create a new category
  try {
    const categoriesData = await Category.create(req.body);
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  try {
    const categoriesData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!categoriesData[0]) {
      res.status(404).json({ message: "No categories found with this id!!" });
      return;
    }
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    // const productTagsToRemove = await ProductTag.destroy({
    //   where: {
    //     product_id: req.params.id
    //   }
    // });

    const categoryId = req.params.id; // Get the category ID from request parameters

    const sqlQuery = `
      DELETE FROM product_tag 
      WHERE product_id IN (
        SELECT p.id FROM product p 
        WHERE p.category_id = :categoryId
      )
    `;

    // Execute the raw SQL query
    await sequelize.query(sqlQuery, {
      replacements: { categoryId: categoryId }, // Use replacements to safely insert the parameter
      type: sequelize.QueryTypes.DELETE, // Specify the query type
    });

    // Delete the product after deleting the product tag
    const productToRemove = await Product.destroy({
      where: {
        category_id: req.params.id,
      },
    });

    const categoryToRemove = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryToRemove) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    }

    res
      .status(200)
      .json({
        message:
          "Category and its products and tags have been deleted successfully.",
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
