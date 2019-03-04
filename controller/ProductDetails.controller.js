sap.ui.define([
    "sapui5_task/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ca/ui/model/format/DateFormat"

], function (BaseController, JSONModel, Filter, DateFormat) {
    "use strict";

    return BaseController.extend("sapui5_task.controller.App", {

        onInit: function() {                                 
            var oRouter = this.getRouter();
            oRouter.getRoute("productDetails").attachMatched(this._onRouteMatched, this);
            this.path = "";
            this.productId = 0;
            var screenData = new JSONModel();
            this.getView().setModel(screenData, "screenData");           
        },

        _onRouteMatched: function(oEvent) {
            this.path = oEvent.getParameter("arguments").product_num;
            this.productId = this.path.replace(/[^\d;]/g, '');
            console.log(this.productId);
            var oView = this.getView();
            var oModel = this.oView.getModel("mainData");
            oModel.read("/" + this.path, {
                success: function(data){
                    var details = new JSONModel(data);
                    oView.setModel(details, "productDetails");
                    jQuery.sap.log.info("Succsess");                 
                },
                error: function() {
                    jQuery.sap.log.error("Error");
                }
            });

            var filters = new Array();
            var filterById = new Filter("productId", sap.ui.model.FilterOperator.EQ, this.productId);
            filters.push(filterById);
            var oBinding = oView.byId("commentsList").getBinding("items");
            oBinding.filter(filters);    
        },
        
        onPost: function(oEvent) {           
			var oEntry = {
                comment: oEvent.getParameter("value"),
				author: this.getView().getModel("screenData").getProperty("/authorName"),
                createdDate: new Date,
                rating: this.getView().getModel("screenData").getProperty("/rating"),
                productId: this.productId
			};
			
            var oModel = this.getView().getModel("mainData");
            var context = this;
            oModel.create("/ProductComments", oEntry, {
				success: function(){
                    jQuery.sap.log.info("Sucsess");                   
				},
				error : function () {
					jQuery.sap.log.error("Error");
				}
			});		
		}
    });
});