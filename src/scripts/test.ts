import GDB from "../../dist/gdb.js";


var db = new GDB("1PDi6pcuAqya5VuM044nkqrF1-oQWdRO4NDfubY2sX3k");
console.error(db);
db.query({
  sheetName: "data",
  sql: "SELECT *"
}).then(function(data){
  console.log(data);
  console.error(data.findColumnKeyByName("과목명"));
  console.error(data.getColumn("과목명"));
  console.error(data.getRow(0));
}).catch(function(e){
  console.error(e);
})
