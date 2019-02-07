sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.violation.AppealViolation", {
        formatter: formatter,
        iTicketsSelected: 0,
        iTicketTotal: 0,
        viewModel: null,
        /* =========================================================== */
        /* lifecycle methods                                         */
        /* =========================================================== */
        onInit: function () {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device

            this.getRouter().getRoute("appealViolation").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
            //create view model
            this.viewModel = new JSONModel({
                appeal: {
                    ticketId: "",
                    accountId: "",
                    ticketNumber: "",
                    dateAppealed: new Date(),
                    appealText: ""
                },
                state: 1,
                showAppealPayment: false
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

        onPressSubmit: function (oEvent) {
            //submit appeal

        },

        onPressCancel: function (oEvent) {
            var oFileUploader = this.byId("UploadCollection");
            this.viewModel.setProperty("/appealReason", "");
            //clear file uploader
            oFileUploader.removeAllItems();
            this.onNavBack();
        },

        /* =========================================================== */
        /* event handlers                                         */
        /* =========================================================== */


        /* =========================================================== */
        /* private methods                                         */
        /* =========================================================== */
        /**
         * Fires every time route is matched to this view
         * @param {sap.ui.base.Event} oEvent : Routing event
         * @private
         */
        _onRouteMatched: function (oEvent) {
            this.sPath = oEvent.getParameter("arguments").sPath;
            this.byId("details-container").bindElement({
                model: "sessionData",
                path: "/" + this.sPath.replace("-", "/")
            });
        }

    });
});