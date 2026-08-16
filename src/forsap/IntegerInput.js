sap.ui.define([
    "sap/m/Input",
    "sap/m/InputRenderer",
    "sap/m/library"
], function (Input, InputRenderer, mobileLibrary) {
    "use strict";

    const InputType = mobileLibrary.InputType;

    return Input.extend("forsap.IntegerInput", {
        metadata: {
            library: "forsap"
        },

        renderer: InputRenderer,

        onBeforeRendering: function () {
            Input.prototype.onBeforeRendering.apply(this, arguments);
            this.setType(InputType.Text);
        },

        onAfterRendering: function () {
            Input.prototype.onAfterRendering.apply(this, arguments);

            var oInput = this.getDomRef("inner");

            if (oInput) {
                oInput.setAttribute("inputmode", "numeric");
                this._sLastValidValue = oInput.value;
            }
        },

        onkeydown: function (oEvent) {
            if (oEvent.key !== "-" && oEvent.key !== "+") {
                Input.prototype.onkeydown.apply(this, arguments);
                return;
            }

            oEvent.preventDefault();

            var oInput = oEvent.target;
            var sValue = oInput.value;
            var sDigits = sValue.replace(/\D/g, "");
            var bNegative = sValue.charAt(0) === "-";

            if (oEvent.key === "+") {
                bNegative = false;
            } else {
                bNegative = !bNegative;
            }

            if (!sDigits) {
                oInput.value = bNegative ? "-" : "";
            } else {
                oInput.value = bNegative
                    ? "-" + sDigits
                    : sDigits;
            }

            this._sLastValidValue = oInput.value;
            this.setValue(oInput.value);

            Input.prototype.oninput.apply(this, arguments);
        },

        oninput: function (oEvent) {
            var oInput = oEvent.target;
            var sValue = oInput.value;

            if (!/^-?\d*$/.test(sValue)) {
                oInput.value = this._sLastValidValue || "";
                this.setValue(oInput.value);
                return;
            }

            this._sLastValidValue = sValue;

            Input.prototype.oninput.apply(this, arguments);
        }
    });
});