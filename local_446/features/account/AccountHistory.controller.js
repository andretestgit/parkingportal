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
                showNavBack: 1,
                state: "HISTORY",
                flags: {
                    busy: false
                }
            });
            this.getView().setModel(this.viewModel);

        },

        onBeforeRendering: function () {

        },

        onAfterRendering: function () {
            this.oService = this.getService();
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
                        }).addStyleClass("sapUiLargeMarginEnd account-daily-charge"),
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
         * Check is period has loaded transactions. If not read transactions based on period start and end dates
         * @param {sap.ui.base.Event} oEvent : Button Press
         * @public
         */
        onPressExpandPeriod: function (oEvent) {
            var oPanel = oEvent.getSource().getParent().getParent().getParent().getParent().getParent(),
                sPath = oPanel.getBindingContext("sessionData").sPath + "/transactions",
                oTransactions = this._getModel("sessionData").getProperty(sPath);

            this._expandPanel(oEvent.getSource(), oPanel, oEvent.getSource().getParent().getParent().getParent());
        },
        /**
         * Check is parking activity has been loaded. If not read parking activity based on date
         * @param {sap.ui.base.Event} oEvent : Button Press
         * @public
         */
        onPressExpandTransaction: function (oEvent) {
            var oPanel = oEvent.getSource().getParent().getParent().getParent().getParent().getParent(),
                sPath = oPanel.getBindingContext("sessionData").sPath + "/parkingActivity",
                oParkingActivity = this._getModel("sessionData").getProperty(sPath);
            // if (!oParkingActivity) {
            //     oPanel.getContent()[0].setBusy(true);
            //     //read transactions based on period
            //     this.oService.getAccountParkingActivity(function (sPath, oTable, oData, sMessage) {
            //             this._getModel("sessionData").setProperty(sPath, oData);
            //             oTable.setBusy(false);
            //         }.bind(this, sPath, oPanel.getContent()[0]),
            //         function (oError) {

            //         }.bind(this));
            // }
            this._expandPanel(oEvent.getSource(), oPanel, oEvent.getSource().getParent().getParent().getParent(), true);
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

        onDownloadPDF: function (oEvent) {
            var oModel = this._getModel("sessionData").getProperty(oEvent.getSource().getBindingContext("sessionData").getPath());
            this._downloadPDF(oModel);
            // this.oPdfData = this._getModel("sessionData").getProperty(oEvent.getSource().getBindingContext("sessionData").getPath());
            // this._createPDF();
            // if (!this.oUser) {
            //     //this.getService().getPerson(this._getModel("sessionData").getProperty("/user/kerb"), function(oData) {
            //     this.getService().getPerson("mark", function (oData) {
            //             this.oUser = oData.item
            //             this._createPDF();
            //         }.bind(this),
            //         function (oError) {
            //             this._createPDF();
            //         }.bind(this));
            // } else {
            //     this._createPDF();
            // }
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

        onPressInvoice: function (oEvent) {
            var oPanel = oEvent.getSource().getParent().getParent(),
                oIcon = oEvent.getSource().getItems()[0].getCells()[4].getItems()[0];

            this._expandPanel(oIcon, oPanel, oEvent.getParameter("listItem"));
            oEvent.getSource().removeSelections();
        },
        onPressTransaction: function (oEvent) {
            var oPanel = oEvent.getSource().getParent().getParent(),
                oIcon = oEvent.getSource().getItems()[0].getCells()[3].getItems()[0],
                sPath = oEvent.getParameter("listItem").getBindingContext("sessionData").getPath(),
                oModel = this._getModel("sessionData").getProperty(sPath);
            if (oModel.activity.length) {
                this._expandPanel(oIcon, oPanel, oEvent.getSource(), true);
            }

            oEvent.getSource().removeSelections();
        },

        /**
         * Set panel to expanded or colapsed as well as rotate expand icon
         * @param {sap.ui.base.Event} oEvent : Icon Press
         * @param {sap.m.Panel} oPanel
         * @private
         */
        _expandPanel: function (oIcon, oPanel, oSelectedItem, bApplyHighlight) {
            if (oPanel.getExpanded()) {
                $("#" + oIcon.sId).css({
                    'transform': 'rotate(0deg)'
                });
                if (bApplyHighlight) {
                    oSelectedItem.removeStyleClass("selectedItem");
                    oSelectedItem.getParent().removeStyleClass("account-toolbar-selected");
                }
            } else {
                $("#" + oIcon.sId).css({
                    'transform': 'rotate(90deg)'
                });
                if (bApplyHighlight) {
                    oSelectedItem.addStyleClass("selectedItem");
                    oSelectedItem.getParent().addStyleClass("account-toolbar-selected");
                }
            }
            oPanel.setExpanded(!oPanel.getExpanded());
        },

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
                        // minScreenWidth: "550px",
                        demandPopin: false,
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
        },
        _downloadPDF: function(oModel) {
            var sUrl = window.location .protocol + "//" + window.location.host + "/apis/mulesoft/pk_parking/account/invoice/" 
                        + oModel.invoiceId + "/pdf";
            window.open(sUrl, "_blank");     
        },
        _createPDF: function () {
            var oData = this.oPdfData;
            var oUserInfo = this._getModel("sessionData").getProperty("/userInfo");
            var pdf = new jsPDF('p', 'pt', 'letter');
            var sTBody = "",
                sRow = "",
                sTo = "",
                sAccount = "";
            for (var x in oData.transactions) {
                if (oData.transactions[x].amount > 0) {
                    sTBody += "<tr>" +
                        "<td>" + this.formatter.getDateWithYear(oData.transactions[x].date) + "</td>" +
                        "<td>" + oData.transactions[x].description + "</td>" +
                        "<td>$" + oData.transactions[x].amount + "</td>" +
                        "</tr>";
                }
            }
            var sHeader = "<img src='images/PDFHeader.png' style='height: 5rem'>";
            // var sHeader = "<div><img src='images/MIT_logo.png' style='height: 2rem; margin-bottom: -50px;'></div>" +
            //     "<p>Atlas Service Center" + 
            //     "<br/>E17-106" + 
            //     "<br/>Hours: M-F, 8:00 AM-5:00 PM" + 
            //     "<br/>617-258-6510 | mitparking@mit.edu";
            if (oUserInfo) {
                if (oUserInfo.mitid) {
                    sAccount = "<h4>MIT ID: " + oUserInfo.mitid + "</h4>";
                }
                if (oUserInfo.firstName) {
                    sTo = "<h4>To: " + oUserInfo.firstName + " " + oUserInfo.lastName + "</h4>";
                }
            }

            var oSource = sHeader +
                sTo +
                sAccount +
                "<h4>Invoice Date: " + this.formatter.getDateWithYear(oData.invoiceDate) + "</h4>" +
                "<h4>Amount Due: $" + oData.amount + "</h4>" +
                "<table> <colgroup> <col> <col> <col> </colgroup>" +
                "<thead> <tr> <th>Date</th> <th>Description</th> <th>Amount</th> </thead>" +
                "<tbody>" +
                sTBody +
                "</tbody> </table>";

            // var oTable = "<h1>Testing Title </h1> <table id='tab_customers'> <colgroup><col ><col width='20%'><col width='20%'><col width='20%'></colgroup><thead><tr class='warning'>          <th>Country</th>                <th>Population</th>                <th>Date</th>                  <th>Age</th>              </tr>          </thead>           <tbody>               <tr>                    <td>Chinna</td>                    <td>1,363,480,000</td>                    <td>March 24, 2014</td>                    <td>19.1</td>                </tr>                <tr>                    <td>India</td>                    <td>1,241,900,000</td>                    <td>March 24, 2014</td>                    <td>17.4</td>                </tr>                <tr>                    <td>United States</td>                    <td>317,746,000</td>                    <td>March 24, 2014</td>                    <td>4.44</td>                </tr>                <tr>                    <td>Indonesia</td>                    <td>249,866,000</td>                    <td>July 1, 2013</td>                    <td>3.49</td>                </tr>                <tr>                    <td>Brazil</td>                    <td>201,032,714</td>                    <td>July 1, 2013</td>                    <td>2.81</td>                </tr>            </tbody>        </table>";
            var specialElementHandlers = {
                // element with id of "bypass" - jQuery style selector
                '#bypassme': function (element, renderer) {
                    // true = "handled elsewhere, bypass text extraction"
                    return true
                }
            };
            var margins = {
                top: 20,
                bottom: 20,
                left: 60
            };
            pdf.fromHTML(
                oSource, // HTML string or DOM elem ref.
                margins.left, // x coord
                margins.top, { // y coord
                    'width': margins.width, // max width of content on PDF
                    'elementHandlers': specialElementHandlers
                },
                function (dispose) {
                    // dispose: object with X, Y of the last line add to the PDF 
                    //          this allow the insertion of new lines after html
                    pdf.save('MIT_Parking_Invoice_' + this.formatter.getDateWithYear(oData.invoiceDate) + ".pdf");
                }.bind(this), margins);
        }

    });
});