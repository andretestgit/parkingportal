sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.violation.ViolationHistory", {
        formatter: formatter,
        iTicketsSelected: 0,
        iTicketTotal: 0,
        viewModel: null,
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

            this.getRouter().getRoute("violationHistory").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
            //create view model
            this.viewModel = new JSONModel({
                state: 0, // 0 first load nothing selected, 1 only 1 selection show ticket info, 2 multiple selected show payment info
                numberSelectedTickets: 0,
                selectedTicketsAmount: 0,
                showAppealPayment: true
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
         * Show ticket info and clear all checkboxs
         * @param {sap.ui.base.Event} oEvent : Checkbox select
         * @public
         */
        onPressTicketRow: function (oEvent, oItem) {
            var sPath;
            this._clearAllCheckboxs();
            this.iTicketsSelected = 0;
            this.iTicketTotal = 0;
            this.viewModel.setProperty("/state", 1);
            if (oItem) {
                this.byId("details-container").bindElement({
                    model: "sessionData",
                    path: oItem.getBindingContext("sessionData").sPath
                });
            } else {
                if (sap.ui.Device.system.phone) {
                    sPath = oEvent.getParameter("listItem").getBindingContext("sessionData").sPath;
                    this.getRouter().navTo("ticketInfo", {
                        sPath: sPath.substring(1, sPath.length).replace("/", "-")
                    });
                } else {
                    this.byId("details-container").bindElement({
                        model: "sessionData",
                        path: oEvent.getParameter("listItem").getBindingContext("sessionData").sPath
                    });
                }
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
                this.viewModel.setProperty("/state", 2);
                this.viewModel.setProperty("/numberSelectedTickets", this.iTicketsSelected);
                this.viewModel.setProperty("/selectedTicketsAmount", this.iTicketTotal);
            } else {
                this.viewModel.setProperty("/state", 0);
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
        /* onPressAppealViolation: function (oEvent) {
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
        /**
         * If first time loading view, select first item
         * @param {sap.ui.base.Event} oEvent : Routing event
         * @private
         */
        _onRouteMatched: function (oEvent) {
            var oTable = this.byId("ticket_table");
            if (this.firstLoad && !sap.ui.Device.system.phone) {
                this.firstLoad = false;
                if (oTable.getItems().length) {
                    oTable.setSelectedItem(oTable.getItems()[0]);
                    this.onPressTicketRow(null, oTable.getItems()[0]);
                }
            }
        },

        _clearAllCheckboxs: function () {
            var oTable = this.byId("ticket_table");
            var oItems = oTable.getItems();

            for (var x in oItems) {
                oItems[x].getCells()[0].setSelected(false);
            }
        }

    });
});