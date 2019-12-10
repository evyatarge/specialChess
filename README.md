# Special Chess 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
# 

## Special rules details:

The following moves are supported:

* QUEENS - can move one or two squares in any direction
* PAWNS - can move one or two squares vertically & forward
* ROOKS - can move any number of squares diagonally
* BISHOPS - can move any number of squares vertically and diagonally
* KNIGHTS - move the same as they do in regular chess, they are also the only ones which can "jump" to a new square on the board
* KINGS - can move any number of squares vertically and horizontally
* A move is legal only when it contains only empty squares and ends on an empty square or a square with an enemy piece on it, with the only exception of the Knight

#### Game End
* The game ends when one of the queens dies, or when one of the players quits