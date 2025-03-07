/*global QUnit*/

sap.ui.define([
	"excel/controller/Excel.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Excel Controller");

	QUnit.test("I should test the Excel controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
