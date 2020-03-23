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
	header:number = 1;

	constructor (id:string=null, header:number=1)
	{
		this.setId(id);
		this.header = header;
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
		var cols = data.table.cols;
		var rows = data.table.rows;
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
		result.findColumnKeyByName = function (name){
      for(let k in this[0]){
        if(this[0][k] == name){
          return k;
        }
      }
    }
		result.getRow = function(index){
			return this[index];
		}
    result.getColumn = function(name){
      let ckey = this.findColumnKeyByName(name);
			if(!ckey) return null;
      let l = this.length, r=[], lastRow=0;

      for(let i=1; i<l; i++){
        if(this[i][ckey] !== null){
					lastRow = i;
          r.push(this[i][ckey]);
        }
      }
			r.splice(lastRow+1);
      return r;
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
			header: this.header,
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
