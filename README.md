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

* KING - can move any number of squares vertically and horizontally
* QUEEN - can move one or two squares in any direction
* KNIGHT - move the same as they do in regular chess
* BISHOP - can move any number of squares vertically and diagonally
* ROOK - can move any number of squares diagonally
* PAWN - can move one or two squares vertically & forward

* A move is legal only when it contains only empty squares and ends on an empty square or a square with an enemy piece on it, with the only exception of the Knight

```
* To release picked piece - click it again
```

#### Game End
* The game ends when one of the queens dies, or when one of the players quits