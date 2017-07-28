function SinriTableX(table_id,readonly){
    return {
        table_id:table_id,
        readonly:(!!readonly),
        DATA:null,
        INPUTS:null,
        cornerCellContent:"",
        customizedTitleForRows:[],//default as 1,2,3
        customizedTitleForColumns:[],//default as A,B,C
        init:function(rows,columns){
            document.querySelector("#"+this.table_id).innerHTML="";
            for (var i=0; i<rows; i++) {
                var row = document.querySelector("#"+this.table_id).insertRow(-1);
                for (var j=0; j<columns; j++) {
                    var letter = this.convertNumberToColumnCode(j);//String.fromCharCode("A".charCodeAt(0)+j-1);
                    if(i==0 && j==0){
                        row.insertCell(-1).innerHTML=this.cornerCellContent;
                    }else{
                        if(i==0){
                            row.insertCell(-1).innerHTML="<span class='sinriExcelJsColumnTitle' title='"+letter+"'>"+(this.customizedTitleForColumns[j-1]?this.customizedTitleForColumns[j-1]:letter)+"</span>";
                        }else if(j==0){
                            row.insertCell(-1).innerHTML="<span class='sinriExcelJsRowTitle' title='"+i+"'>"+(this.customizedTitleForRows[i-1]?this.customizedTitleForRows[i-1]:i)+"</span>";
                        }else{
                            if(this.readonly){
                                row.insertCell(-1).innerHTML = "<span class='sinriExcelJsCell' cell_index='"+ letter+i +"'/>";
                            }else{
                                row.insertCell(-1).innerHTML = "<input class='sinriExcelJsCell' cell_index='"+ letter+i +"'/>";
                            }
                        }
                    }
                    //row.insertCell(-1).innerHTML = i&&j ? "<input class='sinriExcelJsCell' cell_index='"+ letter+i +"'/>" : i||letter;
                }
            }
            localStorage.clear();
            this.DATA={};
            if(this.readonly){
                this.INPUTS=[].slice.call(document.querySelectorAll("span.sinriExcelJsCell"));
            }else{
                this.INPUTS=[].slice.call(document.querySelectorAll("input.sinriExcelJsCell"));
            }
            var that=this;

            this.INPUTS.forEach(function(elm) {
                //console.log(elm)
                if(!that.readonly){
                    elm.onfocus = function(e) {
                        e.target.value = localStorage[e.target.getAttribute('cell_index')] || "";
                    };
                    elm.onblur = function(e) {
                        localStorage[e.target.getAttribute('cell_index')] = e.target.value;
                        that.computeAll();
                    };
                }
                var getter = function() {
                    var value = localStorage[elm.getAttribute('cell_index')] || "";
                    if (value.charAt(0) == "=") {
                        with (that.DATA) return eval(value.substring(1));
                    } else {
                        return that.isNumeric(value)?parseFloat(value):value;
                        //return isNaN(parseFloat(value)) ? value : parseFloat(value);
                    }
                };
                Object.defineProperty(that.DATA, elm.getAttribute('cell_index'), {get:getter});
                //Object.defineProperty(that.DATA, elm.getAttribute('cell_index').toLowerCase(), {get:getter});
            });
            this.computeAll()
        },
        isNumeric:function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        computeAll:function() {
            var that=this;
            this.INPUTS.forEach(function(elm) {
                try {
                    if(that.readonly){
                        elm.innerHTML=that.DATA[elm.getAttribute('cell_index')];
                    }else{
                        elm.value = that.DATA[elm.getAttribute('cell_index')];
                    }
                } catch(e) {
                    console.log(e);
                }
            });
        },
        setCornerCellContent:function(content){
            this.cornerCellContent=content;
        },
        setTitleRowContent:function(titles){
            this.customizedTitleForColumns=titles;
        },
        setTitleColumnContent:function(titles){
            this.customizedTitleForRows=titles;
        },
        convertNumberToColumnCode:function(columnNumber){
            if(columnNumber<1)return "";
            //from 1: A-Z,AA-AZ,BA-BZ,...,ZA-ZZ,AAA-AAZ,...
            var dividend = columnNumber;
            var columnName = "";
            var modulo=0;

            while (dividend > 0)
            {
                modulo = (dividend - 1) % 26;
                columnName = String.fromCharCode(65 + modulo) + columnName;
                dividend = parseInt((dividend - modulo) / 26,10);
            }

            return columnName;
        },
        loadDataWithCellIndex:function(data){
            // NOTE: overflowed cell info in data would be neglected.
            var nodes;
            if(this.readonly){
                nodes=document.querySelectorAll("#"+this.table_id+" span.sinriExcelJsCell");
            }else{
                nodes=document.querySelectorAll("#"+this.table_id+" input.sinriExcelJsCell");
            }
            for(var i=0;i<nodes.length;i++){
                if(!nodes[i].hasAttribute('cell_index')){
                    continue;
                }
                var cell_index=nodes[i].getAttribute('cell_index');
                if(data[cell_index]===undefined){
                    data[cell_index]='';
                }
                localStorage[cell_index] = data[cell_index];
            }
            this.computeAll()
        },
        loadDataWithMatrix:function(matrix){
            for (var i=0; i<matrix.length; i++) {
                for (var j=0; j<matrix[i].length; j++) {
                    var letter = this.convertNumberToColumnCode(j+1); //String.fromCharCode("A".charCodeAt(0)+j-1+1);
                    var cell_index=letter+(i+1);
                    localStorage[cell_index]=matrix[i][j];
                }
            }
            this.computeAll();
        },
        appendCSS:function(){
            function createStyleSheet(){
                var head=document.head || document.getElementByTagName('head')[0];
                var style=document.createElement('style');
                style.type='text/css';
                head.appendChild(style);
                return style.sheet||style.styleSheet;
            }
            var sheet=createStyleSheet();
            sheet.insertRule(".sinriExcelJsCell {border: none;width: 80px;font-size: 14px;padding: 2px;display: inline-block;}",0);
            sheet.insertRule(".sinriExcelJsCell:hover {background-color: #eee;}",0);
            sheet.insertRule(".sinriExcelJsCell:focus {background-color: #ccf;}",0);
            sheet.insertRule(".sinriExcelJsCell:not(:focus) {text-align: right;}",0);
            sheet.insertRule(".sinriExcelJsColumnTitle {display:inline-block;padding:2px 4px;}",0);
            sheet.insertRule(".sinriExcelJsRowTitle {display:inline-block;padding:2px 4px;}",0);
            sheet.insertRule("#"+this.table_id+" {border-collapse: collapse;}",0);
            sheet.insertRule("#"+this.table_id+" td {border: 1px solid #999;padding: 0;}",0);
            sheet.insertRule("#"+this.table_id+" tr:first-child td, td:first-child {background-color: #ccc;padding: 1px 3px;font-weight: bold;text-align: center;}",0);
        }
    }
}
