<script lang="ts">
    import { BOARD } from "$lib/client";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let colors: Color[] = ["red", "green", "blue"];
    export let cell_size: number = 50;

    let selected_color: Color | null = null;

    function select_color(color: Color) {
        selected_color = color;
        dispatch("color_select", color);
    }

    function handle_keydown(event: KeyboardEvent, color: Color) {
        if (event.key === "Enter" || event.key === " ") {
            select_color(color);
        }
    }

    function handle_submit() {
        if (selected_color === null) return;

        const my_color = $BOARD[0][0];
        const rows = $BOARD.length;
        const cols = $BOARD[0].length;

        let queue: [number, number][] = [[0, 0]];
        const visited = new Set<string>();
        const directions: [number, number][] = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1]
        ]; // top, right, bottom, left

        while (queue.length > 0) {
            const cell = queue.shift();
            if (cell === undefined) break;

            const [row, col] = cell;
            const cellKey = `${row},${col}`;

            if (
                row >= 0 &&
                row < rows &&
                col >= 0 &&
                col < cols &&
                !visited.has(cellKey) &&
                $BOARD[row][col] === my_color
            ) {
                visited.add(cellKey);
                $BOARD[row][col] = selected_color;

                for (const [dx, dy] of directions) {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    const newCellKey = `${newRow},${newCol}`;
                    if (
                        newRow >= 0 &&
                        newRow < rows &&
                        newCol >= 0 &&
                        newCol < cols &&
                        !visited.has(newCellKey) &&
                        $BOARD[newRow][newCol] === my_color
                    ) {
                        queue.push([newRow, newCol]);
                    }
                }
            }
        }

        selected_color = null;
    }
</script>

<div class="color_picker_container">
    <div class="color_picker" role="listbox" aria-label="Color Picker">
        {#each colors as color, index}
            <div
                class="color_cell"
                role="option"
                tabindex="0"
                aria-label={color}
                aria-selected={selected_color === color}
                style="background-color: {color}; width: {cell_size}px; height: {cell_size}px;"
                on:click={() => select_color(color)}
                on:keydown={(event) => handle_keydown(event, color)}
            ></div>
        {/each}
    </div>

    <button
        class="submit_button"
        on:click={handle_submit}
        disabled={!selected_color}
    >
        Submit
    </button>
</div>

<style>
    .color_picker_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .color_picker {
        display: flex;
        flex-direction: column;
        gap: 2px;
        background-color: #2c3e50;
        padding: 2px;
        width: fit-content;
    }

    .color_cell {
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .color_cell:hover,
    .color_cell:focus {
        transform: scale(1.1);
        outline: 2px solid #3498db;
    }

    .color_cell[aria-selected="true"] {
        outline: 3px solid #f39c12;
        transform: scale(1.1);
    }

    .submit_button {
        padding: 5px 10px;
        background-color: #3498db;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .submit_button:hover:not(:disabled) {
        background-color: #2980b9;
    }

    .submit_button:disabled {
        background-color: #95a5a6;
        cursor: not-allowed;
    }
</style>
