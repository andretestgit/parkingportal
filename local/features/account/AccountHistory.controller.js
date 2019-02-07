sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.account.AccountHistory", {
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
            //create view model
            this.viewModel = new JSONModel({
                state: "HISTORY",
                activity: [{
                        type: "PERMIT",
                        description: "Permit Fee",
                        date: "2017-09-01",
                        amount: 200,
                        balance: 200
                    },
                    {
                        type: "PARKING_FEE",
                        description: "Daily Parking Charge",
                        date: "2018-03-01",
                        amount: 10,
                        balance: 10
                    },
                    {
                        type: "PARKING_FEE",
                        description: "Daily Parking Charge",
                        date: "2018-04-05",
                        amount: 10,
                        balance: 20
                    },
                    {
                        type: "PARKING_FEE",
                        description: "Daily Parking Charge",
                        date: "2018-03-10",
                        amount: 10,
                        balance: 30
                    },
                    {
                        type: "PARKING_FEE",
                        description: "Daily Parking Charge",
                        date: "2018-03-12",
                        amount: 10,
                        balance: 40
                    },
                ]

            });
            this.getView().setModel(this.viewModel);

            this.accountHistory = [{
                    type: "PERMIT_FEE",
                    description: "Permit Fee",
                    date: "2017-09-01",
                    amount: 200,
                    balance: 200
                },
                {
                    type: "PARKING_FEE",
                    description: "Daily Parking Charge",
                    date: "2018-03-01",
                    amount: 10,
                    balance: 10
                },
                {
                    type: "PARKING_FEE",
                    description: "Daily Parking Charge",
                    date: "2018-04-05",
                    amount: 10,
                    balance: 20
                },
                {
                    type: "PARKING_FEE",
                    description: "Daily Parking Charge",
                    date: "2018-03-10",
                    amount: 10,
                    balance: 30
                },
                {
                    type: "PARKING_FEE",
                    description: "Daily Parking Charge",
                    date: "2018-03-12",
                    amount: 10,
                    balance: 40
                },
            ];

            this.parkingActivity = [{
                    type: "GATE",
                    date: "2018-03-10",
                    lprHitTime: null,
                    gateEntryTime: "07:31",
                    gateExitTime: "14:30",
                    lotName: "Riverside"
                },
                {
                    type: "GATE",
                    date: "2018-03-10",
                    lprHitTime: null,
                    gateEntryTime: null,
                    gateExitTime: null,
                    lotName: "W92"
                },
                {
                    type: "GATE",
                    date: "2018-03-10",
                    lprHitTime: null,
                    gateEntryTime: null,
                    gateExitTime: "14:30",
                    lotName: "W58"
                },
                {
                    type: "GATE",
                    date: "2018-03-10",
                    lprHitTime: null,
                    gateEntryTime: "07:31",
                    gateExitTime: null,
                    lotName: "Parkside"
                },
                {
                    type: "LPR",
                    date: "2018-03-10",
                    lprHitTime: "12:24",
                    gateEntryTime: null,
                    gateExitTime: null,
                    lotName: "W78"
                }
            ];

        },

        onBeforeRendering: function () {

        },

        onAfterRendering: function () {

        },
        /* =========================================================== */
        /* public methods                                         */
        /* =========================================================== */

        onCreateTable: function (sId, oContext) {
            var bParkingFee = oContext.oModel.getProperty(oContext.sPath).type === "PARKING_FEE";
            var oTable = new sap.m.Table({
                inset: false,
                showNoData: false,
                columns: this._getColumns(sap.ui.Device.system.phone, bParkingFee)
            }).addStyleClass("customTableHeader-panel");

            var oContent = new sap.m.VBox({}).bindAggregation("items", {
                path: oContext.sPath + "/parkingActivity",
                template: new sap.m.HBox({
                    items: [
                        new sap.m.Text({
                            text: "{lotName}",
                            width: "5rem"
                        }).addStyleClass("sapUiLargeMarginEnd sapUiLargeMarginBegin"),
                        new sap.m.Text().bindProperty("text", {
                            parts: [{
                                path: 'type'
                            }, {
                                path: 'lprHitTime'
                            }, {
                                path: 'gateEntryTime'
                            }, {
                                path: 'gateExitTime'
                            }],
                            formatter: this.formatter.getDailyActivity.bind(this)
                        })
                    ]
                })
            }).addStyleClass(" parking-activity daily-parking");

            var oPanel = new sap.m.Panel({
                id: "account_panel_" + oContext.sPath.split("activity/")[1],
                expanded: false,
                headerToolbar: new sap.m.Toolbar({
                    content: oTable,
                    height: "auto"
                }),
                content: oContent,
                expandable: true
                /*,
                                content: oSecondaryTable*/
            }).addStyleClass("panel-no-border");

            return oPanel;


        },

        /* =========================================================== */
        /* event handlers                                         */
        /* =========================================================== */
        /**
         * Expands or closes panel content as well as rotates button 90 degrees
         * @param {sap.ui.base.Event} oEvent : Button Press
         * @public
         */

        onPressExpand: function (oEvent) {
            var oPanel = oEvent.getSource().getParent().getParent().getParent().getParent(),
                oParkingActivity = oPanel.getBindingContext().oModel.getProperty(oPanel.getBindingContext().sPath).parkingActivity;

            if (oPanel.getExpanded()) {
                $("#" + oEvent.getSource().sId).css({
                    'transform': 'rotate(0deg)'
                });
            } else {
                $("#" + oEvent.getSource().sId).css({
                    'transform': 'rotate(90deg)'
                });
            }
            oPanel.setExpanded(!oPanel.getExpanded());
            if (!oParkingActivity) {
                oPanel.getContent()[0].setBusy(true);
                //simulate retreiving activity
                setTimeout(function (sId, sPath) {
                    this.getView().getModel().setProperty(sPath + "/parkingActivity", [this.parkingActivity[Math.floor(Math.random() * (4 - 0 + 1))]]);
                    oPanel.getContent()[0].setBusy(false);
                }.bind(this, oPanel.sId, oPanel.getBindingContext().sPath), 2000);

            }
            //set panel header to selected
            if (this.selectedItem) {
                this.selectedItem.removeStyleClass("selectedItem");
            }
            this.selectedItem = oEvent.getSource().getParent().getParent();
            this.selectedItem.addStyleClass("selectedItem");
        },

        /** Filter ticket table
         * @param {sap.ui.base.Event} oEvent : Combobox change
         * @public
         */
        onFilterTable: function (oEvent) {
            var sKey = oEvent.getParameter("selectedItem").getKey();
            var oModel = this.accountHistory;
            var oItems = [];
            for (var x in oModel) {
                if (oModel[x].type === sKey || sKey === "ALL") {
                    oItems.push(oModel[x]);
                }
            }
            this.viewModel.setProperty("/activity", oItems);
        },

        /* =========================================================== */
        /* private methods                                         */
        /* =========================================================== */
        /**
         * Fires every time route is matched to this view
         * @param {sap.ui.base.Event} oEvent : Routing event
         * @private
         */
        _onRouteMatched: function (oEvent) {},

        _getColumns: function (bMobile, bParkingFee) {
            if (bMobile) {
                return [
                    new sap.m.Column({
                        header: new sap.m.VBox({
                            items: [
                                new sap.m.Text({}).bindProperty("text", {
                                    path: "date",
                                    formatter: this.formatter.getDateWithYear.bind(this)
                                }),
                                new sap.m.Text({
                                    text: "{description}"
                                }).addStyleClass("sapUiMediumMarginTop")

                            ]
                        }),
                        width: "8rem"
                    }),
                    new sap.m.Column({
                        header: new sap.m.Text({
                            text: "{description}"
                        }),
                        minScreenWidth: "Desktop",
                        demandPopin: true,
                        popinDisplay: "WithoutHeader"

                    }),
                    new sap.m.Column({
                        header: new sap.m.Text({
                            text: "${amount}"
                        }),
                        width: "4rem"
                    }),
                    new sap.m.Column({
                        header: new sap.ui.core.Icon({
                            src: "sap-icon://slim-arrow-right",
                            press: [this.onPressExpand, this],
                            visible: bParkingFee,
                            size: "2rem",
                            width: "3rem",
                            height: "3rem"

                        }).addStyleClass("expand-button"),
                        width: "2rem"
                    })
                ];
            } else {
                return [
                    new sap.m.Column({
                        header: new sap.m.Text({}).bindProperty("text", {
                            path: "date",
                            formatter: this.formatter.getDateWithYear.bind(this)
                        }),
                        width: "8rem"
                    }),
                    new sap.m.Column({
                        header: new sap.m.Text({
                            text: "{description}"
                        }),
                        minScreenWidth: "550px",
                        demandPopin: true,
                        popinDisplay: "WithoutHeader"

                    }),
                    new sap.m.Column({
                        header: new sap.m.Text({
                            text: "${amount}"
                        }),
                        width: "4rem",
                        hAlign: "End"
                    }),
                    new sap.m.Column({
                        header: new sap.ui.core.Icon({
                            src: "sap-icon://slim-arrow-right",
                            press: [this.onPressExpand, this],
                            visible: bParkingFee,
                            width: "1rem"
                        }).addStyleClass("expand-button"),
                        width: "2rem"
                    })
                ];
            }
        }

    });
});