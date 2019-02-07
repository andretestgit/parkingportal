sap.ui.define([], function () {
	"use strict";
	return {

		initializeApp: function (oContext, oService) {
			this.oContext = oContext;
			this.oService = oService;
			this.firstLoad = true;

			this._setSessionExpireListener();
			this._resetBusyFlags(true, true, true, true);
			this._resetAuth();

			this._getApiStatus(function () {
				this._getAuth(function() {
					this._getUser();		
					this._getVehicleLookups();
					this._getTicketCount();
					this._getBillingStatements();
					this._getBanners();
					this._getPermits();
					this._getApiHealth();
				}.bind(this));
            }.bind(this));	
			
		},
		reInitializeAppAfterPermitRequest: function (oContext, oService) {
			this.oContext = oContext;
			this.oService = oService;

			this._resetBusyFlags(false, false, true, true);
			this._resetAuth();
			this._getAuth(function() {
				this._getPermits();
				this._getBanners();
				this._getTicketCount();
			}.bind(this));
			

		},
		_resetBusyFlags: function (billing, ticketCount, permits, auth) {
			this.oContext._getModel("sessionData").setProperty("/busyFlags", {
				billing: billing,
				ticketCount: ticketCount,
				permits: permits,
				auth: auth
			});
		},
		_resetAuth: function () {
			this.oContext._getModel("sessionData").setProperty("/auth", {
				BILLING_FEATURE_ENABLED: false,
				CAN_REQUEST_PERMIT: false,
				CAN_REQUEST_SPOUSE_PERMIT: false,
				TICKETS_FEATURE_ENABLED: false,
				CAN_SWITCH_TO_CARPOOL: false,
				RENEWAL_ELIGIBLE: false
			});
		},
		_getApiStatus: function (callBackFn) {
            this.oService.getApiStatus(function (oData, sMessage) {
                    var bValid = true;
                    this.oContext._getModel("sessionData").setProperty("/environment", oData.environment);
                    for (var x in oData.items) {
                        if (oData.items[x].key == "mit-sap-proxy.principal" || oData.items[x].key == "mit-sap-proxy.operational") {
                            if (oData.items[x].state != "OK") {
                                bValid = false;
                            }
                        }
                    }
                    if (bValid) {
                        callBackFn();
                    } else {
                        var oDialog = sap.ui.xmlfragment(this.oContext.getView().getId(), "edu.mit.parking.features.fragments.InitializationError", this);
                        this.oContext.getView().addDependent(oDialog);
                        oDialog.open();
                    }
                }.bind(this),
                function (oError) {

                }.bind(this)
            );
        },

		//get logged in user through scp
		_getUser: function () {
			this.oService.getUserName(function (oData, sMessage) {
					this.oContext._getModel("sessionData").setProperty("/user/kerb", oData.name);
				}.bind(this),
				function (oError) {
					if(APP_BUILD_NUMBER !== "local") {
						this.oContext._showValidationErrorMessageItems(oError);						
					}				
				}.bind(this)
			);
		},
		_getAuth: function (callbackFn) {
			this.oService.getAuthorization(function (callbackFn,oData, sMessage) {
					//oData.functions.CAN_SWITCH_CARPOOL = false;
					oData.functions.BILLING_FEATURE_ENABLED = true;
					this.oContext._getModel("sessionData").setProperty("/busyFlags/auth", false);
					this.oContext._getModel("sessionData").setProperty("/auth", oData.functions);
					this.oContext._getModel("sessionData").setProperty("/userInfo", oData.userInfo);
					if(callbackFn) {
						callbackFn();
					}					
				}.bind(this, callbackFn),
				function (callbackFn, oError) {
					this.oContext._showValidationErrorMessageItems(oError);
					if(callbackFn) {
						callbackFn();
					}
				}.bind(this, callbackFn));
		},
		_getVehicleLookups: function () {
			this.oService.getVehicleLookups(function (oData, sMessage) {
					this.oContext._getModel("lookups").setProperty("/vehicle", oData);
					this.oContext._getModel("lookups").setProperty("/busyFlags/vehicle", false);
				}.bind(this),
				function (oError) {
					this.oContext._showValidationErrorMessageItems(oError);
				}.bind(this));
		},
		_getBanners: function () {
			this.oService.getBanners(function (oData, sMessage) {
				 var oCallbackBanners = this.oContext._getModel("sessionData").getProperty("/callBackBanners");
				 	for(var x in oCallbackBanners) {
						 oData.items.push(oCallbackBanners[x]);
					 }

					this.oContext._getModel("sessionData").setProperty("/banners", oData.items);
					this.oContext._getModel("sessionData").setProperty("/callBackBanners", []);
					//this.oContext._addBannerMessages(oData.items);
				}.bind(this),
				function (oError) {
					this.oContext._showValidationErrorMessageItems(oError);
				}.bind(this));
		},
		_getApiHealth: function () {
			this.oService.getApiHealth(function (oData, sMessage) {
					this.oContext._getModel("sessionData").setProperty("/environment", oData.environment);
				}.bind(this),
				function (oError) {
					if(APP_BUILD_NUMBER !== "local") {
						this.oContext._showValidationErrorMessageItems(oError);
					}
				}.bind(this));
		},
		_getBillingStatements: function () {
			this.oService.getBillingPeriods(function (oData, sMessage) {
				var oDashboard = [],
					iMaxCount = 4;
				for(var x in oData.items) {
					if(iMaxCount > x) {
						oDashboard.push(oData.items[x]);
					}
				};
					this.oContext._getModel("sessionData").setProperty("/billing/items", oData.items);
					this.oContext._getModel("sessionData").setProperty("/dashboard/billing/items", oDashboard);
					this.oContext._getModel("sessionData").setProperty("/busyFlags/billing", false);
				}.bind(this),
				function (oError) {
					this.oContext._showValidationErrorMessageItems(oError);
				}.bind(this));
		},
		_getTicketCount: function () {
			this.oService.getTicketCount(function (oData, sMessage) {
					//this.oContext._getModel("sessionData").setProperty("/ticketCount", oData);
					this.oContext._getModel("sessionData").setProperty("/busyFlags/ticketCount", false);
				}.bind(this),
				function (oError) {
					this.oContext._showValidationErrorMessageItems(oError);
				}.bind(this));
		},
		_getPermits: function () {
			this.oService.getPermits(function (oData, sMessage) {
					var oPermits = oData.items,
						bCarpool = false,
						bCanRequestParking = this.oContext._getModel("sessionData").getProperty("/auth/CAN_REQUEST_PERMIT");
					for (var x in oPermits) {
						if (oPermits[x].carpool) {
							bCarpool = true;
						}
					}
					// if(this.firstLoad) {
					// 	this.firstLoad = false;
						if(oData.items.length > 0) {
							this.oContext.getRouter().navTo("dashboard");
							this.oContext._getModel("sessionData").setProperty("/ticketCount", [{
								state: "ISSUED",
								count: 0
							}, {
								state: "APPEALED",
								count: 0
							}]);							
						} else {
							this.oContext._getModel("sessionData").setProperty("/ticketCount", []);
						}
					// }
					if(oPermits.length == 0) {
						bCanRequestParking = true;
					}

					this.oContext._getModel("sessionData").setProperty("/showRequestParkingButton", bCanRequestParking );
					this.oContext._getModel("sessionData").setProperty("/busyFlags/carpool", bCarpool);
					this.oContext._getModel("sessionData").setProperty("/permits", oData.items);
					this.oContext._getModel("sessionData").setProperty("/busyFlags/permits", false);
					
					// if (oPermits.length === 0) {
					// 	this.oContext.getRouter().navTo("newPermit");
					// }

				}.bind(this),
				function (oError) {
					this.oContext._showValidationErrorMessageItems(oError);
				}.bind(this));
		},
		_setSessionExpireListener: function() {
			jQuery(document).ajaxComplete(function(e, jqXHR) {
				if(jqXHR.status === "403") { 
					//Forbidden: CSRF token out of date
					this._showSessionExpireDialog();
				} else if(jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
					// HCP session timeout
					this._showSessionExpireDialog();
				}
			}.bind(this));
	
		},
		_showSessionExpireDialog: function() {
			var dialog = new sap.m.Dialog({
				title: 'Session Expired',
				type: 'Message',
				content: new sap.m.Text({
					text: 'Your session has expired. The page will be reloaded.'
				}),
				beginButton: new sap.m.Button({
					text: 'OK',
					press: function () {
						dialog.close();
						window.location.reload(true);
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		}

	};

});