export class Player extends Phaser.GameObjects.Sprite
{

    constructor(scene: Phaser.Scene, x: number, y: number, frame?: string | number)
    {
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
        this.setOrigin(0, 0);
        this.setInteractive();
    }

    private boosting() {
        
    }

    addedToScene(): void {
        super.addedToScene();
    }

    removedFromScene(): void {
        super.removedFromScene();
    }
}