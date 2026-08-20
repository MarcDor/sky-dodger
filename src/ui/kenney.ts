import Phaser from "phaser";

const FONT = '"Kenney Future Narrow", "Trebuchet MS", sans-serif';

/** Nine-slice Kenney button with centered label. */
export function addKenneyButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
): Phaser.GameObjects.NineSlice {
  const width = 280;
  const height = 72;
  const slice = scene.add.nineslice(x, y, "button-yellow", undefined, width, height, 48, 48, 28, 28);
  slice.setInteractive({ useHandCursor: true });
  const text = scene.add
    .text(x, y - 2, label, {
      fontFamily: FONT,
      fontSize: "22px",
      color: "#3A2A32",
    })
    .setOrigin(0.5)
    .setDepth(slice.depth + 1);

  slice.on("pointerover", () => {
    slice.setScale(1.04);
    text.setScale(1.04);
  });
  slice.on("pointerout", () => {
    slice.setScale(1);
    text.setScale(1);
  });
  slice.on("pointerdown", () => {
    scene.sound.play("click");
    onClick();
  });
  return slice;
}

export function addKenneyPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
): Phaser.GameObjects.NineSlice {
  return scene.add.nineslice(x, y, "panel-grey", undefined, width, height, 48, 48, 28, 28);
}

export { FONT };
