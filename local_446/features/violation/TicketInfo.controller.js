sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.violation.TicketInfo", {
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

            this.getRouter().getRoute("ticketInfo").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
            //create view model
            this.viewModel = new JSONModel({});
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




        /* =========================================================== */
        /* private methods                                         */
        /* =========================================================== */
        /**
         * If first time loading view, bind view to ticket
         * @param {sap.ui.base.Event} oEvent : Routing event
         * @private
         */
        _onRouteMatched: function (oEvent) {
            var sPath = oEvent.getParameter("arguments").sPath;
            sPath = "/" + sPath.replace("-", "/");
            this.getView().bindElement({
                model: "sessionData",
                path: sPath
            });
        }



    });
});