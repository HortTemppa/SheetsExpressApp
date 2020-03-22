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
  const rows = await sheet.getRows({ offset: 0 });

  const sheetHeaders = sheet.headerValues;

  console.log("rows", rows);
  console.log("Headers length:" + sheetHeaders.length);

  const rowData = new Array(rows.length);

  for (var i = 0; i < rowData.length; i++) {
    rowData[i] = new Array(sheetHeaders.length);
  }

  console.log("RowCount:" + sheet.rowCount);

  await rows.forEach((row, i) => {
    for (let j = 0; j < sheetHeaders.length; j++) {
      console.log(row[sheetHeaders[j]]);
      rowData[i].splice(j, 1, row[sheetHeaders[j]]);
    }
  });

  const sheetData = { headers: sheetHeaders, rows: rowData };

  return response.json(sheetData);
});

module.exports = sheetsRouter;
