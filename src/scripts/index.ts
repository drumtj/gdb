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
	private qurl:string = "https://docs.google.com/spreadsheets/d/{key}/gviz/tq?";
	private key:string = null;
	tqx:string = 'out:json';
	header:number = 1;

	constructor (key:string=null, header:number=1)
	{
		this.setKey(key);
		this.header = header;
	}

	setKey(key:string){
		this.key = key;
	}

	parse(json:string) {

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
			result = [],
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
		return result;
	}

	query(option:QueryOption) {
		return this.drequest(this.key, option);
	}

	// request(option:QueryOption): JQueryXHR{
	// 	return this.drequest(this.key, option);
	// }

	drequest(dkey:string, option:QueryOption){
		if(dkey == null){
			return Promise.reject("wrong key");
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
		return xhr(this.qurl.replace("{key}",dkey) + qs.join('&')).then(function(data:string){
			let json;
			try{
				json = self.parse(data.substring(data.indexOf('{'), data.lastIndexOf('}')+1));
			}catch(e){
				return Promise.reject(e);
			}
			return json;
		});
		// console.error(qs.join('&'));
		// return new Promise(function(resolve, reject){
		// 	$.ajax(( self.qurl.replace("{key}",dkey) + qs.join('&')), {
		// 	//$.ajax( this.qurl + qs.join('&'), {
	  //     type: "get",
	  //     crossDomain: true,
	  //     //type: "get",
	  //     dataType: "text",
		// 		//type: "jsonp",
	  //     //jsonpCallback: "google.visualization.Query.setResponse",
		// 		//timeout: 15000,
		// 		success: function(data){
		// 			try{
		// 				data = data.substring(data.indexOf('{'), data.lastIndexOf('}')+1);
		// 				resolve(self.parse(data));
		// 				//console.error(data);
		// 				//console.log("GSheet response:", data);
		// 			}catch(e){
		// 				console.log(e)
		// 				reject("request data error");
		// 			}
		//
		// 			// if(option.callback) option.callback(data);
		// 		},
		// 		error: function(e){
		// 			console.error("ERROR", e);
		// 			reject("request data error");
		// 			//dispatchEvent(new Event(GSheet.REQUEST_TIMEOUT));
		// 		}
		// 	});
		// })
	}

	// dquery(dkey:string, option:QueryOption): JQueryXHR{
  //   var self = this;
	// 	if(option.callback){
	// 		var fn = option.callback;
	// 		option.callback = function(jsonStr){
	// 			try{
	// 				var p = self.parse(jsonStr);
	// 			}catch(e){
	// 				throw new Error("파싱오류");
	// 			}
	// 			fn.call(null, p);
	// 		};
	// 	}
	// 	return this.drequest(dkey, option);
	// }

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
