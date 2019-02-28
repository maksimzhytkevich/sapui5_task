sap.ui.define([
	"sapui5_task/controller/BaseController",
	"sap/ui/core/Fragment"

], function (BaseController, Fragment) {
	"use strict";

	return BaseController.extend("sapui5_task.controller.OrdersOverview", {

		onInit: function() {
			
			this.oView = this.getView();	
			//this.oModel = this.oView.getModel("mainData");
			//console.log(this.oModel);	
			//this.getView().getModel("screenData").setProperty("/totalOrdersCount", 5);

			//console.log(this.getView().byId("ordersTable"));						
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
			var oView = this.oView;

			if (!this.byId("createOrderDialog")) {
				Fragment.load({
					id: oView.getId(),
					name: "sapui5_task.view.CreateOrder",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("createOrderDialog").open();
			}
		},

		onCloseDialog : function () {	
			this.oView.byId("createOrderDialog").close();
		},

		createOrderObject: function() {
			var orderModel = this.oView.getModel("orderToCreate");			
			var orderToCreate = JSON.parse(orderModel.getJSON());
			var currentDate = new Date().toISOString();
			orderToCreate.summary.createdAt	= currentDate;
			orderToCreate.shipTo.shipedAt = currentDate;
			return orderToCreate;
		},

		addOrder: function(){
			var oModel = this.getView().getModel("mainData");			
			var orderToCreate = this.createOrderObject();
			console.log(orderToCreate);
			oModel.create("/Orders", orderToCreate, {
				success: function(){
					jQuery.sap.log.info("Sucsess");
				},
				error : function () {
					jQuery.sap.log.error("Error");
				}
			});
			this.onCloseDialog();		
		}
	});

});