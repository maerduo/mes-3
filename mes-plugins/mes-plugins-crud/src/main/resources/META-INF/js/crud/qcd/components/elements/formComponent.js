/*
 * ***************************************************************************
 * Copyright (c) 2010 Qcadoo Limited
 * Project: Qcadoo MES
 * Version: 0.1
 *
 * This file is part of Qcadoo.
 *
 * Qcadoo is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation; either version 3 of the License,
 * or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 * ***************************************************************************
 */

var QCD = QCD || {};
QCD.components = QCD.components || {};
QCD.components.elements = QCD.components.elements || {};

QCD.components.elements.FormComponent = function(_element, _mainController) {
	$.extend(this, new QCD.components.Component(_element, _mainController));

	var mainController = _mainController;

	var element = _element;
	
	var component = $("#" + element.attr('id'));

	var errorIcon = $("#" + element.attr('id') + "_error_icon");
	
	var errorMessages = $("#" + element.attr('id') + "_error_messages");

	var descriptionIcon = $("#" + element.attr('id') + "_description_icon");

	var descriptionMessage = $("#" + element.attr('id') + "_description_message");
	
	var currentValue;
	
	this.input = $("#" + element.attr('id') + "_input");

	function constructor(_this) {
		_this.registerCallbacks();
		currentValue = _this.input.val();
	}
	
	this.registerCallbacks = function() {
		descriptionIcon.hover(function() {
			descriptionMessage.show();
		}, function() {
			descriptionMessage.hide();
		});

		errorIcon.hover(function() {
			errorMessages.show();
		}, function() {
			errorMessages.hide();
		});
	}
	
	this.getComponentData = function() {
		return {
			value : this.input.val()
		}
	}

	this.setComponentData = function(data) {
		if (data.value) {
			this.input.val(data.value);
		}
	}

	this.getComponentValue = function() {
		value = this.getComponentData();
		value.required = component.hasClass("required");
		return value;
	}

	this.setComponentValue = function(value) {
		this.setComponentData(value);
		setComponentRequired(value.required);
		this.setCurrentValue(value);
	}

	this.setComponentState = function(state) {
		this.setComponentData(state);
		setComponentRequired(state.required);
		this.setCurrentValue(state);
	}
	
	this.setCurrentValue = function(data) {
		currentValue = data.value ? data.value : "";
	} 
	
	this.isChanged = function() {
		return currentValue != this.input.val();
	}

	this.setComponentEnabled = function(isEnabled) {
		if (isEnabled) {
			element.removeClass("disabled");
			this.input.removeAttr('disabled');
		} else {
			element.addClass("disabled");
			this.input.attr('disabled', 'true');
		}
		if (this.setFormComponentEnabled) {
			this.setFormComponentEnabled(isEnabled);
		}
	}
	
	function setComponentRequired(isRequired) {
		if (isRequired) {
			component.addClass("required");
		} else {
			component.removeClass("required");
		}
	}

	function setComponentError(isError) {
		if (isError) {
			component.addClass("error");
		} else {
			component.removeClass("error");
		}
	}
	
	this.setMessages = function(messages) {
		errorMessages.html("");

		for ( var i in messages.error) {
			messageDiv = $('<div>')

			message = QCD.MessagesController.split(messages.error[i], 'error');

			messageDiv.append('<span>' + message[0] + '</span>');
			messageDiv.append('<p>' + message[1] + '</p>');

			errorMessages.append(messageDiv);

			var top = this.input.offset().top;
			var errorIconHeight = errorMessages.height();
			var inputHeight = this.input.outerHeight() - 1;
			var viewHeight = document.documentElement.clientHeight + $(document).scrollTop();

			if ((top+errorIconHeight+inputHeight) > viewHeight) {
				errorMessages.css("top", "");
				errorMessages.css("bottom", errorIcon.outerHeight()+"px");
			} else {
				errorMessages.css("top", errorIcon.outerHeight()+"px");
				errorMessages.css("bottom", "");
			}
			
		}

		setComponentError(messages.error.length != 0);
	}

	this.setComponentLoading = function(isLoadingVisible) {}
	
	constructor(this);

}