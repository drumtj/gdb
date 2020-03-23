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
<script src="https://unpkg.com/@drumtj/wiki@1.0.2/dist/gdb.js"></script>
```

CommonJS
```js
import GDB from '@drumtj/gdb';
```
```js
const GDB = require('@drumtj/gdb');
```

## caution
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
  // sql : "SELECT E, F, G, L where J = 'AnimateCC' and L IS NOT NULL",
  sql : "SELECT E, F, G, J, L where (J = 'AnimateCC' or J = 'FullAni') and L IS NOT NULL"
}).then(function(json){
  console.error(json);
});

```


## License

MIT
