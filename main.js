// Create our 'main' state that will contain the game
var mainState = {
    preload: function () {
        // Load the bird sprite
        game.load.image('bird', 'assets/bird.png');
        // Load the bird sprite
        game.load.image('back', 'assets/back.png');
        // Load the pipe sprite
        game.load.image('pipe', 'assets/pipe.png');
        // Load sound
        game.load.audio('up', 'assets/up.wav');
    },

    create: function () {
        // Velocidade
        this.velocidade = -200;

        // Distancia
        this.distancia = 1400;

        this.upSound = game.add.audio('up');
        // Change the background color of the game to blue
        game.stage.backgroundColor = '#71c5cf';

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 200, 'bird');

        // Create an empty group
        this.pipes = game.add.group();

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        // Call the 'up' function when the upKey is hit
        var upKey = game.input.keyboard.addKey(
            Phaser.Keyboard.UP);
        upKey.onDown.add(this.up, this);

        // Call the 'down' function when the upKey is hit
        var downKey = game.input.keyboard.addKey(
            Phaser.Keyboard.DOWN);
        downKey.onDown.add(this.down, this);

        // Timer
        this.timer = game.time.events.loop(this.distancia, this.addRowOfPipes, this);

        // Score
        this.score = 0;
        // Show Score
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Arial", fill: "#ffffff" });

        // Show Instrution
        this.instrution = game.add.text(20, 400, "↑ Jump \n↓ Ride",
            { font: "20px Arial", fill: "#ffffff" });
        // Move the anchor to the left and downward
        this.bird.anchor.setTo(0.5, 0);
    },

    update: function () {
        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 490)
            this.restartGame();
        //Restart Game
        game.physics.arcade.overlap(
            this.bird, this.pipes, this.hitPipe, null, this);

        // Rotate object
        if (this.bird.angle < 60)
            this.bird.angle += 1;

    },
    // Make the bird up 
    up: function () {
        this.upSound.play();
        if (this.bird.alive == false)
            return;
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -300;

        // Create an animation on the bird
        game.add.tween(this.bird).to({
            angle: 10
        }, 50).start();
        this.velocidade += -1;
        this.distancia += 0.5;
    },
    // Make the bird up 
    down: function () {
        this.upSound.play();
        if (this.bird.alive == false)
            return;
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = 300;

        // Create an animation on the bird
        game.add.tween(this.bird).to({
            angle: 30
        }, 50).start();
    },

    // Restart the game
    restartGame: function () {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
    addOnePipe: function (x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe 
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = this.velocidade;


        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function () {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);

        // Socre increments
        this.score += 1;
        this.labelScore.text = this.score;
    },
    hitPipe: function () {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function (p) {
            p.body.velocity.x = 100;
        }, this);
    },
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');