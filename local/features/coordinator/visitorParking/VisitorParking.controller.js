sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.coordinator.visitorParking.VisitorParking", {
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
                visibleRowCount: 0
            });
            this.getView().setModel(this.viewModel);
        },

        onBeforeRendering: function () {

        },

        onAfterRendering: function () {
            this._setTableVisibleRowCount("/coordinator/visitorParking");
            this._setHeaderButtonSelected("VisitorParking");
        },
        /* =========================================================== */
        /* public methods                                         */
        /* =========================================================== */


        /* =========================================================== */
        /* event handlers                                         */
        /* =========================================================== */
        /**
         * Download visitor pass
         * @param {sap.ui.base.Event} oEvent : Icon Press
         * @public
         */
        onPressDownloadPDF: function (oEvent) {

        },
        /**
         * Revert JV for requested parking passes 
         * @param {sap.ui.base.Event} oEvent : Icon Press
         * @public
         */
        onPressCancelVisitorRequest: function (oEvent) {
            this.sPath = oEvent.getSource().getBindingContext("sessionData").sPath;
            this._showCancelVisitorRequestConfirmation();


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

        /**
         * Show confirmation messagebox to confirm user wants to delete vehicle from permit
         * @private
         */
        _showCancelVisitorRequestConfirmation: function () {
            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
            sap.m.MessageBox.warning(
                this.getTranslation("Visitor.Text.CancelRequestConfirmation"), {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                    onClose: function (sAction) {
                        if (sAction === "YES") {
                            this._cancelPermitRequest();
                        }
                    }.bind(this)
                }
            );
        },
        /**
         * Make http call to cancel request permit and revert jv
         * @private
         */
        _cancelPermitRequest: function () {
            var iIndex = parseInt(this.sPath.split("/")[3]),
                oModel = this._getModel("sessionData").getProperty("/coordinator/visitorParking"),
                oEntry = oModel[iIndex];
            //http call
            //success
            oModel.splice(iIndex, 1);
            this._getModel("sessionData").setProperty("/coordinator/visitorParking", oModel);
            this._setTableVisibleRowCount();
        }
    });
});