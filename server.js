require("dotenv").config();

const { GoogleSpreadsheet } = require("google-spreadsheet");
const { promisify } = require("util");
const express = require("express");
const app = express();

const credentials = require("./client_secret.json");

const sheetsRouter = require("./controllers/consumption");

const accessSpreadsheet = async () => {
  const document = await new GoogleSpreadsheet(
    "18Ou6uQjD95lL26RCP8MM0LZRkT4aQfInsLZWRomNbaY"
  );

  await document.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key
  });

  await document.loadInfo();

  const sheet = await document.sheetsByIndex[0];
  const rows = await sheet.getRows({
    offset: 0
  });

  const consumables = [];

  rows.forEach(row => {
    consumables.push({
      tuote: row.tuote,
      yksikkö: row.yksikkö,
      co2: row.co2,
      määrä: row.määrä
    });
  });
  console.log(consumables);
};

accessSpreadsheet();

app.use("/api/sheets/", sheetsRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Serveri juoksee portissa ${PORT}`);
});
