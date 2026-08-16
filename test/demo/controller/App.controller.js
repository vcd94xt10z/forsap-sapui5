sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("demo.controller.App", {
        onInit: function () {
            this.getView().setModel(new JSONModel({
                integerValue: "",
                decimalValue2: "",
                decimalValue3: "",
                Supplier: ""
            }));

            this.byId("integerInput").attachLiveChange(function (oEvent) {
                this.getView().getModel().setProperty(
                    "/integerValue",
                    oEvent.getParameter("value")
                );
            }.bind(this));

            this.byId("decimalInput2").attachLiveChange(function (oEvent) {
                this.getView().getModel().setProperty(
                    "/decimalValue2",
                    oEvent.getParameter("value")
                );
            }.bind(this));

            this.byId("decimalInput3").attachLiveChange(function (oEvent) {
                this.getView().getModel().setProperty(
                    "/decimalValue3",
                    oEvent.getParameter("value")
                );
            }.bind(this));
        }
    });
});
