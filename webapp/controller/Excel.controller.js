sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("excel.controller.Excel", {
        /**
         * @override
         */
        onInit: function() {
        },

        onUpload: function (oEvent) {
            this._import(oEvent.getParameter("files") && oEvent.getParameter("files")[0]);
        },

        _import: function (oFile) {
            let aExcelRows = [];
            const oExcelModel = this.getOwnerComponent().getModel('excelModel');
            const aExcelTableRows = oExcelModel.getProperty('/excelRows');

            //? Valida se o ficheiro existe
            if (oFile && window.FileReader) {

                //? Cria o objeto da classe que permite ler o conteudo dos ficheiros do tipo XLSX
                const reader = new FileReader();

                //? Função que da parse da xstring ( xlsx type ) para objetos JSON
                reader.onload = function (oRender) {
                    const data = oRender.target.result;
                    const workbook = XLSX.read(data, { type: 'binary' });

                    //? Percorre as sheets do ficheiro xlsx
                    workbook.SheetNames.forEach(sheetName => {

                        //? Converte cada linha na tabela num objeto em que será do tipo <key>: <valor_da_linha_atual>
                        //? Da referente sheet do ficheiro
                        const aExcelSheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                        
                        //? Guarda todas as linhas da sheet atual
                        aExcelRows = aExcelRows.concat(aExcelSheet);
                    });
                    
                    //? For para alterar os registos ( neste caso e o campo adress )
                    for(let oExcelRow of aExcelTableRows) {
                        const oPairRow = aExcelRows.find(oRow => oRow.Name === oExcelRow.Name 
                                                              && oRow.Age === oExcelRow.Age 
                                                              && oRow.Job === oExcelRow.Job );
                        if(!oPairRow) continue;
                        if(oPairRow.Address) oExcelRow.Address = oPairRow.Address;
                    }

                    //? Atualização do modelo
                    this.getOwnerComponent().getModel('excelModel').setProperty('/excelRows', aExcelTableRows);
                    this.getOwnerComponent().getModel('excelModel').refresh(true);
                }.bind(this);   

                //? Se acontecer algum erro, esta função vai ser chamada
                reader.onerror = function (oError) {
                    console.error(oError);
                };
                reader.readAsBinaryString(oFile);
            }
        },

        //? Função para exportar 
        onExport: function () {
            const oTable = this.byId("excelTable"); 
            const oBinding = oTable.getBinding("items");

            //? Constroi um array com os objetos do binding
            const aItems = oBinding.getContexts().map(function (oContext) {
                return oContext.getObject();
            });

            //? Constroi um array com os nomes das colunas
            const aCols = oTable.getColumns().map(function (oColumn) {
                return oColumn.getHeader().getText();
            });

            //? Cria a sheet do ficheiro xlsx
            const oSheet = XLSX.utils.json_to_sheet(aItems, {header: aCols});
            //? Cria o ficheiro
            const oWorkbook = XLSX.utils.book_new();
            //? Adiciona a sheet ao ficheiro
            XLSX.utils.book_append_sheet(oWorkbook, oSheet, "Sheet1");
            //? Preenche o ficheiro
            XLSX.writeFile(oWorkbook, "dataExported.xlsx");
        }
    });
});