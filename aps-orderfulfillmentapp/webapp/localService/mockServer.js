// MockServer initializes HERE, at module-load time, before any Component
// constructor runs. This guarantees it intercepts the $metadata XHR that
// ODataModel fires synchronously inside the ManagedObject constructor.
sap.ui.define([
    "sap/ui/core/util/MockServer"
], function (MockServer) {
    "use strict";

    var _oMockServer;
    var _sServicePath = "/sap/opu/odata/sap/ZORDER_FULFILLMENT_SRV/";

    function _baseUrl() {
        return window.location.href.replace(/[?#].*$/, "").replace(/\/[^/]*$/, "/");
    }

    function _loadJson(sUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", sUrl, false);
        xhr.send();
        if (xhr.status !== 200) {
            console.error("[MockServer] HTTP", xhr.status, "for", sUrl);
            return [];
        }
        try {
            var d = JSON.parse(xhr.responseText);
            if (Array.isArray(d))                          { return d; }
            if (d && d.d && Array.isArray(d.d.results))   { return d.d.results; }
            if (d && Array.isArray(d.results))             { return d.results; }
            return [];
        } catch (e) {
            console.error("[MockServer] JSON parse error", sUrl, e);
            return [];
        }
    }

    // --- run immediately so XHR is replaced before ODataModel constructor ---
    console.log("[MockServer] module init start");

    var sBase        = _baseUrl();
    var sMetadataUrl = sBase + "localService/metadata.xml";
    var sMockBase    = sBase + "localService/mockdata/";

    MockServer.config({ autoRespond: true, autoRespondAfter: 0 });
    _oMockServer = new MockServer({ rootUri: _sServicePath });
    _oMockServer.simulate(sMetadataUrl);
    console.log("[MockServer] simulate done");

    var aOrders = _loadJson(sMockBase + "Orders.json");
    var aItems  = _loadJson(sMockBase + "OrderItems.json");
    var aCusts  = _loadJson(sMockBase + "Customers.json");
    console.log("[MockServer] data —", aOrders.length, "orders,", aItems.length, "items,", aCusts.length, "customers");

    // The OData V2 model indexes entities by __metadata.uri. Data injected via
    // setEntitySetData() is stored raw, so we must attach __metadata ourselves
    // or every entity's key resolves to undefined and the model stores nothing.
    function _quote(v) {
        return "'" + String(v).replace(/'/g, "''") + "'";
    }
    function _addMetadata(aData, sSetName, sTypeName, aKeyProps) {
        var sNs = "ZORDER_FULFILLMENT_SRV.";
        aData.forEach(function (oEntity) {
            var sPredicate;
            if (aKeyProps.length === 1) {
                sPredicate = _quote(oEntity[aKeyProps[0]]);
            } else {
                sPredicate = aKeyProps.map(function (k) {
                    return k + "=" + _quote(oEntity[k]);
                }).join(",");
            }
            oEntity.__metadata = {
                uri:  _sServicePath.replace(/\/$/, "") + "/" + sSetName + "(" + sPredicate + ")",
                type: sNs + sTypeName
            };
        });
        return aData;
    }

    _addMetadata(aOrders, "Orders",     "OrderType",     ["OrderId"]);
    _addMetadata(aItems,  "OrderItems", "OrderItemType", ["OrderId", "ItemId"]);
    _addMetadata(aCusts,  "Customers",  "CustomerType",  ["CustomerId"]);

    _oMockServer.setEntitySetData("Orders",     aOrders);
    _oMockServer.setEntitySetData("OrderItems", aItems);
    _oMockServer.setEntitySetData("Customers",  aCusts);

    var aRequests = _oMockServer.getRequests();
    ["ConfirmOrder", "ShipOrder", "CancelOrder"].forEach(function (sFn) {
        var sNewStatus = { ConfirmOrder: "PR", ShipOrder: "SH", CancelOrder: "CA" }[sFn];
        aRequests.push({
            method: "POST",
            path: new RegExp("/" + sFn + "(.*)"),
            response: function (oXhr, sUrlParams) {
                var mParams = {};
                (sUrlParams || "").replace(/[?&]([^=&]+)=([^&]*)/g, function (_, k, v) {
                    mParams[k] = decodeURIComponent(v.replace(/\+/g, " "));
                });
                var sOrderId = mParams.OrderId;
                var aData    = _oMockServer.getEntitySetData("Orders");
                var oOrder   = aData.find(function (o) { return o.OrderId === sOrderId; });
                if (oOrder) {
                    oOrder.Status = sNewStatus;
                    _oMockServer.setEntitySetData("Orders", aData);
                }
                oXhr.respond(200,
                    { "Content-Type": "application/json" },
                    JSON.stringify({ d: oOrder || {} }));
            }
        });
    });
    _oMockServer.setRequests(aRequests);
    _oMockServer.start();
    console.log("[MockServer] started — intercepting", _sServicePath);
    // -----------------------------------------------------------------------

    return {
        getMockServer: function () { return _oMockServer; }
    };
});
