export class Player extends Phaser.GameObjects.Sprite {
    private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    private maxVelocity: number = 800;
    private acceleration: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    private accelerationRate: number = 300;
    private direction: Phaser.Math.Vector2;
    private rotationRate: number = 3;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        frame?: string | number,
    ) {
        // Set up sprite display
        const hitbox = new Phaser.Geom.Triangle();
        super(scene, x, y, 'shipSheet', 'shipIdle');
        this.scene.anims.create({
            key: 'boost',
            frames: this.scene.anims.generateFrameNames('shipSheet', {
                prefix: 'shipBoost',
                start: 0,
                end: 1,
            }),
            frameRate: 2,
            repeat: -1,
        });
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('shipSheet', {
                prefix: 'shipIdle',
                start: 0,
                end: 0,
            }),
            frameRate: 0,
            repeat: -1,
        });

        // Lets player be updated
        this.addToUpdateList();

        // Displays player on the screen
        this.addToDisplayList();

        // Visual Settings
        this.setScale(1);
        this.setOrigin(0.5, 0.5);
        this.setInteractive();
        this.setPosition(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
        );

        // Corrects rotation to be facing top of the screen
        this.rotation = -Math.PI / 2;

        this.direction = new Phaser.Math.Vector2(
            Math.cos(this.rotation),
            Math.sin(this.rotation),
        );
    }

    /**
     * Accelerates the player using a fixed acceleration rate
     *
     * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    public accelerate(delta: number) {
        // Plays boosting animation
        this.anims.play('boost', true);

        // Finds direction and applies acceleration depending on delta (time passed)
        this.direction.setTo(Math.cos(this.rotation), Math.sin(this.rotation));
        this.acceleration
            .copy(this.direction)
            .scale((this.accelerationRate * delta) / 1000);
        this.velocity.add(this.acceleration);

        // Ensure velocity doesn't get too fast
        if (this.velocity.length() > this.maxVelocity)
            this.velocity = this.velocity.normalize().scale(this.maxVelocity);
    }

    /**
     * Plays the idle animation for our player
     */
    public stopAccelerate() {
        this.anims.play('idle', true);
    }

    /**
     * Rotates the player model in a given direction
     *
     * @param input The direction and speed at which to rotate the player, -1.0 to 1.0, Positive is right, negative is left
     * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    public rotate(input: integer, delta: number) {
        if (input > 0.1) {
            this.rotation += (input * this.rotationRate * delta) / 1000;
        } else if (input < -0.1) {
            this.rotation += (input * this.rotationRate * delta) / 1000;
        }
    }

    /**
     * Moves the player based on currently stored velocity
     *
     * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    public move(delta: number) {
        this.x += (this.velocity.x * delta) / 1000;
        this.y += (this.velocity.y * delta) / 1000;
    }

    addedToScene(): void {
        super.addedToScene();
    }

    removedFromScene(): void {
        super.removedFromScene();
    }
}
