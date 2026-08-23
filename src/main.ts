import { mountLockstep } from "./ui/app";

const host = document.querySelector<HTMLElement>("#game");
if (!host) {
  throw new Error("#game fehlt");
}

void mountLockstep(host);
