import { mountCinder } from "./app";

const host = document.querySelector<HTMLElement>("#game");
if (!host) throw new Error("#game fehlt");
void mountCinder(host);
