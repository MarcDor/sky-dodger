import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { addKenneyButton, addKenneyPanel, FONT } from "../ui/kenney";

export class MenuScene extends Phaser.Scene {
  private starting = false;

  constructor() {
    super("Menu");
  }

  create(): void {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "background");
    this.add.image(86, 120, "kenney-star").setScale(0.45).setAngle(-12);
    this.add.image(400, 168, "kenney-star").setScale(0.32).setAngle(18);

    addKenneyPanel(this, GAME_WIDTH / 2, 248, 400, 220);
    this.add.image(GAME_WIDTH / 2, 248, "frame-outline").setDisplaySize(412, 232);

    this.add
      .text(GAME_WIDTH / 2, 188, "Sky Dodger", {
        fontFamily: FONT,
        fontSize: "42px",
        color: "#3A2A32",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 238, "Weiche den kawaii Wolken aus!", {
        fontFamily: FONT,
        fontSize: "16px",
        color: "#6B4A57",
      })
      .setOrigin(0.5);

    const hero = this.add.image(GAME_WIDTH / 2, 318, "player").setScale(0.72);
    this.tweens.add({
      targets: hero,
      y: 330,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    addKenneyButton(this, GAME_WIDTH / 2, 470, "Start", () => this.begin());

    this.add
      .text(GAME_WIDTH / 2, 560, "Tippen / Klicken zum Start", {
        fontFamily: FONT,
        fontSize: "18px",
        color: "#3A2A32",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 710, "Pfeiltasten  ·  Touch-Drag", {
        fontFamily: FONT,
        fontSize: "14px",
        color: "#6B4A57",
      })
      .setOrigin(0.5);

    // Whole canvas is a start hit target, matching the requested copy.
    this.input.once("pointerdown", () => this.begin());
  }

  private begin(): void {
    if (this.starting) {
      return;
    }
    this.starting = true;
    this.sound.play("start");
    this.scene.start("Play");
  }
}
