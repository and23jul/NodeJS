sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "orderfulfillment/model/models",
    "orderfulfillment/localService/mockServer"  // loading this module starts MockServer
], function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("orderfulfillment.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(models.createDeviceModel(), "device");
            this.getRouter().initialize();
        },

        getContentDensityClass: function () {
            return Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
        }
    });
}); 
