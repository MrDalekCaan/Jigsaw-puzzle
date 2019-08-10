var imgArea = $(".imgArea");
var imgAreaWidth = parseInt(imgArea.css("width"));
var imgAreaHeight = parseInt(imgArea.css("height"));
var cellWidth = imgAreaWidth / 3;
var cellHeight = imgAreaHeight / 3;
var $imgCell;
var oriArr = [];
var ranArr = [];
var flag = true;

init();

function init() {
	imgSplit();
	gameState();
}

function imgSplit() {
	var cell;
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			oriArr.push(i * 3 + j);
			cell = $('<div class="imgCell"></div>');
			$(cell).css({
				width: cellWidth + "px",
				height: cellHeight + "px",
				left: cellWidth * j,
				top: cellHeight * i,
				backgroundPosition:
					-cellWidth * j + "px " + -cellHeight * i + "px"
			});
			imgArea.append(cell);
		}
	}
	$imgCell = $(".imgCell");
}

function gameState() {
	$(".start").on("click", function() {
		if (flag) {
			$(this).text("restore");
			flag = false;
			ranArr = randomArr(ranArr);
			cellOrder(ranArr);
			$imgCell.on("mousedown", function(event) {
				event = event || window.event;
				event.preventDefault();
				var index1 = $(this).index();
				var left = event.pageX - $imgCell.eq(index1).offset().left;
				var top = event.pageY - $imgCell.eq(index1).offset().top;
				$(document)
					.on("mousemove", function(event) {
						$imgCell.eq(index1).css({
							"z-index": "40",
							left:event.pageX -left -imgArea.offset().left +"px",
							top: event.pageY - top - imgArea.offset().top + "px"
						});
					})
					.on("mouseup", function(event) {
						var left = event.pageX - imgArea.offset().left;
						var top = event.pageY - imgArea.offset().top;
						var index2 = changeIndex(left, top, index1);
						if (index1 == index2) {
							cellReturn(index1);
						} else {
							cellChange(index1, index2);
						}
						$(document)
							.off("mousemove")
							.off("mouseup");
					});
			});
		} else {
			$(this).text("start");
			flag = true;
			cellOrder(oriArr);
			$imgCell
				.off("mousedown")
				.off("mousemove")
				.off("mouseup");
		}
	});
}

function randomArr(arr) {
	arr = [];
	var len = oriArr.length;
	for (var i = 0; i < len; i++) {
		order = Math.floor(Math.random() * len);
		if (arr.length > 0) {
			while ($.inArray(order, arr) > -1) {
				order = Math.floor(Math.random() * len);
			}
		}
		arr.push(order);
	}
	return arr;
}

function cellOrder(arr) {
	var len = arr.length;
	for (var i = 0; i < len; i++) {
		$imgCell
			.eq(i)
			.animate(
				{
					left: (arr[i] % 3) * cellWidth + "px",
					top: Math.floor(arr[i] / 3) * cellHeight + "px"
				},
				400
			);
	}
}

function changeIndex(x, y, i) {
	if (x < 0 || x > imgAreaWidth || y < 0 || y > imgAreaHeight) {
		return i;
	}
	var row = Math.floor(y / cellHeight);
	var col = Math.floor(x / cellWidth);
	var location = row * 3 + col;
	var i = 0,
		len = ranArr.length;
	while (i < len && ranArr[i] !== location) {
		i++;
	}
	return i;
}

function cellReturn(index) {
	var i = Math.floor(ranArr[index] / 3);
	var j = ranArr[index] % 3;
	$imgCell
		.eq(index)
		.animate(
			{ left: j * cellWidth + "px", top: i * cellHeight + "px" },
			400,
			function() {
				$(this).css("z-index", "10");
			}
		);
}
function cellChange(from, to) {
	var fromI = Math.floor(ranArr[from] / 3);
	var fromJ = ranArr[from] % 3;
	var toI = Math.floor(ranArr[to] / 3);
	var toJ = ranArr[to] % 3;
	var temp = ranArr[from];
	$imgCell
		.eq(from)
		.animate(
			{ left: toJ * cellWidth + "px", top: toI * cellHeight + "px" },
			400,
			function() {
				$(this).css("z-index", "10");
			}
		);
	$imgCell
		.eq(to)
		.animate(
			{ left: fromJ * cellWidth + "px", top: fromI * cellHeight + "px" },
			400,
			function() {
				$(this).css("z-index", "10");
				ranArr[from] = ranArr[to];
				ranArr[to] = temp;
				check();
			}
		);
}
function check() {
	if (oriArr.toString() == ranArr.toString()) {
		alert("right");
		$(".start").text("start");
		flag = true;
	}
}
