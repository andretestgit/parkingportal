sap.ui.define([
	"edu/mit/parking/common/BaseController",
	"sap/ui/model/json/JSONModel",
	"edu/mit/parking/common/formatter",
	"edu/mit/parking/common/CustomTypes"
], function(BaseController, JSONModel, formatter, CustomTypes) {
	"use strict";

	return BaseController.extend("edu.mit.parking.features.permit.TestNewPermit", {
		formatter: formatter,
		CustomTypes: CustomTypes,
		/* =========================================================== */
		/* lifecycle methods                                         */
		/* =========================================================== */
		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device
			/*this.getView().setBusy(true);
			this.getOwnerComponent().getModel("jcc").attachMetadataLoaded(function(oEvent) { //Set screen to not busy once meta data has been loaded
				this.getView().setBusy(false);
			}.bind(this));*/

			this.getRouter().getRoute("testNewPermit").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
			//create view model
			//create view model
			this.viewModel = new JSONModel({
				showComment: false,
				showCarpoolDescription: false,
				carpool: false,
				economy: false,
				numberOfPeople: "3",
				agreeToTermsAndConditions: false,
				permitFeeDetails: {
					"dailyFee": 10,
					"recurringFee": 100,
					"recurringFrequency": "Y",
					"annualCap": 1900
				},
				newPermit: {
					permitTypeId: "PERSONAL",
					permitId: "",
					location: "",
					contactEmail: "",
					contactPhoneNumber: "",
					vehicles: [],
					inviteCarpoolMembers: [{
							kerbid: ""
						}, {
							kerbid: ""
						}],
					acceptCarpoolInvitation: false,
					paymentMethod: "PAYROLL"
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

		onBeforeRendering: function() {

		},

		onAfterRendering: function() {
			//Read API for permit info
			this.viewModel.setProperty("/permit", this.getOwnerComponent().getModel("sessionData").getProperty("/permitsModel/0"));
			this.viewModel.setProperty("/permitFeeDetails", this.getOwnerComponent().getModel("sessionData").getProperty(
				"/permitsModel/0/permitType/0/permitFeeDetails"));
			this.viewModel.setProperty("/canAddAditionalVehicles", this.getOwnerComponent().getModel("sessionData").getProperty(
				"/permitsModel/0/permitType/0/canAddAditionalVehicles"));
			this.viewModel.setProperty("/headerText", this.getOwnerComponent().getModel("sessionData").getProperty(
				"/permitsModel/0/permitType/0/headerText"));
				this.viewModel.setProperty("/newPermit/paymentMethod", "P");
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
		suggestEmail: function(oEvent) {
			var sKey = oEvent.getParameter("suggestValue"),
				oService = this.getService();

			this.removeValidationError(oEvent);
			if (oEvent.getSource().getId() != this.sSuggestionInputId) {
				this.viewModel.setProperty("/suggestions", []);
			}
			this.sSuggestionInputId = oEvent.getSource().getId();
			//search 
			oService.getPeople(sKey, function(oData, sMessage) {
					this.viewModel.setProperty("/suggestions", oData.items);
				}.bind(this),
				function(oError) {

				}.bind(this)
			);
			//this.viewModel.setProperty("/suggestions", oResults);
		},
		// carpoolEmailSelected: function(oEvent) {
		// 	var oItem = this.viewModel.getProperty(oEvent.getParameter("selectedItem").getBindingContext().sPath),
		// 		oCarpoolMemberPath = oEvent.getSource().getBindingContext().sPath;
		// 	//this.viewModel.setProperty(oCarpoolMemberPath + "/kerb", oItem.kerbid);
		// },
		/**
		 * Verifies that enter email is valid 
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onChangeEmail: function(oEvent) {
			var sKey = oEvent.getParameters().value,
				oInput = oEvent.getSource(),
				sPath = oInput.getBindingContext().sPath,
				oService = this.getService();

			oService.getPeople(sKey, function(sPath, oInput, oData, sMessage) {
					if (oData.items.length) {
						this.viewModel.setProperty(sPath + "/kerbid", oData.items[0].id);
						//	this.viewModel.setproperty(sPath + "/email", oData.items[0].id);
					}
				}.bind(this, sPath, oInput),
				function(oError) {

				}.bind(this)
			);
		},

		/* =========================================================== */
		/* event handlers                                         */
		/* =========================================================== */
		/**
		 * Adds a blank new vehicle object to the vehicles array
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressAddAnotherVehicle: function(oEvent) {
			var oVehicles = this.viewModel.getProperty("/newPermit/vehicles");
			if (oVehicles.length < 3) {
				var newVehicle = {
					vehicleNumber: oVehicles.length + 1,
					make: "",
					bodyType: "",
					model: "",
					color: "",
					plateNumber: "",
					plateState: "",
					plateCountry: "",
					startDate: null,
					endDate: null				
				};
				oVehicles.push(newVehicle);
				this.viewModel.setProperty("/newPermit/vehicles", oVehicles);
			} else {
				this._showValidationError("Error.Text.MaximumVehicles");
			}
			this.viewModel.refresh(true);
		},
		/**
		 * Remove vehicle from list. Renumber vehicle numbers if vehicle is a middle vehicle
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressRemoveVehicle: function(oEvent) {
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
					oMake = oContainer.getItems()[x].getItems()[1].getItems()[0].getItems()[1].getItems()[2]
					this.onChangeMake(null, oMake);
				}

			}
			this.viewModel.setProperty("/newPermit/vehicles", oVehicles);
			//check if electric vehicle flag still exists
		//	this.onPressElectricVehicleDiscount();
			this.viewModel.refresh(true);
		},

		onChangeState: function(oEvent) {
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
		onPressComment: function(oEvent) {
			this.viewModel.setProperty("/showComment", !this.viewModel.getProperty("/showComment"));
			this.viewModel.setProperty("/newPermit/comment", "");
		},

		/**
		 * Shows and hides carpool description section
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressCarpoolDescription: function(oEvent) {
			this.viewModel.setProperty("/showCarpoolDescription", !this.viewModel.getProperty("/showCarpoolDescription"));
			this.viewModel.setProperty("/newPermit/carpool/description", "");
		},
		/**
		 * Sets flag if permit type is carpool
		 * @param {sap.ui.base.Event} oEvent : Selected
		 * @public
		 */
		onChangePermitType: function(oEvent) {
			var sPath = oEvent.getParameter("item").getBindingContext().sPath,
				oModel = this.viewModel.getProperty(sPath);

			if (oModel.carpool) {
				this.viewModel.setProperty("/newPermit/vehicles", []);
			} else if (this.viewModel.getProperty("/carpool") && !oModel.carpool) {
				this._resetVehicleModel();
			}
			//this.onPressElectricVehicleDiscount();

			//set properties
			this.viewModel.setProperty("/carpool", oModel.carpool);
			this.viewModel.setProperty("/permitFeeDetails", oModel.permitFeeDetails);
			this.viewModel.setProperty("/canAddAditionalVehicles", oModel.canAddAditionalVehicles);

			//bind permit to container
			this.byId("permit_panel_container").bindElement({
				path: sPath
			})

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
		onChangeNumberOfPeople: function(oEvent) {
			var sKey = parseInt(oEvent.getParameters().selectedItem.getKey()),
				oMembers = this.viewModel.getProperty("/newPermit/inviteCarpoolMembers"),
				iLimit = sKey - oMembers.length - 1;
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
		},
		/**
		 * Temperary method for testing different permits. Remove once testing has been successful
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onChangePermit: function(oEvent) {
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
		onPressEnconomyLink: function(oEvent) {
			window.open(
				"https://whereis.mit.edu/?zoom=18&lat=42.35555513653314&lng=-71.10191344451903&maptype=mit&q=westgate%20parking&open=-1");
		},
		/**
		 * Set flag for economy which reduces rate and cap by half
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onSelectEconomy: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext().sPath,
				oModel = this.viewModel.getProperty(sPath);
			//this.viewModel.setProperty("/economy", oEvent.getParameter("selected"));
			oEvent.getParameter("selected") ? this.viewModel.setProperty("/permitFeeDetails", oModel.economyFeeDetails) : this.viewModel.setProperty(
				"/permitFeeDetails", oModel.permitFeeDetails);
			this.viewModel.refresh(true);
		},
		/**
		 * Change parking fee based on selected lot
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onChangePreferredLot: function(oEvent) {
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
		onPressElectricVehicleDiscount: function(oEvent) {
			var oVehicles = this.viewModel.getProperty("/newPermit/vehicles"),
				belectricVehicleDiscount = false;
			for (var x in oVehicles) {
				if (oVehicles[x].electricVehicleDiscount) {
					belectricVehicleDiscount = true;
				}
			}
			//this.viewModel.setProperty("/newPermit/electricVehicleDiscount", belectricVehicleDiscount);
		},
		/**
		 * Validate input fields
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressSubmit: function(oEvent) {
			var oModel = this.viewModel.getProperty("/newPermit"),
				bValid = this.getValidator().validate(this.getView().getContent()[0]),
				oEmail = this.byId("contact_email"),
				oPhone = this.byId("contact_phone");
				
				if(!oEmail.getValue() && oEmail.getVisible()) {
					oEmail.setValueState("Error");
					bValid = false;
				}
				if(!oPhone.getValue() && oPhone.getVisible()) {
					oPhone.setValueState("Error");
					bValid = false;
				}

			if (bValid) {
				oModel = this._formatModelForSave(oModel);
			} else {
				this._showValidationError("Error.Text.RequiredFields");
			}

			//after submiting permit request
			if (oModel.paymentMethod === "C") {
				this._forwardToCyberSource();
			}
		},
		/* =========================================================== */
		/* private methods                                         */
		/* =========================================================== */
		/**
		 * Fires every time route is matched to this view
		 * @param {sap.ui.base.Event} oEvent : Routing event
		 * @private
		 */
		_onRouteMatched: function(oEvent) {
			this._resetVehicleModel();
		},
		/**
		 * Clears vehicles property from view model
		 * @private
		 */
		_resetVehicleModel: function() {
			var oVehicles = [{
				vehicleNumber: 1,
				bodyType: "",
				make: "",
				model: "",
				color: "",
				licensePlate: "",
				state: "",
				electricVehicleDiscount: false,
				startDate: null,
				endDate: null,
				config: {
					color: "S",
					make: "S",
					model: "S",
					year: "I"
				},
				previousBodyType: 2
			}];
			this.viewModel.setProperty("/newPermit/vehicles", oVehicles);
		},
		_forwardToCyberSource: function() {
			//read api for cybersource data
			// document.body.innerHTML += "<form id='myForm' action='https://shopmitdev.mit.edu/web/buy' method='post'> <input type='hidden' name='merchant_id' value='mit_ope_park'> <input type='hidden' name='profile_id value'='6211D618-6F65-4196-A680-0E9B92035B7B'> <input type='hidden' name='access_key' value='c4e2635e4eea3da7b1327b9abd3a914e'> <input type='hidden' name='transaction_type' value='create_payment_token'> <input type='hidden' name='merchant_defined_data1' value='jdudleyk'></form>"
			// document.getElementById("myForm").submit();
		},
		_formatModelForSave: function(oModel) {
			var oVehicles = oModel.vehicles;
			if(!this.viewModel.getProperty("/carpool")) {
				oModel.inviteCarpoolMembers = [];
			}
			for (var x in oVehicles) {
				delete oVehicles[x].config;
				delete oVehicles[x].previousBodyType;
				delete oVehicles[x].vehicleNumber;
			}

			return oModel;
		}

	});
});