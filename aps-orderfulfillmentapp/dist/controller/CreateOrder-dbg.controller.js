sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, History, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("orderfulfillment.controller.CreateOrder", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("createOrder").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._resetForm();
        },

        _resetForm: function () {
            var oModel = new JSONModel({
                CustomerId: "",
                CustomerName: "",
                OrderDate: new Date(),
                DeliveryDate: null,
                Currency: "USD",
                ShippingAddress: "",
                Notes: "",
                Items: []
            });
            this.getView().setModel(oModel, "newOrder");
        },

        onAddItem: function () {
            var oModel = this.getView().getModel("newOrder");
            var aItems = oModel.getProperty("/Items");
            aItems.push({
                ProductId: "",
                ProductName: "",
                Quantity: "1",
                Unit: "EA",
                UnitPrice: "0.00"
            });
            oModel.setProperty("/Items", aItems);
        },

        onDeleteItem: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext("newOrder");
            var sPath = oCtx.getPath();
            var iIndex = parseInt(sPath.split("/").pop(), 10);
            var oModel = this.getView().getModel("newOrder");
            var aItems = oModel.getProperty("/Items");
            aItems.splice(iIndex, 1);
            oModel.setProperty("/Items", aItems);
        },

        onSave: function () {
            if (!this._validate()) { return; }

            var oData = this.getView().getModel("newOrder").getData();
            var oODataModel = this.getOwnerComponent().getModel();

            // Build the order entry
            var oOrderEntry = {
                CustomerId: oData.CustomerId,
                CustomerName: oData.CustomerName,
                OrderDate: oData.OrderDate,
                DeliveryDate: oData.DeliveryDate,
                Status: "NW",
                Currency: oData.Currency,
                ShippingAddress: oData.ShippingAddress,
                Notes: oData.Notes
            };

            this.getView().setBusy(true);
            oODataModel.create("/Orders", oOrderEntry, {
                success: function (oResponse) {
                    this.getView().setBusy(false);
                    var sOrderId = oResponse.OrderId;

                    // Create line items sequentially via batch
                    this._createItems(oData.Items, sOrderId, oODataModel, function () {
                        MessageToast.show("Order " + sOrderId + " created successfully");
                        this.getOwnerComponent().getRouter().navTo("orderDetail", {
                            orderId: encodeURIComponent(sOrderId)
                        });
                    }.bind(this));
                }.bind(this),
                error: function (oError) {
                    this.getView().setBusy(false);
                    var sMsg = oError.message || "Failed to create order";
                    MessageBox.error(sMsg);
                }.bind(this)
            });
        },

        _createItems: function (aItems, sOrderId, oODataModel, fnCallback) {
            if (!aItems || aItems.length === 0) {
                fnCallback();
                return;
            }

            var aDeferredList = aItems.map(function (oItem, iIdx) {
                return {
                    OrderId: sOrderId,
                    ItemId: String(iIdx + 1).padStart(6, "0"),
                    ProductId: oItem.ProductId,
                    ProductName: oItem.ProductName,
                    Quantity: parseFloat(oItem.Quantity) || 0,
                    Unit: oItem.Unit || "EA",
                    UnitPrice: parseFloat(oItem.UnitPrice) || 0,
                    TotalPrice: (parseFloat(oItem.Quantity) || 0) * (parseFloat(oItem.UnitPrice) || 0),
                    Currency: this.getView().getModel("newOrder").getProperty("/Currency"),
                    FulfilledQty: 0
                };
            }.bind(this));

            oODataModel.setUseBatch(true);
            var oPendingItems = aDeferredList.length;

            aDeferredList.forEach(function (oItemEntry) {
                oODataModel.create("/OrderItems", oItemEntry, {
                    success: function () {
                        oPendingItems--;
                        if (oPendingItems === 0) { fnCallback(); }
                    },
                    error: function () {
                        oPendingItems--;
                        if (oPendingItems === 0) { fnCallback(); }
                    }
                });
            });
        },

        _validate: function () {
            var oData = this.getView().getModel("newOrder").getData();
            var aErrors = [];

            if (!oData.CustomerId.trim())   { aErrors.push("Customer ID is required"); }
            if (!oData.CustomerName.trim()) { aErrors.push("Customer Name is required"); }
            if (!oData.OrderDate)           { aErrors.push("Order Date is required"); }
            if (oData.Items.length === 0)   { aErrors.push("At least one line item is required"); }

            if (aErrors.length > 0) {
                MessageBox.error(aErrors.join("\n"), { title: "Validation Error" });
                return false;
            }
            return true;
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            if (oHistory.getPreviousHash() !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("orderList", {}, true);
            }
        }
    });
});
