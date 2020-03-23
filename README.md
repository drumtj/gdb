# GDB

[![npm version](https://img.shields.io/npm/v/@drumtj/gdb.svg?style=flat)](https://www.npmjs.com/package/@drumtj/gdb)
[![license](https://img.shields.io/npm/l/@drumtj/gdb.svg)](#)

Library for using Google Sheets as a database


## Installing

Using npm:

```bash
$ npm install @drumtj/gdb
```

Using cdn:
```html
<script src="https://unpkg.com/@drumtj/wiki@1.0.12/dist/gdb.js"></script>
```

CommonJS
```js
import GDB from '@drumtj/gdb';
```
```js
const GDB = require('@drumtj/gdb');
```

## Caution
Only Google Sheet with shared link is working.

## How To

### test google sheet
https://docs.google.com/spreadsheets/d/1Ha9S6ZjGobRoIzzIHJeeUKcLBYqooRZ7V7PMCEN3qKg/edit#gid=0

### code
```js
var db = new GDB("1Ha9S6ZjGobRoIzzIHJeeUKcLBYqooRZ7V7PMCEN3qKg");
db.query({
  ////// input sheetname or sheetid(gid)
  sheetName: "data",
  //gid: 122345642, //sheetid

  ////// sql query
  // sql: "SELECT *"
  sql : "SELECT B, C, D, E where D is not null"
}).then(function(data){
  console.log("data", data);
  console.log('findColumnKeyByName("author") =>', data.findColumnKeyByName("author"));
  console.log('findColumnKeyByName("author, email") =>', data.findColumnKeyByName("author, email"));
  console.log('findColumnKeyByName(["author", "email"]) =>', data.findColumnKeyByName(["author", "email"]));
  console.log('getColumn("E") =>', data.getColumn("E"));
  console.log('getColumn(findColumnKeyByName("author, email")) =>', data.getColumn(data.findColumnKeyByName("author, email")));
  console.log('getRow(0) =>', data.getRow(0));
});
```

## Interface
```ts
class GDB {
  interface QueryOption {
  	sheetName?: string;
  	gid? 			: string | number;
  	sql				: string;
  };

  interface GDBRowData {
    [column: string]: string|number;
  }

  constructor(sheetID:string=null, header:number=2);
  setId(sheetID:string);
  getId();
  query(option:QueryOption):Promise<GDBRowData[]>;
}

data.findColumnKeyByName(columnName:string|string[]):string|string[];
data.getColumn(columnKey:string):any[]|any[][];
data.getRow(index:number):Object;
```

## Test
```sh
git clone https://github.com/drumtj/gdb.git
cd gdb
npm install
npm start
```

## License

MIT
