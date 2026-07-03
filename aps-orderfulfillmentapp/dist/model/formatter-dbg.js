sap.ui.define([], function () {
    "use strict";

    var STATUS_MAP = {
        "NW": { text: "New",        state: "Information" },
        "PR": { text: "Processing", state: "Warning"     },
        "SH": { text: "Shipped",    state: "Success"     },
        "DL": { text: "Delivered",  state: "Success"     },
        "CA": { text: "Cancelled",  state: "Error"       }
    };

    return {
        statusText: function (sStatus) {
            return (STATUS_MAP[sStatus] || { text: sStatus }).text;
        },

        statusState: function (sStatus) {
            return (STATUS_MAP[sStatus] || { state: "None" }).state;
        },

        // Returns true when action button should be visible
        canConfirm: function (sStatus) { return sStatus === "NW"; },
        canShip:    function (sStatus) { return sStatus === "PR"; },
        canCancel:  function (sStatus) { return sStatus === "NW" || sStatus === "PR"; },

        fulfillmentProgress: function (sFulfilled, sOrdered) {
            var fFulfilled = parseFloat(sFulfilled) || 0;
            var fOrdered   = parseFloat(sOrdered)   || 0;
            return fOrdered > 0 ? Math.round((fFulfilled / fOrdered) * 100) : 0;
        }
    };
});
