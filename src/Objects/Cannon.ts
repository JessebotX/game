export class Cannon extends Phaser.GameObjects.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        frame?: string | number,
    ) {
        super(scene, x, y, 'cannon');
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
    }
}
