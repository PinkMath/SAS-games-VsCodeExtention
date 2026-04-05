# 🎮 SAS Games Extension for VS Code

Play Tic-Tac-Toe, Snake, Guess-the-word, Minesweeper, and Memory Match directly inside VS Code with this fun and interactive extension!

## Features

### Snake 🐍

- Classic snake game playable inside VS Code.
- Choose skins for your snake (including rainbow mode).
- Smooth animation and responsive controls.
- Restart and change skin anytime.

### Tic-Tac-Toe ❌🔴

- Play against AI or a friend in 1v1 mode.
- Four difficulty modes: Easy, Normal, Hard, 1v1.
- AI last move is always visible.
- Winning line is highlighted with animations.
- Restart or change mode without closing the game.
- Animated pop-in effect for moves.

### Guess the Word 🟩🟨⬜

- Play a word-guessing game inspired by Termo/Wordle directly inside VS Code.
- Supports English and Portuguese languages with instant switching.
- Type letters directly inside the grid squares—no separate input box needed.
- Smooth flip animation reveals correctness of each letter after submission.
- Visual feedback with colors: green for correct, yellow for present, gray for absent letters.
- Responsive layout that adapts seamlessly from desktop to mobile screen sizes.
- Focus highlight on the current typing cell with a distinctive bottom border.
- Reset button to start a new game anytime without restarting VS Code.
- Stylish starry night background with twinkling animated stars for an immersive experience.

### Minesweeper 💣🚩
- Classic Minesweeper gameplay with three difficulty modes: Easy, Normal, and Hard.
- Right-click to place flags (🚩) and avoid mines.
- First click guarantees a safe reveal of a larger area for smooth gameplay.
- Soft and easy-on-the-eyes color palette for long play sessions.
- Boom animation effect when clicking on a mine for satisfying feedback.
- Restart and change difficulty anytime from the controls.

### Memory Match 🧠🃏
- Classic Memory Match game.
- Flip cards and find matching pairs.
- Multiple levels with increasing difficulty.
- Tracks moves and time for a challenge.
- Restart anytime or change difficulty.

## Commands

You can run the games using VS Code commands or assign your own keyboard shortcuts.

| Command               | Description                                     | Default Shortcut   |
| --------------------- | ----------------------------------------------- | ------------------ |
| `SAS: Snake`          | Play a classic Snake game; collect food to grow | `Ctrl+Shift+Alt+S` |
| `SAS: Tic-Tac-Toe`    | Play the classic Tic-Tac-Toe game               | `Ctrl+Shift+Alt+T` |
| `SAS: Guess the word` | Open a word-guessing game panel in VS Code      | `Ctrl+Shift+Alt+G` |
| `SAS: Minesweeper` |  Classic Minesweeper with flags and animations     | `Ctrl+Shift+Alt+N` |
| `SAS: Memory Match` |  Classic Memory Match, choose the rights matchs to win     | `Ctrl+Shift+Alt+M` |

### If the commands don't work use `Ctrl+Shift+P`, and search for the game.


## Installation - VsCode

1. Search for `SAS-games` in the extentions.

2. Download it.

3. Enjoy!

## Installation - Manually

1. Clone or download the repository:
```bash
git clone https://github.com/PinkMath/SAS-games-VsCodeExtention.git
```

2. Open the folder in VS Code.

3. Press F5 to run the extension in a new Extension Development Host.

4. Open the Command Palette `Ctrl+Shift+P` and search for:
- SAS: Snake
- SAS: Tic-Tac-Toe
- SAS: Guess the word
- SAS: Minesweeper
- SAS: Memory Match

5. Enjoy!

## Controls

### Snake 
- Arrow keys to move.
- Select skin from the menu.
- Restart anytime from the button.

### Tic-Tac-Toe 
- Click on a cell to place your move.
- AI moves automatically in Easy/Normal/Hard.
- 1v1 mode allows two players to take turns.
- Restart or change mode using buttons below the board.

### Guess the Word 
- Type letters directly into the grid cells.
- Submit guesses with Enter.
- Switch between English and Portuguese instantly.
- Reset anytime without restarting VS Code.

### Minesweeper 
- Left-click to reveal cells.
- Right-click to place or remove flags (🚩).
- First click is always safe and reveals a larger area.
- Restart or change difficulty anytime from the dropdown and button.

### Memory Match 
- Click cards to flip and reveal them.
- Find matching pairs to clear the board.
- Restart anytime or change difficulty.

## File Structure

```
sas-extension/
├─ package.json
├─ README.md
├─ src/
│  └─ extension.js
└─ webview/
    ├─ snake/
    │   ├─ index.html
    │   ├─ style.css
    │   └─ script.js
    └─ tic-tac-toe/
    │   ├─ index.html
    │   ├─ style.css
    │   └─ script.js
    └─ gtw/
    │    ├─ index.html
    │    ├─ style.css
    │    └─ script.js
    └─ memory/
    │    ├─ index.html
    │    ├─ style.css
    │    └─ script.js
    └─ mine/
         ├─ index.html
         ├─ style.css
         └─ script.js
```
