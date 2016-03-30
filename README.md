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

`function refresh()`

Force to recompute value of cells.

### Data Format

Data Matrix is a json object which contains two keys, `title` and `body`. Both of the two contain an array with one or more item, one item for one row. Item for title lines could be String or object with three possible keys of `name`, `rowspan` and `colspan`, but `name` must be there. Item for body lines should be a value to display. For example:

	var dm={
		title:[
			[{name:'No.',rowspan:2},{name:'Part I',colspan:2},{name:'Part II',colspan:2},{name:"FORMULA",colspan:2}],
			['AName','BName','CName','DName','FORMULA','EXPECTED']
		],
		body:[
			['0','1','2','3','4','5','=5'],
			['10','11','12','13','14','=[1,1]','11'],
			['20','21','22','23','24','=[2,3]+[2,4]/[2,2]',''+(23+24/22)],
			['30','31','32','33','34','=count(0,0,5,1)','12'],
			['40','41','42','34','44','=sum(0,0,5,1)','306'],
			['50','51','52','53','54','=ave(0,0,5,1)','25.5'],
		]
	};

In source data matrix json, you would find those string values begin with equal char `=`, which are defined as formulas. Formula functions now include `count`, `sum`, `ave`, `min`, `max`. Each of the functions has four parameters, `r1`, `c1`, `r2`, `c2`. For example, parameter `(0,0,1,1)` includes the sub matrix of 

	[0,0]	[0,1]
	[1,0]	[1,1]

