sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.coordinator.departmentVehicles.DepartmentVehicles", {
        formatter: formatter,
        firstLoad: true,
        /* =========================================================== */
        /* lifecycle methods                                         */
        /* =========================================================== */
        onInit: function () {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device
            /*this.getView().setBusy(true);
            this.getOwnerComponent().getModel("jcc").attachMetadataLoaded(function(oEvent) { //Set screen to not busy once meta data has been loaded
            	this.getView().setBusy(false);
            }.bind(this));*/

            this.getRouter().getRoute("departmentVehicles").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
            //create view model
            this.viewModel = new JSONModel({
                state: 0, // 0: dept vehicles , 1: dept tickets
                ticketState: 0, // 0:dont show, 1: ticket info, 2: pay multiple tickets
                editable: false,
                vehicleDetailsVisible: false,
                role: "COORDINATOR"
            });
            this.getView().setModel(this.viewModel);
        },

        onBeforeRendering: function () {

        },

        onAfterRendering: function () {
            this._setHeaderButtonSelected("DeptVehicles");
            this._setTableVisibleRowCount("/coordinator/departmentVehicles");
        },
        /* =========================================================== */
        /* public methods                                         */
        /* =========================================================== */


        /* =========================================================== */
        /* event handlers                                         */
        /* =========================================================== */
        /**
         * Handles hiding and showing selected tab views
         * @param {sap.ui.base.Event} oEvent : Link press
         * @param {string} sId: id of link to set as selected
         * @public
         */
        onPressTabLink: function (oEvent, sId) {
            var oTabs = ["vehicle_details_link", "tickets_appeals_link"];
            var sSelected = oEvent ? oEvent.getSource().sId.split("--")[1] : sId;
            for (var x in oTabs) {
                if (oTabs[x] === sSelected) {
                    this.byId(oTabs[x]).addStyleClass("underline");
                    this.viewModel.setProperty("/state", parseInt(x));
                } else {
                    this.byId(oTabs[x]).removeStyleClass("underline");
                }
            }
        },
        /**
         * Bind vehicle properties to details pane
         * @param {sap.ui.base.Event} oEvent : Table row press
         * @public
         */
        onPressVehicleTable: function (oEvent) {
            // var sPath = oEvent.getParameter("listItem").getBindingContext("sessionData").sPath,
            var sPath = oEvent.getParameter("rowContext").sPath,
                oEntry = this._getModel("sessionData").getProperty(sPath);

            this.viewModel.setProperty("/vehicle", oEntry.vehicle);
            this.viewModel.setProperty("/vehicleDetailsVisible", true);

            this.byId("vehicle_details_panel").bindElement({
                model: "sessionData",
                path: sPath
            });

            this.onChangeMake();
        },

        /**
         * Bind Model Combobox to selected makes models
         * @param {sap.ui.base.Event} oEvent : Combo Change
         * @param {object} oSource: Reference to make combo
         * @public
         */
        onChangeMake: function (oEvent) {
            var sPath = this.byId("make_combo").getSelectedItem().getBindingContext("lookups").sPath,
                oCombo = this.byId("model_combo"),
                oTemplate = new sap.ui.core.Item({
                    key: "{lookups>name}",
                    text: "{lookups>name}"
                });

            oCombo.bindItems({
                model: "lookups",
                path: sPath + "/models",
                template: oTemplate
            });
            if (oEvent) {
                this.removeValidationError(oEvent);
            }

        },
        /**
         * Makes vehicle details editable
         * @param {sap.ui.base.Event} oEvent : Link press
         * @public
         */
        onPressEditLink: function (oEvent) {
            this.viewModel.setProperty("/editable", !this.viewModel.getProperty("/editable"));
        },

        /**
         * Save vehicle details 
         * @param {sap.ui.base.Event} oEvent : Link press
         * @public
         */
        onPressSaveLink: function (oEvent) {
            var oInputs = $(".vehicle-input"),
                oCombos = $(".vehicle-combo");
            //validate input fields
            var bValid = this.validateInputs(oInputs, oCombos);
            if (!bValid) {
                this._showValidationError("Error.Text.RequiredFields");
            } else {
                this._saveVehicles();
            }

            // this.viewModel.setProperty("/editable", !this.viewModel.getProperty("/editable"));
        },

        //ticket methods
        /**
         * Show ticket info and clear all checkboxs
         * @param {sap.ui.base.Event} oEvent : Checkbox select
         * @public
         */
        onPressTicketRow: function (oEvent, oItem) {
            this._clearAllCheckboxs();
            this.iTicketsSelected = 0;
            this.iTicketTotal = 0;
            this.viewModel.setProperty("/ticketState", 1);
            if (oItem) {
                this.byId("tickets_details_container").bindElement({
                    model: "sessionData",
                    path: oItem.getBindingContext("sessionData").sPath
                })
            } else {
                this.byId("tickets_details_container").bindElement({
                    model: "sessionData",
                    path: oEvent.getParameter("listItem").getBindingContext("sessionData").sPath
                })
            }


        },

        onTicketTableChange: function (oEvent) {

        },
        /**
         * If only one check in table is selected, highlight row and show ticket details. If multiple are selected, show ticket payment option for combined
            tickets
         * @param {sap.ui.base.Event} oEvent : Checkbox select
         * @public
         */
        onPressCheckbox: function (oEvent) {
            var oTable = this.byId("ticket_table");
            var oRow = oEvent.getSource().getParent();
            var oTicket = this._getModel("sessionData").getProperty(oEvent.getSource().getBindingContext("sessionData").sPath);
            if (oEvent.getParameters().selected) {
                this.iTicketsSelected++;
                this.iTicketTotal += oTicket.amount;
            } else {
                this.iTicketsSelected--;
                this.iTicketTotal -= oTicket.amount;
            }
            if (this.iTicketsSelected) {
                //remove table selection
                oTable.setSelectedItem(oTable.getSelectedItem(), false);
                this.viewModel.setProperty("/ticketState", 2);
                this.viewModel.setProperty("/numberSelectedTickets", this.iTicketsSelected);
                this.viewModel.setProperty("/selectedTicketsAmount", this.iTicketTotal);
            } else {
                this.viewModel.setProperty("/ticketState", 0);
            }
            /*else {
                           //oTable.setSelectedItem(oRow);
                           this.viewModel.setProperty("/state", 1);
                       }*/
        },
        /**
         * Route to appeal view
         * @param {sap.ui.base.Event} oEvent : Link Press
         * @public
         */
        /*  onPressAppealViolation: function (oEvent) {
             this.getRouter().navTo("appealViolation", {
                 sPath: oEvent.getSource().getBindingContext("sessionData").sPath.split("/")[2]
             })
         }, */
        /** Filter ticket table
         * @param {sap.ui.base.Event} oEvent : Combobox change
         * @public
         */
        onFilterTable: function (oEvent) {
            var sKey = oEvent.getParameter("selectedItem").getKey();
            var oTable = this.byId("ticket_table");
            var oFilterOperator = sap.ui.model.FilterOperator.EQ;
            if (sKey === "ALL") {
                sKey = "";
                oFilterOperator = sap.ui.model.FilterOperator.Contains;
            }
            var oFilter = new sap.ui.model.Filter([
                new sap.ui.model.Filter("status", oFilterOperator, sKey),
            ], true);
            oTable.getBinding("items").filter(oFilter);
        },

        /* =========================================================== */
        /* private methods                                         */
        /* =========================================================== */

        _clearAllCheckboxs: function () {
            var oTable = this.byId("ticket_table");
            var oItems = oTable.getItems();

            for (var x in oItems) {
                oItems[x].getCells()[0].setSelected(false);
            }
        },

        /* =========================================================== */
        /* private methods                                         */
        /* =========================================================== */
        /**
         * If first time loading view, select first item
         * @param {sap.ui.base.Event} oEvent : Routing event
         * @private
         */
        _onRouteMatched: function (oEvent) {
            var sTab = oEvent.getParameter("arguments").sTab;
            var oTable = this.byId("ticket_table");
            if (this.firstLoad) {
                this.firstLoad = false;
                if (oTable.getItems().length) {
                    oTable.setSelectedItem(oTable.getItems()[0]);
                    this.onPressTicketRow(null, oTable.getItems()[0]);
                }
            }
            this.onPressTabLink(null, sTab == "tickets" ? "tickets_appeals_link" : "vehicle_details_link");
            this._setHeaderButtonSelected("DeptVehicles");
        },

        /**
         * Saves edited vehicle detials
         * @private
         */
        _saveVehicles: function () {
            //make http call
            //on success
            var sPath = this.byId("vehicle_details_panel").getBindingContext("sessionData").sPath;
            this._getModel("sessionData").setProperty(sPath + "/vehicle", this.viewModel.getProperty("/vehicle"));
            this.viewModel.setProperty("/editable", !this.viewModel.getProperty("/editable"));
        }

    });
});