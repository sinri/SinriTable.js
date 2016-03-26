# SinriTable.js
Editable Table Component in Javascript for Web Page.

## Set up SinriTable.js

You need to load the this with

	<link rel="stylesheet" type="text/css" href="SinriTable.css">
	<script src="SinriTable.js"></script>

And in HTML page body, set one div such as 

	<div id="demo_st" class="SinriTable"></div>

And for it create one instance of SinriTable Object with

	var theST=SinriTable('demo_st');

Okay, now you can benefit from SinriTable with its various(?) functions.

## Details of SinriTable.js

### Property

`table_div_id` : Store the id of one div, in which the target table would be shown in.

`editable` : Determine if the table created later editable.

### Function

`function init(dataMatrix,editable)`

This function to generate a new table instance in the preset div. Parameter `dataMatrix` is a json object, which would be described later. Parameter `editable` determines if the generated table is editable.

`function bodyJson()`

This function is to make the data in table body to an JSON array and stringify it to return.

### Data Format

Data Matrix is a json object which contains two keys, `title` and `body`. Both of the two contain an array with one or more item, one item for one row. Item for title lines could be String or object with three possible keys of `name`, `rowspan` and `colspan`, but `name` must be there. Item for body lines should be a value to display. For example:

	var dm={
		title:[
			[{name:'No.',rowspan:2},{name:'Part I',colspan:2},{name:'Part II',colspan:2}],
			['AName','BName','CName','DName']
		],
		body:[
			['0','A','B','C','D'],
			['1','A1','B1','C1','D1'],
			['2','A2','B2','C2','D2'],
			['3','A3','B3','C3','D3'],
			['4','A4','B4','C4','D4'],
			['5','A5','B5','C5','D5'],
		]
	};


