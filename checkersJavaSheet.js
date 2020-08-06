//bug multiple pieces with a jump
/*jslint browser: true*/
/*global $, jQuery, alert*/
/* eslint-env browser */
var turn = 0;
var arrayOfJumpers = [];	
var jumpExist = false;
var highlightedBoxes = [];
var blackCount = 12;
var redCount = 12;
//returns a list of neighboring boxes for a piece being moved
function returnNeighbors(p)
{
	var parentBox = p.parentElement;
	var boxNum = parentBox.id;
	var potenOne = null;
	var potenTwo = null;
	var pieceColor = -1;
	boxNum = boxNum.slice(3,boxNum.length);
	boxNum = parseInt(boxNum);
	if((boxNum+1)%8==0)
	{
		if((p.className=="redPiece" && turn == 1) || (p.className=="blackPiece" && turn == 1))
			pieceColor = 7;
		if((p.className=="blackPiece" && turn == 0) || (p.className=="redPiece" && turn == 0))
			pieceColor = -9;
		potenOne = boxNum + pieceColor;
	}
	else if(boxNum==0 || boxNum%8==0)
	{
		if((p.className=="redPiece" && turn == 1) || (p.className=="blackPiece" && turn == 1))
			pieceColor = 9;
		if((p.className=="blackPiece" && turn == 0) || (p.className=="redPiece" && turn == 0))
			pieceColor = -7;
		potenTwo = boxNum + pieceColor;
	}
	else
	{
		if((p.className=="redPiece" && turn == 1) || (p.className=="blackPiece" && turn == 1))
			pieceColor = 1;
		if((p.className=="blackPiece" && turn == 0) || (p.className=="redPiece" && turn == 0))
			pieceColor = -1;
		potenOne = boxNum + (7 * pieceColor);
		potenTwo = boxNum + (9 * pieceColor);
	}
	if(p.className!="redKing" && p.className!="blackKing")
	{
		if(potenOne<63 && potenOne>0 && potenTwo<63 && potenTwo>0)
			return [potenOne, potenTwo];
		else if(potenOne<63 && potenOne>0)
			return [potenOne, null];
		else if(potenTwo<63 && potenTwo>0)
			return [null, potenTwo];
		else
			return [null, null];
	}
	else
	{
		var a = boxNum - 9;
		var b = boxNum  - 7;
		var c = boxNum + 7;
		var d = boxNum + 9;
		if(!(a<63&&a>0))
			a=null;
		if(!(b<63&&b>0))
			b=null;
		if(!(c<63&&c>0))
			c=null;
		if(!(d<63&&d>0))
			d=null;
		return [a,b,c,d];
	}
}

//returns the min of a and b for checking neighbor boxes
function findMin(a,b)
{
	if(a!=null && b!=null)
	{
	if(a<b)
		return a;
	if(b<a)
		return b;
	}
	if(b==null)
		return a;
	return null;
}

//returns the max of a and b for checking neighbor boxes
function findMax(a,b)
{
	if(a!=null && b!=null)
	{
	if(a>b)
		return a;
	if(b>a)
		return b;
	}
	if(a==null)
		return b;
	return null;
}

//returns a list of jumps available for a particular piece(looped through in checkJump)
function returnJumpers(pID)
{
	var root = document.getElementById("piece"+pID);
	if(root!=null)
	{
		var neighbors = returnNeighbors(root);
		var smallNeighbor = findMin(neighbors[0],neighbors[1]);
		var bigNeighbor = findMax(neighbors[0],neighbors[1]);
		var a = checkSmall(root, smallNeighbor);
		var b = checkBig(root, bigNeighbor);
		if(root.className=="redKing"||root.className=="blackKing")
		{
			smallNeighbor = findMin(neighbors[2],neighbors[3]);
			bigNeighbor = findMax(neighbors[2],neighbors[3]);
			var c = checkSmall(root, smallNeighbor);
			var d = checkBig(root, bigNeighbor);
			if(a||b||c||d)
				return true;
		}
		if(a||b)
			return true;
	}
	return false;
}
function checkSmall(root, small)
{
	var par = root.parentElement;
	var rootColor = null;
	if(root.className=="redPiece"||root.className=="redKing")
		rootColor="red";
	if(root.className=="blackPiece"||root.className=="blackKing")
		rootColor="black";
	if(small!=null&&(small%8!=0))
	{
		var smallNeighbor = document.getElementById("box" + small);
		if(smallNeighbor.childElementCount!=0 && smallNeighbor.lastChild.className!=(rootColor+"Piece")&&smallNeighbor.lastChild.className!=(rootColor+"King"))
		{
			var diff = small - parseInt((par.id.substring(3, par.id.length)));
			var newBox = small + diff;
			var smallestNeighbor = document.getElementById("box"+newBox);
			if(smallestNeighbor!=null && smallestNeighbor.childElementCount==0)
			{
				arrayOfJumpers.push([par.id.substring(3,par.id.length), small, newBox]);
				highlightedBoxes.push(newBox);
				return true;
			}
		}
	}
	return false;
}
function checkBig(root, big)
{
	var par = root.parentElement;
	var rootColor = null;
	if(root.className=="redPiece"||root.className=="redKing")
		rootColor="red";
	if(root.className=="blackPiece"||root.className=="blackKing")
		rootColor="black";
	if(big!=null&&((big+1)%8!=0))
	{
		var bigNeighbor = document.getElementById("box" + big);
		if(bigNeighbor.childElementCount!=0 && bigNeighbor.lastChild.className!=(rootColor+"Piece")&&bigNeighbor.lastChild.className!=(rootColor+"King"))
		{
			var diff = big - parseInt((par.id.substring(3, par.id.length)));
			var newBox = big + diff;
			var biggestNeighbor = document.getElementById("box"+newBox);
			if(biggestNeighbor!=null && biggestNeighbor.childElementCount==0)
			{
				arrayOfJumpers.push([par.id.substring(3,par.id.length), big, newBox]);
				highlightedBoxes.push(newBox);
				return true;
			}
		}
	}
	return false;
}
//function checks if there are any jumps available for current player of currentTurn
function checkJump(currentTurn)
{
	var i;
	jumpExist = false;
	var temp;
	arrayOfJumpers=[];
	if(currentTurn==1)
	{
		for(i=1; i<32; i++)
		{
			temp = returnJumpers(i);
			if(jumpExist==false)
				jumpExist=temp;
		}
	}
	else
	{
		for(i=33; i<64; i++)
		{
			temp = returnJumpers(i);
			if(jumpExist==false)
				jumpExist=temp;		
		}
	}
	for(i=0; i<highlightedBoxes.length; i++)
		highlightColor(document.getElementById("box"+highlightedBoxes[i]));
}

//function returns the box the piece is hovering over
function checkBox(p)
{
	//gets middle point of piece
	var midpointX = ((p.getBoundingClientRect().width)/2)+p.getBoundingClientRect().left;
	var midpointY = ((p.getBoundingClientRect().height)/2)+p.getBoundingClientRect().top;
	for(var i=0; i<64; i++)
	{
		//iteratively setting bx to each box on board
		var bx = document.getElementById("box" + i.toString());
		//comparing midpoint to edges of box 
		if(bx.className!="red" && midpointX<bx.getBoundingClientRect().right && midpointX > bx.getBoundingClientRect().left && midpointY > bx.getBoundingClientRect().top && midpointY < bx.getBoundingClientRect().bottom && bx.childElementCount==0)
		{
			var idNum= p.parentElement.id.slice(3,p.parentElement.id.length);
			if((i > idNum)&&(p.className=="redPiece"))
			{
				return bx;
			}
			else if((i < idNum)&&(p.className=="blackPiece"))
			{
				return bx;
			}
			else if(p.className=="blackKing"||p.className=="redKing")
				return bx;
		}
	}
	return null;
}

//function highlights the background of neighbor boxes of pOne
function highlightBox(pOne, boxes)
{
	if(pOne.className!="redKing" && pOne.className!="blackKing")
	{
		var pBoth = returnNeighbors(pOne);
		var potenOne = pBoth[0];
		var potenTwo = pBoth[1];
		var newBox = null;
		if(potenOne!=null)
		{
			newBox = document.getElementById("box" + potenOne.toString());
			if(newBox.childElementCount==0)
			{
				highlightColor(newBox);
				boxes.push(potenOne);
			}
		}
		if(potenTwo!=null)
		{
			newBox = document.getElementById("box" + potenTwo.toString());
			if(newBox.childElementCount==0)
			{
				highlightColor(newBox);
				boxes.push(potenTwo);
			}
		}
	}
	else
	{
		var newBox = null;
		var n = returnNeighbors(pOne);
		for(var i=0; i<4; i++)
		{
			if(n[i]!=null)
			{
				newBox = document.getElementById("box" + n[i].toString());
				if(newBox.childElementCount==0)
				{
					highlightColor(newBox);
					boxes.push(n[i]);
				}
			}
		}
	}
}

// function highlights background of a box
function highlightColor(box)
{
	box.style.backgroundImage =  "URL('highlightBack.jpg')";
}

//unhighlights background of each box in boxes
function unHighlight(boxes)
{
	if(boxes!=undefined)
	{
		for(var i=0; i<boxes.length; i++)
		{
			var secondBox = document.getElementById("box"+boxes[i]);
			secondBox.style.backgroundImage = "URL('blackBack.jpg')";
		}
		boxes.length=0;
	}
}

//returns true or false if the piece is a highlighted box
function containsBox(piece, boxes, box)
{
	for(var i=0; i<boxes.length; i++)
	{
		if((boxes[i]==box)&&jumpExist&&(arrayOfJumpers[i][2]==box)&&(arrayOfJumpers[i][0]==piece.parentElement.id.substring(3,piece.parentElement.id.length)))
		{
			var child = document.getElementById("box"+arrayOfJumpers[i][1]).lastChild;
			if(child.className=="redPiece"||child.className=="redKing")
				redCount--;
			else if(child.className=="blackPiece"||child.className=="blackKing")
				blackCount--;
			if(blackCount==0)
			{
				document.getElementById("board").parentElement.removeChild(document.getElementById("board"));
				document.getElementById("win").innerHTML = "Black Wins!";
			}
			else if(redCount==0)
			{
				document.getElementById("board").parentElement.removeChild(document.getElementById("board"));
				document.getElementById("win").innerHTML = "Red Wins!";
			}
			document.getElementById("box"+arrayOfJumpers[i][1]).removeChild(document.getElementById("box"+arrayOfJumpers[i][1]).lastChild);
			return true;
		}
		else
		{
			 if(boxes[i] == box && jumpExist == false)
				return true;
		}
	}
	return false;
}

function checkIfKing(piece)
{
	var e = document.getElementById("piece"+piece);
	var parID = e.parentElement.id.substring(3,e.parentElement.id.length);
	if(e.className!="redKing"&&e.className!="blackKing")
	{
			if(e.className=="redPiece" && parID>55)
			{
				e.style.backgroundImage =  "URL('redKing.png')";
				e.className = "redKing";
			}
			else if(e.className=="blackPiece" && parID<8)
			{
				e.style.backgroundImage =  "URL('blackKing.png')";
				e.className = "blackKing";
			}
	}	
}
//initializes the board, divs with pieces and boxes
function makeBoard()
{
	document.getElementById("startgame").parentElement.removeChild(document.getElementById("startgame"));
	var checkersBoard = document.getElementById("board");
	var size = parseInt(document.getElementById("boardscript").getAttribute("data-name"));
	var row = 1;
	checkersBoard.style.height = size+"px";
	checkersBoard.style.width = size+"px";
	for(var i=0; i<64; i++)
	{
		var box = document.createElement("div");
		var piece = document.createElement("div");
		var leftval = 0;
		var topval = 0;
		piece.style.width = piece.style.height = size*.125 + "px";
		piece.id = "piece" + i;
		
		box.id = "box" + i.toString();
		
		if(i+1<25 && i>0)
		{					
			piece.className = "redPiece";
		}
		
		if(i+1<64 && i>39)
		{
			piece.className = "blackPiece";
		}
		
		piece.style.backgroundSize = "100%";
		
		if(row%2==0)																																								
		{
			if((i+2)%2==0)
			{
				box.className = "black";
				checkersBoard.appendChild(box);
				
				if(i+1<25 && i>0 || i+1<64 && i>39)
				{
					
					leftval = box.getBoundingClientRect().left;
					piece.style.left = leftval + "px";
					topval = box.getBoundingClientRect().top;
					piece.style.top = topval + "px";
					box.appendChild(piece);
					
				}
				
			}
			else
			{
				box.className = "red";
				checkersBoard.appendChild(box);
			}
			
		}
		else 
		{
			if((i+2)%2==0)
			{
				box.className = "red";
				checkersBoard.appendChild(box);
			}
			else
			{
				box.className = "black";
				checkersBoard.appendChild(box);
				if(i+1<25 && i>0 || i+1<64 && i>39)
				{
					leftval = box.getBoundingClientRect().left;
					piece.style.left = leftval + "px";
					topval = box.getBoundingClientRect().top;
					piece.style.top = topval + "px";
					box.appendChild(piece);
				}
				
			}
		}
		if((i+1)%8==0)
			row++;
		//when mouse pressed down on piece
		piece.onmousedown = function(event) 
		{
			//piece being moved
			var pieceUsed = event.target;
			//checking to make sure correct piece being moved based on turn
			if(((pieceUsed.className=="redPiece")&&(turn==1))|| ((pieceUsed.className=="blackPiece")&&(turn==0)) || ((pieceUsed.className=="redKing")&&(turn==1)) || ((pieceUsed.className=="blackKing")&&(turn==0)))
			{
				pieceUsed.style.zIndex = 10;
				if(jumpExist==false)
					highlightBox(pieceUsed, highlightedBoxes);
				document.addEventListener("mousemove", moveDiv); 
				//moves piece position when cursor moves
				function moveDiv(e)
				{
					pieceUsed.style.left = e.pageX - pieceUsed.offsetWidth / 2 + "px";
					pieceUsed.style.top = e.pageY - pieceUsed.offsetHeight / 2 + "px";
				}
				//when mouse released from piece
				pieceUsed.onmouseup = function()
				{
					var temp = highlightedBoxes;
					//bring piece z index to normal and remove listener for acutal movement
					document.removeEventListener("mousemove", moveDiv);
					pieceUsed.style.zIndex = 2;
					//check if piece is in x and y of a box
					var boxIn = checkBox(pieceUsed);
					//check if box is a highlighted box
					if((boxIn!=null)&&(containsBox(pieceUsed, highlightedBoxes, boxIn.id.substring(3,boxIn.id.length)))==true)
					{
						//move piece
						pieceUsed.style.left = (boxIn.getBoundingClientRect().left+window.scrollX) + "px";
						pieceUsed.style.top = (boxIn.getBoundingClientRect().top+window.scrollY) + "px";
						pieceUsed.parentElement.lastChild = null;
						boxIn.appendChild(pieceUsed);
						//if after a jump, check to see if another jump
						if(jumpExist==true)
							checkJump(turn);
						//if no jump exists switch turns
						if(jumpExist==false)
							turn=!turn;
						//check if after move the piece becomes a king
						checkIfKing(pieceUsed.id.substring(5,pieceUsed.id.length));
					}
					else
					{
						//move piece back to original box
						pieceUsed.style.left = (pieceUsed.parentElement.getBoundingClientRect().left+window.scrollX) + "px";
						pieceUsed.style.top = (pieceUsed.parentElement.getBoundingClientRect().top+window.scrollY) + "px";
					}
					//for a move that is not a jump, unhighlight boxes and check if jump exists for new position
					unHighlight(temp);
					checkJump(turn);
					pieceUsed.onmouseup = null;
				};
				//disbale ondragstart function
				pieceUsed.ondragstart = function() {
				return false;
				};
			}
		};
	}
}
