<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="CSS/material.min.css">
	<link rel="stylesheet" href="CSS/ViStyles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
	<script src="JS/material.min.js"></script>
	<script src="JS/blackjack.js"></script>
    <script>
		var cardsInDeck = new Array(); //Array of cards not draw/in the deck
		var P1 = 0; //Score or total value of the cards Player 1 has
		var P2 = 0; //Score or total value of the cards Player 2 has
		var P1Name = "Player 1"; //Name of Player 1, can be changed by user
		var P2Name = "Blackjack Dealer"; //Name of Player 2, can be changed by user
		var winner ="";
		var loser ="";
    	var turn = 1; //Variable to keep track of turns
		var endedTurn = "false"; //Checks if the last turn done was "End of turn"
		var cardDrew; //Variable containing the "value" of the card drawn. This value is from 1-52 symbolizing the cards in a deck.
		var suite; //Contains the suite of a draw card such as Hearts or Diamonds
		var p1RevealedAces = 0; //Player 1 Aces with the value of 11
		var p2RevealedAces = 0; //Player 2 Aces with the value of 11
		var p1HiddenAces = 0; //Player 2 Aces with the value of 1
		var p2HiddenAces = 0; //Player 2 Aces with the value of 1
		var p1Cards = 0;
		var p2Cards = 0;
		
		
		
		function deckShuffle(){ //Function called to restore deck to its unused state as well as other relevant variables to their initial state
		cardsInDeck.splice(0,cardsInDeck.length); //Deletes contents of the array
		for(index = 0; index < 52; index++) //Loop fills array with the Integers 1-52 representing cards
			{
			cardsInDeck.push(index+1); //Because we won't have a card 0... Could actually add it and other "special" cards if we want to make something better than Blackjack
			}
		P1 = 0; //Shuffle function also returns everything to the start, Player1 and Player2 scores as well as turns, aces and the endedTurn checker are included in this for that reason.
		P2 = 0;
		turn = 1;
		p1RevealedAces = 0;
		p2RevealedAces = 0;
		p1HiddenAces = 0;
		p2HiddenAces = 0;
		p1Cards = 0;
		p2Cards = 0;
        endedTurn = "false";
		$("#pturn").html(turn); //This and the following .html code is just to update the values the user sees
		$("#p1").html(P1);
		$("#p2").html(P2);
		$("#result").html(null);
		alert("Shuffling the deck!"); //Tells users deck is shuffling...
		deal(); //Gives users two starting cards each...
		}
		function Ace(score1){ //I hate this function! But its needeed, So it deals with Aces in Blackjack as Aces can have a value of 1 or 11. This function determines what value Aces players have will take.
		
			var score = Number(score1); //Function passeed through Ace() is the score of Player 1 (P1) or Player 2 (P2)
			if(turn == 2) //This is a bit confusing but because the turn has changed before the Ace() function is called, if turn == 2, then it means it is player 1s turn.
			{
				while(score > 21 && p1RevealedAces > 0)//If the score of Player 1 is above 21 and he has an Ace with a value of 11
				{
					score-=10; //Score of the player is reduced by 10
					p1RevealedAces--; //Because the Ace now takes the value of 1, it is not a revealed Ace anymore.
					p1HiddenAces++; //The Ace is now a HiddenAce, or in otherwords, has a value of 1
				}
				//This while loop is probably not needed unless we want to add more features later on such as a "Card delete"
				while(score<=11 && p1HiddenAces > 0)  
				{
					score+= 10; 
					p1RevealedAces++;
					p1HiddenAces--;
				}
			}
			else //If it is not Player 1s turn, then it is Player 2s turn. Uses same code as Player 1 but with Player 2's variables.
			{
				while(score>21 && p2RevealedAces > 0)
				{
					score-=10;
					p2RevealedAces--;
					p2HiddenAces++;
				}
				//This while loop is probably not needed unless we want to add more features later on such as a "Card delete"
				while(score<=11 && p2HiddenAces > 0)
				{
					score+=10;
					p2RevealedAces++;
					p2HiddenAces--;
				}
			} 
			return score; //Returns a score after determining the best value of Ace
		}
		
		function over(score){ //Main function to check if someone has won the game
			if(score < 21) //If score, passed through the over function, is less than 21
			{
				if(turn==1 && p2Cards >  4) //If it is Player 2s turn and Player 2 has 5 cards with a value under 21, Player 2 wins
				{
					winner = P2Name;
					loser = P1Name;
					alert(winner + " drew a card with a Suite of " + suite + " with a value of " + cardValue + ". " + winner + " has a total value of " + score + "while having 5 cards! " + winner +" wins!");
				}
				
				else if(turn==2 && p1Cards >  4) 
				{
					winner = P1Name;
					loser =P2Name;
					alert(winner + " drew a card with a Suite of " + suite + " with a value of " + cardValue + ". " + winner + " has a total value of " + score + "while having 5 cards! " + winner +" wins!");
				}
			}
			
			else if(score > 21) //If score, passed through the over function, is over 21
			{	
				if(turn==1) //Again, because turn updates before this code runs, if the turn ==1, then it really means it is Player 2's turn...
				{
					winner = P1Name; //If it was Player 2s turn, then it was Player 2's score that passed 21. That means Player 1 wins
					loser = P2Name; //And if Player 1 wins then....
				}
				else //If its not Player 2s turn then...
				{
					winner = P2Name;
					loser = P1Name;
				}
				alert(loser + " drew a card with a Suite of " + suite + " with a value of " + cardValue + ". " + loser + " has a total value of " + score + " which has hit over 21! " + winner + " has won!"); 
				//Tells whar card was drawn, its suite and declares the winner/loser along with the reason why someone won/lost
				deckShuffle(); //Because someone won, game is over and deck must be shuffled for the next game
			}
			
			else if(score == 21) //If one side gets the score of 21, which is considered the best score in BlackJack
			{	
				if(turn==2) //Same as before, Turn was changed so this means if its Player 1s score that was passed through this function
				{
					winner = P1Name; //Winner is Player 1
				}
				else
				{
					winner = P2Name;
				}
				alert(winner + " drew a card with a Suite of " + suite + " with a value of " + cardValue + ". " + winner + " has a total value of " + score + "! " + winner + " has won!");
				//Tells whar card was drawn, its suite and declares the winner/loser along with the reason why someone won/lost
				deckShuffle(); //Because someone won, game is over and deck must be shuffled for the next game
			}
		}
		
		function deal(){ //Starts the game. Draws 2 cards for each player... in this case, we can just run "Click Draw button" 4 times.
		$("button#Draw").click();
		$("button#Draw").click();
		$("button#Draw").click();
		$("button#Draw").click();
		}
		
		function valueCompare(){ //Compares the scores of Player 1 and Player 2 and returns a message saying who the winner is.
		if(P1>P2){
			alert("Player 1 has a greater value with a score of " + P1 + ". Player 1 wins!");
			}
		else if(P2>P1){
			alert("Player 2 has a greater value with a score of " + P2 + ". Player 2 wins!");
			}
		else{
			alert("It is a tie!");
			}
			deckShuffle();
		}
		
		function draw(){ //Simulates a Player drawing a card
		var cardDrew = Math.floor(Math.random()*cardsInDeck.length); // Takes a random element index from the cardsInDeck array
		var drawn = cardsInDeck[cardDrew]; // Gets the value of the element in the cardsInDeck array
		cardsInDeck.splice(cardDrew, 1); // Removes element from the array
		endedTurn = "false"; //Says that the user did not end their turn
		return drawn; // Returns the value of the element
			}		
		function convertCard(cardToConvert) { //Do not call this function more as it messes up the "Ace" system if called elsewhere.
		//Passes the value of the element in the cardsInDeck that was drawn
		cardToConvert = cardToConvert%13; //Gets the remainder after dividing by 13, because their are 13 variations of cards in a deck disregarding suites
		if(cardToConvert > 10 || cardToConvert === 0) //If the card dre is 11,12 or 0, then the user drew a "facecard" Jack/Queen/King
			{
				cardToConvert = 10;
			}
		else if(turn == 1){ //This is like... the only feature with adequate turn representation because it happens before turn updates...
			if(cardToConvert == 1) //Oh boy, the damn Aces. If the card drew has a remainder of 1, that means an Ace was drawn and it is Player 1s
			{
			p1RevealedAces++; //Since it was Player 1s Ace and we are giving it a value of 11, his RevealedAces is increased
			cardToConvert = 11; //Gives Aces the value of 11
			}
		}
		else{
			if(cardToConvert == 1)
			{
			p2RevealedAces++;
			cardToConvert = 11;
			}}
		return cardToConvert; //Returns the value of the card
			}
	    
		function getSuite(cardToConvert) {
		var suiteTier = (cardToConvert/13); //There are 4 suites, 52/4 = 13 so...
		var suite ="";
		if(suiteTier <= 1){ //Cards 1-13 are Diamonds
		suite = "Diamonds"; //Assign Diamonds to the suite
		} 
		else if(suiteTier <= 2){
		suite = "Hearts";
		}
		else if(suiteTier <= 3){
		suite = "Clubs";
		}
		else if(suiteTier <= 4){
		suite = "Spades";
		}
	
		return suite; //Returns the Suite of the card
			}
			
		
		$("document").ready(function() {
		deckShuffle(); //Shuffle Deck
		$("#pturn").html(turn); //Codes below just show the users whose turn it is and the scores of Player1 and Player2
		$("#p1").html(P1);
		$("#p2").html(P2);
			
		$("button#dealMe").click(function(){ //The deal me button is clicked
		deal(); //Deal function
		$("button#dealMe").hide(); //Hides the button as the deal button is only needed once
		});
			
		$("button#changeName").click(function(){
			P1Name = $("input#inputP1").val();
			P2Name = $("input#inputP2").val();
			$("label#p1name").html(P1Name);
			$("label#p2name").html(P2Name);
			$("div#changey").hide();  //Change name is only needed once per session so it is hidden afterwards
		});
			
		$("button#Draw").click(function(){ //A user wants to draw a card
			if(cardsInDeck.length === 0) //Probably not needed, but will be useful incase game goes on until deck is empty for future variants.
			{
				alert("Deck is empty! Reshuffling deck."); 
				deckShuffle();
				$("#result").html("Deck reshuffled~");
			}
			
			else{
			cardDrew = draw(); //Draws a random card from the deck
			cardValue = convertCard(cardDrew); //Gets the cards BlackJack value
			suite = getSuite(cardDrew); //Gets the cards suite
			var playerMoving; //Says which player is moving/whose turn it is~
			if(turn ==1)
			{
				playerMoving = P1Name;
			}
			else
			{
				playerMoving = P2Name;
			}
			$("#result").html(playerMoving + " drew a card " + cardDrew + " with a Suite of " + suite + " and a value of " + cardValue + ". There are now " + cardsInDeck.length + " cards left in deck now. " + "<!-- This code is for testing purposes only <br>The remaining values in the deck are: " +cardsInDeck.toString() + "-->");
			//Returns the results of a Players Draw
			if(turn == 1) //If its player 1s turn
			{
				p1Cards++;
				turn++; //Make it Player 2s turn
				P1 += cardValue; //Player 1s score is updated with the value of the card drawn
				P1 = Ace(P1); //Checks to see if Player 1 has atleast one Ace and there is a better score for Player 1 to use
				$("#p1").html(P1); //Updates Player 1s score
				over(P1); //Checks to see if a winner/loser is revealed from the score
			}
			else
			{
				p2Cards++;
				turn--;
				P2 += cardValue;
				P2 = Ace(P2);
				$("#p2").html(P2);
				over(P2);
			}
			}
			$("#pturn").html(turn); //Shows players whose turn it is now 
			// This was for testing/debugging purposes.$("#noAces1").html(p1RevealedAces); 
			// This was for testing/debugging purposes.$("#noAces2").html(p2RevealedAces); 
			// This was for testing/debugging purposes. alert("Player 1 has "+ p1Cards + " cards. Player 2 has "+ p2Cards + " cards.");
			});
		$("button#endofTurn").click(function(){ //When someone doesn't want to move 
			if(turn == 1) //If its Player 1s turn...
			{
			turn++; //Make it Player 2s turn....
			}
			else 
			{
			turn--;
			}
			$("#pturn").html(turn);	
			
			if(endedTurn == "false") //If the other player didn't end their turn as their last move
			{
				endedTurn = "true";
			}
			else //If the other player did end their turn as well then game is over and the one with a higher value wins
			{
				valueCompare();
			}
			});
		});
		
		
    </script>
</head>
<body>
    <main class="mdl-layout__content">
	<span class="fName">  Angelo </span><span class = "lName"> Villadolid </span>
	<img src="Images/Header.png" id="headBanner"><br><br>
    <div class="page-content" style="padding-left: 30px;">
	<div id ="changey">
	Player 1 Name: <input type="text" id = "inputP1" value="Player 1"></input><br><br>
	<button id="changeName">Change Names</button>
	
	<br><br>
	</div>
	Turn: <label id ="pturn"></label>
	<br>
	<label id ="p1name">Player 1 </label> Total: <label id ="p1"></label>
	<br>
	<label id ="p2name">Player 2 </label> Total: <label id ="p2"></label>
	
	<br><br><br>
    <button id="Draw">Draw a Card</button>
	<button id="endofTurn">End of Turn</button>
	<button id="dealMe">Deal Me</button>
	<div id = "result"></div>
	 <!-- The following code is for testing purposes only. <br><br><br><label id ="noAces1"> </label> 
<br><label id ="noAces2"> </label> -->
		</div>
      </main>
</body>
</html>
