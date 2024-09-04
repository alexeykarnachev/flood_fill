<script lang="ts">
    import { BOARD, BOARD_SIZE } from "$lib/client";
    import Board from "$lib/components/Board.svelte";
    import ColorPicker from "$lib/components/ColorPicker.svelte";
    import { get } from "svelte/store";

    const colors: Color[] = [
        "red",
        "green",
        "blue",
        "yellow",
        "magenta",
        "cian",
        "pink"
    ];
    let selected_color: Color | null = null;
    let is_game_over = false;

    function flood_fill(
        board: Color[][],
        x: number,
        y: number,
        new_color: Color,
        old_color: Color
    ) {
        if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) return;
        if (board[y][x] !== old_color) return;

        board[y][x] = new_color;

        flood_fill(board, x + 1, y, new_color, old_color);
        flood_fill(board, x - 1, y, new_color, old_color);
        flood_fill(board, x, y + 1, new_color, old_color);
        flood_fill(board, x, y - 1, new_color, old_color);
    }

    function get_best_color(board: Color[][]): Color {
        const color_counts: Record<Color, number> = colors.reduce(
            (acc, color) => ({ ...acc, [color]: 0 }),
            {} as Record<Color, number>
        );

        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                if (board[y][x] && board[y][x] !== board[0][0]) {
                    color_counts[board[y][x]]++;
                }
            }
        }

        return Object.entries(color_counts).reduce((a, b) =>
            a[1] > b[1] ? a : b
        )[0] as Color;
    }

    function is_board_complete(board: Color[][]) {
        const first_color = board[0][0];
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                if (board[y][x] !== first_color) return false;
            }
        }
        return true;
    }

    function handle_color_select(event: CustomEvent<Color>) {
        selected_color = event.detail;
        console.log(`Selected color: ${selected_color}`);

        if (selected_color) {
            let current_board = get(BOARD);
            const start_color = current_board[0][0];
            flood_fill(current_board, 0, 0, selected_color, start_color);
            BOARD.set(current_board);
        }
    }

    async function handle_auto_run() {
        // TODO: This has a bug: sometimes it stucks when there is no required adjecent color.
        // solution: check that the most frequent color can be reached from our field.

        let current_board = get(BOARD);
        let steps = 0;
        let is_running = true;

        while (is_running) {
            if (is_board_complete(current_board)) {
                is_running = false;
                console.log(`Puzzle solved in ${steps} steps!`);
                is_game_over = true;
                break;
            }

            const start_color = current_board[0][0];
            const new_color = get_best_color(current_board);

            flood_fill(current_board, 0, 0, new_color, start_color);
            BOARD.set(current_board);
            steps++;

            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
</script>

<div class="flex items-start gap-5">
    <div class="relative">
        <Board />
        {#if is_game_over}
            <div class="absolute inset-0 flex items-center justify-center">
                <span
                    class="text-4xl font-bold text-white bg-black bg-opacity-50 p-4 rounded"
                >
                    SOLVED
                </span>
            </div>
        {/if}
    </div>
    <div class="flex flex-col gap-3">
        <ColorPicker {colors} on:colorselect={handle_color_select} />
        <button
            class="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            on:click={handle_auto_run}
        >
            Auto-solve
        </button>
    </div>
</div>
