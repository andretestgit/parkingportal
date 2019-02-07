sap.ui.define([
	"edu/mit/parking/common/BaseController",
	"sap/ui/model/json/JSONModel",
	"edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("edu.mit.parking.features.dashboard.Dashboard", {
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

			this.getRouter().getRoute("dashboard").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to

			//create local json model for view for test data
			var oModel = new JSONModel({
				canRemoveVehicles: false,
				canEditVehicle: false,
				outstandingBalance: 0,
				outstandingTickets: 1,
				showNavBack: 0,
				billing: {
					statements: []
				},
				tickets: [

				],
				busy: false
			});
			this.getView().setModel(oModel);
			this.viewModel = oModel;

		},

		onBeforeRendering: function () {

		},

		onAfterRendering: function () {
			
		},
		/* =========================================================== */
		/* public methods                                         */
		/* =========================================================== */

		createTicketCounts: function (sId, oContext) {
			var sState = oContext.oModel.getProperty(oContext.sPath).state;
			var oListItem = new sap.m.CustomListItem({
				content: new sap.m.HBox({
					justifyContent: "SpaceBetween",
					items: [
						new sap.m.Text().bindProperty("text", {
							path: 'sessionData>state',
							formatter: this.formatter.getTicketCountText.bind(this)
						}).addStyleClass("ticket-text"),
						new sap.m.Text({
							text: "{sessionData>count}",
							wrapping: false
						}).addStyleClass("list-billing-amount ticket-text")
					]
				})
			}).addStyleClass("list-item ticket-no-border")
			if (sState === "ISSUED") {
				oListItem.addStyleClass("ticket-issued");
			} else {
				oListItem.addStyleClass("ticket-appealed");
			}

			return oListItem;
		},

		/* =========================================================== */
		/* event handlers                                         */
		/* =========================================================== */
		onPressRequestParking: function (oEvent) {
			this.getRouter().navTo("newPermit");
		},


		/**
		 * Navigate to ticket history details view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressTicketHistory: function (oEvent) {
			this.getRouter().navTo("violationHistory");
		},
		/**
		 * Navigate to account history details view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressTransactionHistory: function (oEvent) {
			this.getRouter().navTo("accountHistory");
			//add parameters to pass flag for open tickets
		},
		/**
		 * Navigate to permit details view
		 * @param {sap.ui.base.Event} oEvent : Link Press
		 * @public
		 */
		onPressPermitDetails: function (oEvent) {
			this.getRouter().navTo("permitDetails", {
				sPath: oEvent.getSource().getBindingContext("sessionData").sPath.split("/")[2] //send index of permit,
			});
		},
		/**
		 * Mark banner message as seen so it will not show up next time user launched application and remove it from the model
		 * @param {sap.ui.base.Event} oEvent : Icon Press
		 * @public
		 */
		onPressDeleteBannerMessage: function (oEvent) {
			this.sRemoveBannerPath = oEvent.getSource().getBindingContext("sessionData").sPath;
			var sId = this._getModel("sessionData").getProperty(this.sRemoveBannerPath).id;
			if(sId) {
				this.getService().removeBanner(sId, function (oData, sMessage) {
					this._removeBanner();
				}.bind(this),
				function (oError) {
					this._showValidationErrorMessageItems(oError);
				}.bind(this));
			} else {
				this._removeBanner();
			}
		},

		onPressBillingItem: function(oEvent) {
			oEvent.getSource().removeSelections();
			this.onPressTransactionHistory();
		},

		highlightOpenPeriod: function (oEvent) {
			var oItems = oEvent.getSource().oList;
			for (var x in oItems) {
				if (oItems[x].status === 'O') {
					this.byId("billing_container").getItems()[x].addStyleClass("list-billing-open");
				}
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
		_onRouteMatched: function (oEvent) {
			
		},

		_removeBanner: function () {
			var iIndex = this.sRemoveBannerPath.split("/")[2],
				oBanners = this._getModel("sessionData").getProperty(this.sRemoveBannerPath.split(iIndex)[0]);
			//make http call to remove flag banner as removed based on ID
			oBanners.splice(iIndex, 1);
			this._getModel("sessionData").setProperty(this.sRemoveBannerPath.split(iIndex)[0], oBanners);
		}

	});
});