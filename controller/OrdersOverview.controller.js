sap.ui.define([
	"sapui5_task/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sapui5_task.controller.OrdersOverview", {

		onInit: function() {
			console.log("controller init");			

			//this.getView().getModel("screenData").setProperty("/totalOrdersCount", 5);

			//console.log(this.getView().byId("ordersTable"));	
					
		},

		onBeforeRendering: function() {
			
		},
		
		deleteOrder: function(oEvent) {
			var oModel = this.getView().getModel("mainData");	

			var path = oEvent.getParameter("listItem").getBindingContext("mainData").getPath();

			oModel.remove(path);
		},

		navToMoreInfo: function(oEvent) {

			var path = oEvent.getSource().getBindingContext("mainData").getPath();			
			
			this.getRouter().navTo("orderDetails", {order_num : path.substr(1)});						
		},

		addOrder: function(){
		}
	});

});