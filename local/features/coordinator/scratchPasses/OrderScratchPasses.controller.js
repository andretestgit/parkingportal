sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.coordinator.scratchPasses.OrderScratchPasses", {
        formatter: formatter,
        costOfScratchPass: 29,
        /* =========================================================== */
        /* lifecycle methods                                         */
        /* =========================================================== */
        onInit: function () {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device
            /*this.getView().setBusy(true);
            this.getOwnerComponent().getModel("jcc").attachMetadataLoaded(function(oEvent) { //Set screen to not busy once meta data has been loaded
            	this.getView().setBusy(false);
            }.bind(this));*/

            this.getRouter().getRoute("orderScratchPasses").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
            //create view model
            this.viewModel = new JSONModel({
                totalCost: "$29.00",
                quantity: 1,
                costObject: "",
                comment: "",
                contactName: "",
                email: "",
                phoneNumber: ""
            });
            this.getView().setModel(this.viewModel);
        },

        onBeforeRendering: function () {

        },

        onAfterRendering: function () {
            this._setHeaderButtonSelected("ScratchPasses");
        },
        /* =========================================================== */
        /* public methods                                         */
        /* =========================================================== */


        /* =========================================================== */
        /* event handlers                                         */
        /* =========================================================== */
        /**
         * Update total price based on quantity selected
         * @param {sap.ui.base.Event} oEvent : Combo change
         * @public
         */
        onChangeQuantity: function (oEvent) {
            var iQuantity = parseInt(oEvent.getParameter("newValue"));
            this.viewModel.setProperty("/totalCost", "$" + (iQuantity * this.costOfScratchPass));
            this.removeValidationError(oEvent);
        },
        /**
         * Validate
         * @param {sap.ui.base.Event} oEvent : Combo change
         * @public
         */
        onPressOrder: function (oEvent) {
            var oCombos = $(".scratch-combo"),
                oInputs = $(".scratch-input"),
                oPhone = this.byId("scratch_phone_input"),
                oEmail = this.byId("scratch_email_input"),
                bValid;
            bValid = this.validateInputs(oInputs, oCombos);

            if (oPhone.getValue().replace(/["'()-\s]/g, "").length !== 10) {
                bValid = false;
                oPhone.setValueState("Error");
                oPhone.setValueStateText("Invalid Phone Number");
            }
            if (!oEmail.getValue().endsWith("@mit.edu")) {
                bValid = false;
                oEmail.setValueState("Error");
                oEmail.setValueStateText("Invalid Email Address");
            }
            if (!bValid) {
                this._showValidationError("Error.Text.RequiredFields");
            } else {
                this._submitOrder();
            }
        },
        /**
         * Clear fields and value states
         * @param {sap.ui.base.Event} oEvent : Combo change
         * @public
         */
        onPressCancel: function (oEvent) {
            var oFields = $(".scratch-field");

            for (var x = 0; x < oFields.length; x++) {
                sap.ui.getCore().byId(oFields[x].id).setValueState("None");
            }
            this._resetData();
            this.onNavBack();
        },

        /* =========================================================== */
        /* private methods                                         */
        /* =========================================================== */
        /**
         * Fires every time route is matched to this view
         * @param {sap.ui.base.Event} oEvent : Routing event
         * @private
         */
        _onRouteMatched: function (oEvent) {
            this._setHeaderButtonSelected("ScratchPasses");
        },
        /**
         * Make http call, update model on success               
         * @private
         */
        _submitOrder: function () {
            var oModel = this.viewModel.getProperty("/");

            //http call
            //success
            this._resetData();
            this.onNavBack();
        },
        /**
         * Clears data model
         * @private
         */
        _resetData: function () {
            this.viewModel.setProperty("/", {
                totalCost: "$29.00",
                quantity: 1,
                costObject: "",
                comment: "",
                contactName: "",
                email: "",
                phoneNumber: ""
            });
        }

    });
});