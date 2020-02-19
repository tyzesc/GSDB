# GSDB
GSDB, using Google Spreadsheets as database.

## How to install
1. Create or open a spreadsheet in Google Sheets.
2. Select the menu item **Tools** > **Script editor**.
3. Paste the content in **main.js** into editor.
4. Select the menu item **Publish** > **Deploy as web app**.
5. Set **"Execute the app as:"** to **"Me(username@gmail.com)"**.
6. Set **"Who has access to the app:"** to **"Anyone, even anonymous"**.
7. Congratulations! Now you should remember this url.

## Usage

### getAll
> Get datas by sheetname.

Method: **GET**
Parameters:
 - \_action: "getAll"
 - \_table: Sheet name. **{string}**
 
Example: ```{url}/?_action=getAll&_table=example```

### append
> Insert data into table at the last row.

Method: **POST**
Parameters:
 - \_action: "append"
 - \_table: Sheet name. **{string}**
 - \_values: Anything you want to save. **{Object}**

Example: `{url}?_action=append&_table=example&_values={"key1":"v1","key2":"v1","key3":"v1","key4":"v1","key5":"v1"}`

### fill
> Replace all data.

Method: **POST**
Parameters:
 - \_action: "fill"
 - \_table: Sheet name. **{string}**
 - \_values: Anything you want to save. **{Array&lt;Object&gt;}**

Example: `{url}?_action=fill&_table=example&_values=[{"key1":"v1","key2":"v1","key3":"v1","key4":"v1","key5":"v1"},{"key1":"v1","key2":"v1","key3":"v1","key4":"v1","key5":"v1"}]`