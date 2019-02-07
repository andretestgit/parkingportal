sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel"
 
], function (BaseController, JSONModel ) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.status.Status", {       
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

            this.getRouter().getRoute("status").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
            //create view model
            this.viewModel = new JSONModel({
                status: [],
                flags: {
                    status: true
                }

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
    

        /* =========================================================== */
        /* private methods                                         */
        /* =========================================================== */



        /* =========================================================== */
        /* private methods                                         */
        /* =========================================================== */
        /**
         * If first time loading view, select first item
         * @param {sap.ui.base.Event} oEvent : Routing event
         * @private
         */
        _onRouteMatched: function (oEvent) {
            this.getService().getApiHealth(function (oData) {
                    this.viewModel.setProperty("/status", oData.items);
                    this.getService().getApiStatus(function (oData) {
                            for(var x in oData.items) {
                                oData.items[x].api = "Parking";
                            }
                            this.viewModel.setProperty("/status", oData.items);
                            this.getService().getFinanceApiStatus(function (oData) {
                                    for(var x in oData.items) {
                                        oData.items[x].api = "Finance";
                                        this.viewModel.getProperty("/status").push(oData.items[x]);
                                    }
                                    this.viewModel.setProperty("/flags/status", false);
                                }.bind(this),
                                function (oError) {

                                }.bind(this));
                        }.bind(this),
                        function (oError) {

                        });
                }.bind(this),
                function (oError) {

                });
        },




    });
});