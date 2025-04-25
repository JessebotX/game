import Phaser from 'phaser';

export class InputManager {
    private scene: Phaser.Scene;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private keyW?: Phaser.Input.Keyboard.Key;
    private keyA?: Phaser.Input.Keyboard.Key;
    private keyD?: Phaser.Input.Keyboard.Key;
    private pointer: Phaser.Input.Pointer;
    private gamepad?: Phaser.Input.Gamepad.Gamepad;

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
    }

    /**
     * Function for determining if fire is pressed
     *
     * @returns True if one of the fire buttons is pressed, otherwise false
     */
    firing(): boolean {
        return (
            (this.pointer.leftButtonDown() || (this.gamepad?.R2 ?? 0) > 0.1) ??
            false
        );
    }

    /**
     * Function for determining if dodge is pressed
     *
     * @returns True if one of the dodge buttons is pressed, otherwise false
     */
    dodge(): boolean {
        return (
            (this.pointer.rightButtonDown() || (this.gamepad?.R1 ?? 0) > 0.1) ??
            false
        );
    }

    /**
     * **UNIMPLEMENTED** Determines the angle which the player's weapon should be aimed using either a mouse or joystick, may need to be moved out of class
     *
     * @returns Angle in radians of where the weapon should be aimed
     */
    weaponAngle(): number {
        return 0;
    }

    /**
     * Function for determining if player should be accelerating
     *
     * @returns True if an accelerate button is pressed, otherwise false
     */
    isAccelerating(): boolean {
        return (
            (this.keyW?.isDown ||
                this.cursors?.space.isDown ||
                this.cursors?.up.isDown ||
                (this.gamepad?.L2 ?? 0) > 0.1) ??
            false
        );
    }

    /**
     * Function for determining the acceleration speed, dependant on input
     *
     * @returns Acceleration speed, if using variable input value from 0.0, 1.0, if using non-variable input either 0 or 1
     */
    getAcceleration(): number {
        if ((this.gamepad?.L2 ?? 0) > 0.1) return this.gamepad?.R2 ?? 0;
        else if (
            this.keyW?.isDown ||
            this.cursors?.space.isDown ||
            this.cursors?.up.isDown
        )
            return 1;
        else return 0;
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
                this.keyA?.isDown) ??
            false
        );
    }

    // Helper for getRotateValue
    private isRotatingRight(): boolean {
        return (
            (this.getGamepadLeftAxisX() > 0.1 ||
                this.cursors?.right.isDown ||
                this.keyD?.isDown) ??
            false
        );
    }

    private getLeftRotateValue(): number {
        if (this.getGamepadLeftAxisX() < -0.1)
            return this.getGamepadLeftAxisX();
        else if (this.cursors?.left.isDown || this.keyA?.isDown) return -1;
        else return 0;
    }

    // Helper for getRotateValue
    private getRightRotateValue(): number {
        if (this.getGamepadLeftAxisX() > 0.1) return this.getGamepadLeftAxisX();
        else if (
            this.cursors?.right.isDown ||
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
}
