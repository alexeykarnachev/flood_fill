import { writable } from "svelte/store";

export const BOARD_SIZE = 10;

export const BOARD = writable<Color[][]>(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
);

