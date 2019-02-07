sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createLookupsModel: function () {
			var oModel = new JSONModel({
				vehicle: {

				}
			});
			return oModel;
		},

		createSessionDataModel: function () {
			var oModel = new JSONModel({
				environment: "dev",
				banners: [{
						id: "1",
						type: "W",
						header: "New Ticket",
						message: "You recieved a new ticket. Please pay by 5/28/18.",
						cancel: false
					}
					/* {
					    id: "2",
					    type: "S",
					    header: "Request Submitted",
					    message: "Please note that you cannot park on campus until you recive an email confirming your permit is active",
					    cancel: true
					},
					{
					    id: "3",
					    type: "P",
					    header: "Pending Permit Request",
					    message: "You will receive a notification when your request has been processed and a lot has been assigned",
					    cancel: false
					} */
				],
				permits: [{
					permitId: 1,
					type: "Occasional",
					location: "Riverside",
					permitFee: "200",
					costPerDay: 10,
					costCap: 2100,
					runningBalance: 1500,
					startDate: "2017-09-12",
					endDate: "2018-08-30",
					paymentInformation: {
						type: "Payroll Deduction"
					},
					vehicles: [{
						vehicleId: "xxxx",
						make: "Nissan",
						model: "350z",
						year: "2015",
						color: "Grey",
						plateNumber: "PK785Y",
						plateState: "MA",
						bodyType: "VEHICLE",
						temporary: false,
						startDate: "",
						endDate: ""
					}, {
						make: "Suzuki",
						model: "GSXR-R1000",
						year: "2010",
						color: "Grey",
						plateNumber: "HP378G",
						plateState: "MA",
						bodyType: "MOTORCYCLE",
						temporary: false,
						startDate: "",
						endDate: ""
					}, {
						make: "Ford",
						model: "F150",
						year: "2018",
						color: "Grey",
						plateNumber: "OI7885",
						plateState: "MA",
						bodyType: "VEHICLE",
						temporary: true,
						startDate: "",
						endDate: "2018-05-04"
					}]
				}, {
					permitId: 2,
					type: "Occasional",
					location: "WestGate",
					permitFee: "200",
					costPerDay: 10,
					costCap: 2100,
					runningBalance: 700,
					startDate: "2017-09-12",
					endDate: "2018-08-30",
					paymentInformation: {
						type: "Payroll Deduction"
					},
					vehicles: [{
						make: "Honda",
						model: "Accord",
						year: "2018",
						color: "Grey",
						plateNumber: "GH598K",
						plateState: "MA",
						bodyType: "VEHICLE",
						temporary: false,
						startDate: "",
						endDate: ""
					}]
				}],
				tickets: [{
					"ticketId": "123",
					"accountId": "321",
					"ticketNumber": "A123",
					"violationDate": "2018-04-05T11:05:16",
					"description": "Double parked",
					"amount": 30,
					"status": "ADJUDICATION_APPROVED",
					"location": "Riverside",
					"canAppeal": false,
					"vehicle": {
						"make": "Nissan",
						"model": "Versa",
						"year": 2015,
						"color": "White",
						"plateNumber": "ABC-85K",
						"plateState": "MA",
						"bodyType": "VEHICLE"
					},
					"attachments": [{
						"attachmentId": "123667",
						"mimeType": "image/jpeg",
						"filename": "test.jpg"
					}]
				}, {
					"ticketId": "123",
					"accountId": "321",
					"ticketNumber": "A123",
					"violationDate": "2018-04-01T09:30:16",
					"description": "Parked in front of fire hydrant",
					"amount": 300,
					"status": "PAID",
					"location": "Riverside",
					"canAppeal": false,
					"vehicle": {
						"make": "Nissan",
						"model": "Versa",
						"year": 2015,
						"color": "White",
						"plateNumber": "ABC-85K",
						"plateState": "MA",
						"bodyType": "VEHICLE"
					},
					"attachments": [{
						"attachmentId": "123667",
						"mimeType": "image/jpeg",
						"filename": "test.jpg"
					}]
				}, {
					"ticketId": "123",
					"accountId": "321",
					"ticketNumber": "A123",
					"violationDate": "2018-01-07T13:30:16",
					"description": "Not parked in parking spot",
					"amount": 50,
					"status": "APPEALED",
					"location": "Riverside",
					"canAppeal": false,
					"vehicle": {
						"make": "Nissan",
						"model": "Versa",
						"year": 2015,
						"color": "White",
						"plateNumber": "ABC-85K",
						"plateState": "MA",
						"bodyType": "VEHICLE"
					},
					"attachments": [{
						"attachmentId": "123667",
						"mimeType": "image/jpeg",
						"filename": "test.jpg"
					}]
				}, {
					"ticketId": "123",
					"accountId": "321",
					"ticketNumber": "A123",
					"violationDate": "2018-04-23T08:45:16",
					"description": "No permit for lot",
					"amount": 150,
					"status": "ISSUED",
					"location": "W92",
					"canAppeal": true,
					"vehicle": {
						"make": "Nissan",
						"model": "Versa",
						"year": 2015,
						"color": "White",
						"plateNumber": "ABC-85K",
						"plateState": "MA",
						"bodyType": "VEHICLE"
					},
					"attachments": [{
						"attachmentId": "123667",
						"mimeType": "image/jpeg",
						"filename": "test.jpg"
					}]
				}],
				ticketCount: [{
					state: "ISSUED",
					count: 1
				}, {
					state: "APPEALED",
					count: 2
				}],
				user: {
					mitId: "",
					firstName: "",
					lastName: "",
					livesOnCampus: false,
					graduateStudent: false,
					type: "USER",
					vip: false,
					activePermit: true
				},
				billing: {
					deductionType: "PAYROLL",
					items: [{
						periodStartDate: "2018-04-01",
						periodEndDate: "2018-04-30",
						amount: 75,
						dueDate: "2018-05-30",
						deductionType: "PAYROLL",
						autoDeductions: [{
							date: "2018-06-15",
							amount: 37.50,
							deductionType: "PAYROLL",
						}, {
							date: "2018-06-30",
							amount: 37.50,
							deductionType: "PAYROLL",
						}]
					}, {
						periodStartDate: "2018-03-01",
						periodEndDate: "2018-03-30",
						amount: 300,
						dueDate: "2018-05-30",
						deductionType: "PAYROLL",
						autoDeductions: [{
							date: "2018-05-15",
							amount: 150,
							deductionType: "PAYROLL",
						}, {
							date: "2018-05-30",
							amount: 150,
							deductionType: "PAYROLL",
						}]
					}, {
						periodStartDate: "2018-02-01",
						periodEndDate: "2018-02-31",
						amount: 150,
						dueDate: "2018-04-30",
						deductionType: "PAYROLL",
						autoDeductions: [{
							date: "2018-04-15",
							amount: 75,
							deductionType: "PAYROLL",
						}, {
							date: "2018-04-30",
							amount: 75,
							deductionType: "PAYROLL",
						}]
					}]
				},
				helperSets: {
					color: [{
						id: "white",
						text: "White"
					}, {
						id: "blue",
						text: "Blue"
					}, {
						id: "red",
						text: "Red"
					}],
					state: [{
						id: "GA",
						text: "Georgia"
					}, {
						id: "MA",
						text: "Massachusetts"
					}, {
						id: "FA",
						text: "Florida"
					}],
					bodyType: [{
						id: "VEHICLE",
						text: "Vehicle"
					}, {
						id: "MOTORCYCLE",
						text: "Motorcycle"
					}],
					ticketType: [{
						id: "ALL",
						text: "All"
					}, {
						id: "ISSUED",
						text: "Issued"
					}, {
						id: "Paid",
						text: "Paid"
					}, {
						id: "APPEALED",
						text: "Appealed"
					}, {
						id: "ADJUDICATION_APPROVED",
						text: "Appeal Approved"
					}],
					accountHistoryType: [{
						id: "ALL",
						text: "All"
					}, {
						id: "PERMIT_FEE",
						text: "Permit Fee"
					}, {
						id: "PARKING_FEE",
						text: "Parking Fee"
					}, {
						id: "ADJUSTMENT",
						text: "Adjustment"
					}, {
						id: "PAYMENT",
						text: "Payment"
					}],
					visitorLocation: [{
						id: "RIVERSIDE",
						text: "Riverside",
						remainingSpots: 10
					}, {
						id: "BACKBAY",
						text: "Back Bay",
						remainingSpots: 15
					}, {
						id: "WESTGATE",
						text: "West Gate",
						remainingSpots: 7
					}, {
						id: "EASTGATE",
						text: "East Gate",
						remainingSpots: 1
					}],
					scratchPassQuantity: [{
						id: "1",
						text: "1"
					}, {
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
					}, {
						id: "6",
						text: "6"
					}, {
						id: "7",
						text: "7"
					}, {
						id: "8",
						text: "8"
					}, {
						id: "9",
						text: "9"
					}, {
						id: "10",
						text: "10"
					}, ],

					accountTimeframe: [{
						id: "ALL",
						text: "All"
					}]
				}
			});
			return oModel;

			var permitModels = [{
					title: "EMPLOYEE",
					type: "employee",
					permitType: ["PERSONAL", "CARPOOL"],
					permitOptions: [],
					preferredLot: [],
					lot: "W92",
					canEditLot: true,
					showLot: true,
					canAddComment: true,
					canChooseWestgate: true,
					dailyCharge: 10,
					maxCap: 1900,
					permitFee: 200,
					isProRated: false,
					carpoolRate: 950,
					paymentOptions: ["PAYROLL_DEDUCTION", "CREDIT_CARD"]
				}, {
					title: "STUDENT_COMMUTER",
					type: "student",
					PermitType: ["PERSONAL", "CARPOOL"],
					permitOptions: [{
						text: "PAY_PER_DAY",
						amount: 10
					}, {
						text: "PAY_YEARLY",
						amount: 1238
					}],
					preferredLot: [],
					lot: "W92",
					canEditLot: false,
					showLot: true,
					canAddComment: false,
					canChooseWestgate: false,
					dailyCharge: 10,
					maxCap: 1238,
					permitFee: 200,
					isProRated: false,
					carpoolRate: 950,
					paymentOptions: ["STUDENT_ACCOUNT", "CREDIT_CARD"]
				}, {
					title: "STUDENT_RESIDENT",
					type: "student",
					PermitType: ["PERSONAL", "CARPOOL"],
					permitOptions: [],
					preferredLot: [{
						text: "RESIDENT_LOT",
						amount: 1900
					}, {
						text: "WESTGATE",
						amount: 1050
					}],
					lot: "",
					canEditLot: false,
					showLot: false,
					canAddComment: false,
					canChooseWestgate: false,
					dailyCharge: 0,
					maxCap: 0,
					permitFee: 0,
					isProRated: false,
					carpoolRate: 0,
					paymentOptions: ["STUDENT_ACCOUNT", "CREDIT_CARD"]
				}, {
					title: "NON_EMPLOYEE_COMMUTER",
					type: "affiliate",
					PermitType: ["PERSONAL", "CARPOOL"],
					permitOptions: [{
						text: "PAY_PER_DAY",
						amount: 10
					}, {
						text: "PAY_YEARLY",
						amount: 2262
					}],
					preferredLot: [],
					lot: "W92",
					canEditLot: true,
					showLot: true,
					canAddComment: true,
					canChooseWestgate: false,
					dailyCharge: 0,
					maxCap: 0,
					permitFee: 0,
					isProRated: false,
					carpoolRate: 0,
					paymentOptions: []
				}, {
					title: "VOLUNTEER",
					type: "volunteer",
					PermitType: ["PERSONAL", "CARPOOL"],
					permitOptions: [{
						text: "PAY_PER_DAY",
						amount: 10
					}, {
						text: "PAY_YEARLY",
						amount: 2262
					}],
					preferredLot: [],
					lot: "W92",
					canEditLot: false,
					showLot: true,
					canAddComment: false,
					canChooseWestgate: false,
					dailyCharge: 0,
					maxCap: 446,
					permitFee: 0,
					isProRated: false,
					carpoolRate: 0,
					paymentOptions: []
				},

				{
					title: "Employee, Student Resident, Student Commuter, Affiliate, Professor Emeritus, Construction, Discounted,  Department Vehicles, Z-Center",
					permitType: "EMPLOYEE, STUDENT, AFFILIATE, NON-MIT",
					permitOptions: [{
						id: "PERSONAL",
						text: "Personal"
					}, {
						id: "CARPOOL",
						text: "Carpool"
					}],
					preferredLot: [{
						lot: "Resident Lot",
						cost: 10,
						costType: "DAY"
					}, {
						lot: "Westgate",
						cost: 5,
						costType: "DAY"
					}],
					preferredLotInputType: "INPUT, COMBO, SEGEMENTED, NONE",
					selectedLot: "",
					assignedLot: "W92",
					canAddComment: true,
					canChooseEconomy: true,
					canEditLot: true,
					permitDetails: {
						cost: 10,
						costType: "DAY, MONTH, YEAR",
						costCap: 1900,
						numberOfPayments: 7,
						autoRenew: true,
						showParkMessage: true
					},
					paymentMethod: [{
						id: "BURSAR",
						text: "Student Account"
					}, {
						id: "CREDIT",
						text: "Credit/Debit Card"
					}]
				}

			]

		}

	};
});