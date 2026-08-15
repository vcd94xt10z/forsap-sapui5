sap.ui.define([
    "forsap/IntegerInput"
], function (IntegerInput) {
    "use strict";

    QUnit.module("forsap.IntegerInput");

    QUnit.test("should have an empty default value", function (assert) {
        var oInput = new IntegerInput();

        assert.strictEqual(oInput.getValue(), "", "Default value is empty");

        oInput.destroy();
    });
});
