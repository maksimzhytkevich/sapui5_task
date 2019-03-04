sap.ui.define([
    "sapui5_task/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/core/Fragment"

], function (BaseController, JSONModel, Filter, Fragment) {
	"use strict";

	return BaseController.extend("sapui5_task.controller.App", {

		onInit: function() {                            
            var oRouter = this.getRouter();
            this.path = "";
            this.orderId = 0;
            oRouter.getRoute("orderDetails").attachMatched(this._onRouteMatched, this);            
        },
        
        _onRouteMatched: function(oEvent) {
            this.path = oEvent.getParameter("arguments").order_num;
            this.orderId = this.path.replace(/[^\d;]/g, '');
            var oView = this.getView();            
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
            var filterById = new Filter("orderId", sap.ui.model.FilterOperator.EQ, this.orderId);
            filters.push(filterById);
            var oBinding = oView.byId("productsTable").getBinding("items");
            oBinding.filter(filters);            
        },

        editShipToForm: function() {
            this.changeShipToFormMode(true);           
        },

        editCustomerInfoForm: function() { 
            this.changeCustomerInfoFormMode(true);                         
        },

        changeShipToFormMode: function(mode) {
            var oConfig = this.getView().getModel("config");
            oConfig.setProperty("/shipToFormEditMode", mode);
            oConfig.setProperty("/shipFormEditable", mode);
        },

        changeCustomerInfoFormMode: function(mode) {
            var oConfig = this.getView().getModel("config");
            oConfig.setProperty("/customerInfoFormEditMode", mode);
            oConfig.setProperty("/customerFormEditable", mode);
        },
        
        saveForm: function(oEvent) {
            this.selectForm(oEvent);

            var oModel = this.getView().getModel("mainData");
            var orderModel = this.getView().getModel("orderDetails");
            var orderToUpdate = orderModel.getData();
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

        cancelForm: function(oEvent) {
            this.selectForm(oEvent);

            var oView = this.oView;
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
        
        selectForm: function(oEvent){
            var formId = oEvent.getSource().getId();
            if(formId.includes("Ship")){
                this.changeShipToFormMode(false);
            } else if(formId.includes("Cust")){
                this.changeCustomerInfoFormMode(false);
            } else {
                jQuery.sap.log.error("Error");
            }
        },

        deleteProduct: function(oEvent) {
            var oModel = this.getView().getModel("mainData");                       
            var path = oEvent.getParameter("listItem").getBindingContext("mainData").getPath();
            oModel.remove(path);
        },

        onOpenDialog : function () {
            if(!this.oDialog){
				this.oDialog = sap.ui.xmlfragment("sapui5_task.view.CreateProduct", this);
				this.getView().addDependent(this.oDialog);
				this.oDialog.open();
			} else {
				this.oDialog.open();
			}			
        },
        
        onCloseDialog : function () {	
			this.oDialog.close();
		},
        
        addProduct: function() {
            var context = this;           
            var oModel = this.getView().getModel("mainData");			
			var productToCreate = this.createProductObject();
			oModel.create("/OrderProducts", productToCreate, {
				success: function(){
                    jQuery.sap.log.info("Sucsess");
                    context.onCloseDialog();
				},
				error : function () {
					jQuery.sap.log.error("Error");
				}
			});				
        },

        createProductObject: function() {
			var productModel = this.getView().getModel("productToCreate");			
			var productToCreate = productModel.getData();
            productToCreate.totalPrice = productToCreate.price * productToCreate.quantity;
            productToCreate.orderId = this.orderId;
			return productToCreate;
        },
        
        navToComments: function(oEvent) {
            var path = oEvent.getSource().getBindingContext("mainData").getPath();
            this.getRouter().navTo("productDetails", {order_num : this.path, product_num : path.substr(1)});
        }
	});
});