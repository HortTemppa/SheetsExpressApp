const { GoogleSpreadsheet } = require("google-spreadsheet");
const { promisify } = require("util");
const express = require("express");
const app = express();

const sheetsRouter = require("./controllers/consumption");

app.use("/api/sheets/", sheetsRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
