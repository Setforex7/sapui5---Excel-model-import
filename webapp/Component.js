sap.ui.define([
    "sap/ui/core/UIComponent",
    "excel/model/models",
    "sap/ui/model/json/JSONModel"
], (UIComponent, models, JSONModel) => {
    "use strict";

    return UIComponent.extend("excel.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // jQuery.sap.includeScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
            jQuery.sap.includeScript("../utils/xlsx.full.min.js");

            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            const oExcelModel = new JSONModel({ excelRows: [ {Name: 'bruno', Age: 15, Job: 'Developer', Address: ''},
                                                             {Name: 'tomas', Age: 12, Job: 'Pasteleiro', Address: ''} ] });
            this.setModel(oExcelModel, "excelModel");

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        }
    });
});