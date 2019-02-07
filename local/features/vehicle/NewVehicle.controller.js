sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/parking/common/formatter",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, MessageBox) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.vehicle.NewVehicle", {
        formatter: formatter,
        /* =========================================================== */
        /* lifecycle methods                                         */
        /* =========================================================== */
        onInit: function () {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device
            /*this.getView().setBusy(true);
            this.getOwnerComponent().getModel("jcc").attachMetadataLoaded(function(oEvent) { //Set screen to not busy once meta data has been loaded
            	this.getView().setBusy(false);
            }.bind(this));*/

            this.getRouter().getRoute("newVehicle").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
            //create view model
            this.viewModel = new JSONModel({
                startDate: null,
                endDate: null
            });
            this.getView().setModel(this.viewModel);
        },

        onBeforeRendering: function () {

        },

        onAfterRendering: function () {

        },

        /* =========================================================== */
        /* public methods                                         */
        /* =========================================================== */

        /* =========================================================== */
        /* event handlers                                         */
        /* =========================================================== */
        /**
         * Adds a blank new vehicle object to the vehicles array
         * @param {sap.ui.base.Event} oEvent : Press
         * @public
         */
        onPressAddAnotherVehicle: function (oEvent) {
            var oVehicles = this.viewModel.getProperty("/vehicles");
            var newVehicle = {
                vehicleNumber: oVehicles[oVehicles.length - 1].vehicleNumber + 1,
                make: "",
                model: "",
                color: "",
                licensePlate: "",
                state: "",
                startDate: null,
                endDate: null
            };
            oVehicles.push(newVehicle);
            this.viewModel.setProperty("/vehicles", oVehicles);
        },
        /**
         * Remove vehicle from list. Renumber vehicle numbers if vehicle is a middle vehicle
         * @param {sap.ui.base.Event} oEvent : Press
         * @public
         */
        onPressRemoveVehicle: function (oEvent) {
            var sIndex = oEvent.getSource().getBindingContext().sPath.split("/")[2];
            var oVehicles = this.viewModel.getProperty("/vehicles");
            var bRenumberVehicles = false;
            //Check to see if vehicle to be removed is a middle vehicle which would require renumbering vehicles
            if (sIndex != oVehicles.length - 1) {
                bRenumberVehicles = true;
            }
            oVehicles.splice(parseInt(sIndex), 1);
            if (bRenumberVehicles) {
                for (var x = 1; x < oVehicles.length; x++) {
                    oVehicles[x].vehicleNumber = oVehicles[x - 1].vehicleNumber + 1;
                }
            }
            this.viewModel.setProperty("/vehicles", oVehicles);
        },
        /**
         * Navigate back to previous screen
         * @param {sap.ui.base.Event} oEvent : Press
         * @public
         */
        onPressCancel: function () {
            this.viewModel.setProperty("/vehicles", []);
            this.onNavBack();
        },

        /**
         * Perform validation on required fields, then submit vehicles
         * @param {sap.ui.base.Event} oEvent : Press
         * @public
         */
        onPressSubmitVehicles: function (oEvent) {
            var oInputs = $(".vehicle-input"),
                oCombos = $(".vehicle-combo"),
                bValid = true,
                oDateIds = ["vehicle_datepicker_startDate", "vehicle_datepicker_endDate"],
                oInput, oCombo;
            //validate input
            for (var x = 0; x < oInputs.length; x++) {
                oInput = sap.ui.getCore().byId(oInputs[x].id);
                if (oInput.getVisible() && !oInput.getValue()) {
                    oInput.setValueState("Error");
                    bValid = false;
                }
            }
            //validate combo
            for (var x = 0; x < oCombos.length; x++) {
                oCombo = sap.ui.getCore().byId(oCombos[x].id);
                if (oCombo.getVisible() && !oCombo.getSelectedKey()) {
                    oCombo.setValueState("Error");
                    bValid = false;
                }
            }
            //if temp vehicle, check date range fields
            if (this.bTempVehicle) {
                for (var x in oDateIds) {
                    oInput = this.byId(oDateIds[x]);
                    if (oInput.getVisible() && !oInput.getDateValue()) {
                        oInput.setValueState("Error");
                        bValid = false;
                    }
                }
            }
            //this._saveVehicles(); //for testing
            if (!bValid) {
                this._showValidationError("Error.Text.RequiredFields");
            } else {
                this._saveVehicles();
            }
        },


        /* =========================================================== */
        /* private methods                                         */
        /* =========================================================== */
        /**
         * Fires every time route is matched to this view. Changes text based on temp vehicle property passed in
         * @param {sap.ui.base.Event} oEvent : Routing event
         * @private
         */
        _onRouteMatched: function (oEvent) {
            this.bTempVehicle = oEvent.getParameter("arguments").bTempVehicle === "true";
            this.sPath = "/" + oEvent.getParameter("arguments").sPath.replace(/-/g, "/");
            this.iVehicleNumber = oEvent.getParameter("arguments").iVehicleNumber;
            this.viewModel.setProperty("/vehicleNumber", this.iVehicleNumber);
            this.viewModel.setProperty("/tempVehicle", this.bTempVehicle);
            if (this.bTempVehicle) {
                this.byId("vehicle_text_title").setText(this.getTranslation("Vehicle.Text.AddaTempVehicle"));
                this.byId("vehicle_button_submit").setText(this.getTranslation("Vehicle.Button.AddaTempVehicle"));
            } else {
                this.byId("vehicle_text_title").setText(this.getTranslation("Vehicle.Text.AddaVehicle"));
                this.byId("vehicle_button_submit").setText(this.getTranslation("Vehicle.Button.AddaVehicle"));
            }
            this._resetVehicleModel();
        },
        /**
         * Clears vehicles property from view model
         * @private
         */
        _resetVehicleModel: function () {
            this.viewModel.setProperty("/vehicles", []);
            var oVehicles = [{
                make: "",
                model: "",
                year: "",
                color: "",
                plateNumber: "",
                plateState: "",
                bodyType: "",
                temporary: false,
                startDate: "",
                endDate: ""
            }];
            this.viewModel.setProperty("/vehicles", oVehicles);
            this.byId("vehicle_datepicker_startDate").setValueState("None");
            this.byId("vehicle_datepicker_endDate").setValueState("None");
        },
        /**
         * Sets start and end date for temp vehicles
         * @private
         */
        _formatVehiclesForSave: function () {
            var oModel = this.viewModel.getProperty("/");
            var oVehicles = oModel.vehicles;
            for (var x in oVehicles) {
                oVehicles[x].startDate = this._getFormatterDate(oModel.startDate);
                oVehicles[x].endDate = this._getFormatterDate(oModel.endDate);
                delete oVehicles[x].vehicleNumber;
            }
            return oVehicles;
        },

        _saveVehicles: function () {
            var oVehicles = this.viewModel.getProperty("/vehicles");
            if (this.bTempVehicle) {
                oVehicles = this._formatVehiclesForSave();
            }
            //save

            //Simulate a success
            var oCurrentVehicles = this._getModel("sessionData").getProperty(this.sPath + "/vehicles");
            for (var x in oVehicles) {
                if (this.bTempVehicle) {
                    oVehicles[x].temporary = true;
                } else {
                    oVehicles[x].temporary = false;
                }
                oCurrentVehicles.push(oVehicles[x]);
            }
            this._getModel("sessionData").setProperty(this.sPath + "/vehicles", oCurrentVehicles);
            this.onPressCancel();
        },

        _getFormatterDate: function (oDate) {
            return oDate.toISOString().split("T")[0];
        }

    });
});