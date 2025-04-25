// var player: Phaser.Types.Physics.Arcade.ArcadeColliderType;

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | number) {
        const hitbox = new Phaser.Geom.Triangle;
        super(scene, x, y, key, frame);
        this.addToUpdateList();
        this.addToDisplayList();
        this.setScale(1);
        // this.setOrigin(0, 0);
        this.setInteractive();
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    addedToScene(): void {
        super.addedToScene();
    }
    
    removedFromScene(): void {
        super.removedFromScene();
    }
}