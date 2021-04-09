"use strict";

const max_digits = 8;

const _device_expression = document.getElementById("expression");
const _device_operand = document.getElementById("operand");

const calculation = {
	//use regular functions to define this object's intermal methods
	_expression: [],
	push: function (exp) { this._expression.push(exp); },
	pop: function () { this._expression.pop(); },
	last: function () { return this._expression[this._expression.length - 1] || "";},
	clear: function () { this._expression.length = 0; },
	debug: function () { console.log(this._expression); },
	expression: function() {
		let exp = ""; 
		for(let i = 0; i < this._expression.length; i++) {
			exp += this._expression[i] + " ";
		} 
		return exp;
	}
};

const screen = {
	//use arrow functions to define this object's internal methods
	set: {
		expression: (value) => { _device_expression.innerText = value; },
		operand: (value) => { _device_operand.innerText = value; },
	},
	clear: {
		expression: () => { _device_expression.innerText = ""; },
		operand: () => { _device_operand.innerText = ""; },
		all: () => { 
			_device_expression.innerText = "";
			_device_operand.innerText = "";
		},
	},
	get: {
		expression: () => { return _device_expression.innerText; },
		operand: () => { return _device_operand.innerText; },
	},
};


function append_value(original, append, glue, spacer = false) {
	original = (original || "").trim(); //initialise undefined variables
	append = (append || "").trim();
	glue = (glue || "").trim();
	let padding = spacer ? " ": ""; //apply the spacer based on shorthad padding condition
	let result = "";
	if(original.length > 0) {
		if(append.length > 0) {
			if(glue.length > 0) { 
				result = original + padding + glue.trim() + padding + append; 
			} else {
				result = original + padding + append; 
			}
		} else { 
			result = original; 
		} 
	} else { 
		if(append.length > 0) { result = append; } 
	}
	return result.trim();
}

function evaluate(expression) {
	return eval(expression);
}

function digit_pressed(digit) {
	let current = screen.get.operand();
	let updated = append_value(current, digit);
	screen.set.operand(updated);	
}

function operator_pressed(operator) {
	let current_operand = screen.get.operand();
	calculation.push(current_operand);
	calculation.push(operator);

	screen.set.expression(calculation.expression());
	screen.clear.operand();
}

function control_pressed(control) {
	switch(control) {
		case "c": screen.clear.operand(); break;
		case "ac": screen.clear.all(); break;
		case "=":
			let current_operand = "";
			let computed_value = 0;

			current_operand = screen.get.operand();
			calculation.push(current_operand);

			screen.set.expression(calculation.expression());
			screen.clear.operand();

			computed_value = evaluate(calculation.expression());
			screen.set.operand(computed_value);

			calculation.clear();
			
			break;
	}
}

//create events for the number buttons
var buttons = document.getElementsByClassName('button');
for(let i = 0; i < buttons.length; i++) { //loop through each specific instance of number buttons
	buttons[i].addEventListener('click', function() {
		switch(this.dataset.action) {
			case("digit"): digit_pressed(this.id); break;
			case("operator"): operator_pressed(this.id); break;
			case("control"): control_pressed(this.id); break;
		}
	})
}

window.onload = () => {
	screen.clear.all();
};
 