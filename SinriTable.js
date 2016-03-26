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

						var td = document.createElement("td");
						td.setAttribute('row_index',r_index);
						td.setAttribute('col_index',c_index);
						td.setAttribute('coor_hash',r_index+'_'+c_index);

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
	return this;
}