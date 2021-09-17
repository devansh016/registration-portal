# Registration Portal with Razorpay
A web app to register user for a event and collect payment using razorpay.

## Environment Variable Required
```sh
razorpay_key_id = ""
razorpay_key_secret = ""
MONGODB_URL = ""
spreadsheetId = ""
```
## Google Credentials for sheets
You will need to get a google credentials json file from google console for google sheet api and you have to create a google sheet. Add the client email you created in the google console to the google sheets as a editor and copy the spreadsheetid from the google sheet url.
For example https://docs.google.com/spreadsheets/d/1reuufhreoifuYHUBYU32B/edit#gid=0 the spreadsheet id is 1reuufhreoifuYHUBYU32B.

If you dont want to use google sheets you can remove the following lines from paymentController.js
```sh
const googleSheets = require('../util/googleSheet');

var user_data = await User.findOne({ order_id: req.body.razorpay_order_id });
await googleSheets.insertData([user_data.name, user_data.email, user_data.phone, user_data.college, user_data.address.address1, user_data.address.address2, user_data.address.city, user_data.address.state, user_data.address.pincode, user_data.order_id, user_data.paymentDate ]);
```
