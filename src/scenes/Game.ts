import { Scene } from 'phaser';
import { Player } from '../Objects/Player';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.TileSprite;
    msg_text: Phaser.GameObjects.Text;
    player: Player


    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        this.background = this.add.tileSprite(
            this.camera.midPoint.x, 
            this.camera.midPoint.y, 
            this.camera.width, 
            this.camera.height, 
            'background'
        ).setOrigin(0.5, 0.5).setScrollFactor(0);

        this.player = new Player(this, 0, 0,);
        this.camera.startFollow(this.player, true, 1, 1);
    }

    update(time: number, delta: number): void {
        const dt = delta / 1000;
        this.background.tilePositionX = this.camera.scrollX;
        this.background.tilePositionY = this.camera.scrollY;
        this.player.boosting(delta);
        this.player.y -= this.player.velocity.y * delta;
        this.player.x -= this.player.velocity.x * delta;
    }

    
}
