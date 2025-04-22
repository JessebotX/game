import { Scene, GameObjects} from 'phaser';
import { Player } from '../Objects/Player';
// import {SCREEN_RESOLUTION_W, SCREEN_RESOLUTION_H} from 'main.ts' - idk how to import singular variables/constants

var asteroids;
// var player: Phaser.Types.Physics.Arcade.ArcadeColliderType;

export class MainMenu extends Scene {
    private player!: Player;
    camera: Phaser.Cameras.Scene2D.Camera;

    background: GameObjects.Image;
    ship: GameObjects.Image;
    Asteroid: GameObjects.Image;

    constructor() {
        super('MainMenu');
    }

    deflectFromImpact(
        source: Phaser.GameObjects.Sprite,
        target: Phaser.GameObjects.Sprite,
        speed: number
    ) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const len = Math.hypot(dx, dy) || 1;
        
        target.body.setVelocityX(
            (dx / len) * speed
        );
        target.body.setVelocityY(
            (dy / len) * speed
        );
    }
    // shipDeflectFromImpact(
    //     ship: Phaser.GameObjects.Sprite,
    //     collider: Phaser.GameObjects.Sprite
    // ) {

    // }

    create() {

        const SCREEN_W = this.scale.width;
        const SCREEN_H = this.scale.height;
    
        const CENTER_W = SCREEN_W / 2;
        const CENTER_H = SCREEN_H / 2;
        this.background = this.add.image(1250, 1250, 'Stars')
        this.background.scale = 3;

        // this.ship = this.add.image(512, 300, 'Ship').setScale(0.1);
        this.player = new Player(this, CENTER_W, CENTER_H, 'ShipFrames', 0).setScale(0.2);

        this.camera = this.cameras.main;
        // this.physics.add.sprite(200, 300, 'ShipFrames').setScale(0.2);

        // player.setBounce(1);
        this.player.body.setMaxVelocity(200, 200)
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'still',
            frames: [{key: "ShipFrames", frame: 0}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'boost',
            frames: this.anims.generateFrameNumbers('ShipFrames', {start: 1, end: 2}),
            frameRate: 10,
            repeat: -1
        });

        asteroids = this.physics.add.group({
            collideWorldBounds: true,
            // bounceX: 0.3,
            // bounceY: 0.3
        });

        for (let i = 1; i < 50; i++) {
            const Mass = Math.random();
            const a = asteroids.create(
                2500 * Math.random(),
                2500 * Math.random(),
                'Asteroid'
            )
            a.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));
            a.setAngularVelocity(Phaser.Math.Between(-25, 25) * 2);
            a.setScale(0.5*Mass + 0.5)
            a.Mass = Mass;
            a.refreshBody();
        }

        this.physics.add.collider(asteroids, asteroids, (asteroid1, asteroid2) => {
            this.deflectFromImpact(asteroid1, asteroid2, 100);
            this.deflectFromImpact(asteroid2, asteroid1, 100);
        })

        this.physics.add.collider(this.player, asteroids, (playerObj, rock) => {
            playerObj.setAcceleration(0, 0);
            this.deflectFromImpact(playerObj, rock, 100);
            this.deflectFromImpact(rock, playerObj, 25);
        })

        this.cameras.main.startFollow(this.player);
        // this.cameras.main.setBounds(0, 0, 4500, 4500);

        // this.input.once('pointerdown', () => {
        //     this.scene.start('Game');
        // });
        this.camera.postFX.addVignette(0.5, 0.5, 4, 3);
        this.camera.postFX.addPixelate(1.2);
        // this.camera.postFX.addBarrel(1.1);
        // this.camera.postFX.addShadow(50, 50, 150, 15, 0xffffff, 5, 5);
        this.camera.postFX.addShine(0.4, 35, 15, false);
        this.camera.postFX.addBloom(0xffffff, 0.5, 0.5, 0.1, 10, 7);
        
    }

    update () {

        var cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left.isDown) {
            if (this.player.body.angularVelocity > -100)
                this.player.body.angularVelocity -= 1
        } else if (cursors.right.isDown) {
            if (this.player.body.angularVelocity < 100)
                this.player.body.angularVelocity += 1
        } else if (cursors.up.isDown) {
            this.player.body.acceleration.y += -1* (Math.cos(this.player.rotation))
            this.player.body.acceleration.x += (Math.sin(this.player.rotation))
            this.player.anims.play("boost", true);
        } else if (cursors.down.isDown) {
            // if (Math.hypot(this.player.body.acceleration.x, this.player.body.acceleration.y) > 0) {
            //     this.player.body.acceleration.y -= -1* (Math.cos(this.player.rotation))
            //     this.player.body.acceleration.x -= (Math.sin(this.player.rotation))
            //     this.player.anims.play("boost", true);
            // }
        } else {
            this.player.anims.play("still", true);
        }

        if (this.player.body.velocity > 0) {
            this.player.body.velocity.normalize().scale(100);
        }
        // this.game.physics.arcade.collide
    }
}
