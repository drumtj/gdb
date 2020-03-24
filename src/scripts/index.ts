// import $ from "jquery";

interface QueryOption {
	sheetName?: string;
	gid? 			: string | number;
	sql				: string;
};

function xhr(url){
	return new Promise(function(resolve, reject){
		var x = new XMLHttpRequest();
    x.open('GET', url, true);
    x.onreadystatechange = function(){
			if(this.readyState == this.DONE){
				if(this.status == 200 || this.status == 201) {
					resolve(this.responseText);
				}else{
					reject(this.responseText);
				}
			}
		};
    x.send();
	})
}

export default class GDB {
	//static REQUEST_TIMEOUT:string = "requestTimeout";

	//private qurl:string = "https://spreadsheets.google.com/tq?";
	private qurl:string = "https://docs.google.com/spreadsheets/d/{id}/gviz/tq?";
	private id:string = null;
	tqx:string = 'out:json';
	// header:number = 1;

	constructor (id:string=null)//, header:number=2)
	{
		this.setId(id);
		// this.header = header;
	}

	setId(id:string){
		this.id = id;
	}

	getId(){
		return this.id;
	}

	private parse(json:string) {

		var data:any = JSON.parse(json);
    // console.error("parse", data);
		if(data.status == "error"){
			// console.error(data.errors);
			throw data.errors;
		}
		var cols = data.table.cols;
		var rows = data.table.rows;
		if(cols[0].label == ""){
			//시트의 첫 컬럼이 번호로 안되있으면 해더가 0으로 되더라.
			//이때 rows에 첫 배열에 해더가 들어온다.
			cols.forEach(function(col, i){
				if(rows[0]['c'][i]){
					col.label = rows[0]['c'][i].v;
				}
			})
			rows.splice(0, 1);
		}
		var column_length = cols.length;
		if (!column_length || !rows.length)
		{
			return false;
		}
		var columns = [],
			result:any = [],
			row_length: number,
			value;
		var column_idx, rows_idx, row_idx;
		for (column_idx in cols)
		{
			columns.push(cols[column_idx].id);
		}
		for (rows_idx in rows)
		{
			row_length = rows[rows_idx]['c'].length;
			if (column_length != row_length)
			{
				// Houston, we have a problem!
				return false;
			}
			for (row_idx in data.table.rows[rows_idx]['c'])
			{
				if (!result[rows_idx])
				{
					result[rows_idx] = {};
				}
				value = !!rows[rows_idx]['c'][row_idx] ? rows[rows_idx]['c'][row_idx].v : null;
				result[rows_idx][columns[row_idx]] = value;
			}
		}

		// console.error("cols", cols);
		// console.error("columns", columns);
		result.getHeader = function(){
			return JSON.parse(JSON.stringify(cols));
		}
		result.findColumnKeyByName = function (name){
			let names, isString;
			if(typeof name === "string"){
				isString = true;
				names = name.split(',');
			}else if(Array.isArray(name)){
				names = name;
			}
			names = names.map(function(name){
				return name.trim();
			})
			names = names.map(function(name){
	      for(let k in cols){
					// console.error(cols[k].label, name);
	        if(cols[k].label == name){
	          return cols[k].id;
	        }
	      }
			})
			if(isString){
				return names.join(',');
			}

			return names.length <= 1 ? names[0] : names;
    }
		result.getRow = function(index){
			return this[index];
		}
    result.getColumn = function(columnKey){
			let keys;
			if(Array.isArray(columnKey)){
				keys = columnKey;
			}else if(typeof columnKey === "string"){
				keys = columnKey.split(',');
			}else{
				throw "wrong param";
			}

			keys = keys.map(function(key){
				return key.trim();
			})

			// console.error(keys);

      let rr = [];
      for(let i=0; i<keys.length; i++){
        // let ckey = this.findColumnKeyByName(keys[i]);
				let ckey = keys[i];
  			if(!ckey) {
					rr.push([]);
					break;
				}

        let l = this.length, r=[], lastRow=0;

        for(let i=1; i<l; i++){
					// console.error(this[i][ckey]);
          if(this[i][ckey] !== null){
  					lastRow = i;
            r.push(this[i][ckey]);
          }
        }
  			r.splice(lastRow+1);
        rr.push(r);
      }

      return rr.length <= 1 ? rr[0] : rr;
    }
		return result;
	}

	query(option:QueryOption) {
		return this.request(this.id, option);
	}

	request(id:string, option:QueryOption){
		if(id == null){
			return Promise.reject("wrong id");
		}

		var params:any = {
			//key: dkey,
			tq: encodeURIComponent(option.sql),
			// header: this.header,
			tqx: this.tqx
		};

		if( option.sheetName ){
			params.sheet = encodeURIComponent(String(option.sheetName));
		} else if( option.gid ){
			params.gid = option.gid;
		}else{
			Promise.reject("gid또는 sheet 이름이 잘못됨");
		}

		var qs = [];
		for (var key in params)
		{
			qs.push(key + '=' + params[key]);
		}

		let self = this;
		return xhr(this.qurl.replace("{id}",id) + qs.join('&')).then(function(data:string){
			let json;
			try{
				json = self.parse(data.substring(data.indexOf('{'), data.lastIndexOf('}')+1));
			}catch(e){
				return Promise.reject(e);
			}
			return json;
		});
	}


}

//https://developers.google.com/chart/interactive/docs/querylanguage#Language_Syntax
//select D,F count(C) where (B contains ‘author name’) group by D, F
//SELECT B, C, D, F WHERE C CONTAINS ‘Florida’
//select sum(B) pivot C
//select C, count(I) where (G contains ‘2011’) group by C
// var db = new GSheet("1uKS3Jixwt2Crp6UcmcJpeWx8t-cCj4XJZ1wvWgxcN_s", 6);
// db.query({
//   gid : ipSheetGid,
//   sql : "SELECT count(A) where B = 'permit' and (A = '" + ip() +"')",
//   // sql : "SELECT count(A) where B = 'permit' and (A = '" + ip() +"' or A = '"+ sigongIp +"')",
//   callback : function(data){
//     if(data[0] && data[0]["count-A"] > 0){
//       $.cookie('auth', "true", {expires: 1});
//       authSuccess();
//       // initPage();
//     } else{
//       authFail();
//     }
//   }
// });
