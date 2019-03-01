sap.ui.define([
    "sapui5_task/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter"
], function (BaseController, JSONModel, Filter) {
	"use strict";

	return BaseController.extend("sapui5_task.controller.App", {

		onInit: function() {            
            this.oView = this.getView();                     
            var oRouter = this.getRouter();
            this.path = "";
            oRouter.getRoute("orderDetails").attachMatched(this._onRouteMatched, this);            
        },
        
        _onRouteMatched: function(oEvent) {
            this.path = oEvent.getParameter("arguments").order_num;
            var orderId = this.path.replace(/[^\d;]/g, '');
            var oView = this.oView;            
            var oModel = oView.getModel("mainData");            

            oModel.read("/" + this.path, {
                success: function(data){
                    var details = new JSONModel(data);
                    oView.setModel(details, "orderDetails");
                    jQuery.sap.log.info("Succsess");                 
                },
                error: function() {
                    jQuery.sap.log.error("Error");
                }
            });

            var filters = new Array();
            var filterById = new Filter("orderId", sap.ui.model.FilterOperator.EQ, orderId);
            filters.push(filterById);
            var oBinding = oView.byId("productsTable").getBinding("items");
            oBinding.filter(filters);            
        },

        // Ship to form
        editShipToForm: function(oEvent) {       
            this.oView.getModel("config").setProperty("/shipToFormEditMode", true);
            this.changeShipButtonVisibility(true);            
        },

        saveShipToForm: function() {
            this.oView.getModel("config").setProperty("/shipToFormEditMode", false);
            this.changeShipButtonVisibility(false);
            var oModel = this.oView.getModel("mainData");
            var orderModel = this.oView.getModel("orderDetails");
            var orderToUpdate = JSON.parse(orderModel.getJSON());
            oModel.update("/" + this.path, orderToUpdate, {
                merge: false,
                success: function(){
                    jQuery.sap.log.info("Sucsess");
                },
                error : function () {
                    jQuery.sap.log.error("Error");
                }
            });
        },

        cancelShipToForm: function() {
            var oView = this.oView;
            oView.getModel("config").setProperty("/shipToFormEditMode", false);
            this.changeShipButtonVisibility(false);
            var oModel = oView.getModel("mainData");
            oModel.read("/" + this.path, {
                success: function(data){                   
                    oView.getModel("orderDetails").setData(data);
                    jQuery.sap.log.info("Succsess");                 
                },
                error: function() {
                    jQuery.sap.log.error("Error");
                }
            });
        },

        changeShipButtonVisibility : function (bEdit) {
			this.oView.byId("ShipEdit").setVisible(!bEdit);
			this.oView.byId("ShipSave").setVisible(bEdit);
			this.oView.byId("ShipCancel").setVisible(bEdit);			
        },
       
        //Customre info form
        editCustomerInfoForm: function(oEvent) {         
            this.oView.getModel("config").setProperty("/customerInfoFormEditMode", true);
            this.changeCustomerButtonVisibility(true);            
        },

        saveCustomerInfoForm: function() {
            this.oView.getModel("config").setProperty("/customerInfoFormEditMode", false);
            this.changeCustomerButtonVisibility(false);
            var oModel = this.oView.getModel("mainData");
            var orderModel = this.oView.getModel("orderDetails");
            var orderToCreate = JSON.parse(orderModel.getJSON());
            oModel.update("/" + this.path, orderToCreate, {
                merge: false,
                success: function(){
                    jQuery.sap.log.info("Sucsess");
                },
                error : function () {
                    jQuery.sap.log.error("Error");
                }
            });
        },

        cancelCustomerInfoForm: function() {
            var oView = this.oView;
            oView.getModel("config").setProperty("/customerInfoFormEditMode", false);
            this.changeCustomerButtonVisibility(false);
            var oModel = oView.getModel("mainData");
            oModel.read("/" + this.path, {
                success: function(data){                   
                    
                    oView.getModel("orderDetails").setData(data);
                    jQuery.sap.log.info("Succsess");                 
                },
                error: function() {
                    jQuery.sap.log.error("Error");
                }
            });
        },

        changeCustomerButtonVisibility: function (bEdit) {
			this.oView.byId("CustEdit").setVisible(!bEdit);
			this.oView.byId("CustSave").setVisible(bEdit);
			this.oView.byId("CustCancel").setVisible(bEdit);			
        },

        deleteProduct: function(oEvent) {
            var oModel = this.oView.getModel("mainData");                       
            var path = oEvent.getParameter("listItem").getBindingContext("mainData").getPath();
            oModel.remove(path);
        }
	});

});