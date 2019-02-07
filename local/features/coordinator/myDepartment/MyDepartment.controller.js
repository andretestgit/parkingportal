sap.ui.define([
    "edu/mit/parking/common/BaseController",
    "sap/ui/model/json/JSONModel",
    "edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("edu.mit.parking.features.coordinator.myDepartment.MyDepartment", {
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

            this.getRouter().getRoute("myDepartment").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
            //create view model
            this.viewModel = new JSONModel({
                state: 0, // 0(initial, dont show anything), 1(has permit), 2(no permit)
                canRemoveVehicles: false,
                sorterIcons: {
                    name: 1
                }
            });
            this.getView().setModel(this.viewModel);
            this._oPopover = sap.ui.xmlfragment("edu.mit.parking.features.fragments.TableSortFilter", this);
        },

        onBeforeRendering: function () {
            var oTable = this.byId("department_table");
            var that = this;
            oTable.addEventDelegate({
                onAfterRendering: function () {
                    var oHeader = this.$().find('.sapMListTblHeaderCell'); //Get hold of table header elements
                    for (var i = 0; i < oHeader.length; i++) {
                        var oID = oHeader[i].id;
                        that.onClick(oID);
                    }
                }
            }, oTable);
        },

        onAfterRendering: function () {
            this._setHeaderButtonSelected("MyDepartment");
            this._setTableVisibleRowCount("/coordinator/departmentPermits");
        },

        onClick: function (oID) {
            var that = this;
            $('#' + oID).click(function (oEvent) { //Attach Table Header Element Event
                var oTarget = oEvent.currentTarget; //Get hold of Header Element
                var oLabelText = oTarget.childNodes[0].textContent; //Get Column Header text
                that._selectedColumnProperty = oTarget.id.split("--")[1];
                if (that._selectedColumnProperty.indexOf("_") <= 0) {
                    that._oPopover.openBy(oTarget);
                }

            });
        },
        /* =========================================================== */
        /* public methods                                         */
        /* =========================================================== */


        /* =========================================================== */
        /* event handlers                                         */
        /* =========================================================== */
        /**
         * Determines what details panel to show
         * @param {sap.ui.base.Event} oEvent : Row Press
         * @public
         */
        onPressTableRow: function (oEvent) {
            // var sPath = oEvent.getParameter("listItem").getBindingContext("sessionData").sPath,
            //var sPath = oEvent.getParameter("rowContext").sPath,
            var sPath = oEvent.getParameter("listItem") ? oEvent.getParameter("listItem").getBindingContext("sessionData").sPath : oEvent.getParameter("rowContext").sPath,
                oRow = this._getModel("sessionData").getProperty(sPath);

            this.byId("right_container").bindElement({
                model: "sessionData",
                path: sPath
            });

            this.viewModel.setProperty("/state", 1);

            /* if (oRow.vehicles.length > 0) {
                //has a permit
                this.viewModel.setProperty("/state", 1);
            } else {
                this.viewModel.setProperty("/state", 2);
            } */
        },

        onSearch: function (oEvent) {
            var oTable = this.byId("department_table"),
                sKey = oEvent.getParameter("newValue"),
                oFilter = new sap.ui.model.Filter([
                    new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sKey),
                    new sap.ui.model.Filter("mitId", sap.ui.model.FilterOperator.Contains, sKey),
                    new sap.ui.model.Filter({
                        path: "vehicles",
                        test: function (sKey, oValue) {
                            var bValid = false;
                            for (var x in oValue) {
                                if (oValue[x].plateNumber.toUpperCase().indexOf(sKey.toUpperCase()) >= 0) {
                                    bValid = true;
                                }
                            }
                            return bValid;
                        }.bind(this, sKey)
                    }),
                ], false);

            oTable.getBinding("items").filter(oFilter);
        },

        onPressSort: function (oEvent) {
            var oTable = this.byId("department_table"),
                oItems = oTable.getBinding("items");
            oItems.sort(new sap.ui.model.Sorter(this._selectedColumnProperty, oEvent.getParameter("listItem").sId === "sort_descending"));
            this._setIconState(this._selectedColumnProperty, oEvent.getParameter("listItem").sId === "sort_descending");
            this._oPopover.getContent()[0].removeSelections();
            this._oPopover.close()

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
            this._setHeaderButtonSelected("MyDepartment");
        },

        _setIconState: function (sPath, bDescending) {
            //reset icon states
            var oIcons = this.viewModel.getProperty("/sorterIcons");
            for (var x in oIcons) {
                oIcons[x] = 0;
            }
            if (sPath) {
                oIcons[sPath] = bDescending ? 2 : 1;
            }
            this.viewModel.setProperty("/sorterIcons", oIcons);
        }


    });
});