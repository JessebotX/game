export class Player extends Phaser.GameObjects.Sprite
{

    constructor(scene: Phaser.Scene, x: number, y: number, frame?: string | number)
    {
        const hitbox = new Phaser.Geom.Triangle
        super(scene, x, y, 'ship', frame);
        this.addToUpdateList();
        this.addToDisplayList();
        this.setScale(0.25);
        this.setOrigin(0, 0);
        this.setInteractive();
    }

    addedToScene(): void {
        super.addedToScene();
    }

    removedFromScene(): void {
        super.removedFromScene();
    }
}