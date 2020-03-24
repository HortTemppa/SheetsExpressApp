require("dotenv").config();
const sheetsRouter = require("express").Router();

const { GoogleSpreadsheet } = require("google-spreadsheet");
const bodyParser = require("body-parser");

const credentials = require("../client_secret.json");

sheetsRouter.use(bodyParser.json());
sheetsRouter.use(bodyParser.urlencoded({ extended: true }));

sheetsRouter.put("/", async (request, response) => {
  const document = await new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

  await document.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key
  });

  await document.loadInfo();

  const sheet = await document.sheetsByIndex[0];

  await sheet.loadCells(request.body.cell);

  const cell = await sheet.getCellByA1(request.body.cell);

  const data = request.body.data;

  cell.value = data;

  await sheet.saveUpdatedCells();

  return response.status(200).send();
});

sheetsRouter.post("/", async (request, response, next) => {
  const document = await new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

  await document.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key
  });

  const data = request.body;

  console.log(data);

  await document.loadInfo();

  const sheet = await document.sheetsByIndex[0];

  await sheet.addRow(data);

  return response.status(200).send();
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

  const rowData = new Array(rows.length);

  for (var i = 0; i < rowData.length; i++) {
    rowData[i] = new Array(sheetHeaders.length);
  }

  await rows.forEach((row, i) => {
    for (let j = 0; j < sheetHeaders.length; j++) {
      rowData[i].splice(j, 1, row[sheetHeaders[j]]);
    }
  });

  const sheetData = { headers: sheetHeaders, rows: rowData };

  return response.status(200).json(sheetData);
});

module.exports = sheetsRouter;
