import { Scene } from 'phaser';
import { Player } from '../Objects/Player';
import { InputManager } from '../Managers/InputManager';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.TileSprite;
    inputManager: InputManager;
    msg_text: Phaser.GameObjects.Text;
    player: Player;

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        this.background = this.add
            .tileSprite(
                this.camera.midPoint.x,
                this.camera.midPoint.y,
                this.camera.width,
                this.camera.height,
                'background',
            )
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0);

        this.inputManager = new InputManager(this);

        this.player = new Player(this, 0, 0);
        this.camera.startFollow(this.player, true, 1, 1);
    }

    update(time: number, delta: number): void {
        this.background.tilePositionX = this.camera.scrollX;
        this.background.tilePositionY = this.camera.scrollY;

        // Handles acceleratio
        if (this.inputManager.isAccelerating()) this.player.accelerate(delta);
        else this.player.stopAccelerate();

        this.player.rotate(this.inputManager.getRotateValue(), delta);
        this.player.move(delta);
        this.player.aimCannon(
            this.inputManager.weaponAngle(this.player) ??
                this.player.getCannonAngle(),
        );
    }
}
