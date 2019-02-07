sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.cybersource.CyberSource", {
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

            this.getRouter().getRoute("cyberUpdateSuccess").attachMatched(this._onUpdateSuccess, this); //triggered every time view is navigated to
            this.getRouter().getRoute("cyberError").attachMatched(this._onError, this); //triggered every time view is navigated to
            this.getRouter().getRoute("cyberCancel").attachMatched(this._onCancel, this); //triggered every time view is navigated to
            this.getRouter().getRoute("cyberUpdateCancel").attachMatched(this._onUpdateCancel, this); //triggered every time view is navigated to
            this.getRouter().getRoute("cyberUpdateError").attachMatched(this._onUpdateError, this); //triggered every time view is navigated to
            //create view model
                

        },

        onBeforeRendering: function () {

        },

        onAfterRendering: function () {
            this.oService = this.getService();
        },
        /* =========================================================== */
        /* public methods                                         */
        /* =========================================================== */
        onNavToDashboard: function() {
            this.getRouter().navTo("dashboard");
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
        _onRouteMatched: function (oEvent) {},

        _onUpdateSuccess: function(oEvent) {
            if(this.firstLoad) {
                this.firstLoad = false;
                //this._addPermitSuccessBanner();
                this._getModel("sessionData").setProperty("/callBackBanners",[{
                    id: "",
                    type: "S",
                    header: "Request Successful",
                    //	message: "Please note that you cannot park on campus until you receive an email confirming your permit is active",
                    message: "Your credit card has been successfully updated.",
                    cancel: true
                }]);
                this.onNavToDashboard();
            }
            
        },
        _onUpdateCancel: function(oEvent) {
            if(this.firstLoad) {
                this.firstLoad = false;
                //this._addPermitSuccessBanner();
                this._getModel("sessionData").setProperty("/callBackBanners",[{
                    id: "",
                    type: "W",
                    header: "Request Canceled",
                    //	message: "Please note that you cannot park on campus until you receive an email confirming your permit is active",
                    message: "Your credit card information was not updated.",
                    cancel: true
                }]);
                this.onNavToDashboard();
            }
            
        },
        _onUpdateError: function(oEvent) {
            if(this.firstLoad) {
                this.firstLoad = false;
                //this._addPermitSuccessBanner();
                this._getModel("sessionData").setProperty("/callBackBanners",[{
                    id: "",
                    type: "W",
                    header: "Request Error",
                    //	message: "Please note that you cannot park on campus until you receive an email confirming your permit is active",
                    message: "There was a problem updating your credit card information. If problem persist, contact the Parking & Transportation Office.",
                    cancel: true
                }]);
                this.onNavToDashboard();
            }
            
        },
        _onError: function(oEvent) {
            if(this.firstLoad){
                this.firstLoad = false;
                this._getModel("sessionData").setProperty("/callBackBanners",[{
                    id: "",
                    type: "W",
                    header: "Request Error",
                    //	message: "Please note that you cannot park on campus until you receive an email confirming your permit is active",
                    message: "There was a problem capturing your credit card information for autopay. Your parking request was not created. If problem persist, contact the Parking & Transportation Office.",
                    cancel: true
                }]);
                this.onNavToDashboard();
            }
       
        },
        _onCancel: function(oEvent) {
            if(this.firstLoad){
                this.firstLoad = false;
                this._getModel("sessionData").setProperty("/callBackBanners",[{
				id: "",
				type: "W",
				header: "Request Canceled",
				//	message: "Please note that you cannot park on campus until you receive an email confirming your permit is active",
				message: "You have canceled your parking request. To have the ability to park on campus you will need to submit a parking request.",
				cancel: true
            }]);
            this.onNavToDashboard();
        }

        _on
        },
     

    });
});