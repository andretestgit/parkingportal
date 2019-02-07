sap.ui.define([], function () {
	"use strict";
	return {
		getDashboardPermitCost: function (iDaily, iRecurring, sRecurringFrequency, iAnnualCap) {
			if (iDaily) {
				return "$" + this.formatter.getNumberWithComma(iDaily) + " per day";
			} else {
				if (sRecurringFrequency === "M") {
					return "$" + this.formatter.getNumberWithComma(iRecurring) + " per month";
				} else if (sRecurringFrequency === "Y") {
					return "$" + this.formatter.getNumberWithComma(sRecurringFrequency) + " per year";
				}
			}
		},
		dashboardVehicleNumber: function (sPlateNumber) {
			var oPermits = this._getModel("sessionData").getProperty("/permits"),
				iVehicles,
				iTempVehicles,
				oVehicles;
			for (var x in oPermits) {
				iVehicles = 0;
				iTempVehicles = 0;
				oVehicles = oPermits[x].vehicles;
				for (var i in oVehicles) {
					if (oVehicles[i].temporary) {
						iTempVehicles++;
					} else {
						iVehicles++;
					}
					if (sPlateNumber === oVehicles[i].plateNumber) {
						if (oVehicles[i].temporary) {
							return this.getTranslation("Dashboard.text.TempVehicleNumber", iTempVehicles);
						} else {
							return this.getTranslation("Dashboard.text.VehicleNumber", iVehicles);
						}
					}
				}
			}
		},
		getPaymentMethod: function (sPaymentMethod, sLastFourCredit) {
			switch (sPaymentMethod) {
				case 'P':
					return "Payroll Deduction";
					break;
				case 'S':
					return "Student Account";
					break;
				case 'C':
					return "Credit/Debit Card ending in " + sLastFourCredit;
					break;
				case 'J':
					return "Journal Voucher";
					break;
				case 'T':
					return "Check";
					break;
				case 'X':
					return "Cash";
					break;
			}
		},
		dashboardPermitTitle: function (sPermitId) {
			var oPermits = this._getModel("sessionData").getProperty("/permits"),
				oVehicles;
			for (var x in oPermits) {
				if (oPermits[x].permitId === sPermitId) {
					sPermitId = x + 1;
				}
			}
			if (sPermitId > 1) {
				return this.getTranslation("Dashboard.Text.SpousePartnerPermit");
			}
			return this.getTranslation("Dashboard.Text.MyPermit");

		},
		getBillingMonth: function (sStart) {
			var iMonth = sStart.toString().split("-")[1] - 1;
			switch (iMonth) {
				case 1:
					return this.getTranslation("Month.Text.January");
					break;
				case 2:
					return this.getTranslation("Month.Text.February");
					break;
				case 3:
					return this.getTranslation("Month.Text.March");
					break;
				case 4:
					return this.getTranslation("Month.Text.April");
					break;
				case 5:
					return this.getTranslation("Month.Text.May");
					break;
				case 6:
					return this.getTranslation("Month.Text.June");
					break;
				case 7:
					return this.getTranslation("Month.Text.July");
					break;
				case 8:
					return this.getTranslation("Month.Text.August");
					break;
				case 9:
					return this.getTranslation("Month.Text.September");
					break;
				case 10:
					return this.getTranslation("Month.Text.October");
					break;
				case 11:
					return this.getTranslation("Month.Text.November");
					break;
				case 12:
					return this.getTranslation("Month.Text.December");
					break;
			}
		},
		getDateObject: function (inDate) {
			var outDate = inDate;
			if (inDate instanceof Date === false) {
				if (inDate && inDate.toString().indexOf("/") !== -1) { //assume it is mm/dd/yyyy
					var parts = inDate.split("/");
					outDate = new Date(parts[2], parts[0] - 1, parts[1]);
				} else if (inDate && inDate.toString().indexOf("-") !== -1 && inDate.toString().indexOf("-") < 10) {
					var from = inDate.toString().split("-");
					outDate = new Date(from[0], from[1] - 1, from[2]);
				}
			}
			return outDate;
		},
		getTypeOfVehicle: function (bTempVehicle) {
			if (bTempVehicle) {
				return this.getTranslation("Vehicle.Text.TemporaryVehicle");
			}
			return this.getTranslation("Vehicle.Text.Vehicle");
		},
		getVehicleTypeButtonText: function (bTempVehicle, bEdit) {
			if (bEdit) {
				if (bTempVehicle) {
					return "Update Temporary Vehicle";
				} else {
					return "Update Vehicle";
				}
			} else {
				if (bTempVehicle) {
					return this.getTranslation("Vehicle.Button.AddaTempVehicle");
				} else {
					return this.getTranslation("Vehicle.Button.AddaVehicle");
				}
			}

		},
		getAddVehicleLinkText: function (iVehicleNumber) {
			if (iVehicleNumber > 1) {
				return this.getTranslation("Global.Link.Remove");
			}
			return this.getTranslation("Global.Link.AddAnotherVehicle");
		},
		getVehicleTitle: function (bTempVehicle, bEdit) {
			var sReturn = "";
			if (bEdit) {
				if (bTempVehicle) {
					return "Edit Temporary Vehicle";
				} else {
					return "Edit Vehicle";
				}
			} else {
				if (bTempVehicle) {
					return "Add a Temporary Vehicle";
				} else {
					return "Add a Vehicle";
				}
			}
		},
		getDateWithYear: function (sDate) {
			if (sDate) {
				if (sDate.indexOf("T") > 0) {
					sDate = sDate.split("T")[0];
				}
				sDate += "";
				var aDate = sDate.split("-");
				return parseInt(aDate[1]) + "/" + parseInt(aDate[2]) + "/" + parseInt(aDate[0]);
			}
		},
		getDateWithoutYear: function (sDate) {
			if (sDate) {
				if (sDate.indexOf("T") > 0) {
					sDate = sDate.split("T")[0];
				}
				sDate += "";
				var aDate = sDate.split("-");
				return parseInt(aDate[1]) + "/" + parseInt(aDate[2]);
			}
		},
		getNumberWithComma: function (fNum, bEconomy) {
			if (bEconomy) {
				fNum /= 2;
			}
			if (fNum) {
				return fNum.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
			}
			return fNum;
		},
		getNumberWithDecimal: function (fNum) {
			if (fNum) {
				return parseFloat(fNum).toFixed(2);
			}
		},
		getCurrencyWithDecimal: function (fNum) {
			if (fNum) {
				var bNegative = fNum.toString().indexOf("-") >= 0;
				var sReturn = "";
				if (bNegative) {
					fNum = fNum.toString().replace("-", "");
					sReturn = "-";
				}
				return sReturn + "$" + parseFloat(fNum).toFixed(2);
			} else {
				return "$0.00";
			}
		},
		getDailyActivity: function (sType, sDateIn, sTimeIn, sDateOut, sTimeOut) {
			if (sType == "G") { //In and out
				if (sDateIn != sDateOut) {
					return this.formatter.getDateWithoutYear(sDateIn) + " " + this.formatter.getStandardTime(sTimeIn) + " - " + this.formatter.getDateWithoutYear(sDateOut) + " " + this.formatter.getStandardTime(sTimeOut);
				}
				return this.formatter.getStandardTime(sTimeIn) + " - " + this.formatter.getStandardTime(sTimeOut);
			} else if (sType == "E") { //Entry only
				return this.formatter.getStandardTime(sTimeIn);
			} else if (sType == "X") { // Exit only
				return this.formatter.getStandardTime(sTimeOut);
			} else if (sType == "L") {
				return this.formatter.getStandardTime(sTimeIn) + " (LPR)";
			}
		},
		getStandardTime: function (sTime) {
			if (sTime && sTime !== "00:00:00") {
				if (sTime.indexOf("T") > 0) {
					sTime = sTime.split("T")[1];
				}
				var sPostFix;
				var sHours = parseInt(sTime.split(":")[0]);
				var sMinutes = sTime.split(":")[1];
				if (sHours < 12) {
					sPostFix = "am";
					if (sHours == 0) {
						sHours = 12;
					}
				} else if (sHours == 12) {
					sPostFix = "pm";
				} else if (sHours == 24) {
					sPostFix = "am";
					sHours = 12;
				} else {
					sPostFix = "pm";
					sHours = sHours - 12;
				}

				return sHours + ":" + sMinutes + sPostFix;
			} else {
				return "Overnight"
			}
		},
		getTicketCountText: function (sStatus) {
			if (sStatus === "ISSUED") {
				return this.getTranslation("Dashboard.Text.OpenParkingViolations");
			}
			return this.getTranslation("Dashboard.Text.PendingAppeals");
		},

		getTicketStatus: function (sStatus) {
			switch (sStatus) {
				case "ISSUED":
					return this.getTranslation("Ticket.Text.Issued");
					break;
				case "PAID":
					return this.getTranslation("Ticket.Text.Paid");
					break;
				case "APPEALED":
					return this.getTranslation("Ticket.Text.Appealed");
					break;
				case "ADJUDICATION_APPROVED":
					return this.getTranslation("Ticket.Text.AdjuicationApproved");
					break;
			}
		},

		getDeductionType: function (sDeduction) {
			switch (sDeduction) {
				case "PAYROLL":
					return this.getTranslation("Dashboard.Text.Payroll");
					break;
				case "BURSAR":
					return this.getTranslation("Dashboard.Text.Bursar");
					break;
				case "CREDIT":
					return this.getTranslation("Dashboard.Text.Credit");
					break;
				case "NONE":
					return "";
					break;
			}
		},
		getLicenseString: function (oVehicles) {
			var sReturn = "";
			if (!oVehicles) {
				return this.getTranslation("Permit.Text.NoPermit");
			}

			for (var x in oVehicles) {
				sReturn += oVehicles[x].plateNumber;
				if (x < oVehicles.length - 1) {
					sReturn += ", "
				} else {
					return sReturn;
				}
			}
		},

		getCurrency: function (sValue) {
			if (sValue) {
				if (sValue.toString().indexOf(".") >= 0) {
					sValue = parseFloat(sValue).toFixed(2)
				}
			}
			return sValue;
		},

		getOpenBilling: function (sStart, sEnd) {
			var oToday = new Date();
			if (sStart.toString().split("-")[1] == oToday.getMonth() + 1) {
				return true;
			}
			return false;
			/*  oToday.setHours(0);
			 oToday.setMinutes(0);
			 sStart = new Date(sStart.split("-")[0], sStart.split("-")[1] - 1, sStart.split("-")[2]);
			 sEnd = new Date(sEnd.split("-")[0], sEnd.split("-")[1] - 1, sEnd.split("-")[2]);
			 if (oToday >= sStart && oToday <= sEnd) {
			     return true;
			 }
			 return false; */
		},
		getBillingPeriodAmount: function (sValue, sStart, sEnd) {
			if (this.formatter.getOpenBilling(sStart, sEnd)) {
				return "TBD";
			}
			return "$" + this.formatter.getCurrency(sValue);
		},
		getNewPermitDetailsTitle: function (sVehicleNumber, bAddVehicles) {
			// if (bAddVehicles) {
			//     return this.getTranslation("NewPermit.Text.VehicleTitle", [sVehicleNumber]);
			// }
			// return this.getTranslation("NewPermit.Text.YourVehicleDetails");
			return this.getTranslation("NewPermit.Text.VehicleTitle", [sVehicleNumber]);
		},
		getVehicleDetailsTitle: function (bCarpool) {
			if (bCarpool) {
				return this.getTranslation("NewPermit.Text.YourVehicleDetails");
			}
			return this.getTranslation("NewPermit.Text.VehicleDetails");
		},

		getVehicleImage: function (sBodyType) {
			if (sBodyType == "MOTORCYCLE") {
				return "images/motorcycle.png";
			}
			return "images/car.png";
		},

		getPermitVehicleLimitText: function (iMax) {
			return this.getTranslation("NewPermit.Text.MaxVehicle", [iMax]);
		},

		getPermitCostSubText: function (iDailyFee, iRecurringFee, sRecurringFrequency, iCostCap) {
			var sReturn = "";
			if (iDailyFee > 0) {
				sReturn += "$" + this.formatter.getNumberWithComma(iDailyFee) + " per day";
			} else {
				if (sRecurringFrequency === "M") {
					sReturn += "$" + this.formatter.getNumberWithComma(iRecurringFee) + " per month";
				} else if (sRecurringFrequency === "Y") {
					sReturn += "$" + this.formatter.getNumberWithComma(iRecurringFee) + " per year";
				}
			}

			if (iCostCap > 0) {
				sReturn += ", $" + this.formatter.getNumberWithComma(iCostCap) + "/year";
			}
			return sReturn;
		},
		getPermitCost: function (iDailyFee, iRecurringFee, sRecurringFrequency) {
			var sReturn = "";
			if (iDailyFee > 0) {
				sReturn += "$" + this.formatter.getNumberWithComma(iDailyFee) + " each day you park";
			} else {
				if (sRecurringFrequency === "M") {
					sReturn += "$" + this.formatter.getNumberWithComma(iRecurringFee) + " per month";
				} else if (sRecurringFrequency === "Y") {
					sReturn += "$" + this.formatter.getNumberWithComma(iRecurringFee) + " per year";
				}
			}
			return sReturn;
		},
		getPermitFeeText: function (iDailyFee, iRecurringFee, sRecurringFrequency) {
			if (iDailyFee > 0 && iRecurringFee > 0) {
				if (sRecurringFrequency == 'Y') {
					return "Plus $" + this.formatter.getNumberWithComma(iRecurringFee) + " recurring yearly parking fee";
				} else if (sRecurringFrequency == 'M') {
					return "Plus $" + this.formatter.getNumberWithComma(iRecurringFee) + " recurring monthly parking fee";
				}
			}
		},
		getCreditDisclaimer: function (iDailyFee, iRecurringFee, sRecurringFrequency) {
			if (iDailyFee > 0) {
				return this.getTranslation("NewPermit.Text.CreditDisclaimerDaily");
			} else {
				return this.getTranslation("NewPermit.Text.CreditDisclaimerMonthly");
			}
		},
		getCarpoolPermitCost: function (iFee, carpoolMembers) {
			var iNumberOFMembers = 0,
				fCost;
			if (carpoolMembers) {
				if (Array.isArray(carpoolMembers)) {
					iNumberOFMembers = carpoolMembers.length;
				} else {
					iNumberOFMembers = carpoolMembers;
				}
				if (iNumberOFMembers) {
					fCost = Math.ceil(iFee / parseInt(iNumberOFMembers));
					return "$" + this.formatter.getNumberWithComma(fCost) + " per month";
				} else {
					return "$" + this.formatter.getNumberWithComma(iFee) + " per month";
				}
			}
		},
		getCarpoolPermitBreakdown: function (iFee, carpoolMembers) {
			var iNumberOFMembers = 0;
			if (carpoolMembers) {
				if (Array.isArray(carpoolMembers)) {
					iNumberOFMembers = carpoolMembers.length;
				} else {
					iNumberOFMembers = carpoolMembers;
				}
				if (iNumberOFMembers) {
					return "($" + this.formatter.getNumberWithComma(iFee) + " / " + iNumberOFMembers + " participants)";
				} else {
					return "($" + this.formatter.getNumberWithComma(iFee) + " / 1 participant)";
				}
			}
		},
		getPermitSubmitButtonText: function (sPaymentType, bCarpoolInvitation) {
			if (bCarpoolInvitation) {
				return this.getTranslation("NewPermit.Button.AcceptInvitation");
			} else {
				if (sPaymentType === "P" || sPaymentType === "S") {
					return this.getTranslation("NewPermit.Button.RequestPermit");
				} else {
					return this.getTranslation("NewPermit.Button.CreditCardPayment");
				}
			}

		},
		getPermitDetailsDesc: function (iRecurringFee) {
			if (iRecurringFee) {
				return this.getTranslation("NewPermit.Text.PermitDetailsDesc");
			} else {
				return this.getTranslation("NewPermit.Text.PermitDetailsDescNoCap");
			}
		},
		getPermitExpireText: function (sDefaultValidity) {
			if (sDefaultValidity == "Y") {
				return this.getTranslation("NewPermit.Text.PermitExpireYearly");
			} else if (sDefaultValidity == "T") {
				return this.getTranslation("NewPermit.Text.PermitExpireQuarterly");
			}
		},
		getPermitAutoRenewText: function (iDaily, iRecurring, sRecurringFrequency) {
			// if (iDaily) {
			// 	if (sRecurringFrequency == 'M') {
			// 		return "This permit will auto-renew at the beginning of every month."
			// 	} else if (sRecurringFrequency == 'Y') {
			// 		return "This permit will auto-renew each september."
			// 	}
			// } else {
			// 	return "This permit will auto-renew each september.";
			// }
			return "Your parking will auto-renew until you cancel or become ineligible.";

		},
		getStatusText: function (sStatus) {
			switch (sStatus) {
				case 'A':
					return "Accepted";
					break;
				case 'P':
					return "Pending";
					break;
				case 'R':
					return "Rejected";
					break;
			}
		},

		getRenewPermit2018: function (sLocation) {
			return this.getTranslation("NewPermit.Text.Renew2018", [sLocation]);
		},

		getBaseUrl: function (sEnvironment) {
			if (sEnvironment == 'DEV') {
				return "https://parking.hcpdev.mit.edu/index.html";
			} else if (sEnvironment == "TEST") {
				return "https://parking.hcptest.mit.edu/index.html";
			} else {
				return "https://parking.hcp.mit.edu/index.html";
			}
		},
		getParkingGridPermitCost: function (iDailyFee, iRecurringFee, sRecurringFrequency, iAnnualCap, sName) {
			var sReturn = "";
			if (sName.indexOf("Carpool") != -1) {
				sReturn += "$" + this.formatter.getNumberWithComma(iRecurringFee) + " per month / number of participants";
			} else {
				if (iDailyFee > 0) {
					sReturn += "$" + this.formatter.getNumberWithComma(iDailyFee) + " each day you park";
				} else {
					if (sRecurringFrequency === "M") {
						sReturn += "$" + this.formatter.getNumberWithComma(iRecurringFee) + " per month";
					} else if (sRecurringFrequency === "Y") {
						sReturn += "$" + this.formatter.getNumberWithComma(iRecurringFee) + " per year";
					}
				}
				if (iAnnualCap > 0) {
					sReturn += " (up to a maximum of $" + this.formatter.getNumberWithComma(iAnnualCap) + " annually)"
				}
			}
			return sReturn;
		},
		getParkingGidFeeText: function (iDailyFee, iRecurringFee, sRecurringFrequency) {
			if (iDailyFee > 0 && iRecurringFee > 0) {
				if (sRecurringFrequency == 'Y') {
					return "$" + this.formatter.getNumberWithComma(iRecurringFee) + " recurring yearly parking fee";
				} else if (sRecurringFrequency == 'M') {
					return "$" + this.formatter.getNumberWithComma(iRecurringFee) + " recurring monthly parking fee";
				}
			}
			return "N/A";

		},

		parseDateString: function (sDate) {
			if (sDate) {
				var aDate = sDate.split("-");
				aDate[1] -= 1;
				return new Date(aDate[0], aDate[1], aDate[2]);
			}
			return null;
		},
		parseDateObjectToString: function (oDate) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			return oDateFormat.format(oDate);
		},
		getDashboardRequestPermitButtonText: function (bRenew) {
			if (bRenew) {
				return "Renew Parking";
			} else {
				return "Request Parking";
			}
		},
		getPermitExpireVisibility: function (sStartDate) {
			var oToday = new Date().setHours(0, 0, 0, 0);
			if (this.formatter.parseDateString(sStartDate) > oToday) {
				return false;
			}
			if (!sStartDate) {
				return false;
			}
			return true;
		},
		getCancelPermitText: function (sValidStart, sValidEnd) {
			if (!sValidEnd && !sValidEnd) {
				return "Cancel Request";
			}
			return "Cancel Permit";
		}



		// getPermitValidityText: function(sStartDate, sEndDate) {
		// 	if(sEndDate == "2099-12-31") {
		// 		return this.getTranslation("Permit.Text.ValidFromCancel", [this.formatter.getDateWithYear(sStartDate)]);
		// 	} else if(sStartDate && sEndDate) {
		// 		return this.getTranslation("Permit.Text.ValidFromTo", [this.formatter.getDateWithYear(sStartDate),this.formatter.getDateWithYear(sEndDate)]);
		// 	}
		// },


		//This is how you set up a formatter that will give a refference to the control allowing you to get its binding context
		/*  $.sap.getObject("edu.mit.parking.formatter", 0);
			edu.mit.parking.formatter = {
				departmentVehicleNumber: function(sPlatNumber) {
					var iVehicles = 0,
					 iTempVehicles = 0,
					 sPath = this.getBindingContext("sessionData").sPath.split("vehicles/") + "vehicles",
					 oVehicles = this.getBindingContext("sessionData").oModel.getProperty(sPath),
					 oVehicles;
					 for(var x in oVehicles) {
						if (oVehicles[i].temporary) {
							iTempVehicles++;
						} else {
							iVehicles++;
						}
						if (sPlateNumber === oVehicles[i].plateNumber) {
							if (oVehicles[i].temporary) {
								return this.getTranslation("Dashboard.text.TempVehicleNumber", iTempVehicles);
							} else {
								return this.getTranslation("Dashboard.text.VehicleNumber", iVehicles);
							}
						}
					 }
					 

				}
			}; */
	};
});