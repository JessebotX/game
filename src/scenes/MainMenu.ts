import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.background = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'background',
        );

        this.logo = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'logo',
        );

        this.title = this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 100,
                'Main Menu',
                {
                    fontFamily: 'Arial Black',
                    fontSize: 38,
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 8,
                    align: 'center',
                },
            )
            .setOrigin(0.5);

        const startButton = this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2 + 200,
                'Start',
                {
                    fontFamily: 'Arial Black',
                    fontSize: 38,
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 8,
                    align: 'center',
                },
            )
            .setOrigin(0.5, 0.5);

        startButton.setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
