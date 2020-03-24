// import GDB from "../../dist/gdb.js";
import GDB from "./index";


var db = new GDB("1Ha9S6ZjGobRoIzzIHJeeUKcLBYqooRZ7V7PMCEN3qKg");

db.query({
  sheetName: "data",
  sql: "SELECT B, C, D, E where D is not null"
  // sql: "SELECT *"
}).then(function(data){
  console.log("data", data);
  console.log('findColumnKeyByName("author") =>', data.findColumnKeyByName("author"));
  console.log('findColumnKeyByName("author, email") =>', data.findColumnKeyByName("author, email"));
  console.log('findColumnKeyByName(["author", "email"]) =>', data.findColumnKeyByName(["author", "email"]));
  console.log('getColumn("E") =>', data.getColumn("E"));
  console.log('getColumn(findColumnKeyByName("author, email")) =>', data.getColumn(data.findColumnKeyByName("author, email")));
  console.log('getRow(0) =>', data.getRow(0));
  console.log('getHeader() =>', data.getHeader());
}).catch(function(e){
  console.error(e);
})
