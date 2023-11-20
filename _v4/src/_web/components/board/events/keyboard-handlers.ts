
import { MoveTypes } from "@/movers/types";

export interface IFlashlightEventArgs {
    // direction: Direction;
    isOn: boolean;
    powerLevel?: number;
}

export interface IResetEventArgs {
    newMap: boolean;
}

export interface IPlayerActions {
    get ResetArgs(): IResetEventArgs | undefined;
    get TorchArgs(): IFlashlightEventArgs;
    get NextMove(): string;
}

export class KeyboardHandlers implements IPlayerActions {
    private resetArgs: IResetEventArgs | undefined = undefined;
    private torchArgs: IFlashlightEventArgs = { isOn: false };
    private nextMove: MoveTypes = "none";

    get ResetArgs() {
        const args = this.resetArgs;
        this.resetArgs = undefined;
        return args;
    }

    get TorchArgs() {
        return this.torchArgs;
    }

    get NextMove() {
        const move = this.nextMove;
        this.nextMove = "none";
        return move;
    }

    constructor() {
        this.setupHandlers();
    }

    private firing: string[] = [];
    private keydownHandlers: { [key: string]: (key: KeyboardEvent) => void } = {
        ArrowUp: (key: KeyboardEvent) => {
            key.preventDefault();
            if (this.nextMove === "none") this.nextMove = "move-forward";
        },
        ArrowDown: (key: KeyboardEvent) => {
            key.preventDefault();
            if (this.nextMove === "none") this.nextMove = "move-forward";
        },
        w: () => {
            if (this.nextMove === "none") this.nextMove = "move-forward";
        },
        s: () => {
            if (this.nextMove === "none") this.nextMove = "move-forward";
        },
        ArrowLeft: (key: KeyboardEvent) => {
            key.preventDefault();
            if (this.nextMove === "none") this.nextMove = "turn";
        },
        ArrowRight: (key: KeyboardEvent) => {
            key.preventDefault();
            if (this.nextMove === "none") this.nextMove = "turn";
        },
        a: () => {
            if (this.nextMove === "none") this.nextMove = "turn";
        },
        d: () => {
            if (this.nextMove === "none") this.nextMove = "turn";
        },
        f: () => {
            this.torchArgs.isOn = true;
        },
        e: () => {
            this.torchArgs.isOn = true;
            this.torchArgs.powerLevel = 0;
        },
        t: () => {
            this.resetArgs = { newMap: true };
        },
    };

    setupHandlers() {
        document.addEventListener("keydown", (e) => {
            if (this.firing.indexOf(e.key) > -1) {
                return;
            }
            if (this.keydownHandlers[e.key]) {
                this.keydownHandlers[e.key](e);
                this.firing.push(e.key);
            }
        });

        document.addEventListener("keyup", (e) => {
            this.firing = this.firing.filter((k) => k !== e.key);
            if (e.key === "f") {
                this.torchArgs.isOn = false;
            }
            if (e.key === "e") {
                this.torchArgs.isOn = false;
                this.torchArgs.powerLevel = undefined;
            }
        });
    }
}
