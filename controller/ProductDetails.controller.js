sap.ui.define([
    "sapui5_task/controller/BaseController",
    "sap/ui/model/json/JSONModel"

], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sapui5_task.controller.App", {

        onInit: function() {            
            this.oView = this.getView();                     
            var oRouter = this.getRouter();
            oRouter.getRoute("productDetails").attachMatched(this._onRouteMatched, this);            
        },

        _onRouteMatched: function(oEvent) {
            var path = oEvent.getParameter("arguments").product_num;
            var oView = this.oView;
            var oModel = this.oView.getModel("mainData");
            oModel.read("/" + path, {
                success: function(data){
                    var details = new JSONModel(data);
                    oView.setModel(details, "productDetails");
                    jQuery.sap.log.info("Succsess");                 
                },
                error: function() {
                    jQuery.sap.log.error("Error");
                }
            });
        }
    });
});