sap.ui.define([
    "sap/ui/core/Lib"
], function (Library) {
    "use strict";

    return Library.init({
        name: "forsap",
        version: "0.1.0",
        dependencies: {
            minUI5Version: "1.120.14",
            libs: {
                "sap.ui.core": {},
                "sap.m": {}
            }
        },
        controls: [
            "forsap.IntegerInput",
            "forsap.DecimalInput"
        ]
    });
});
