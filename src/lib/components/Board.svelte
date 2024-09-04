<script lang="ts">
    import { BOARD } from "$lib/client";

    export let board_size: number = 10;
    export let cell_size: number = 50;

    function get_random_color(): Color {
        const colors: Color[] = ["red", "green", "blue"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Initialize the board with random colors
    for (let i = 0; i < board_size; i++) {
        for (let j = 0; j < board_size; j++) {
            $BOARD[i][j] = get_random_color();
        }
    }

    function handle_cell_interaction(row: number, col: number) {
        console.log(`Interacted with cell at row ${row}, column ${col}`);
        // Add your interaction logic here
    }

    function handle_keydown(event: KeyboardEvent, row: number, col: number) {
        if (event.key === "Enter" || event.key === " ") {
            handle_cell_interaction(row, col);
        }
    }
</script>

<div
    class="board"
    style="--board-size: {board_size}; --cell-size: {cell_size}px;"
    role="grid"
    aria-label="Game Board"
>
    {#each $BOARD as row, row_index}
        {#each row as cell, col_index}
            <div
                class="cell dimmed"
                role="gridcell"
                tabindex="0"
                aria-label="Cell {row_index + 1},{col_index + 1}"
                on:click={() => handle_cell_interaction(row_index, col_index)}
                on:keydown={(event) =>
                    handle_keydown(event, row_index, col_index)}
                style="background-color: {cell};"
            ></div>
        {/each}
    {/each}
</div>

<style>
    .board {
        display: grid;
        grid-template-columns: repeat(var(--board-size), var(--cell-size));
        grid-template-rows: repeat(var(--board-size), var(--cell-size));
        gap: 2px;
        background-color: #2c3e50;
        padding: 2px;
        width: fit-content;
    }

    .cell {
        width: var(--cell-size);
        height: var(--cell-size);
        cursor: pointer;
        transition:
            background-color 0.2s ease,
            filter 0.2s ease;
    }

    .cell.dimmed {
        filter: brightness(0.6);
    }

    .cell:hover,
    .cell:focus {
        outline: 2px solid #3498db;
        filter: brightness(1);
    }
</style>
