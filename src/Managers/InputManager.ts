import Phaser from 'phaser';
import { Player } from '../Objects/Player';

export class InputManager {
    private scene: Phaser.Scene;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyW?: Phaser.Input.Keyboard.Key;
    private keyA?: Phaser.Input.Keyboard.Key;
    private keyD?: Phaser.Input.Keyboard.Key;
    private keyS?: Phaser.Input.Keyboard.Key;
    private pointer: Phaser.Input.Pointer;
    private gamepad?: Phaser.Input.Gamepad.Gamepad;
    private touchpadAngle: number | null = null;
    private aimingMethod: 'mouse' | 'touchpad' | 'gamepad';

    //bool for touch controls 
    private isLeftButtonPressed = false;
    private isRightButtonPressed = false;
    private isUpButtonPressed = false;
    private isDownButtonPressed = false;

    constructor(scene: Phaser.Scene) {
        // Getting scene to apply input for
        this.scene = scene;

        // Setting up keyboard input
        this.cursors = scene.input.keyboard?.createCursorKeys();
        this.keyW = scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.W,
        );
        this.keyA = scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.A,
        );
        this.keyD = scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.D,
        );
        this.keyS = scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.S,
        );
        this.pointer = scene.input.activePointer;

        // Check gamepad is connected
        scene.input.gamepad?.once(
            'connected',
            (pad: Phaser.Input.Gamepad.Gamepad) => {
                this.gamepad = pad;
            },
        );

        if (scene.input.gamepad && scene.input.gamepad.gamepads.length > 0) {
            const pad = scene.input.gamepad.gamepads[0];
            if (pad && pad.connected) {
                this.gamepad = pad;
            }
        }

        //touch controls
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            //adding buttons
            const leftButton = scene.add.image(1500, 850, 'left').setScrollFactor(0).setScale(1).setInteractive();
            const rightButton = scene.add.image(1700, 850, 'right').setScrollFactor(0).setScale(1).setInteractive();
            const downButton = scene.add.image(1600, 950, 'down').setScrollFactor(0).setScale(1).setInteractive();
            const upButton = scene.add.image(1600, 750, 'up').setScrollFactor(0).setScale(1).setInteractive();

            //checking if the buttons are pressed
            leftButton.on('pointerdown', () => {
                this.isLeftButtonPressed = true;
            });
            leftButton.on('pointerup', () => {
                this.isLeftButtonPressed = false;
            });
            
            rightButton.on('pointerdown', () => {
                this.isRightButtonPressed = true;
            });
            rightButton.on('pointerup', () => {
                this.isRightButtonPressed = false;
            });
            
            upButton.on('pointerdown', () => {
                this.isUpButtonPressed = true;
            });
            upButton.on('pointerup', () => {
                this.isUpButtonPressed = false;
            });
            
            downButton.on('pointerdown', () => {
                this.isDownButtonPressed = true;
            });
            downButton.on('pointerup', () => {
                this.isDownButtonPressed = false;
            });
            
            //adding turret controls 
            const baseRadius = 180;
            const stickRadius = 50;

            const centerX = 300;
            const centerY = 850;

            const baseColor = Phaser.Display.Color.GetColor(237, 36, 88);
            const stickColor = Phaser.Display.Color.GetColor(237, 36, 88);

          
            const base = scene.add.graphics({ x: centerX, y: centerY }).setScrollFactor(0);
            base.fillStyle(baseColor, 0.3);
            base.fillCircle(0, 0, baseRadius); // center relative to base graphics

            // Draw stick
            const stick = scene.add.graphics({ x: centerX, y: centerY }).setScrollFactor(0);
            stick.fillStyle(stickColor, 0.7);
            stick.fillCircle(0, 0, stickRadius);

            // Make the stick interactive
            const dragZone = new Phaser.Geom.Circle(0, 0, stickRadius);
            stick.setInteractive(dragZone, Phaser.Geom.Circle.Contains);
            scene.input.setDraggable(stick);

            // Dragging logic (screen-space only)
            scene.input.on('drag', (pointer, gameObject) => {
                if (gameObject !== stick) return;

                // Pointer is in screen coordinates (UI layer)
                const dx = pointer.x - centerX;
                const dy = pointer.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (isNaN(dx) || isNaN(dy)) return; // Defensive

                // Calculate and store the touchpad angle
                this.touchpadAngle = Math.atan2(dy, dx);

                if (distance <= baseRadius) {
                    stick.setPosition(pointer.x, pointer.y);
                } else {
                    // Clamp the stick to the edge of the base circle
                    const newX = centerX + Math.cos(this.touchpadAngle) * baseRadius;
                    const newY = centerY + Math.sin(this.touchpadAngle) * baseRadius;
                    stick.setPosition(newX, newY);
                }
            });

            // Always reset stick and angle when drag ends
            scene.input.on('dragend', (gameObject) => {
                if (gameObject === stick) {
                    stick.setPosition(centerX, centerY);
                    this.touchpadAngle = null;
                }
            });

            // Safety reset in case stick doesn't reset above
            scene.input.on('pointerup', () => {
                stick.setPosition(centerX, centerY);
                this.touchpadAngle = null;
            });

            this.aimingMethod = 'touchpad';
        } else {
            scene.input.on('pointermove', () => {
                this.aimingMethod = 'mouse';
            });
        }    
    }

    /**
     * Function for determining if fire is pressed
     *
     * @returns True if one of the fire buttons is pressed, otherwise false
     */
    firing(): boolean {
        return (
            (this.pointer.leftButtonDown() || (this.gamepad?.R2 ?? 0) > 0.1) ?? false
        );
    }
    //THIS IS NOW FOR DEACCLERATION, PERHAPS FIRE WHEN AIMMED (and click for computers)

    /**
     * Function for determining if dodge is pressed
     *
     * @returns True if one of the dodge buttons is pressed, otherwise false
     */
    dodge(): boolean {
        return (
            (this.pointer.rightButtonDown() || this.isDownButtonPressed || (this.gamepad?.R1 ?? 0) > 0.1) ??
            false
        );
    }
    //NEED TO ADD DODGE BUTTON FOR TOUCHPAD

    /**
     * Determines the angle which the player's weapon should be aimed using either a mouse or joystick, may need to be moved out of class
     *
     * @returns Angle in radians of where the weapon should be aimed
     */
    weaponAngle(player: Player): number | null {
        if (this.aimingMethod === 'mouse') {
            if ((this.gamepad?.rightStick.length() ?? 0) > 0.1)
                this.aimingMethod = 'gamepad';
            const worldPointer = this.pointer.positionToCamera(
                this.scene.cameras.main,
            ) as Phaser.Math.Vector2;
            return Phaser.Math.Angle.Between(
                player.x,
                player.y,
                worldPointer.x,
                worldPointer.y,
            );
        } else if (
            this.aimingMethod === 'gamepad' &&
            (this.gamepad?.rightStick.length() ?? 0) > 0.1
        ) {
            return this.gamepad?.rightStick.angle() ?? 0;
        } else if (this.aimingMethod === 'touchpad'){
            return this.touchpadAngle;
        } else return null;
    }

    /**
     * Function for determining if player should be accelerating
     *
     * @returns True if an accelerate button is pressed, otherwise false
     */
    isAccelerating(): boolean {
        return (
            this.keyW?.isDown ||
            this.keyA?.isDown ||
            this.keyD?.isDown ||
            this.cursors?.space.isDown ||
            this.cursors?.up.isDown ||
            (this.gamepad?.L2 ?? 0) > 0.1 ||
            this.isUpButtonPressed ||
            this.isLeftButtonPressed ||
            this.isRightButtonPressed ||
            false
        );
    }

    stopAccelerate(): boolean{
        return (
            this.keyS?.isDown ||
            this.cursors?.down.isDown ||
            this.isDownButtonPressed ||
            ((this.gamepad?.R2 ?? 0) > 0.1) ||
            false
        );
    }

    /**
     * Function for determining rotation speed and direction, dependant on input
     *
     * @returns Rotation speed and direction, if using variable input value from -1.0 to 1.0, if using non-variable input either -1, 0, or 1
     */
    getRotateValue(): number {
        if (this.isRotatingLeft()) return this.getLeftRotateValue();
        else if (this.isRotatingRight()) return this.getRightRotateValue();
        else return 0;
    }

    // Helper for getRotateValue
    private isRotatingLeft(): boolean {
        return (
            (this.getGamepadLeftAxisX() < -0.1 ||
                this.cursors?.left.isDown ||
                this.isLeftButtonPressed ||
                this.keyA?.isDown) ??
            false
        );
    }

    // Helper for getRotateValue
    private isRotatingRight(): boolean {
        return (
            (this.getGamepadLeftAxisX() > 0.1 ||
                this.cursors?.right.isDown ||
                this.isRightButtonPressed ||
                this.keyD?.isDown) ??
            false
        );
    }

    private getLeftRotateValue(): number {
        if (this.getGamepadLeftAxisX() < -0.1)
            return this.getGamepadLeftAxisX();
        else if (this.cursors?.left.isDown || this.keyA?.isDown || this.isLeftButtonPressed) return -1;
        else return 0;
    }

    // Helper for getRotateValue
    private getRightRotateValue(): number {
        if (this.getGamepadLeftAxisX() > 0.1) return this.getGamepadLeftAxisX();
        else if (
            this.cursors?.right.isDown ||
            this.isRightButtonPressed ||
            this.keyD?.isDown ||
            this.gamepad?.A
        )
            return 1;
        else return 0;
    }

    /**
     * Helper function for determining X-axis values for movement
     *
     * @returns X-axis values from left joystick
     */
    private getGamepadLeftAxisX(): number {
        return this.gamepad?.axes[0].getValue() ?? 0;
    }

    /**
     * Helper function for determining Y-axis values for movement
     *
     * @returns Y-axis values from left joystick
     */
    private getGamepadLeftAxisY(): number {
        return this.gamepad?.axes[1].getValue() ?? 0;
    }

    private getGamepadRightAxisX(): number {
        return this.gamepad?.axes[2].getValue() ?? 0;
    }

    private getGamepadRightAxisY(): number {
        return this.gamepad?.axes[3].getValue() ?? 0;
    }
}