import Phaser from "phaser";

const FONT = '"Kenney Future Narrow", "Trebuchet MS", sans-serif';

/** Nine-slice Kenney button with centered label. */
export function addKenneyButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
): Phaser.GameObjects.Container {
  const width = 280;
  const height = 72;
  const slice = scene.add.nineslice(0, 0, "button-yellow", undefined, width, height, 48, 48, 28, 28);
  const text = scene.add
    .text(0, -2, label, {
      fontFamily: FONT,
      fontSize: "22px",
      color: "#3A2A32",
    })
    .setOrigin(0.5);

  const container = scene.add.container(x, y, [slice, text]);
  container.setSize(width, height);
  container.setInteractive({ useHandCursor: true });
  container.on("pointerover", () => container.setScale(1.04));
  container.on("pointerout", () => container.setScale(1));
  container.on("pointerdown", () => {
    scene.sound.play("click");
    onClick();
  });
  return container;
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
