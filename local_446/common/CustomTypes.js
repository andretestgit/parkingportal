sap.ui.define([
    "sap/ui/model/SimpleType",
    "sap/ui/model/ValidateException"
], function (SimpleType, ValidateException) {
    "use strict";
    return {
        input: SimpleType.extend("email", {
            formatValue: function (oValue) {
                return oValue;
            },
            parseValue: function (oValue) {
                return oValue;
            },
            validateValue: function (oValue) {
                if (!oValue) {
                    throw new ValidateException("Enter a valid value");
                }
            }
        }),
        combo: SimpleType.extend("email", {
            formatValue: function (oValue) {
                return oValue;
            },
            parseValue: function (oValue) {
                return oValue;
            },
            validateValue: function (oValue) {
                if (!oValue) {
                    throw new ValidateException("Select a valid value");
                }
            }
        }),
        licensePlate: SimpleType.extend("email", {
            formatValue: function (oValue) {
                return oValue;
            },
            parseValue: function (oValue) {
                return oValue;
            },
            validateValue: function (oValue) {
                var regex = new RegExp("^[a-zA-Z0-9]+\-*[a-zA-Z0-9]+$"); // allow for only number, letter, or dash

                if (!regex.test(oValue) || !oValue || oValue.length < 2) {
                    throw new ValidateException("Enter a valid license plate number");
                }
            }
        }),
         year: SimpleType.extend("email", {
            formatValue: function (oValue) {
                return oValue;
            },
            parseValue: function (oValue) {
                return oValue;
            },
            validateValue: function (oValue) {
                if (oValue.length !== 4 || parseInt(oValue) < 0) {
                    throw new ValidateException("Enter a 4 digit year");
                }
            }
        }),
        carpoolEmail: SimpleType.extend("email", {
            formatValue: function (oValue) {
                return oValue;
            },
            parseValue: function (oValue) {
                return oValue;
            },
            validateValue: function (oValue) {
                if (!oValue) {
                    throw new ValidateException("Enter or select a valid email address");
                }
            }
        })
    };
});