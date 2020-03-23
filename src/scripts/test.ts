import GDB from "./index";

var db = new GDB("[google-sheet-id]");
console.error(db);
db.query({
  sheetName: "data",
  sql: "SELECT *"
}).then(function(json){
  console.log(json);
}).catch(function(e){
  console.error(e);
})
