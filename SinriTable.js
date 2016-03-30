var SinriTable=function(table_div_id,editable){
	var that=this;
	this.table_div_id=table_div_id;
	this.editable=editable;

	this.init=function(dataMatrix,onCellEdited){
		var table_div=document.getElementById(that.table_div_id);
		while (table_div.firstChild) {
			console.log('to remove '+table_div.firstChild);
			table_div.removeChild(table_div.firstChild);
		}
		var table=document.createElement("table");

		if(dataMatrix){
			var dm_title=dataMatrix.title;
			var dm_body=dataMatrix.body;

			if(dm_title){
				var thead=document.createElement('thead');
				for(var r_index=0;r_index<dm_title.length;r_index++){
					var row=dm_title[r_index];

					var tr = document.createElement("tr");
					tr.setAttribute('row_index',r_index);
					for(var c_index=0;c_index<row.length;c_index++){
						var col=row[c_index];

						var th = document.createElement("th");

						if(typeof col == 'string'){
							var textNode = document.createTextNode(col);
							th.appendChild(textNode); 
						}else{
							if(col.colspan)
							th.setAttribute('colspan',col.colspan);
							if(col.rowspan)
							th.setAttribute('rowspan',col.rowspan);

							var textNode = document.createTextNode(col.name);
							th.appendChild(textNode); 
						}

						tr.appendChild(th);
					}
					thead.appendChild(tr);
				}
				table.appendChild(thead);
			}
			if(dm_body){
				var tbody=document.createElement('tbody');
				for(var r_index=0;r_index<dm_body.length;r_index++){
					var row=dm_body[r_index];

					var tr = document.createElement("tr");
					tr.setAttribute('row_index',r_index);
					for(var c_index=0;c_index<row.length;c_index++){
						var col=row[c_index];
						var formula=col;
						// if(col.length>0 && col[0]=='='){
							// formula=col;
						// }else{
							// formula="";
						// }

						var td = document.createElement("td");
						td.setAttribute('row_index',r_index);
						td.setAttribute('col_index',c_index);
						td.setAttribute('coor_hash',r_index+'_'+c_index);

						td.setAttribute('formula',formula);

						if(!that.editable){
							var textNode = document.createTextNode(col);
							td.appendChild(textNode); 
						}else{
							var textbox=document.createElement('input');
							textbox.setAttribute('row_index',r_index);
							textbox.setAttribute('col_index',c_index);
							textbox.setAttribute('coor_hash',r_index+'_'+c_index);
							textbox.setAttribute('class','SinriTableCellInputInactive');

							textbox.setAttribute('value',col);

							if(typeof onCellEdited=='function'){
								textbox.addEventListener('input',function(){
									onCellEdited(r_index,c_index,this.value);
									that.refresh();
								});
							}

							td.appendChild(textbox);
						}


						tr.appendChild(td);
					}
					tbody.appendChild(tr);
				} 
				table.appendChild(tbody);
			}
		}

		table_div.appendChild(table);

		this.refresh();
	}

	this.refresh=function(){
		var table_div=document.getElementById(that.table_div_id);
		var table=table_div.getElementsByTagName('table');
		table=table[0];
		var thead=table.getElementsByTagName('thead');
		thead=thead[0];
		var tbody=table.getElementsByTagName('tbody');
		tbody=tbody[0];
		console.log("REFRESH BODY: ");
		console.log(tbody);
		var body_tr_list=tbody.getElementsByTagName('tr');
		for(var tr_index=0;tr_index<body_tr_list.length;tr_index++){
			var the_tr=body_tr_list[tr_index];
			var the_td_list=the_tr.getElementsByTagName('td');	
			for(var td_index=0;td_index<the_td_list.length;td_index++){
				var the_td=the_td_list[td_index];
				// var tb=the_td.getElementsByTagName('input');
				// var cell_str='';
				// if(tb && tb.length>0){
				// 	tb=tb[0];
				// 	cell_str = (tb.value);
				// }else{
				// 	cell_str = (the_td.textContent);
				// }
				console.log("REFRESH["+tr_index+","+td_index+"]->");
				var value=that.getCellValue(tr_index,td_index);
				console.log(value);
				var formula=that.getCellFormula(tr_index,td_index);
				console.log(formula);
				if(formula.length>0 && formula[0]=='='){
					value=that.parseCellString(formula.slice(1));
				}
				that.setCellString(tr_index,td_index,value);
			}
		}
	}

	this.getCellTd=function(row,col){
		console.log("getCellString("+row+","+col+")")
		var table_div=document.getElementById(that.table_div_id);
		var table=table_div.getElementsByTagName('table');
		table=table[0];
		var thead=table.getElementsByTagName('thead');
		thead=thead[0];
		var tbody=table.getElementsByTagName('tbody');
		tbody=tbody[0];

		var body_tr_list=tbody.getElementsByTagName('tr');
		var the_tr=body_tr_list[row];
		var the_td_list=the_tr.getElementsByTagName('td');
		var td=the_td_list[col];

		return td;
	}

	this.getCellFormula=function(row,col){
		var td=that.getCellTd(row,col);

		var formula=td.getAttribute('formula');
		return formula;
	}

	this.getCellString=function(row,col){
		var td=that.getCellTd(row,col);

		var tb=td.getElementsByTagName('input');
		if(tb && tb.length>0){
			tb=tb[0];
			return (tb.value);
		}else{
			return (td.textContent);
		}
	}

	this.setCellString=function(row,col,v){
		var td=that.getCellTd(row,col);

		var tb=td.getElementsByTagName('input');
		if(tb && tb.length>0){
			tb=tb[0];
			tb.value=v;
		}else{
			td.textContent=v;
		}
	}

	this.parseCellCodeToValue=function(cell_code){
		console.log("parseCellCodeToValue("+cell_code+")")
		var cc=cell_code.match(/\[(\d+),(\d+)\]/);
		console.log("parseCellCodeToValue("+cell_code+") cc = ");
		console.log(cc);
		return that.getCellValue(cc[1],cc[2]);
	}

	this.getCellValue=function(row,col){
		console.log("getCellValue("+row+","+col+")")
		var str=that.getCellString(row,col);
		if(str[0]!='='){
			return str;
		}
		else {
			return that.parseCellString(str.slice(1));
		}
	}

	this.parseCellString=function(str){
		//PART I FORMULA
		var re=/(count|sum|ave|min|max)\(\d+,\d+,\d+,\d+\)/.exec(str);
		console.log("parseCellString("+str+") re1=");
		console.log(re);
		if(re){
			var first=re.index;
			var length=re[0].length;
			var k=eval('that.formula().'+re[0]);
			var new_str=str.slice(0,first)+''+k+''+str.slice(first+length);
			return that.parseCellString(new_str);
		}

		//PART II REPLACE CELL
		var re=/\[\d+,\d+\]/.exec(str);
		console.log("parseCellString("+str+") re2=");
		console.log(re);
		if(re){
			var first=re.index;
			var length=re[0].length;
			var k=that.parseCellCodeToValue(re[0]);
			var new_str=str.slice(0,first)+''+k+''+str.slice(first+length);
			return that.parseCellString(new_str);
		}else{
			var v1 = that.safeEval(str);
			var v2 = that.safeEval(v1);
			while(v1!=v2){
				v1=v2;
				v2=that.safeEval(v1);
			}
			return v2;
		}
	}

	this.safeEval=function(code){
		try {
			return eval(code);
		}catch (e) {
			if(e instanceof SyntaxError){
				return code;
			}
			return code;
		}
	}

	this.bodyJson=function(){
		var table_div=document.getElementById(that.table_div_id);
		var table=table_div.getElementsByTagName('table');
		table=table[0];
		var thead=table.getElementsByTagName('thead');
		thead=thead[0];
		var tbody=table.getElementsByTagName('tbody');
		tbody=tbody[0];

		var json_array=Array();

		var body_tr_list=tbody.getElementsByTagName('tr');
		for(var tr_i=0;tr_i<body_tr_list.length;tr_i++){
			var tr=body_tr_list[tr_i];

			var trArray=Array();

			var td_list=tr.getElementsByTagName('td');
			for(var td_i=0;td_i<td_list.length;td_i++){
				var td=td_list[td_i];

				var tb=td.getElementsByTagName('input');
				if(tb && tb.length>0){
					tb=tb[0];
					trArray.push(tb.value);
				}else{
					trArray.push(tb.textContent);
				}
			}
			json_array.push(trArray);
		}
		return JSON.stringify(json_array);
	}

	//////

	//INNER FORMULA FUNCTIONS
	this.formula = function(){
		var there=that;
		this.turnScaleToArray=function(r1,c1,r2,c2){
			console.log("turnScaleToArray("+r1+","+c1+","+r2+","+c2+")->("+Math.min(r1,r2)+","+Math.min(c1,c2)+","+Math.max(r1,r2)+","+Math.max(c1,c2)+")");
			var list=[];
			for(var row=Math.min(r1,r2);row<=Math.max(r1,r2);row++){
				for(var col=Math.min(c1,c2);col<=Math.max(c1,c2);col++){
					list.push(there.getCellValue(row,col));
				}
			}
			console.log(list);
			return list;
		}
		this.count=function(r1,c1,r2,c2){
			var list=this.turnScaleToArray(r1,c1,r2,c2);
			return list.filter(function(v){return v!=''}).length;
		}
		this.sum=function(r1,c1,r2,c2){
			var list=this.turnScaleToArray(r1,c1,r2,c2);
			var sum=0;
			list.forEach(function(v){
				var vv=parseFloat(v);
				if(!isNaN(vv))sum=sum+vv
			});
			return sum;
		}
		this.ave=function(r1,c1,r2,c2){
			var list=this.turnScaleToArray(r1,c1,r2,c2);
			var sum=0;
			var count=0;
			list.forEach(function(v){
				var vv=parseFloat(v);
				if(!isNaN(vv)){
					sum=sum+vv;
					count=count+1;
				}
			});
			return sum/count;
		}
		this.min=function(r1,c1,r2,c2){
			var list=this.turnScaleToArray(r1,c1,r2,c2);
			var theMin=null;
			list.forEach(function(v){
				var vv=parseFloat(v);
				if(!isNaN(vv)){
					if(theMin==null || theMin>vv){
						theMin=vv;
					}
				}
			});
			return theMin;
		}
		this.max=function(r1,c1,r2,c2){
			var list=this.turnScaleToArray(r1,c1,r2,c2);
			var theMax=null;
			list.forEach(function(v){
				var vv=parseFloat(v);
				if(!isNaN(vv)){
					if(theMax==null || theMax<vv){
						theMax=vv;
					}
				}
			});
			return theMax;
		}
		return this;
	}

	//////

	return this;
}