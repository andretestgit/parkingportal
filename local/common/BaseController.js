sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"edu/mit/parking/common/Service"
], function (Controller, History, MessageBox, Service) {
	"use strict";

	return Controller.extend("edu.mit.parking.common.BaseController", {

		/* =========================================================== */
		/* public methods                                         */
		/* =========================================================== */
		/**
		 * Returns a reference to a new Service object
		 * @public
		 */
		getService: function () {
			return Service;
		},
		/**
		 * Returns translated text based on key
		 * @param {string} sKey : Key for translated text
		 * @param {array} aParameters : array of parameters 
		 * @public
		 */
		getTranslation: function (sKey, aParameters) {
			return this._getModel("i18n").getResourceBundle().getText(sKey, aParameters);
		},

		/**
		 * Fires when ever the model property /billing/statements is changed. Calculate the outstanding balance based off if statements in array are outside of their period
		 * @param {sap.ui.base.Event} oEvent : Change event
		 * @public
		 */
		calculateOutstandingBalance: function (oEvent) {
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
		removeValidationError: function (oEvent) {
			oEvent.getSource().setValueState("None");
		},

		validateInputs: function (oInputs, oCombos, oDatePickers) {
			var oInput,
				bValid = true;
			//validate input
			if (oInputs) {
				for (var x = 0; x < oInputs.length; x++) {
					oInput = sap.ui.getCore().byId(oInputs[x].id);
					if (oInput.getVisible() && !oInput.getValue()) {
						oInput.setValueState("Error");
						bValid = false;
					}
				}
			}
			//validate combo
			if (oCombos) {
				for (var x = 0; x < oCombos.length; x++) {
					oInput = sap.ui.getCore().byId(oCombos[x].id);
					if (oInput.getVisible() && !oInput.getSelectedKey()) {
						oInput.setValueState("Error");
						bValid = false;
					}
				}
			}
			//if temp vehicle, check date range fields
			if (oDatePickers) {
				for (var x = 0; x < oDatePickers.length; x++) {
					oInput = sap.ui.getCore().byId(oDatePickers[x].id);
					if (oInput.getVisible() && !oInput.getDateValue()) {
						oInput.setValueState("Error");
						bValid = false;
					}
				}
			}

			return bValid;
		},

		/**
		 * Route to add new vehicle
		 * @param {sap.ui.base.Event} oEvent : Button Press
		 * @public
		 */
		onPressAddVehicle: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("sessionData").sPath;
			var iNumberOfVehicles = this._getNumberOfVehicles(false, sPath + "/vehicles");
			if (iNumberOfVehicles < 3) {
				this.getRouter().navTo("newVehicle", {
					bTempVehicle: false,
					sPath: sPath.substring(1, sPath.length).replace(/\//g, "-"),
					iVehicleNumber: iNumberOfVehicles + 1
				});
			} else {
				//throw error
				this._showValidationError("Error.Text.MaximumVehicles");
			}
		},
		/**
		 * Route to add new temp vehicle
		 * @param {sap.ui.base.Event} oEvent : Button Press
		 * @public
		 */
		onPressAddTemporaryVehicle: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("sessionData").sPath;
			var iNumberOfTempVehicles = this._getNumberOfVehicles(true, sPath + "/vehicles");
			if (iNumberOfTempVehicles < 2) {
				this.getRouter().navTo("newVehicle", {
					bTempVehicle: true,
					sPath: sPath.substring(1, sPath.length).replace(/\//g, "-"),
					iVehicleNumber: iNumberOfTempVehicles + 1
				});
			} else {
				//show error message
				this._showValidationError("Error.Text.MaximumTempVehicles");

			}
		},


		/**
		 * Navigate to details views based on id
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressViewDetails: function (oEvent) {
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
		/**
		 * Set flag for showing input feilds for motorcycle or combo for vehicle
		 * @param {sap.ui.base.Event} oEvent : Combo Change
		 * @public
		 */
		onChangeBodyType: function (oEvent) {
			var sPath = oEvent.getSource().getParent().getBindingContext().sPath,
				oItem = this.getView().getModel().getProperty(sPath);
			oItem.model = "";
			oItem.make = "";
			this.viewModel.setProperty(sPath, oItem);

			this.removeValidationError(oEvent);
		},
		/**
		 * Bind Model Combobox to selected makes models
		 * @param {sap.ui.base.Event} oEvent : Combo Change
		 * @public
		 */
		onChangeMake: function (oEvent) {
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("lookups").sPath,
				oCombo = oEvent.getSource().getParent().getParent().getItems()[3].getItems()[2],
				oTemplate = new sap.ui.core.Item({
					key: "{lookups>name}",
					text: "{lookups>name}"
				});

			oCombo.bindItems({
				model: "lookups",
				path: sPath + "/models",
				template: oTemplate
			});
			this.removeValidationError(oEvent);
		},

		onPressMap: function (oEvent) {
			window.open("https://whereis.mit.edu/");
		},
		/* =========================================================== */
		/* Routing methods                                         */
		/* =========================================================== */

		/**Returns reference to router object
		 * @public
		 */
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Navigates back to previous page in history. If history is empty, navigates back to first page
		 * @public
		 */
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("dashboard", {}, true /* no history */ );
			}
		},
		/**
		 * Route to order scratch pass view
		 * @param {sap.ui.base.Event} oEvent : Routing event
		 * @private
		 */
		onPressOrderScratchPass: function (oEvent) {
			this.getRouter().navTo("orderScratchPasses");

		},
		/**
		 * Route to request visitor permit view
		 * @param {sap.ui.base.Event} oEvent : Button Press
		 * @public
		 */
		onPressRequestVisitorPermit: function (oEvent) {
			this.getRouter().navTo("requestVisitorPermit");
		},

		/**
		 * Route to appeal view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressAppealViolation: function (oEvent) {
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
		onNavHome: function (oEvent) {
			this.getRouter().navTo("dashboard");
		},
		/**
		 * Navigate to my department details view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressMyDepartment: function (oEvent) {
			this.getRouter().navTo("myDepartment");
		},
		/**
		 * Navigate to dept vehicles details view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressDeptVehicle: function (oEvent) {
			this.getRouter().navTo("departmentVehicles", {
				sTab: "vehicles"
			});
		},
		/**
		 * Navigate to dept tickets details view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressDeptTickets: function (oEvent) {
			this.getRouter().navTo("departmentVehicles", {
				sTab: "tickets"
			});
		},
		/**
		 * Navigate to visitor parking details view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressVisitorParking: function (oEvent) {
			this.getRouter().navTo("visitorParking");
		},
		/**
		 * Navigate to scratch passes details view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressScratchPasses: function (oEvent) {
			this.getRouter().navTo("scratchPasses");
		},
		/**
		 * Navigate to logout view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressLogout: function (oEvent) {
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
		_getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		/**
		 * Returns number of vehicles on permit
		 * @param {boolean} bTemp : flag to count temporary vehicles
		 * @private
		 */
		_getNumberOfVehicles: function (bTemp, sPath) {
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

		_setHeaderButtonSelected: function (sView) {
			var oHeader = this._getModel("sessionData").getProperty("/coordinator-header"),
				oButton;
			if (oHeader) {
				oHeader = oHeader.getContent()[3].getItems();
				for (var x = 0; x < oHeader.length; x++) {
					oHeader[x].removeStyleClass("headerSelected");
				}
				if (sView) {
					switch (sView) {
						case "MyDepartment":
							oButton = oHeader[0];
							break;
						case "DeptVehicles":
							oButton = oHeader[1];
							break;
						case "VisitorParking":
							oButton = oHeader[2];
							break;
						case "ScratchPasses":
							oButton = oHeader[3];
							break;
					}
					oButton.addStyleClass("headerSelected");
				}
			}
		},
		_setTableVisibleRowCount: function (sPath) {
			this.viewModel.setProperty("/visibleRowCount", this._getModel("sessionData").getProperty(sPath).length);
		},

		/* =========================================================== */
		/* dialog/confirmation methods                                         */
		/* =========================================================== */
		/**/
		_showValidationError: function (sTranslationText, fOnClose) {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(
				this.getTranslation(sTranslationText), {
					actions: [sap.m.MessageBox.Action.OK],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: fOnClose
				}
			);
		}

	});
});