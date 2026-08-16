sap.ui.define([
    "sap/m/Input",
    "sap/m/InputRenderer",
    "sap/m/library"
], function (Input, InputRenderer, mobileLibrary) {
    "use strict";

    const InputType = mobileLibrary.InputType;

    return Input.extend("forsap.DecimalInput", {
        metadata: {
            library: "forsap",
            properties: {
                decimalPlaces: {
                    type: "int",
                    defaultValue: 2
                }
            }
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
                oInput.setAttribute("inputmode", "decimal");
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
            var bNegative = sValue.charAt(0) === "-";

            if (oEvent.key === "+") {
                bNegative = false;
            } else {
                bNegative = !bNegative;
            }

            var sDigits = sValue.replace(/\D/g, "");

            if (!sDigits) {
                oInput.value = bNegative ? "-" : "";
                this._sLastValidValue = oInput.value;
                this.setValue(oInput.value);
                return;
            }

            this._setFormattedValue(
                oInput,
                bNegative ? "-" + sDigits : sDigits
            );

            this._sLastValidValue = oInput.value;
        },

        oninput: function (oEvent) {
            var oInput = oEvent.target;
            var sValue = oInput.value;

            if (!/^-?[\d.,]*$/.test(sValue)) {
                oInput.value = this._sLastValidValue || "";
                this.setValue(oInput.value);
                return;
            }

            var bNegative = sValue.charAt(0) === "-";
            var sDigits = sValue.replace(/\D/g, "");

            if (!sDigits) {
                oInput.value = bNegative ? "-" : "";
                this._sLastValidValue = oInput.value;

                Input.prototype.oninput.apply(this, arguments);
                return;
            }

            this._setFormattedValue(
                oInput,
                bNegative ? "-" + sDigits : sDigits
            );

            this._sLastValidValue = oInput.value;

            Input.prototype.oninput.apply(this, arguments);
        },

        _setFormattedValue: function (oInput, sValue) {
            var iDecimalPlaces = this.getDecimalPlaces();
            var bNegative = sValue.charAt(0) === "-";
            var sDigits = sValue.replace(/\D/g, "");

            if (!sDigits) {
                oInput.value = bNegative ? "-" : "";
                this.setValue(oInput.value);
                return;
            }

            var iValue = parseInt(sDigits, 10);
            var iDivisor = Math.pow(10, iDecimalPlaces);
            var fValue = iValue / iDivisor;

            var sFormatted = fValue.toFixed(iDecimalPlaces);

            var aParts = sFormatted.split(".");
            var sIntegerPart = aParts[0];
            var sDecimalPart = aParts[1] || "";

            sIntegerPart = sIntegerPart.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                "."
            );

            sFormatted = sIntegerPart + "," + sDecimalPart;

            if (bNegative) {
                sFormatted = "-" + sFormatted;
            }

            oInput.value = sFormatted;
            this.setValue(sFormatted);
        }
    });
});