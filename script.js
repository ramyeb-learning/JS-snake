window.onload = function() {

    var CanvasWidth = 900;
    var CanvasHeigth = 600;
    var blockSize = 30;
    var ctx;
    var delay = 200;
    var snake1;
    var apple1;
    var widthInBlocks = CanvasWidth / blockSize;
    var heightInBlocks = CanvasHeigth / blockSize;
    var score;
    var timeout;


    init();

    /**
     * Function init
     * Create the canvas and initialize the snake
     */
    function init() {
        var canvas = document.createElement('canvas');
        canvas.width = CanvasWidth;
        canvas.height = CanvasHeigth;
        canvas.style.border = " 30px solid gray ";
        canvas.style.margin = " 50px auto ";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#201e1f";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snake1 = new Snake([
            [8, 4],
            [7, 4],
            [6, 4]
        ], "right");
        apple1 = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }

    /**
     * Function refreshCanvas
     * Clear the canvas and draw the snake
     */
    function refreshCanvas() {
        snake1.advance();
        if (snake1.snakeCollision()) {
            gameOver();

        } else {
            if (snake1.IsEattingApple(apple1)) {
                delay -= 5;
                score++;
                do {
                    apple1.setNewPosition();
                } while (apple1.isOnSnake(snake1))
            }
            ctx.clearRect(0, 0, CanvasWidth, CanvasHeigth);
            drawScore();
            snake1.draw();
            apple1.draw();
            timeout = setTimeout(refreshCanvas, delay);
        }
    }

    /**
     * Function drawBlock
     * arg ctx : context
     * arg position : 
     * draw each element of the snake
     */
    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function drawScore() {
        ctx.save();
        ctx.font = "bold 100px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center"
        ctx.textBaseline = "middle";
        var centreX = CanvasWidth / 2;
        var centreY = CanvasHeigth / 2;

        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    function restart() {
        clearTimeout(timeout);
        snake1 = new Snake([
            [8, 4],
            [7, 4],
            [6, 4]
        ], "right");
        apple1 = new Apple([10, 10]);
        score = 0;
        delay = 200;
        refreshCanvas();

    }

    function gameOver() {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center"
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        var centreX = CanvasWidth / 2;
        var centreY = CanvasHeigth / 2;

        ctx.lineWidth = 5;
        ctx.fillText("Game Over", centreX, centreY - 120);
        ctx.font = "bold 40px sans-serif";

        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY + 120);
        drawScore();

        ctx.restore();
    }

    /**
     * Function Snake
     * Contain all the proprieties of the snake
     * arg body : array of positions
     */
    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#ff4000";
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        }

        this.snakeCollision = function() {
            collision = false;
            var snakeHead = this.body[0];
            var snakeBody = this.body.slice(1);

            for (var i = 0; i < snakeBody.length; i++) {
                if (snakeHead[0] == snakeBody[i][0] && snakeHead[1] == snakeBody[i][1]) {
                    collision = true;
                }
            }

            return collision;
        }

        this.IsEattingApple = function(Apple) {
            var snakeHead = this.body[0];
            if (snakeHead[0] == Apple.position[0] && snakeHead[1] == Apple.position[1]) {
                this.ateApple = true;
                return true;
            } else {
                return false;
            }
        }

        this.advance = function() {
            this.snakeCollision();
            var nextPosition = this.body[0].slice();
            if (nextPosition[0] < 0 || nextPosition[0] >= widthInBlocks || nextPosition[1] < 0 || nextPosition[1] >= heightInBlocks) {
                if (nextPosition[0] < 0) {
                    nextPosition[0] = widthInBlocks - 1;
                } else if (nextPosition[0] >= widthInBlocks) {
                    nextPosition[0] = 0;
                } else if (nextPosition[1] < 0) {
                    nextPosition[1] = heightInBlocks - 1;
                } else if (nextPosition[1] >= heightInBlocks) {
                    nextPosition[1] = 0;
                }
            } else {
                switch (this.direction) {
                    case "left":
                        nextPosition[0]--;
                        break;
                    case "right":
                        nextPosition[0]++;
                        break;
                    case "up":
                        nextPosition[1]--;
                        break;
                    case "down":
                        nextPosition[1]++;
                        break;
                    default:
                        throw ("Invalid direction");
                }
            }
            this.body.unshift(nextPosition);
            if (!(this.ateApple)) {
                this.body.pop();
            } else {
                this.ateApple = false;
            }
        }

        this.setDirection = function(newDirection) {
            var allowDirections;
            switch (this.direction) {
                case "left":
                case "right":
                    allowDirections = ["up", "down"];
                    break;
                case "up":
                case "down":
                    allowDirections = ["left", "right"];
                    break;
                default:
                    throw ("Invalid direction");
            }
            if (allowDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }

        }

    }

    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fillStyle = "#50b2c0";
            ctx.fill();
            ctx.restore();
        }

        this.setNewPosition = function() {
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        }

        this.isOnSnake = function(snake) {
            for (var i = 0; i < snake.body.length; i++) {
                if (this.position[0] == snake.body[i][0] && this.position[1] == snake.body[i][1]) {
                    return true;
                }
            }
            return false;
        }
    }

    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snake1.setDirection(newDirection);
    }
}