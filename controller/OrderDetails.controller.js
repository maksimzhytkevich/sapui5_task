sap.ui.define([
    "sapui5_task/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("sapui5_task.controller.App", {

		onInit: function() {
            console.log("order details");
            var oRouter = this.getRouter();
            oRouter.getRoute("orderDetails").attachMatched(this._onRouteMatched, this);
        },
        
        _onRouteMatched: function(oEvent) {
            var path = oEvent.getParameter("arguments").order_num;

            var oView = this.getView();
            
            var oModel = oView.getModel("mainData");            

            oModel.read("/" + path, {
                success: function(data){
                    var details = new JSONModel(data);
                    
                    oView.setModel(details, "orderDetails");
                    jQuery.sap.log.info("Succsess");                 
                },
                error: function() {
                    jQuery.sap.log.error("Error");
                }
            });

        }
	});

});