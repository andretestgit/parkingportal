sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.coordinator.visitorParking.RequestVisitorPermit", {
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

            this.getRouter().getRoute("visitorParking").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
            //create view model
            this.viewModel = new JSONModel({
                contactName: "",
                phoneNumber: "",
                email: "",
                costObject: "",
                comment: "",
                visitors: [{
                    name: "",
                    days: [{
                        date: null,
                        location: "",
                        timeIn: null,
                        timeOut: null
                    }]
                }]
            });
            this.getView().setModel(this.viewModel);
        },

        onBeforeRendering: function () {

        },

        onAfterRendering: function () {
            this._setHeaderButtonSelected("VisitorParking");
        },
        /* =========================================================== */
        /* public methods                                         */
        /* =========================================================== */


        /* =========================================================== */
        /* event handlers                                         */
        /* =========================================================== */
        /**
         * Copy day below the selected day
         * @param {sap.ui.base.Event} oEvent : Icon press
         * @public
         */
        onPressCopyDay: function (oEvent) {
            var sPath = oEvent.getSource().getBindingContext().sPath,
                iIndex = parseInt(sPath.split("/")[sPath.split("/").length - 1]),
                oDays = this.viewModel.getProperty(sPath.split("days/")[0] + "days"),
                oDay = jQuery.extend(true, {}, oDays[iIndex]);

            oDays.splice(iIndex + 1, 0, oDay);
            this.viewModel.setProperty(sPath.split("days/")[0] + "days", oDays);
        },
        /**
         * Delete day from model
         * @param {sap.ui.base.Event} oEvent : Icon press
         * @public
         */
        onPressDeleteDay: function (oEvent) {
            var sPath = oEvent.getSource().getBindingContext().sPath,
                iIndex = parseInt(sPath.split("/")[sPath.split("/").length - 1]),
                oDays = this.viewModel.getProperty(sPath.split("days/")[0] + "days");

            oDays.splice(iIndex, 1);
            this.viewModel.setProperty(sPath.split("days/")[0] + "days", oDays);
        },

        /**
         * Add a new day to array of days
         * @param {sap.ui.base.Event} oEvent : Link Press
         * @public
         */
        onPressAddAnotherDay: function (oEvent) {
            var sPath = oEvent.getSource().getBindingContext().sPath,
                oDays = this.viewModel.getProperty(sPath + "/days"),
                newDay = {
                    date: null,
                    location: "",
                    timeIn: null,
                    timeOut: null
                };

            oDays.push(newDay);
            this.viewModel.setProperty(sPath + "days", oDays);
        },
        /**
         * Add a new visitor to array of visitors
         * @param {sap.ui.base.Event} oEvent : Link Press
         * @public
         */
        onPressAddAnotherVisitor: function (oEvent) {
            var oVisitors = this.viewModel.getProperty("/visitors"),
                newVisitor = {
                    name: "",
                    days: [{
                        date: null,
                        location: "",
                        timeIn: null,
                        timeOut: null
                    }]
                };
            oVisitors.push(newVisitor);
            this.viewModel.setProperty("/visitor", oVisitors);
        },
        /**
         * Delete visitor form array of visitors
         * @param {sap.ui.base.Event} oEvent : Link Press
         * @public
         */
        onPressDeleteVisitor: function (oEvent) {
            var sPath = oEvent.getSource().getBindingContext().sPath,
                iIndex = parseInt(sPath.split("/")[sPath.split("/").length - 1]),
                oVisitors = this.viewModel.getProperty("/visitors");

            oVisitors.splice(iIndex, 1);
            this.viewModel.setProperty("/visitors", oVisitors);
            if (oVisitors.length === 0) {
                this.onPressAddAnotherVisitor();
            }
        },

        /**
         * Perform validation on input fields, then submit data to create visitor passes
         * @param {sap.ui.base.Event} oEvent : Link Press
         * @public
         */
        onPressSubmit: function (oEvent) {
            var bValid = false,
                oInputs = $(".visitor-input"),
                oCombos = $(".visitor-combo"),
                oDates = $(".visitor-date"),
                oPhone = this.byId("visitor_phone_input"),
                oEmail = this.byId("visitor_email_input");
            // email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


            bValid = this.validateInputs(oInputs, oCombos, oDates);

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
            // if (!email_regex.test(oEmail)) {
            //     bValid = false;
            //     oEmail.setValueState("Error");
            //     oEmail.setValueStateText("Invalid Email Address");
            // }
            if (!bValid) {
                this._showValidationError("Error.Text.RequiredFields");
            } else {
                this._submitVisitorPermits();
            }
        },

        /**
         * Clear fields and value states
         * @param {sap.ui.base.Event} oEvent : Combo change
         * @public
         */
        onPressCancel: function (oEvent) {
            var oFields = $(".visitor-field");

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
            this._setHeaderButtonSelected("VisitorParking");
        },

        _submitVisitorPermits: function () {
            var oModel = this.viewModel.getProperty("/");
            oModel.phoneNumber = oModel.phoneNumber.replace(/["'()-\s]/g, "");
            //make http call
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
                contactName: "",
                phoneNumber: "",
                email: "",
                costObject: "",
                comment: "",
                visitors: [{
                    name: "",
                    days: [{
                        date: null,
                        location: "",
                        timeIn: null,
                        timeOut: null
                    }]
                }]
            });
        }
    });
});