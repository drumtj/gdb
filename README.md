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
<script src="https://unpkg.com/@drumtj/wiki@1.0.5/dist/gdb.js"></script>
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

```js
// var db = new GDB("[google-sheet-id]", 5); // for set start header. default 1
var db = new GDB("[google-sheet-id]");
db.query({
  ////// input sheetname or sheetid(gid)
  sheetName: "sheetname",
  //gid: 122345642, //sheetid

  ////// sql query
  // sql: "SELECT *"
  // sql : "SELECT E, F, G, L where J = 'AnimateCC' and L IS NOT NULL"
  sql : "SELECT E, F, G, J, L where (J = 'AnimateCC' or J = 'FullAni') and L IS NOT NULL"
}).then(function(data){
  console.log("data:", data);

  console.log(data.findColumnKeyByName("AnimaionType"));
  console.log(data.getColumn("AnimaionType"));
  console.log(data.getRow(0));
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


  constructor(sheetID:string=null, header:number=1);
  setId(sheetID:string);
  getId();
  query(option:QueryOption):Promise<GDBRowData[]>;
}  

data.findColumnKeyByName(columnName:string):string;
data.getColumn(columnName:string):any[];
data.getRow(index:number):Object;
```


## License

MIT
