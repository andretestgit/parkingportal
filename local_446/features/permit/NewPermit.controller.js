sap.ui.define([
	"edu/mit/parking/common/BaseController",
	"sap/ui/model/json/JSONModel",
	"edu/mit/parking/common/formatter",
	"edu/mit/parking/common/CustomTypes"
], function (BaseController, JSONModel, formatter, CustomTypes) {
	"use strict";

	return BaseController.extend("edu.mit.parking.features.permit.NewPermit", {
		formatter: formatter,
		CustomTypes: CustomTypes,
		rejectedCarpool: false,
		numberOfCarpoolMembers: 3,
		carpoolLot: "",
		/* =========================================================== */
		/* lifecycle methods                                         */
		/* =========================================================== */
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device
			/*this.getView().setBusy(true);
			this.getOwnerComponent().getModel("jcc").attachMetadataLoaded(function(oEvent) { //Set screen to not busy once meta data has been loaded
				this.getView().setBusy(false);
			}.bind(this));*/

			this.getRouter().getRoute("newPermit").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
			//create view model
			//create view model
			this.viewModel = new JSONModel({
				dataLoaded: false,
				showComment: false,
				showCarpoolDescription: false,
				carpoolMemberValidated: false,
				carpool: false,
				economy: false,
				numberOfPeople: "3",
				agreeToTermsAndConditions: false,
				flags: {
					requestPermit: false
				},
				permitFeeDetails: {
					// "dailyFee": 10,
					// "recurringFee": 100,
					// "recurringFrequency": "Y",
					// "annualCap": 1900
				},
				newPermit: {
					permitTypeId: "",
					permitId: "",
					location: "",
					locationId: "",
					contactEmail: "",
					contactWorkPhone: "",
					contactHomePhone: "",
					vehicles: [],
					inviteCarpoolMembers: [{
						kerbid: ""
					}, {
						kerbid: ""
					}],
					requestElectricVehicleDiscount: false,
					acceptCarpoolInvitation: false,
					paymentMethod: "P"
				},
				suggestions: [],
				valueHelp: [{
					id: "2",
					text: "2"
				}, {
					id: "3",
					text: "3"
				}, {
					id: "4",
					text: "4"
				}, {
					id: "5",
					text: "5"
				}]

			});
			this.getView().setModel(this.viewModel);

		},

		onBeforeRendering: function () {

		},

		onAfterRendering: function () {
			//Read API for permit info
			// this.viewModel.setProperty("/permit", this.getOwnerComponent().getModel("sessionData").getProperty("/permitsModel/0"));
			// this.viewModel.setProperty("/permitFeeDetails", this.getOwnerComponent().getModel("sessionData").getProperty(
			// 	"/permitsModel/0/permitType/0/permitFeeDetails"));
			// this.viewModel.setProperty("/canAddAditionalVehicles", this.getOwnerComponent().getModel("sessionData").getProperty(
			// 	"/permitsModel/0/permitType/0/canAddAditionalVehicles"));
			// this.viewModel.setProperty("/headerText", this.getOwnerComponent().getModel("sessionData").getProperty(
			// 	"/permitsModel/0/permitType/0/headerText"));
			// 	this.viewModel.setProperty("/newPermit/paymentMethod", "P");
			// this.viewModel.setProperty("/headerText", this.getOwnerComponent().getModel("sessionData").getProperty(
			// 	"/permitsModel/0/permitType/0/electricVehicleDiscount"));
		},

		/* =========================================================== */
		/* public methods                                         */
		/* =========================================================== */
		/**
		 * Handles requesting suggetion items through people search api
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		suggestEmail: function (oEvent) {
			var sKey = oEvent.getParameter("suggestValue"),
				oService = this.getService();

			this.removeValidationError(oEvent);
			//clear out currently selected person
			this.viewModel.setProperty(oEvent.getSource().getBindingContext().getPath() + "/kerbid", "")
			this.viewModel.setProperty("/carpoolMemberValidated", false);
			// if (oEvent.getSource().getId() != this.sSuggestionInputId) {
			// 	this.viewModel.setProperty("/suggestions", []);
			// }
			this.viewModel.setProperty("/suggestions", []);
			this.sSuggestionInputId = oEvent.getSource().getId();
			//search 
			oService.getPeople(sKey, function (oData, sMessage) {
					this.viewModel.setProperty("/suggestions", oData.items);
				}.bind(this),
				function (oError) {
					this.viewModel.setProperty("/suggestions", []);
				}.bind(this)
			);
			//this.viewModel.setProperty("/suggestions", oResults);
		},
		carpoolEmailSelected: function (oEvent) {
			// var oItem = this.viewModel.getProperty(oEvent.getParameter("selectedItem").getBindingContext().sPath),
			// 	oCarpoolMemberPath = oEvent.getSource().getBindingContext().sPath;
			//this.viewModel.setProperty(oCarpoolMemberPath + "/kerb", oItem.kerbid);
			this.viewModel.setProperty("/suggestions", []);
			oEvent.getSource().setValueState("None");
		},
		/**
		 * Verifies that enter email is valid 
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onChangeEmail: function (oEvent) {
			var sKey = oEvent.getParameters().value,
				oInput = oEvent.getSource(),
				sPath = oInput.getBindingContext().sPath,
				oService = this.getService();

			this.viewModel.setProperty("/suggestions", []);

			oService.getPeople(sKey, function (sKey, sPath, oInput, oData, sMessage) {
					var bFound = false;
					if (oData.items.length) {
						for (var x in oData.items) {
							if (oData.items[x].email == sKey) {
								this.viewModel.setProperty(sPath + "/kerbid", oData.items[x].id);
								bFound = true;
								oInput.setValueState("None");
								this.viewModel.setProperty("/carpoolMemberValidated", true);
							}
						}
						if (!bFound) {
							this.viewModel.setProperty(sPath + "/kerbid", "");
							oInput.setValueState("Error");
							oInput.setValueStateText("Enter or select a valid email address");
						}

						//this.viewModel.setProperty("/suggestions", []);
						//	this.viewModel.setproperty(sPath + "/email", oData.items[0].id);
					} else {
						oInput.setValueState("Error");
						oInput.setValueStateText("Enter or select a valid email address");
					}
				}.bind(this, sKey, sPath, oInput),
				function (oError) {

				}.bind(this)
			);
		},

		vehicleFactory: function (sId, oContext) {
			var oFragment = sap.ui.xmlfragment(sId, "edu.mit.parking.features.fragments.PermitVehicle", this),
				oMake = oFragment.getItems()[1].getItems()[0].getItems()[1].getItems()[1],
				oModel = oFragment.getItems()[1].getItems()[0].getItems()[2].getItems()[1];
			if (this._getModel("device").getProperty("/system/phone")) {
				oMake.setFilterFunction(function (sTerm, oItem) {
					// A case-insensitive 'string contains' style filter
					return oItem.getText().match(new RegExp(sTerm, "i"));
				});
				oModel.setFilterFunction(function (sTerm, oItem) {
					// A case-insensitive 'string contains' style filter
					return oItem.getText().match(new RegExp(sTerm, "i"));
				});
			}
			return oFragment;
		},
		onVehicleChange: function (oEvent) {
			var oVehicleContainer = this.byId("vehicle_container"),
				oVehicles, oMake, oModel;
			if (this._getModel("device").getProperty("/system/phone")) {
				if (oVehicleContainer.getItems().length > 0) {
					oVehicles = oVehicleContainer.getItems();
					for (var x in oVehicles) {
						oMake = oVehicles[x].getItems()[1].getItems()[0].getItems()[1].getItems()[1];
						oModel = oVehicles[x].getItems()[1].getItems()[0].getItems()[2].getItems()[1];
						oMake.setFilterFunction(function (sTerm, oItem) {
							// A case-insensitive 'string contains' style filter
							return oItem.getText().match(new RegExp(sTerm, "i"));
						});
						oModel.setFilterFunction(function (sTerm, oItem) {
							// A case-insensitive 'string contains' style filter
							return oItem.getText().match(new RegExp(sTerm, "i"));
						});
					}
				}
			}
		},

		/* =========================================================== */
		/* event handlers                                         */
		/* =========================================================== */
		/**
		 * Adds a blank new vehicle object to the vehicles array
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressAddAnotherVehicle: function (oEvent) {
			var oVehicles = this.viewModel.getProperty("/newPermit/vehicles"),
				iMaxVehicles = this.viewModel.getProperty(oEvent.getSource().getBindingContext().sPath + "/maxNumberOfVehicles");
			if (oVehicles.length < iMaxVehicles) {
				var newVehicle = this._getNewVehicle(oVehicles);
				oVehicles.push(newVehicle);
				this.viewModel.setProperty("/newPermit/vehicles", oVehicles);
			} else {
				this._showValidationError("Error.Text.MaximumVehicles", [iMaxVehicles]);
			}
			this.viewModel.refresh(true);
		},
		/**
		 * Remove vehicle from list. Renumber vehicle numbers if vehicle is a middle vehicle
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressRemoveVehicle: function (oEvent) {
			var sIndex = oEvent.getSource().getBindingContext().sPath.split("/")[3],
				oVehicles = this.viewModel.getProperty("/newPermit/vehicles"),
				bRenumberVehicles = false,
				oContainer = this.byId("vehicle_container"),
				oMake, oModel;
			//Check to see if vehicle to be removed is a middle vehicle which would require renumbering vehicles
			if (sIndex != oVehicles.length - 1) {
				bRenumberVehicles = true;
			}
			oVehicles.splice(parseInt(sIndex), 1);
			//this.viewModel.setProperty("/newPermit/vehicles", oVehicles);
			this.viewModel.setProperty("/newPermit/vehicles", oVehicles);
			//this.viewModel.refresh(true);
			if (bRenumberVehicles) {
				for (var x = 0; x < oVehicles.length; x++) {
					oVehicles[x].vehicleNumber = x + 1;
					//need to rebind model combo to make if it is selected as well
					// oMake = oContainer.getItems()[x].getItems()[1].getItems()[0].getItems()[1].getItems()[2]
					// this.onChangeMake(null, oMake);
				}

			}
			this.viewModel.setProperty("/newPermit/vehicles", oVehicles);
			//check if electric vehicle flag still exists
			//	this.onPressElectricVehicleDiscount();
			this.viewModel.refresh(true);
		},

		onChangeState: function (oEvent) {
			var sStatePath = oEvent.getSource().getSelectedItem().getBindingContext("lookups").sPath,
				sVehiclePath = oEvent.getSource().getBindingContext().sPath,
				oModel = this._getModel("lookups").getProperty(sStatePath);

			this.viewModel.setProperty(sVehiclePath + "/plateCountry", oModel.country);
			this.removeValidationError(oEvent);
		},
		/**
		 * Shows and hides comment section
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressComment: function (oEvent) {
			this.viewModel.setProperty("/showComment", !this.viewModel.getProperty("/showComment"));
			this.viewModel.setProperty("/newPermit/comment", "");
		},

		/**
		 * Shows and hides carpool description section
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressCarpoolDescription: function (oEvent) {
			this.viewModel.setProperty("/showCarpoolDescription", !this.viewModel.getProperty("/showCarpoolDescription"));
			this.viewModel.setProperty("/newPermit/carpool/description", "");
		},
		/**
		 * Sets flag if permit type is carpool
		 * @param {sap.ui.base.Event} oEvent : Selected
		 * @public
		 */
		onChangePermitType: function (oEvent) {
			var sPath = oEvent.getParameter("item").getBindingContext().sPath,
				oModel = this.viewModel.getProperty(sPath);

			this.viewModel.setProperty("/newPermit/permitTypeId", oModel.permitTypeId);
			if (oModel.carpool) {
				this.viewModel.setProperty("/newPermit/vehicles", []);
				if (!oModel.carpoolInvitation) {
					if (oModel.locationOptions.length && !this.viewModel.getProperty("/newPermit/locationId")) {
						this.viewModel.setProperty("/newPermit/locationId", oModel.locationOptions[0].id);
					}
				}
			} else if (this.viewModel.getProperty("/carpool") && !oModel.carpool) {
				this._resetVehicleModel();
			}
			this._setDefaultPaymentOption(oModel);

			//this.onPressElectricVehicleDiscount();

			//set properties
			this.viewModel.setProperty("/carpool", oModel.carpool);
			this.viewModel.setProperty("/permitFeeDetails", oModel.permitFeeDetails);
			this.viewModel.setProperty("/minNumberOfVehicles", oModel.minNumberOfVehicles);
			this.permit = oModel;

			//bind permit to container
			this.byId("permit_panel_container").bindElement({
				path: sPath
			});

			// //set permit properties
			// if (oEvent) {
			// 	oModel = this.viewModel.getProperty(oEvent.getParameter("item").getBindingContext().sPath);
			// 	oPermit = this.viewModel.getProperty("/permit");
			// 	oKeys = Object.keys(oModel);
			// 	for (var x = 2; x < oKeys.length; x++) {
			// 		oPermit[oKeys[x]] = oModel[oKeys[x]];
			// 	}
			// 	this.viewModel.setProperty("/permit", oPermit);
			// }
		},
		/**
		 * 
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onChangeNumberOfPeople: function (oEvent) {
			if (oEvent.getParameters().selectedItem) {
				var sKey = parseInt(oEvent.getParameters().selectedItem.getKey()),
					oMembers = this.viewModel.getProperty("/newPermit/inviteCarpoolMembers"),
					iLimit = sKey - oMembers.length - 1;

				this.numberOfCarpoolMembers = sKey;
				if (sKey > oMembers.length) {
					//add new memebers
					for (var x = 0; x < iLimit; x++) {
						oMembers.push({
							kerbid: ""
						});
					}
				} else {
					//remove members
					sKey -= 1;
					oMembers.splice(sKey, oMembers.length - sKey);
				}
				this.viewModel.setProperty("/newPermit/inviteCarpoolMembers", oMembers);
			} else {
				oEvent.getSource().setSelectedKey(this.numberOfCarpoolMembers);
			}
		},

		onChangeCarpoolLot: function (oEvent) {
			this.removeValidationError(oEvent);
			if (!oEvent.getParameters().selectedItem) {
				oEvent.getSource().setSelectedKey(this.carpoolLot);
			} else {
				this.carpoolLot = oEvent.getParameters().selectedItem.getKey();
			}
		},

		/**
		 * Temperary method for testing different permits. Remove once testing has been successful
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onChangePermit: function (oEvent) {
			var sPath = oEvent.getParameter("selectedItem").getBindingContext("sessionData").sPath,
				oModel = this._getModel("sessionData").getProperty(sPath);

			this.viewModel.setProperty("/permit", oModel);
			this.viewModel.setProperty("/newPermit/permitTypeId", "PERSONAL");
			//this.viewModel.setProperty("/newPermit/paymentMethod", oModel.paymentOptions[0].id);
			if (oModel.paymentOptions.payroll) {
				this.viewModel.setProperty("/newPermit/paymentMethod", "P");
			} else if (oModel.paymentOptions.studentAccount) {
				this.viewModel.setProperty("/newPermit/paymentMethod", "S");
			} else if (oModel.paymentOptions.creditCard) {
				this.viewModel.setProperty("/newPermit/paymentMethod", "C");
			} else if (oModel.paymentOptions.journalVoucher) {
				this.viewModel.setProperty("/newPermit/paymentMethod", "J");
			}
			this.viewModel.setProperty("/headerText", oModel.permitType[0].headerText);
			this.viewModel.setProperty("/showComment", false);
			//this.viewModel.setProperty("/electricVehicleDiscount", oModel.permitType[0].electricVehicleDiscount);
			this.viewModel.setProperty("/economy", false);
			this.viewModel.setProperty("/agreeToTermsAndConditions", false);
			this.viewModel.setProperty("/permitFeeDetails", oModel.permitType[0].permitFeeDetails);
			this.viewModel.setProperty("/canAddAditionalVehicles", oModel.permitType[0].canAddAditionalVehicles);
			this.viewModel.setProperty("/carpool", oModel.permitType[0].carpool);
			this.viewModel.refresh(true);
			oModel.permitType[0].carpool ? this.viewModel.setProperty("/newPermit/vehicles", []) : this._resetVehicleModel();
			oModel.permitType[0].carpoolInvitation ? this.viewModel.setProperty("/numberOfPeople", oModel.permitType[0].carpoolMembers
				.length) : null;
			//this.onPressElectricVehicleDiscount();
			//bind permit to container
			this.byId("permit_panel_container").bindElement({
				path: "/permit/permitType/0"
			});
		},
		/**
		 * Open MIT where is map for westgate
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressEnconomyLink: function (oEvent) {
			window.open(
				"https://whereis.mit.edu/?zoom=18&lat=42.35555513653314&lng=-71.10191344451903&maptype=mit&q=westgate%20parking&open=-1");
		},
		/**
		 * Set flag for economy which reduces rate and cap by half
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onSelectEconomy: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext().sPath,
				oModel = this.viewModel.getProperty(sPath);
			//this.viewModel.setProperty("/economy", oEvent.getParameter("selected"));
			//oEvent.getParameter("selected") ? this.viewModel.setProperty("/permitFeeDetails", oModel.economyFeeDetails) : this.viewModel.setProperty(
			//	"/permitFeeDetails", oModel.permitFeeDetails);
			if (oEvent.getParameter("selected")) {
				this.viewModel.setProperty("/permitFeeDetails", oModel.economyFeeDetails);
				this.viewModel.setProperty("/newPermit/permitTypeId", oModel.economyPermitTypeId);
			} else {
				this.viewModel.setProperty("/permitFeeDetails", oModel.permitFeeDetails);
				this.viewModel.setProperty("/newPermit/permitTypeId", oModel.permitTypeId);
			}
			this.viewModel.refresh(true);
		},
		/**
		 * Change parking fee based on selected lot
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onChangePreferredLot: function (oEvent) {
			var oSelected = oEvent.getParameter("item") || oEvent.getSource();
			oSelected = this.viewModel.getProperty(oSelected.getBindingContext().sPath);
			this.viewModel.setProperty("/permit/cost/fee", oSelected.cost);
			this.viewModel.setProperty("/newPermit/preferredLot", oSelected.id);
			this.viewModel.refresh(true);
		},
		// onChangePayment: function (oEvent) {
		// 	var oSelected = oEvent.getParameter("item") || oEvent.getSource();
		// 	oSelected = this.viewModel.getProperty(oSelected.getBindingContext().sPath);
		// 	this.viewModel.setProperty("/newPermit/paymentMethod", oSelected.id);
		// 	//this.viewModel.refresh(true);
		// },
		/**
		 * Remove permit fee if selected
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressElectricVehicleDiscount: function (oEvent) {
			var oVehicles = this.viewModel.getProperty("/newPermit/vehicles"),
				belectricVehicleDiscount = false;
			for (var x in oVehicles) {
				if (oVehicles[x].electricVehicleDiscount) {
					belectricVehicleDiscount = true;
				}
			}
			//this.viewModel.setProperty("/newPermit/electricVehicleDiscount", belectricVehicleDiscount);
		},

		onPressReject: function (oEvent) {
			this.sPermitPath = oEvent.getSource().getBindingContext().getPath();
			this._showRejectCarpoolConfirmation();

		},
		/**
		 * Validate input fields
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressSubmit: function (oEvent, bReject) {
			var oModel = this.viewModel.getProperty("/newPermit"),
				bValid = this.getValidator().validate(this.getView().getContent()[0]),
				oEmail = this.byId("contact_email"),
				oPhone = this.byId("contact_phone"),
				oCarpoolLocation = this.byId("carpool_location"),
				oCarpoolEmail = this.byId("carpool_email_container"),
				oPermit = oEvent ? this.viewModel.getProperty(oEvent.getSource().getBindingContext().getPath()) : this.viewModel.getProperty(this.sPermitPath);

			if (!this.validateEmail(oEmail.getValue()) && oEmail.getVisible()) {
				oEmail.setValueState("Error");
				oEmail.setValueStateText("Enter a valid email address");
				bValid = false;
			}
			if (!oPhone.getValue() && oPhone.getVisible()) {
				oPhone.setValueState("Error");
				bValid = false;
			}
			if (!oCarpoolLocation.getSelectedKey() && oCarpoolLocation.getVisible()) {
				oCarpoolLocation.setValueState("Error");
				bValid = false;
			}
			if (oPermit.carpool && !oPermit.carpoolInvitation) {
				if (oModel.inviteCarpoolMembers.length > 0) {
					for (var x in oModel.inviteCarpoolMembers) {
						if (!oModel.inviteCarpoolMembers[x].kerbid) {
							oCarpoolEmail.getItems()[x].setValueState("Error");
							oCarpoolEmail.getItems()[x].setValueStateText("Enter or select a valid email address");
							bValid = false;
						}
					}
				}
			}


			if (bValid || bReject) {
				if (!this.viewModel.getProperty("/flags/requestPermit")) {
					this.viewModel.setProperty("/flags/requestPermit", true);
					oModel = this._formatModelForSave(oEvent, oModel, bReject);
					this.getService().createPermit(oModel, function (oData, sMessage) {
							this.sPermitId = oData.item.permitId;
							//this._addPermitSuccessBanner();
							if (this.viewModel.getProperty("/newPermit/paymentMethod") === "C" && !this.rejectCarpool) {
								this.getCyberSourceProfile();
							} else {
								this._resetModel();
								this._reInitializeData();
								this.getRouter().navTo("dashboard");
							}

							this.viewModel.setProperty("/flags/requestPermit", false);
						}.bind(this),
						function (oError) {
							this.viewModel.setProperty("/flags/requestPermit", false);
							this._showValidationErrorMessageItems(oError);
						}.bind(this));
				}
			} else {
				this._showValidationError("Error.Text.RequiredFields");
			}

			//after submiting permit request

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
			//call API to get permit options

			// if (this._getModel("sessionData").getProperty("/permits").length > 0) {
			if (!this._getModel("sessionData").getProperty("/auth/CAN_REQUEST_PERMIT") && !this._getModel("sessionData").getProperty("/permits").length === 0) {
				this.getRouter().navTo("dashboard");
			} else {
				this.getService().getPermitOptions(function (oData, sMessage) {
						if (oData.permitTypes.length > 0) {
							this.viewModel.setProperty("/permit", oData);
							this.viewModel.setProperty("/permitFeeDetails", oData.permitTypes[0].permitFeeDetails);
							this.viewModel.setProperty("/newPermit/permitTypeId", oData.permitTypes[0].permitTypeId);
							this.viewModel.setProperty("/minNumberOfVehicles", oData.permitTypes[0].minNumberOfVehicles);
							this._setDefaultPaymentOption(oData.permitTypes[0]);
							this.permit = oData.permitTypes[0];

							if (oData.permitTypes[0].carpoolInvitation && oData.permitTypes[0].carpoolMembers.length) {
								this.viewModel.setProperty("/numberOfPeople", oData.permitTypes[0].carpoolMembers.length);
							}
							if (oData.permitTypes[0].minNumberOfVehicles > 0) {
								this._resetVehicleModel();
							}
							this.viewModel.setProperty("/dataLoaded", true);
						} else {
							this._showValidationError("You are not eligible to request a permit. Contact the parking office for assistance.", function () {
								this.onNavBack();
							}.bind(this));
						}
					}.bind(this),
					function (oError) {

					}.bind(this));
			}

			//this._resetVehicleModel();
		},
		/**
		 * Clears vehicles property from view model
		 * @private
		 */
		_resetVehicleModel: function () {
			var oVehicles = this._getNewVehicle();
			this.viewModel.setProperty("/newPermit/vehicles", [oVehicles]);
		},

		_formatModelForSave: function (oEvent, oModel, bReject) {

			if (!this.viewModel.getProperty("/carpool")) {
				delete oModel.inviteCarpoolMembers;
				delete oModel.locationId;
			}
			if (this.permit.carpoolInvitation) {
				if (!bReject) {
					oModel.acceptCarpoolInvitation = true;
				} else {
					oModel.acceptCarpoolInvitation = false;
					oModel.vehicles = [];
				}
			}
			if (!oModel.locationId) {
				delete oModel.locationId;
			}

			oModel.location = this.permit.location;
			if (this.permit.permitId) {
				oModel.permitId = this.permit.permitId;
			} else {
				oModel.permitId = null;
			}
			for (var x in oModel.vehicles) {
				delete oModel.vehicles[x].lookups;
				delete oModel.vehicles[x].vehicleNumber;
			}
			return {
				item: oModel
			};
		},
		_setDefaultPaymentOption: function (oModel) {
			if (oModel.paymentOptions.payroll) {
				this.viewModel.setProperty("/newPermit/paymentMethod", "P");
			} else if (oModel.paymentOptions.studentAccount) {
				this.viewModel.setProperty("/newPermit/paymentMethod", "S");
			} else if (oModel.paymentOptions.creditCard) {
				this.viewModel.setProperty("/newPermit/paymentMethod", "C");
			} else if (oModel.paymentOptions.journalVoucher) {
				this.viewModel.setProperty("/newPermit/paymentMethod", "J");
			}
		},


		_resetModel: function () {
			this.viewModel.setProperty("/newPermit", {
				permitTypeId: "",
				permitId: "",
				location: "",
				locationId: "",
				contactEmail: "",
				contactWorkPhone: "",
				contactHomePhone: "",
				vehicles: [],
				inviteCarpoolMembers: [{
					kerbid: ""
				}, {
					kerbid: ""
				}],
				requestElectricVehicleDiscount: false,
				acceptCarpoolInvitation: false,
				paymentMethod: "PAYROLL"
			});
			this._resetVehicleModel();
			this.viewModel.setProperty("/dataLoaded", false);
		},
		/**
		 * Show confirmation messagebox to confirm user wants to delete vehicle from permit
		 * @private
		 */
		_showRejectCarpoolConfirmation: function () {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			sap.m.MessageBox.warning(
				this.getTranslation("Are you sure you do not want to join this carpool?"), {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "YES") {
							this.rejectCarpool = true;
							this.onPressSubmit(null, true);
						}
					}.bind(this)
				}
			);
		}

	});
});