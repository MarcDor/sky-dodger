import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { addKenneyButton, addKenneyPanel, FONT } from "../ui/kenney";

interface GameOverData {
  score?: number;
}

export class GameOverScene extends Phaser.Scene {
  private restarting = false;

  constructor() {
    super("GameOver");
  }

  create(data: GameOverData): void {
    const score = data.score ?? 0;
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "background").setAlpha(0.72);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x3a2a32, 0.18);

    addKenneyPanel(this, GAME_WIDTH / 2, 340, 380, 280);
    this.add.image(GAME_WIDTH / 2, 340, "frame-outline").setDisplaySize(392, 292);

    this.add
      .text(GAME_WIDTH / 2, 250, "Game Over", {
        fontFamily: FONT,
        fontSize: "36px",
        color: "#3A2A32",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 320, `Score ${score}`, {
        fontFamily: FONT,
        fontSize: "28px",
        color: "#6B4A57",
      })
      .setOrigin(0.5);

    addKenneyButton(this, GAME_WIDTH / 2, 410, "Nochmal", () => this.restart());

    this.add
      .text(GAME_WIDTH / 2, 620, "Tippen / Klicken zum Neustart", {
        fontFamily: FONT,
        fontSize: "16px",
        color: "#3A2A32",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => this.restart());
  }

  private restart(): void {
    if (this.restarting) {
      return;
    }
    this.restarting = true;
    this.scene.start("Play");
  }
}
