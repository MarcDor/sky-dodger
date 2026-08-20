import Phaser from "phaser";
import { AssetUrls } from "../assetUrls";

/**
 * Loads every texture, SVG and sound the later scenes need.
 * SVG doodles are rasterized at a generous size so they stay crisp on phones.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload(): void {
    const { width, height } = this.scale;
    const bar = this.add.rectangle(width / 2, height / 2, 240, 16, 0xffc2d4).setOrigin(0.5);
    this.load.on("progress", (value: number) => {
      bar.width = 40 + 240 * value;
    });

    this.load.svg("background", AssetUrls.backgroundSvg, { width: 480, height: 800 });
    this.load.svg("player", AssetUrls.playerSvg, { width: 128, height: 128 });
    this.load.svg("obstacle-cloud", AssetUrls.cloudSvg, { width: 120, height: 90 });
    this.load.svg("obstacle-star", AssetUrls.starSvg, { width: 96, height: 96 });
    this.load.svg("obstacle-drop", AssetUrls.dropSvg, { width: 72, height: 96 });

    this.load.image("button-yellow", AssetUrls.buttonYellow);
    this.load.image("panel-grey", AssetUrls.panelGrey);
    this.load.image("frame-outline", AssetUrls.frameOutline);
    this.load.image("kenney-star", AssetUrls.kenneyStar);

    this.load.audio("click", AssetUrls.clickSfx);
    this.load.audio("score", AssetUrls.scoreSfx);
    this.load.audio("start", AssetUrls.startSfx);
    this.load.audio("hit", AssetUrls.hitSfx);
  }

  create(): void {
    this.scene.start("Menu");
  }
}
