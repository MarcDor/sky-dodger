import Phaser from "phaser";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  PLAYER_MARGIN,
  PLAYER_SPEED,
  PLAYER_Y,
} from "../config";
import { clamp, fallSpeed, nextSpawnDelay, scoreFromTime } from "../difficulty";
import { addKenneyPanel, FONT } from "../ui/kenney";

const OBSTACLE_KEYS = ["obstacle-cloud", "obstacle-star", "obstacle-drop"] as const;

export class PlayScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private scoreText!: Phaser.GameObjects.Text;
  private elapsedMs = 0;
  private spawnInMs = 400;
  private score = 0;
  private lastScoreChime = 0;
  private dragging = false;
  private ended = false;

  constructor() {
    super("Play");
  }

  create(): void {
    this.elapsedMs = 0;
    this.score = 0;
    this.ended = false;
    this.spawnInMs = 350;

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "background");

    this.player = this.physics.add.sprite(GAME_WIDTH / 2, PLAYER_Y, "player");
    this.player.setDepth(2);
    this.player.setCollideWorldBounds(true);
    this.player.body?.setSize(58, 58, true);

    this.obstacles = this.physics.add.group();
    this.physics.add.overlap(this.player, this.obstacles, () => this.onHit());

    this.cursors = this.input.keyboard?.createCursorKeys();

    // Touch / mouse drag moves the character along the bottom edge.
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.dragging = true;
      this.movePlayerTo(pointer.worldX);
    });
    this.input.on("pointerup", () => {
      this.dragging = false;
    });
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.dragging) {
        this.movePlayerTo(pointer.worldX);
      }
    });

    addKenneyPanel(this, GAME_WIDTH / 2, 42, 240, 58);
    this.scoreText = this.add
      .text(GAME_WIDTH / 2, 42, "Score 0", {
        fontFamily: FONT,
        fontSize: "22px",
        color: "#3A2A32",
      })
      .setOrigin(0.5)
      .setDepth(5);
  }

  update(_time: number, delta: number): void {
    if (this.ended) {
      return;
    }

    this.elapsedMs += delta;
    this.score = scoreFromTime(this.elapsedMs);
    this.scoreText.setText(`Score ${this.score}`);

    // Soft chime every 10 score ticks so survival feels rewarding.
    if (this.score > 0 && this.score % 10 === 0 && this.score !== this.lastScoreChime) {
      this.lastScoreChime = this.score;
      this.sound.play("score", { volume: 0.45 });
    }

    this.handleKeyboard(delta);
    this.player.y = PLAYER_Y + Math.sin(this.elapsedMs / 180) * 5;

    this.spawnInMs -= delta;
    if (this.spawnInMs <= 0) {
      this.spawnObstacle();
      this.spawnInMs = nextSpawnDelay(this.elapsedMs / 1000);
    }

    const speed = fallSpeed(this.elapsedMs / 1000);
    for (const child of this.obstacles.getChildren()) {
      const sprite = child as Phaser.Physics.Arcade.Sprite;
      sprite.setVelocityY(speed);
      if (sprite.y > GAME_HEIGHT + 80) {
        sprite.destroy();
      }
    }
  }

  private handleKeyboard(delta: number): void {
    if (!this.cursors) {
      return;
    }
    const step = PLAYER_SPEED * (delta / 1000);
    if (this.cursors.left.isDown) {
      this.player.x -= step;
    }
    if (this.cursors.right.isDown) {
      this.player.x += step;
    }
    this.player.x = clamp(this.player.x, PLAYER_MARGIN, GAME_WIDTH - PLAYER_MARGIN);
  }

  private movePlayerTo(worldX: number): void {
    this.player.x = clamp(worldX, PLAYER_MARGIN, GAME_WIDTH - PLAYER_MARGIN);
  }

  private spawnObstacle(): void {
    const key = Phaser.Utils.Array.GetRandom([...OBSTACLE_KEYS]);
    const x = Phaser.Math.Between(PLAYER_MARGIN, GAME_WIDTH - PLAYER_MARGIN);
    const obstacle = this.obstacles.create(x, -48, key) as Phaser.Physics.Arcade.Sprite;
    obstacle.setDepth(1);
    obstacle.body?.setCircle(Math.min(obstacle.displayWidth, obstacle.displayHeight) * 0.32);
    obstacle.setVelocityY(fallSpeed(this.elapsedMs / 1000));
  }

  private onHit(): void {
    if (this.ended) {
      return;
    }
    this.ended = true;
    this.sound.play("hit");
    this.cameras.main.shake(220, 0.012);
    this.time.delayedCall(280, () => {
      this.scene.start("GameOver", { score: this.score });
    });
  }
}
