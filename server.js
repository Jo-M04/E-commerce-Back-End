const express = require("express");
const routes = require("./routes");
const sequelize = require("./config/connection"); // Import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// Sync sequelize models to the database, then turn on the server
sequelize
  .sync({ force: false }) // `force: false` will not drop tables if they already exist; use `true` if you want to drop and recreate tables
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
