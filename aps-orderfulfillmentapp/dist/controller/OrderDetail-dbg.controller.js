sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "orderfulfillment/model/formatter"
], function (Controller, History, Filter, FilterOperator, MessageBox, MessageToast, formatter) {
    "use strict";

    return Controller.extend("orderfulfillment.controller.OrderDetail", {
        formatter: formatter,

        onInit: function () {
            // Capture the line-item row template defined in the XML view before
            // any context is set (relative binding hasn't fired any request yet).
            this._oItemsTemplate = this.byId("itemsTable").getBindingInfo("items").template;

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("orderDetail").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sOrderId = decodeURIComponent(oEvent.getParameter("arguments").orderId);

            // Bind line items via an explicit filtered query on the OrderItems set.
            // MockServer cannot resolve the Items navigation/$expand, so we avoid it.
            this.byId("itemsTable").bindItems({
                path: "/OrderItems",
                filters: [new Filter("OrderId", FilterOperator.EQ, sOrderId)],
                template: this._oItemsTemplate,
                templateShareable: true
            });

            // Bind the header/detail fields to the order entity (no $expand).
            this.getView().bindElement({
                path: "/Orders('" + sOrderId + "')",
                events: {
                    dataRequested: function () {
                        this.getView().setBusy(true);
                    }.bind(this),
                    dataReceived: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                }
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("orderList", {}, true);
            }
        },

        // ── Fulfillment Actions ──────────────────────────────────────────

        onConfirmOrder: function () {
            var sOrderId = this._getOrderId();
            MessageBox.confirm(
                "Confirm order " + sOrderId + " for processing?",
                {
                    title: "Confirm Order",
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            this._callFunctionImport("ConfirmOrder", { OrderId: sOrderId },
                                "Order " + sOrderId + " confirmed successfully");
                        }
                    }.bind(this)
                }
            );
        },

        onShipOrder: function () {
            this._openFulfillmentDialog("ship");
        },

        onCancelOrder: function () {
            this._openFulfillmentDialog("cancel");
        },

        _openFulfillmentDialog: function (sMode) {
            this._sDialogMode = sMode;
            if (!this._oFulfillmentDialog) {
                this.loadFragment({ name: "orderfulfillment.view.FulfillmentAction" })
                    .then(function (oDialog) {
                        this._oFulfillmentDialog = oDialog;
                        this.getView().addDependent(oDialog);
                        this._initDialog(sMode);
                        oDialog.open();
                    }.bind(this));
            } else {
                this._initDialog(sMode);
                this._oFulfillmentDialog.open();
            }
        },

        _initDialog: function (sMode) {
            var oViewModel = new sap.ui.model.json.JSONModel({
                mode: sMode,
                trackingNumber: "",
                shipDate: new Date(),
                cancelReason: "",
                title: sMode === "ship" ? "Ship Order" : "Cancel Order",
                showShipFields: sMode === "ship",
                showCancelFields: sMode === "cancel"
            });
            this._oFulfillmentDialog.setModel(oViewModel, "dialog");
        },

        onFulfillmentConfirm: function () {
            var oModel = this._oFulfillmentDialog.getModel("dialog");
            var sMode = oModel.getProperty("/mode");
            var sOrderId = this._getOrderId();

            if (sMode === "ship") {
                var sTracking = oModel.getProperty("/trackingNumber");
                var oShipDate = oModel.getProperty("/shipDate");
                if (!sTracking) {
                    MessageToast.show("Tracking number is required");
                    return;
                }
                this._callFunctionImport("ShipOrder", {
                    OrderId: sOrderId,
                    TrackingNumber: sTracking,
                    ShipDate: oShipDate
                }, "Order " + sOrderId + " shipped successfully");
            } else {
                var sReason = oModel.getProperty("/cancelReason");
                if (!sReason) {
                    MessageToast.show("Cancellation reason is required");
                    return;
                }
                this._callFunctionImport("CancelOrder", {
                    OrderId: sOrderId,
                    Reason: sReason
                }, "Order " + sOrderId + " cancelled");
            }
            this._oFulfillmentDialog.close();
        },

        onFulfillmentCancel: function () {
            this._oFulfillmentDialog.close();
        },

        // ── OData V2 Function Import call ────────────────────────────────

        _callFunctionImport: function (sFunctionName, mParams, sSuccessMsg) {
            var oODataModel = this.getOwnerComponent().getModel();
            this.getView().setBusy(true);
            oODataModel.callFunction("/" + sFunctionName, {
                method: "POST",
                urlParameters: mParams,
                success: function () {
                    this.getView().setBusy(false);
                    oODataModel.refresh();
                    MessageToast.show(sSuccessMsg);
                }.bind(this),
                error: function (oError) {
                    this.getView().setBusy(false);
                    var sMsg = oError.message || "Action failed";
                    MessageBox.error(sMsg, { title: "Error" });
                }.bind(this)
            });
        },

        _getOrderId: function () {
            return this.getView().getBindingContext().getProperty("OrderId");
        }
    });
});
