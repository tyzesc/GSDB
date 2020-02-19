// import 'google-apps-script';

var app = SpreadsheetApp.getActiveSpreadsheet();

function asJSON(json) {
    var result = {};
    result.result = json;
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function asResult(msg) {
    return ContentService.createTextOutput('{"result":"' + msg + '"}').setMimeType(ContentService.MimeType.JSON);
}

function test() {
    var result;
    var obj = { parameter: {} };
    obj.parameter._table = "你好";
    obj.parameter._action = "getAll";

    Logger.log(obj);
    Logger.log(array_getAllObject(getSheet("你好")));
}

function testAppend() {
    var result;
    var obj = { parameter: {} };
    obj.parameter._table = "你好";
    obj.parameter._action = "append";
    obj.parameter._values = JSON.stringify({ "key1": "v1", "key2": "v1", "key3": "v1", "key4": "v1", "key5": "v1" });

    Logger.log(obj);
    result = doPost(obj);
    Logger.log(result);
}

function doGet(e) {
    var params = e.parameter;
    var sheet = getSheet(params._table);
    var action = params._action;
    switch (action) {
        case "getAll":
            return asJSON(array_getAllObject(sheet));
        default:
            break;
    }
}

function doPost(e) {
    var params = e.parameter;
    var sheet = getSheet(params._table);
    var action = params._action;
    var values = params._values;
    if (values == undefined)
        return;
    switch (action) {
        case "append":
            insertJson(sheet, -1, JSON.parse(values));
            return asResult("ok");
        case "fill":
            fillJsons(sheet, JSON.parse(values));
            return asResult("ok");
        default:
            break;
    }
}

function getSheet(name) {
    if (name == null || name == "")
        return null;

    var sheet = app.getSheetByName(name);
    if (sheet == null) {
        sheet = app.insertSheet();
        sheet.setName(name);
    }
    return sheet;
}


function fillJsons(sheet, arr) {
    if (sheet.getLastColumn() > 0 || sheet.getLastRow() > 0)
        sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).clear();
    for (var i = 0; i < arr.length; i++)
        insertJson(sheet, -1, arr[i]);
    return true;
}

// +--------+--------+--------+--------+
// |  key1  |  key2  |  key3  |  key4  |
// +--------+--------+--------+--------+
// | value1 | value2 | value3 | value4 |
// +--------+--------+--------+--------+
// | value5 | value6 | value7 | value8 |
// +--------+--------+--------+--------+   <----- insertJson (if position == -1)

function insertJson(sheet, position, json) {
    if (position == -1) {
        position = sheet.getLastRow() - 1;
    }
    var keys = array_KeysOf(sheet);
    // if the table is new. 
    if (keys.length == 0) {
        for (var key in json)
            keys.push(key);
        var range = sheet.getRange(1, 1, 1, keys.length);
        range.setValues([keys]);
        position = 0;
    }
    sheet.insertRowAfter(position + 1);
    for (var key in json) {
        var index = keys.indexOf(key) + 1;
        if (index == 0) {
            index = keys.length + 1;
            sheet.insertColumnAfter(keys.length);
            keys.push(key);
            sheet.getRange(1, index).setValue(key);
        }
        sheet.getRange(position + 2, index).setValue(json[key]);
    }
}

function insertValuesFront(sheet, position, arr) {
    sheet.insertRowAfter(position + 1);
    sheet.getRange(position + 2, 1, 1, arr.length).setValues([arr]);
}

// +--------+--------+--------+--------+
// |  key1  |  key2  |  key3  |  key4  |
// +--------+--------+--------+--------+   <----- insertJsonFront
// | value1 | value2 | value3 | value4 |
// +--------+--------+--------+--------+
// | value5 | value6 | value7 | value8 |
// +--------+--------+--------+--------+

function insertJsonFront(sheet, position, json) {
    var keys = array_KeysOf(sheet);
    sheet.insertRowAfter(position + 1);
    for (var key in json) {
        var index = keys.indexOf(key) + 1;
        if (index == 0) {
            index = keys.length + 1;
            sheet.insertColumnAfter(keys.length);
            keys.push(key);
            sheet.getRange(1, index).setValue(key);
        }
        sheet.getRange(position + 2, index).setValue(json[key]);
    }
}

function array_KeysOf(sheet) {
    var col_num = sheet.getLastColumn();
    if (col_num <= 0) return [];
    var range = sheet.getRange(1, 1, 1, col_num);
    range.setNumberFormat("@");             // 改成純文字 plaintext
    range.setHorizontalAlignment("center"); // 置中比較好看喇
    var keys = range.getValues()[0];
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "")
            return [];               // 如果有 key 是空的，就不要
    }
    return keys;
}

function array_getAllObject(sheet) {
    var col_num = sheet.getLastColumn();
    var row_num = sheet.getLastRow();
    if (col_num <= 0 || row_num <= 1) return [];

    var range_key = sheet.getRange(1, 1, 1, col_num);
    var range_content = sheet.getRange(2, 1, row_num - 1, col_num);

    var keys = range_key.getValues()[0];
    var contents = range_content.getValues();
    Logger.log(keys);
    Logger.log(contents);

    var result = [];
    for (var row = 0; row < contents.length; row++) {
        var obj = {};
        for (var i = 0; i < keys.length; i++)
            obj[keys[i]] = contents[row][i];
        result.push(obj);
    }
    return result;
}