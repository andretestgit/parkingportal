sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"edu/mit/parking/common/Service",
	"edu/mit/parking/common/Validator",
	"edu/mit/parking/common/Initialize"
], function(Controller, History, MessageBox, Service, Validator, Initialize) {
	"use strict";

	return Controller.extend("edu.mit.parking.common.BaseController", {
		bUpdateCreditCard: false,
		/* =========================================================== */
		/* public methods                                         */
		/* =========================================================== */
		/**
		 * Returns a reference to a new Service object
		 * @public
		 */
		getService: function() {
			return Service;
		},
		/**
		 * Returns a reference to a new Validator object
		 * @public
		 */
		getValidator: function() {
			return new Validator();
		},
		/**
		 * Returns translated text based on key
		 * @param {string} sKey : Key for translated text
		 * @param {array} aParameters : array of parameters 
		 * @public
		 */
		getTranslation: function(sKey, aParameters) {
			return this._getModel("i18n").getResourceBundle().getText(sKey, aParameters);
		},

		/**
		 * Fires when ever the model property /billing/statements is changed. Calculate the outstanding balance based off if statements in array are outside of their period
		 * @param {sap.ui.base.Event} oEvent : Change event
		 * @public
		 */
		calculateOutstandingBalance: function(oEvent) {
			var oStatements = oEvent.getSource().oList;
			var fTotal = 0;
			if (oStatements.length) {
				for (var x in oStatements) {
					//add check to see if current date is within period date. If not add to total
					fTotal += oStatements[x].amount;
				}
				this._getModel("sessionData").setProperty("/billing/outstandingBalance", fTotal);
			}
		},

		/**
		 * Removes error state from input
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		removeValidationError: function(oEvent) {
			oEvent.getSource().setValueState("None");
		},

		onRestrictNumber: function(oEvent) {
			var sValue = oEvent.getSource().getValue().replace(/\D/g, '').substring(0,4);
			oEvent.getSource().setValue(sValue);
			this.removeValidationError(oEvent);
			return sValue;
		},
		allowOnlyLetters: function(oEvent) {
			oEvent.getSource().setValue(oEvent.getParameter("value").replace(/[^a-zA-Z ]/g, ""));
			this.removeValidationError(oEvent);
		},
		changeLicense: function(oEvent) {
			oEvent.getSource().setValue(oEvent.getSource().getValue());
			this.removeValidationError(oEvent);
		},
		/**
		 * Route to add new vehicle
		 * @param {sap.ui.base.Event} oEvent : Button Press
		 * @public
		 */
		onPressAddVehicle: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("sessionData").sPath;
			var iMaxNumberOfVehicles = this._getModel("sessionData").getProperty(sPath).maxNumberOfVehicles
			var iNumberOfVehicles = this._getNumberOfVehicles(false, sPath + "/vehicles");
			if (iNumberOfVehicles < iMaxNumberOfVehicles) {
				this.getRouter().navTo("newVehicle", {
					bTempVehicle: false,
					bEdit: false,
					sPath: sPath.substring(1, sPath.length).replace(/\//g, "-"),
					iVehicleNumber: iNumberOfVehicles + 1
				});
			} else {
				//throw error
				this._showValidationError(this.getTranslation("Error.Text.MaximumVehicles", [iMaxNumberOfVehicles]));
			}
		},
		/**
		 * Route to add new temp vehicle
		 * @param {sap.ui.base.Event} oEvent : Button Press
		 * @public
		 */
		onPressAddTemporaryVehicle: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("sessionData").sPath;
			var iMaxNumberOfVehicles = this._getModel("sessionData").getProperty(sPath).maxNumberTempVehicles;
			var iNumberOfTempVehicles = this._getNumberOfVehicles(true, sPath + "/vehicles");
			if (iNumberOfTempVehicles < iMaxNumberOfVehicles) {
				this.getRouter().navTo("newVehicle", {
					bTempVehicle: true,
					bEdit: false,
					sPath: sPath.substring(1, sPath.length).replace(/\//g, "-"),
					iVehicleNumber: iNumberOfTempVehicles + 1
				});
			} else {
				//show error message				
				this._showValidationError(this.getTranslation("Error.Text.MaximumTempVehicles", [iMaxNumberOfVehicles]));

			}
		},

		/**
		 * Navigate to details views based on id
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressViewDetails: function(oEvent) {
			var sId = oEvent.getSource().sId.indexOf("--") >= 0 ? oEvent.getSource().sId.split("--")[1] : oEvent.getSource().sId,
				sRoute = sId.split("_")[0],
				sParam = sId.split("_")[1];
			if (sParam === "link" || sParam === "button") {
				this.getRouter().navTo(sRoute);
			} else {
				this.getRouter().navTo(sRoute, {
					sTab: sParam
				});
			}
			//temporary for 

		},

		onFilterMake: function(oEvent, sPath) {
			var sYear, sMake, oModel;
			if(oEvent) {
				sYear = oEvent.getParameter("newValue");
				sPath = oEvent.getSource().getBindingContext().sPath;
				sMake = this.viewModel.getProperty(sPath).make;
				sYear = this.onRestrictNumber(oEvent);
			} else {
				oModel = this.viewModel.getProperty(sPath);
				sYear = oModel.year;
				sMake = oModel.make;
			}
			if (sYear.length === 4) {
				//filter make
				this.viewModel.setProperty(sPath + "/lookups/make", []);
				this.getService().getVehicleMakes(sYear, function(sPath, oData, sMessage) {
						this.viewModel.setProperty(sPath + "/lookups/make", oData.items);
					}.bind(this, sPath),
					function(oError) {
						this.viewModel.setProperty(sPath + "/lookups/make", []);
					}.bind(this));
				if (sMake) {
					this.viewModel.setProperty(sPath + "/lookups/model", []);
					this.getService().getVehicleModels(sYear, sMake, function(sPath, oData, sMessage) {
							this.viewModel.setProperty(sPath + "/lookups/model", oData.items);
						}.bind(this, sPath),
						function(oError) {
							this.viewModel.setProperty(sPath + "/lookups/model", []);
						}.bind(this));
				}
			}
		},

		/**
		 * search for models based on make and year
		 * @param {sap.ui.base.Event} oEvent : Combo Change
		 * @param {sap.m.ComboBox} oMake : Make combo
		 * @public
		 */
		onChangeMake: function(oEvent) {
			var sMake = oEvent.getParameter("newValue"),
				sPath = oEvent.getSource().getBindingContext().sPath,
				sYear = this.viewModel.getProperty(sPath).year;
			if (sMake) {
				this.getService().getVehicleModels(sYear, sMake, function(sPath, oData, sMessage) {
						this.viewModel.setProperty(sPath + "/lookups/model", oData.items);
					}.bind(this, sPath),
					function(oError) {
						this.viewModel.setProperty(sPath + "/lookups/model", []);
					}.bind(this));
			}

		},
		/**
		 * Set flag for showing input feilds for motorcycle or combo for vehicle
		 * @param {sap.ui.base.Event} oEvent : Combo Change
		 * @public
		 */
		// onChangeBodyType: function(oEvent) {
		// 	var sVehiclePath = oEvent.getSource().getParent().getBindingContext().sPath,
		// 		oVehicle = this.viewModel.getProperty(sVehiclePath),
		// 		sBodyPath = oEvent.getSource().getSelectedItem().getBindingContext("lookups").sPath,
		// 		oBody = this._getModel("lookups").getProperty(sBodyPath);

		// 	oVehicle.config = oBody.config;
		// 	//check to see if gong to or coming from motorcycle. if so clear make and model
		// 	if (oVehicle.previousBodyType == 8 || oBody.id == 8) {
		// 		oVehicle.make = "";
		// 		oVehicle.model = "";
		// 	}
		// 	oVehicle.previousBodyType = oBody.id;
		// 	this.viewModel.setProperty(sVehiclePath, oVehicle);
		// 	this.removeValidationError(oEvent);
		// },

		getVehicleMakeAndModel: function(oVehicle) {
			var oMakes = this._getModel("lookups").getProperty("/vehicle/makesAndModels"),
				oModels;
			for (var x in oMakes) {
				if (oMakes[x].id == oVehicle.make) {
					oVehicle.make = oMakes[x].text;
					oModels = oMakes[x].models;
					for (var i in oModels) {
						if (oModels[i].id == oVehicle.model) {
							oVehicle.model = oModels[i].text;
						}
					}
				}
			}
			return oVehicle;
		},

		onPressMap: function(oEvent) {
			var oModel = this._getModel("sessionData").getProperty(oEvent.getSource().getBindingContext("sessionData").getPath());
			if(oModel.locationUrl) {
				window.open(oModel.locationUrl);
			} else {
				window.open("http://web.mit.edu/facilities/transportation/parking/MIT_ParkingAreasMap.pdf");
			}
		
		},
		
		/* =========================================================== */
		/* Routing methods                                         */
		/* =========================================================== */

		/**Returns reference to router object
		 * @public
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Navigates back to previous page in history. If history is empty, navigates back to first page
		 * @public
		 */
		onNavBack: function(oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("dashboard", {}, true /* no history */ );
			}
		},

		onPressFAQ: function() {
			window.open("http://web.mit.edu/facilities/transportation/parking/index.html", '_blank');
		},
		

		/**
		 * Route to appeal view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressAppealViolation: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("sessionData").sPath;
			this.getRouter().navTo("appealViolation", {
				sPath: sPath.substring(1, sPath.length).replace("/", "-")
			})
		},
		/**
		 * Route to dashboard view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onNavHome: function(oEvent) {
			this.getRouter().navTo("dashboard");
		},
	
		/**
		 * Navigate to logout view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressLogout: function(oEvent) {
			this.getRouter().navTo("logout");
		},

		/* =========================================================== */
		/* private methods                                         */
		/* =========================================================== */
		/**
		 * Convenience method for getting the view model by name
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 * @private
		 */
		_getModel: function(sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		/**
		 * Returns number of vehicles on permit
		 * @param {boolean} bTemp : flag to count temporary vehicles
		 * @private
		 */
		_getNumberOfVehicles: function(bTemp, sPath) {
			var oVehicles = this._getModel("sessionData").getProperty(sPath);
			var iCount = 0;
			for (var x in oVehicles) {
				if (oVehicles[x].temporary && bTemp) {
					iCount++;
				} else if (!oVehicles[x].temporary && !bTemp) {
					iCount++;
				}
			}
			return iCount;
		},

		

		/* =========================================================== */
		/* dialog/confirmation methods                                         */
		/* =========================================================== */
		/**/
		_showValidationError: function(sTranslationText, fOnClose) {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(
				this.getTranslation(sTranslationText), {
					actions: [sap.m.MessageBox.Action.OK],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: fOnClose
				}
			);
		},

		_parseError: function(oError) {
			if (oError.message) {
				this._showValidationError(oError.message);
			} else if (oError.messages) {
				if (!oError.messages[0].type) {
					this._showValidationError(oError.messages[0]);
				} else {
					if (oError.messages[0].type === 'E') {
						this._showValidationError(oError.messages[0].text);
					}
				}
			}
			// 	aMessages = oError.messages;
			// if (oError.message) {
			// 	this._showValidationError(oError.message);
			// } else if(oError.messages){
			// 	aMessages = oError.messages;
			// 	for (var x in aMessages) {
			// 		if (!aMessages[x].type) {
			// 			sReturnArray.push(aMessages[x]);
			// 		} else {
			// 			if (aMessages[x].type === 'E') {
			// 				sReturnArray.push(aMessages[x].text);
			// 			}
			// 		}
			// 	}
			// 	this._showValidationErrorMessageItems(sReturnArray);
			// }

		},

		_showValidationErrorMessageItems: function(oErrors, sTitle) {
			//var sHeader = "";
			var oMessageStrip;
			if (!sTitle) {
				sTitle = "Request could not be completed";
				//	sHeader = "";
			}
			var oDialog = new sap.m.Dialog({
				title: sTitle,
				verticleScrolling: true,
				contentHeight: "auto",
				beginButton: new sap.m.Button({
					text: 'Close',
					press: function() {
						oDialog.close();
					}.bind(this)
				})
			});

			// oDialog.addContent(new sap.m.Title({
			// 	//text: sHeader,
			// 	titleStyle: "H5"
			// }).addStyleClass("sapUiSmallMarginTopBottom"));
			for (var x = 0; x < oErrors.length; x++) {
				oMessageStrip = new sap.m.MessageStrip({
					text: oErrors[x],
					type: "Error",
					showIcon: true
				});
				oMessageStrip.addStyleClass("sapUiSmallMarginBottom");
				oDialog.addContent(oMessageStrip);
			}
			oDialog.addStyleClass("sapUiResponsiveContentPadding");
			oDialog.open();
		},

		// Initialization
		_initializeData: function() {
			Initialize.initializeApp(this, this.getService());
		},
		_reInitializeData: function() {
			Initialize.reInitializeAppAfterPermitRequest(this, this.getService());
		},

		validateEmail: function(sEmail) {
			var re =
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(sEmail).toLowerCase());
		},
		_getNewVehicle: function(oVehicles) {
			var newVehicle = {
				vehicleNumber: oVehicles ? oVehicles.length + 1 : 1,
				make: "",
				bodyType: "",
				model: "",
				color: "",
				year: "",
				plateNumber: "",
				plateType: "00000001",
				plateState: "MA",
				plateCountry: "US",
				lookups: {
					make: [],
					model: []
				}
			};
			return newVehicle;
		},
		updateCreditCard: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("sessionData");
			this.sPermitId = this._getModel("sessionData").getProperty(sPath + "/permitId");
			this.bUpdateCreditCard = true;
			this.getCyberSourceProfile();
		},
		getCyberSourceProfile: function(oData) {
			this.getService().getCyberSource(function(oData, sMessage) {
					this._forwardToCyberSource(oData);
				}.bind(this),
				function(oError) {
					this._showValidationErrorMessageItems(oError);
				}.bind(this));
		},

		_forwardToCyberSource: function(oData) {
			var sKerb = this._getModel("sessionData").getProperty("/user/kerb"),
				sBaseUrl = this.formatter.getBaseUrl(this._getModel("sessionData").getProperty("/environment")),
				sSuccess = this.bUpdateCreditCard ? "#/cyberUpdateSuccess'>" : "'>",
				sError = this.bUpdateCreditCard ? "#/cyberUpdateError'> " : "#/cybererror'> ",
				sCancel = this.bUpdateCreditCard ? "#/cyberUpdateCancel'> " : "#/cybercancel'> ";
			//read api for cybersource data
			document.body.innerHTML +=
				"<form id='myForm' action='" + oData.actionUrl + "' method='post'>" +
				"<input type='hidden' name='amount' value='0'>" +
				"<input type='hidden' name='merchant_id' value='" + oData.merchantId + "'>" +
				"<input type='hidden' name='profile_id' value='" + oData.profileId + "'> " +
				"<input type='hidden' name='access_key' value='" + oData.accessKey + "'>" +
				"<input type='hidden' name='transaction_type' value='create_payment_token'>" +
				"<input type='hidden' name='merchant_defined_data1' value='" + sKerb + "'>" +
				"<input type='hidden' name='merchant_defined_data2' value='" + this.sPermitId + "'> " +
				//url success
				"<input type='hidden' name='merchant_defined_data3' value='"+ sBaseUrl + sSuccess +
				// //url cancled
				"<input type='hidden' name='merchant_defined_data4' value='"+ sBaseUrl + sCancel +
				// //url error
				"<input type='hidden' name='merchant_defined_data5' value='"+ sBaseUrl + sError +
				"</form>";
			document.getElementById("myForm").submit();
			this.bUpdateCreditCard = false;
		},

		_addBannerMessages: function(aBanners) {
			var oModel = this._getModel("sessionData").getProperty("/banners");

			for(var x in aBanners) {
				oModel.push(aBanners[x]);
			}
			this._getModel("sessionData").setProperty("/banners", oModel);
		},
		_addPermitSuccessBanner: function() {
			this._addBannerMessages([{
				id: "2",
				type: "S",
				header: "Request Submitted",
				//	message: "Please note that you cannot park on campus until you receive an email confirming your permit is active",
				message: "You will receive an email when your parking request has been approved.",
				cancel: true
			}]);
		},
	});
});