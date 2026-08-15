sap.ui.define([
    "forsap/DecimalInput"
], function (DecimalInput) {
    "use strict";

    QUnit.module("forsap.DecimalInput");

    QUnit.test("should have decimalPlaces equal to 2 by default", function (assert) {
        var oInput = new DecimalInput();

        assert.strictEqual(
            oInput.getDecimalPlaces(),
            2,
            "Default decimal places is 2"
        );

        oInput.destroy();
    });

    QUnit.test("should accept a custom decimalPlaces value", function (assert) {
        var oInput = new DecimalInput({
            decimalPlaces: 3
        });

        assert.strictEqual(
            oInput.getDecimalPlaces(),
            3,
            "Decimal places is 3"
        );

        oInput.destroy();
    });
});
