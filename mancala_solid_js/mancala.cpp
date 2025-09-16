#include <bits/stdc++.h>

#define NUM_PITS 6
#define NUMBER_OF_STONES 4
#define SLOTS (NUM_PITS * 2 + 2)
#define STORE_1_POS NUM_PITS
#define STORE_2_POS SLOTS - 1
#define AI_DEPTH 14

using namespace std;

typedef enum
{
    PLAYER_1 = 0,
    PLAYER_2 = NUM_PITS + 1,
} Player;

typedef enum
{
    PLAYER_1_WIN = 1,
    PLAYER_2_WIN = -1,
    DRAW = 0
} Prizes;

struct MoveResult
{
    int score;
    int bestPit; // which pit to play (1–NUM_PITS)
};

void
prepare_game(int game_state[SLOTS]);
void
print_board(int game_state[SLOTS]);
bool
can_play_turn(int game_state[SLOTS], Player p, int position);
int
play_turn(int game_state[SLOTS], Player p, int position, bool* play_again);
bool
can_continue_to_play(int game_state[SLOTS]);
Prizes
finalize_game(int game_state[SLOTS]);
void
DieWithError(string err_msg);
MoveResult
minimax_ab(int game_state[SLOTS],
           Player current,
           int depth,
           bool maximizing,
           Player aiPlayer,
           int alpha,
           int beta);

void
play_human_vs_ai();
void
play_ai_vs_ai();

int
main()
{
    cout << "Welcome to Mancala!\n";
    cout << "Choose mode:\n";
    cout << "1. Human vs AI\n";
    cout << "2. AI vs AI\n";
    cout << "Enter choice: ";

    int choice;
    cin >> choice;

    if (choice == 1) {
        play_human_vs_ai();
    } else if (choice == 2) {
        play_ai_vs_ai();
    } else {
        cout << "❌ Invalid choice. Exiting.\n";
    }

    return 0;
}

void
play_human_vs_ai()
{
    int game_state[SLOTS];
    prepare_game(game_state);

    Player human = PLAYER_1;
    Player ai = PLAYER_2;
    Player current = PLAYER_1;

    cout << "🎮 Starting Human vs AI game...\n";

    while (can_continue_to_play(game_state)) {
        print_board(game_state);

        if (current == human) {
            int pos;
            cout << "Your turn. Choose a pit (1–" << NUM_PITS << "): ";
            cin >> pos;

            if (!can_play_turn(game_state, human, pos)) {
                cout << "❌ Invalid move! Try again.\n";
                continue;
            }

            bool again;
            play_turn(game_state, human, pos, &again);
            if (!again)
                current = ai;
        } else {
            cout << "\n🤖 AI is thinking...\n";
            MoveResult best =
              minimax_ab(game_state, ai, AI_DEPTH, true, ai, INT_MIN, INT_MAX);
            int aiMove = best.bestPit;

            cout << "AI chooses pit " << aiMove << " with heuristic score "
                 << best.score << endl;

            bool again;
            play_turn(game_state, ai, aiMove, &again);
            if (!again)
                current = human;
        }
    }

    print_board(game_state);

    finalize_game(game_state);
}

void
play_ai_vs_ai()
{
    int game_state[SLOTS];
    prepare_game(game_state);

    Player ai1 = PLAYER_1;
    Player ai2 = PLAYER_2;
    Player current = PLAYER_1;

    cout << "🤖 Mancala AI vs AI!\n";

    while (can_continue_to_play(game_state)) {
        print_board(game_state);

        cout << "\n";
        cout << (current == ai1 ? "AI-1" : "AI-2") << " is thinking...\n";

        MoveResult best = minimax_ab(
          game_state, current, AI_DEPTH, true, current, INT_MIN, INT_MAX);

        int aiMove = best.bestPit;
        cout << (current == ai1 ? "AI-1" : "AI-2") << " chooses pit " << aiMove
             << " with heuristic score " << best.score << endl;

        bool again;
        play_turn(game_state, current, aiMove, &again);
        if (!again)
            current = (current == ai1 ? ai2 : ai1);
    }

    finalize_game(game_state);
}

void
DieWithError(string err_msg)
{
    cerr << err_msg << endl;
    exit(1);
}

void
prepare_game(int game_state[SLOTS])
{
    for (int i = 0; i < SLOTS; i++)
        game_state[i] = NUMBER_OF_STONES;
    game_state[STORE_1_POS] = 0;
    game_state[STORE_2_POS] = 0;
}

void
print_board(int game_state[SLOTS])
{
    const int WIDTH = 3; // width for each pit display

    cout << "\n    ";
    // Player 2 pits (right to left)
    for (int i = STORE_2_POS - 1; i > STORE_1_POS; i--) {
        cout << setw(WIDTH) << game_state[i];
    }
    cout << "\n";

    // Stores
    cout << setw(WIDTH) << game_state[STORE_2_POS];
    for (int i = 0; i < NUM_PITS * WIDTH; i++)
        cout << " ";
    cout << setw(WIDTH) << game_state[STORE_1_POS] << "\n";

    cout << "    ";
    // Player 1 pits (left to right)
    for (int i = 0; i < STORE_1_POS; i++) {
        cout << setw(WIDTH) << game_state[i];
    }
    cout << "\n\n";
}

int
play_turn(int game_state[SLOTS], Player p, int position, bool* play_again)
{
    // Position out of bounds [1, NUM_PITS]
    if (position < 1 || position > NUM_PITS)
        return -1;

    int ignore_position;
    if (p == PLAYER_1)
        ignore_position = STORE_2_POS;
    else
        ignore_position = STORE_1_POS;

    int index = p + position - 1;
    int temp_counter = game_state[index];

    // If seed count in pit is 0, throw error
    if (temp_counter <= 0)
        return -1;

    game_state[index] = 0;

    while (temp_counter--) {
        index++;
        if (index == ignore_position)
            index++;
        if (index >= SLOTS)
            index %= SLOTS;

        game_state[index] += 1;
    }

    /* Special rule 1: If last pit had 0 elements or now has 1 elemet,
     * then move the current pit contents and the opposite pit contents
     * to your seed store. The pit should be your pit and the other pit
     * should not be empty.
     */

    if (index != STORE_1_POS && index != STORE_2_POS) {
        if (p == PLAYER_1 && index < STORE_1_POS) {
            int opposite_index = SLOTS - index - 2;
            if (game_state[index] == 1 && game_state[opposite_index] != 0) {
                game_state[STORE_1_POS] += game_state[opposite_index] + 1;
                game_state[index] = 0;
                game_state[opposite_index] = 0;
            }
        }

        else if (p == PLAYER_2 && index > STORE_1_POS) {
            int opposite_index = SLOTS - index - 2;
            if (game_state[index] == 1 && game_state[opposite_index] != 0) {
                game_state[STORE_2_POS] += game_state[opposite_index] + 1;
                game_state[index] = 0;
                game_state[opposite_index] = 0;
            }
        }
    }

    /* Special Rule 2: If the last seed lands in your store,
     * then you get another turn.
     */

    *play_again = (p == PLAYER_1 && index == STORE_1_POS) ||
                  (p == PLAYER_2 && index == STORE_2_POS);

    return 0;
}

bool
can_continue_to_play(int game_state[SLOTS])
{
    int seeds_in_pits[2] = { 0, 0 };

    // For player 1
    for (int i = 0; i < STORE_1_POS; i++)
        seeds_in_pits[0] += game_state[i];

    // For player 2
    for (int i = STORE_1_POS + 1; i < STORE_2_POS; i++)
        seeds_in_pits[1] += game_state[i];

    // cout << seeds_in_pits[0] << "----" << seeds_in_pits[1] << endl;

    if (!seeds_in_pits[0] || !seeds_in_pits[1])
        return false;

    return true;
}

bool
can_play_turn(int game_state[SLOTS], Player p, int position)
{
    if (position < 1 || position > NUM_PITS)
        return false;

    if (!game_state[p + position - 1])
        return false;

    return true;
}

Prizes
finalize_game(int game_state[SLOTS])
{
    int player1_remaining = 0, player2_remaining = 0;

    // Collect Player 1's remaining stones
    for (int i = 0; i < STORE_1_POS; i++) {
        player1_remaining += game_state[i];
        game_state[i] = 0;
    }

    // Collect Player 2's remaining stones
    for (int i = STORE_1_POS + 1; i < STORE_2_POS; i++) {
        player2_remaining += game_state[i];
        game_state[i] = 0;
    }

    // Move them into their respective stores
    game_state[STORE_1_POS] += player1_remaining;
    game_state[STORE_2_POS] += player2_remaining;

    cout << "\nGame over!\n";
    cout << "Final Scores: \n";
    cout << "Player 1: " << game_state[STORE_1_POS] << endl;
    cout << "Player 2: " << game_state[STORE_2_POS] << endl;

    if (game_state[STORE_1_POS] > game_state[STORE_2_POS]) {
        cout << "Winner: Player 1\n";
        return PLAYER_1_WIN;
    } else if (game_state[STORE_2_POS] > game_state[STORE_1_POS]) {
        cout << "Winner: Player 2\n";
        return PLAYER_2_WIN;
    } else {
        cout << "It's a draw\n";
        return DRAW;
    }
}

MoveResult
minimax_ab(int game_state[SLOTS],
           Player current,
           int depth,
           bool maximizing,
           Player aiPlayer,
           int alpha,
           int beta)
{
    // Base case: game over or depth limit reached
    if (!can_continue_to_play(game_state) || depth == 0) {
        // Simple evaluation: store difference from AI perspective
        int eval = game_state[STORE_1_POS] - game_state[STORE_2_POS];
        if (aiPlayer == PLAYER_2)
            eval = -eval;
        return { eval, -1 };
    }

    MoveResult best;
    best.score = maximizing ? INT_MIN : INT_MAX;
    best.bestPit = -1;

    for (int pit = 1; pit <= NUM_PITS; pit++) {
        if (!can_play_turn(game_state, current, pit))
            continue;

        // Copy game state for simulation
        int new_state[SLOTS];
        memcpy(new_state, game_state, sizeof(int) * SLOTS);

        bool play_again = false;
        play_turn(new_state, current, pit, &play_again);

        Player next =
          (play_again ? current : (current == PLAYER_1 ? PLAYER_2 : PLAYER_1));

        MoveResult result = minimax_ab(
          new_state, next, depth - 1, next == aiPlayer, aiPlayer, alpha, beta);

        if (maximizing) {
            if (result.score > best.score) {
                best.score = result.score;
                best.bestPit = pit;
            }
            alpha = max(alpha, best.score);
        } else {
            if (result.score < best.score) {
                best.score = result.score;
                best.bestPit = pit;
            }
            beta = min(beta, best.score);
        }

        // Pruning
        if (beta <= alpha)
            break;
    }

    // If no valid moves, just evaluate
    if (best.bestPit == -1) {
        int eval = game_state[STORE_1_POS] - game_state[STORE_2_POS];
        if (aiPlayer == PLAYER_2)
            eval = -eval;
        return { eval, -1 };
    }

    return best;
}