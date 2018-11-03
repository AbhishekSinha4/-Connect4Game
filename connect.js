var cellSize=50,
	connect=4,
	numRows,
	numCols,
	cols,
	turn,
	filledColCount,
	gameBoard=document.querySelector("#game-board"),
	gameStatus=document.querySelector("#game-status"),
	startB=document.querySelector("#start"),
	restartB=document.querySelector("#restart"),
	undoB=document.querySelector("#undo"),
	endB=document.querySelector("#end"),
	board,
	oldBoard,
	lastAdded,
	winStatus=0,
	player1Score=0,
	player2Score=0;
startB.addEventListener("click",startGame);
restartB.addEventListener("click",startGame);
endB.addEventListener("click",removeGame);

function startGame(){
	gameBoard.innerHTML="";
	gameStatus.textContent="Game On!";
	var inputRows=document.querySelector("#num-rows").value;
	var inputCols=document.querySelector("#num-cols").value;
	if(inputRows>=5 && inputRows<=15 && inputCols>=5 && inputCols<=15){
		winStatus=0;
		playerSet();
		undoB.addEventListener("click",undo);
		board=[];
		oldBoard=[];
		turn=1;
		filledColCount=0;
		numRows=inputRows;
		numCols=inputCols;
		for(var i=0;i<numCols;i++){
			board.push([]);
			oldBoard.push([]);
			var column=document.createElement("div");
			column.classList.add("column");
			column.id="column_"+i;
			for(var j=numRows-1;j>=0;j--){
				var row=document.createElement("div");
				row.classList.add("cell");
				row.classList.add("row_"+j);
				row.id="cell_"+j+"_"+i;
				column.appendChild(row);
			}
			gameBoard.appendChild(column);
		}
		document.querySelector("#pre-start").style.display="none";
		document.querySelector("#post-start").style.display="block";
		createAnimations();
		cols=document.querySelectorAll(".column");
		for(var i=0;i<cols.length;i++){
			cols[i].addEventListener("click",coindrop);
		}
	}
}

function removeGame(){
	player1Score=0;
	player2Score=0;
	playerScoreSet();
	document.querySelector("#player_1").value="";
	document.querySelector("#player_2").value="";
	undoB.removeEventListener("click",undo);
	gameBoard.innerHTML="";
	document.querySelector("#num-rows").value="";
	document.querySelector("#num-cols").value="";
	document.querySelector("#pre-start").style.display="inline-block";
	document.querySelector("#post-start").style.display="none";
}

function coindrop(){
	oldBoard=board.map(function(a){return a.map(function(b){return b;});});
	var coinCol=parseInt(this.id.split('_')[1]);
	var coinRow=board[coinCol].length;
	if(coinRow<numRows){
		board[coinCol].push(turn);
		if(board[coinCol].length==numRows)filledColCount++;
		lastAdded=document.createElement("div");
		lastAdded.classList.add("coin");
		lastAdded.textContent="C4";
		lastAdded.setAttribute("style","bottom:"+cellSize*coinRow+"px; background:"+(turn===1?"rgb(190,0,0)":"yellow")+"; animation: place_"+coinRow+" 1s ease-in 1;");
		this.appendChild(lastAdded);
		winStatus=checkWin(coinRow,coinCol,turn);
		if(winStatus|| filledColCount>=numCols){
			endGame(winStatus,turn);
		}
		turn=(turn===1?-1:1);
	}
}

function playerSet(){
	var p1=document.querySelector("#player_1");
	var p2=document.querySelector("#player_2");
	document.querySelector("#player_1_name").textContent="Player 1";
	document.querySelector("#player_2_name").textContent="Player 2";
	if(p1.value!="")document.querySelector("#player_1_name").textContent=p1.value;
	if(p2.value!="")document.querySelector("#player_2_name").textContent=p2.value;
}

function playerScoreSet(){
	document.querySelector("#player_1_score").textContent=player1Score;
	document.querySelector("#player_2_score").textContent=player2Score;
}

function undo(){
	board=oldBoard.map(function(a){return a.map(function(b){return b;});});
	if(lastAdded!==undefined){
		lastAdded.parentNode.removeChild(lastAdded);
		lastAdded=undefined;
		turn=(turn===1?-1:1);
	}
	if(winStatus|| filledColCount==numCols){
		for(var i=0;i<cols.length;i++){
			cols[i].addEventListener("click",coindrop);
		}
		gameStatus.textContent="Game On!";
		if(turn===1 || filledColCount>=numCols)player1Score--;
		if(turn===-1 || filledColCount>=numCols)player2Score--;
		playerScoreSet();
		winStatus=0;
		if(filledColCount==numCols)filledColCount--;
	}
}

function endGame(winStatus,winner){
	gameStatus.textContent="Game Over! ";
	for(var i=0;i<cols.length;i++){
		cols[i].removeEventListener("click",coindrop);
	}
	if(winStatus){
		if(winner===1){
			gameStatus.textContent+="Player 1 Wins!";
			player1Score++;
		}
		else{
			gameStatus.textContent+="Player 2 Wins!";
			player2Score++;
		}
	}
	else{
		gameStatus.textContent+="Its a TIE!";
		player1Score++;
		player2Score++;
	}
	playerScoreSet();
}

function createAnimations(){
	var styleSheet=document.querySelector("style");
	for(var i=0;i<numRows;i++){
		styleSheet.innerHTML+="@keyframes place_"+i+"{0%{bottom: 100%;}70%{bottom: "+cellSize*i+"px;}85%{bottom: "+(cellSize*i+50)+"px;}100%{bottom: "+cellSize*i+"px;}}  ";
	}
}

function checkWin(r,c,val){
	if(r>=connect-1){
		var flag=0;
		for(var i=r;i>r-connect;i--){
			if(board[c][i]===val){
				flag++;
			}
		}
		if(flag===connect){
			console.log(1);
			return 1;
		}
	}

	
	for(var i=(c>=connect-1?c-connect+1:0),flag=0;i<(c<=numCols-connect?c+connect:numCols);i++){
		if(board[i].length<r+1)flag=0;
		if(board[i][r]===val)flag++;
		else flag=0;
		if(flag===connect){
			console.log(2);
			return 1;
		}
	}

	var flag=0;
	for(var i=c-1,j=r-1;i>c-connect && i>=0 && j>=0; i--,j--){
		if(board[i].length>=j+1){
			if(board[i][j]===val)flag++;
			else break;
		}
		else break;
	}
	for(var i=c+1,j=r+1;i<c+connect && i<numCols && j<numRows; i++,j++){
		if(board[i].length>=j+1){
			if(board[i][j]===val)flag++;
			else break;
		}
		else break;
		
	}
	if(flag+1===connect){
		console.log(3);
		return 1;
	}

	flag=0;
	for(var i=c-1,j=r+1;i>c-connect && i>=0 && j<numRows; i--,j++){
		if(board[i].length>=j+1){
			if(board[i][j]===val)flag++;
			else break;
		}
		else break;
		
	}
	for(var i=c+1,j=r-1;i<c+connect && i<numCols && j>=0; i++,j--){
		if(board[i].length>=j+1){
			if(board[i][j]===val)flag++;
			else break;
		}
		else break;
	}
	if(flag+1===connect){
		return 1;
	}

}
