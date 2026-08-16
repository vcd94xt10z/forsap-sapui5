sap.ui.define([
    "forsap/VendorInput",
    "sap/ui/model/json/JSONModel"
], function (VendorInput, JSONModel) {
    "use strict";

    QUnit.module("forsap.VendorInput");

    QUnit.test("possui testMode com valor padrão false", function (assert) {
        var oControl = new VendorInput();

        assert.strictEqual(
            oControl.getTestMode(),
            false,
            "testMode inicia como false"
        );

        oControl.destroy();
    });

    QUnit.test("aceita testMode=true", function (assert) {
        var oControl = new VendorInput({
            testMode: true
        });

        assert.strictEqual(
            oControl.getTestMode(),
            true,
            "testMode foi habilitado"
        );

        oControl.destroy();
    });

    QUnit.test("usa o modelo da aplicação para o value", function (assert) {
        var oControl = new VendorInput();
        var oModel = new JSONModel({
            Supplier: "1000000001"
        });

        oControl.setModel(oModel);
        oControl.setValue("1000000001");

        assert.strictEqual(
            oControl.getValue(),
            "1000000001",
            "valor do fornecedor foi definido"
        );

        oControl.destroy();
    });
});
