const { google } = require("googleapis");

async function insertData(userdata){
    const auth = new google.auth.GoogleAuth({
        keyFile: "google-credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = process.env.spreadsheetId;
    const metaData = await googleSheets.spreadsheets.get({ auth, spreadsheetId,});
    const getRows = await googleSheets.spreadsheets.values.get({ auth, spreadsheetId, range: "Sheet1!A:A", });

    // Write row(s) to spreadsheet
    await googleSheets.spreadsheets.values.append({
        auth, spreadsheetId, range: "Sheet1!A:B", valueInputOption: "USER_ENTERED",
        resource: {
            values: [userdata],
        },
    });
}

module.exports = {
    insertData
};