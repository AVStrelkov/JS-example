var view = {
	displayMessage: function(msg){
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location){
		var locationHit = document.getElementById(location);
		locationHit.setAttribute("class", "hit");
	},
	displayMiss: function(location){
		var locationMiss = document.getElementById(location);
		locationMiss.setAttribute("class", "miss");
	}
};

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships: [{locations:["", "", ""], hits:["", "", ""]},
			{locations:["", "", ""], hits:["", "", ""]},
			{locations:["", "", ""], hits:["", "", ""]}],

	fire: function(guess){
		for(var i = 0; i < this.numShips; i++){
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0){
				if(ship.hits[index] !== "hit"){
					ship.hits[index] = "hit";
					view.displayHit(guess);
					view.displayMessage("Попадание!");
					if (this.isSunk(ship)){
						view.displayMessage("Корабль потоплен!");
						this.shipsSunk++;
					}
				}
				else{
					view.displayMessage("Зачем стрелять в подбитый корабль!")
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Вы промахнулись!");
		return false;
	},

	isSunk: function(ship){
		for (var i = 0; i < this.shipLength; i++){
			if (ship.hits[i] !== "hit"){
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function(){
		var locations;
		for (var i = 0; i < this.numShips; i++){
			do{
				locations = this.generateShip();
			}
			while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function(){
		var derection = Math.floor(Math.random() * 2);
		var row, col;
		if (derection === 1){
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		}
		else{
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++){
			if (derection === 1){
				newShipLocations.push(row + "" + (col + i));
			}
			else{
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations){
		for (var i = 0; i < this.numShips; i++){
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++){
				if (ship.locations.indexOf(locations[j]) >= 0){
					return true;
				}
			}
		}
		return false;
	}
};

var controller = {
	guesses: 0,

	processGuess: function(guess){
		if (isNaN(guess) || guess.length !== 2){
			var location = parseGuess(guess);
		}
		else{
			var location = guess;
		}
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips){
				view.displayMessage("Вы потопили все коробли за " + this.guesses + " выстрелов")
			}
		}
	}
};

function parseGuess(guess){
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess === null){
		alert("Введены неверные координаты, поробуйте снова.");
	}
	else{
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar.toUpperCase());
		var column = guess.charAt(1);
		if (isNaN(row) || isNaN(column)){
			alert("Введены неверные координаты, поробуйте снова.");
		}
		else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
			alert("Введенные координаты отсутствуют на доске!");
		}
		else{
			return row + column;
		}
	}
	return null;
}

function init (){
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = headleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
	var rowColum = document.getElementsByTagName("td");
	for (var i = 0; i < rowColum.length; i++){
		rowColum[i].onclick = showAnswer;
	}
	function showAnswer(eventObj){
		var rowColum = (eventObj.target.id);
		controller.processGuess(rowColum);
	}
}

function handleKeyPress(e){
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13){
		fireButton.click();
		return false;
	}
}

function headleFireButton(){
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
		if (isNaN(guess)){
			controller.processGuess(guess);
			guessInput.value = "";
		}
		else{
			guessInput.value = "";
			alert("Введены неверные координаты, поробуйте снова.");
		}	
}

window.onload = init;