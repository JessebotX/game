interface plane {
    x: number,
    y: number
}

export class Player extends Phaser.GameObjects.Sprite
{
    public velocity: plane
    private acceleration: plane

    constructor(scene: Phaser.Scene, x: number, y: number, frame?: string | number)
    {
        // Set up sprite display
        const hitbox = new Phaser.Geom.Triangle
        super(scene, x, y, 'shipSheet', 'shipIdle');
        this.scene.anims.create({
            key: 'boost',
            frames: this.scene.anims.generateFrameNames('shipSheet', {prefix: 'shipBoost', start: 0, end: 1}),
            frameRate: 2,
            repeat: -1
        });
        this.addToUpdateList();
        this.addToDisplayList();
        this.setScale(0.25);
        this.setOrigin(0.5, 0.5);
        this.setInteractive();
        this.setPosition(this.scene.cameras.main.width / 2, this.scene.cameras.main.height /2);

        // Set up movement variables
        this.velocity = {x: 0, y: 0};
        this.acceleration = {x: 0, y: 0}
    }

    public boosting(delta: number) {
        if (!this.anims.isPlaying)
            this.anims.play('boost', true);
        if (this.acceleration.x < 0.3) 
            this.acceleration.x += 0.001;
        if (this.acceleration.y < 0.3)
            this.acceleration.y += 0.001;

        if (this.velocity.x < 1.0)
            
        if (this.velocity.y < 1.0)
            this.velocity.y += this.acceleration.y;
    }

    /**
     * Rotates the player model in a given direction
     * 
     * @param dir The direction to rotate the player, 0 is left, 1 is right
     * @param speed The speed at which the player rotates, 0.0 - 1.0
     */
    public rotate(dir: integer, speed: number) {
        if (dir === 0) {
            this.rotation += speed;
        }
        else {
            this.rotation -= speed;
        }
    }

    addedToScene(): void {
        super.addedToScene();
    }

    removedFromScene(): void {
        super.removedFromScene();
    }
}