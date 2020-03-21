require("dotenv").config();
const sheetsRouter = require("express").Router();
const { GoogleSpreadsheet } = require("google-spreadsheet");

const credentials = require("../client_secret.json");

sheetsRouter.post("/", async (request, response, next) => {
  return null;
});

sheetsRouter.get("/", async (request, response) => {
  const document = await new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

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
      määrä: row.määrä,
      kategoria: row.kategoria
    });
  });

  return response.json(consumables);
});

module.exports = sheetsRouter;
