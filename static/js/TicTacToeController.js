
rh.ttt.TicTacToeController = function() { 
	this.game = new rh.ttt.TicTacToeGame; 
	this.enableButtons(); 

};

rh.ttt.TicTacToeController.prototype.updateView = function(data){
	$("#wins").text(data.wins);
	$("#losses").text(data.losses);
	$("#ties").text(data.ties);	
};

rh.ttt.TicTacToeController.prototype.sendPost = function(message) {
		TicTacToeController = this; 
	  $.post( "/gamecomplete", message )
	  .done(function( data ) {
	    console.log("Successfully added custom messages " + JSON.stringify(data));
	    TicTacToeController.updateView(data);
	  })
	  .fail(function(jqxhr, textStatus, error) {
	    var err = textStatus + ", " + error;
	    console.log("POST Request Failed: " + err);
	  });	
};


rh.ttt.TicTacToeController.prototype.enableButtons = function() {
	TicTacToeController = this; 
	

		$(".board .btn").click(function(){
			if (TicTacToeController.game.getGameState()  === 0){
			index = $(".board > button").index(this); 
			TicTacToeController.game.pressedSquare(index, true);
			TicTacToeController.updateButtons();
			gameString = TicTacToeController.game.getGameString();
			if (TicTacToeController.game.getGameState() === 1){
			$.get( "/getmove",  {"gamestring": gameString})
			  .done(function( data ) {
			    console.log("Successfully added custom messages " + JSON.stringify(data));
				TicTacToeController.game.pressedSquare(data.computer_move, false);
				TicTacToeController.updateButtons();
			  })
			  .fail(function(jqxhr, textStatus, error) {
			    var err = textStatus + ", " + error;
			    console.log("Get Request Failed: " + err);
			  });	
		}
			}
		});

	$("#fake-win").click(function(){
		var customMessages = {"result": "win"};
		TicTacToeController.sendPost(customMessages); 
	});
	
	$("#fake-loss").click(function(){
		var customMessages = {"result": "loss"};
		TicTacToeController.sendPost(customMessages); 
	});
	
	$("#fake-tie").click(function(){
		var customMessages = {"result": "tie"};
		TicTacToeController.sendPost(customMessages); 
	});
	
	$("#reset-stats").click(function(){
		var message = {};
		  $.post( "/resetstats", message )
		  .done(function( data ) {
		    console.log("Successfully added custom messages " + JSON.stringify(data));
		    TicTacToeController.updateView(data);
		  })
		  .fail(function(jqxhr, textStatus, error) {
		    var err = textStatus + ", " + error;
		    console.log("POST Request Failed: " + err);
		  });	
		$("#new-game").trigger("click");
	});
	
	$("#new-game").click(function(){
		$(".board > button").each(function(){
			$(this).text(" "); 
			$(this).css("background", "white"); 
			$(".left-text").text("Your turn"); 
		});
		$("body").removeClass("win loss"); 
		TicTacToeController.game = new rh.ttt.TicTacToeGame();
		
	});
};

rh.ttt.TicTacToeController.prototype.updateButtons = function(){
	TicTacToeController = this; 
	$(".board > button").each(function(index) {
		gameString = TicTacToeController.game.getGameString();
		if (gameString[index] === "X") {
			$(this).text("X");			
			$(this).css("background", "green"); 
		}
		if (gameString[index] === "O") {
			$(this).text("O");		
			$(this).css("background", "red"); 
		}
		
	});
	
	gameState = TicTacToeController.game.getGameState();
	
	if (gameState === 0) {
		$(".left-text").text("Your turn"); 
	
	}
	else if (gameState === 1) {
		$(".left-text").text("Computer turn"); 
		
		
	}
	else if (gameState === 2 ){
		$(".left-text").text("You win!"); 
		$( "#fake-win" ).trigger( "click" );
		$("body").addClass("win"); 
		
	}
	else if (gameState === 3){
		$(".left-text").text("You lose!");
		$("#fake-loss").trigger("click"); 
		$("body").addClass("loss"); 
	}
	else {
		$(".left-text").text("Tie game");
		$("#fake-tie").trigger("click"); 		
	}
	
	
	
};
