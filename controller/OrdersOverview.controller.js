sap.ui.define([
	"sapui5_task/controller/BaseController",
	"sap/ui/core/Fragment"

], function (BaseController, Fragment) {
	"use strict";

	return BaseController.extend("sapui5_task.controller.OrdersOverview", {

		onInit: function() {			
								
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

		onOpenDialog : function () {
			if(!this.oDialog){
				this.oDialog = sap.ui.xmlfragment("sapui5_task.view.CreateOrder", this);
				this.getView().addDependent(this.oDialog);
				this.oDialog.open();
			} else {
				this.oDialog.open();
			}
		},

		onCloseDialog : function () {	
			this.oDialog.close();
		},		

		addOrder: function(){
			var context = this;
			var oModel = this.getView().getModel("mainData");			
			var orderToCreate = this.createOrderObject();
			oModel.create("/Orders", orderToCreate, {
				success: function(){
					jQuery.sap.log.info("Sucsess");
					context.onCloseDialog();
				},
				error : function () {
					jQuery.sap.log.error("Error");
				}
			});					
		},

		createOrderObject: function() {
			var orderModel = this.getView().getModel("orderToCreate");			
			var orderToCreate = orderModel.getData();
			var currentDate = new Date().toISOString();
			orderToCreate.summary.createdAt	= currentDate;
			orderToCreate.shipTo.shipedAt = currentDate;
			return orderToCreate;
		}
	});
});