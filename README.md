# Bomb mine game (ReactJS, SocketIO) 

## About The Project

This project is designed based on the simulation of the fleet battle game. The game allows opponents to place bombs of different sizes at various positions on the board. The player's task is to find the bombs that the opponent has placed. The game is designed to be intuitive and user-friendly, making it accessible to players of all ages and experience levels.

## Technical Stack

The game is built using the following technologies:

- ReactJS: The structure of the web page and the core functionality and logic of the game.
- SocketIO in JavaScript: The game server is responsible for controlling and exchanging real-time information.

## Features

- Join room with friend by code: Choose room id to play with friend
- Place bomb: Choose position to place bomb for opponent to explore.
- Gameplay: The player who is ready first will have the right to go first. Select a position on the board; if the chosen position has a bomb placed by the opponent, the player gets another turn. If the chosen position does not have a bomb, the turn passes to the opponent. This process repeats. The game ends when one player finds all the positions where the opponent has placed bombs.
