import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "./config";
import { AssetUrls } from "./assetUrls";
import { BootScene } from "./scenes/BootScene";
import { MenuScene } from "./scenes/MenuScene";
import { PlayScene } from "./scenes/PlayScene";
import { GameOverScene } from "./scenes/GameOverScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#bfe6ff",
  pixelArt: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, PlayScene, GameOverScene],
  input: {
    activePointers: 3,
  },
};

async function boot(): Promise<void> {
  const face = new FontFace("Kenney Future Narrow", `url(${AssetUrls.fontUrl})`);
  try {
    document.fonts.add(await face.load());
  } catch {
    // Fallback fonts in the text styles still keep the UI readable.
  }
  new Phaser.Game(gameConfig);
}

void boot();
