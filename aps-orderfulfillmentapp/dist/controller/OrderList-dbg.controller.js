sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast",
    "orderfulfillment/model/formatter"
], function (Controller, Filter, FilterOperator, Sorter, MessageToast, formatter) {
    "use strict";

    return Controller.extend("orderfulfillment.controller.OrderList", {
        formatter: formatter,

        onInit: function () {
            this._sCurrentStatusFilter = "";
            this._sCurrentSearchQuery = "";
        },

        onCreateOrder: function () {
            this.getOwnerComponent().getRouter().navTo("createOrder");
        },

        onOrderPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oCtx = oItem.getBindingContext();
            var sOrderId = oCtx.getProperty("OrderId");
            this.getOwnerComponent().getRouter().navTo("orderDetail", {
                orderId: encodeURIComponent(sOrderId)
            });
        },

        onOrderSelect: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oCtx = oItem.getBindingContext();
            var sOrderId = oCtx.getProperty("OrderId");
            this.getOwnerComponent().getRouter().navTo("orderDetail", {
                orderId: encodeURIComponent(sOrderId)
            });
        },

        onSearch: function (oEvent) {
            this._sCurrentSearchQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query") || "";
            this._applyFilters();
        },

        onStatusFilterChange: function (oEvent) {
            var oItem = oEvent.getParameter("item");
            this._sCurrentStatusFilter = oItem.getKey();
            this._applyFilters();
        },

        _applyFilters: function () {
            var aFilters = [];

            if (this._sCurrentStatusFilter) {
                aFilters.push(new Filter("Status", FilterOperator.EQ, this._sCurrentStatusFilter));
            }

            if (this._sCurrentSearchQuery) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("OrderId",      FilterOperator.Contains, this._sCurrentSearchQuery),
                        new Filter("CustomerName", FilterOperator.Contains, this._sCurrentSearchQuery)
                    ],
                    and: false
                }));
            }

            var oBinding = this.byId("ordersTable").getBinding("items");
            if (aFilters.length === 0) {
                oBinding.filter([]);
            } else if (aFilters.length === 1) {
                oBinding.filter(aFilters);
            } else {
                oBinding.filter(new Filter({ filters: aFilters, and: true }));
            }

            this._updateTableTitle(oBinding);
        },

        _updateTableTitle: function (oBinding) {
            var iCount = oBinding.getLength();
            this.byId("tableTitle").setText("Orders (" + iCount + ")");
        },

        onRefresh: function () {
            this.byId("ordersTable").getBinding("items").refresh();
            MessageToast.show("Refreshed");
        },

        onSort: function () {
            var oBinding = this.byId("ordersTable").getBinding("items");
            oBinding.sort(new Sorter("OrderDate", true));
        },

        onFilter: function () {
            MessageToast.show("Use the status bar above to filter orders");
        }
    });
});
