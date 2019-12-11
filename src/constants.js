export const PIECES = {
  //Whites
  W_KING: String.fromCharCode('9812'),
  W_QUEEN: String.fromCharCode('9813'),
  W_ROOK: String.fromCharCode('9814'),
  W_BISHOP: String.fromCharCode('9815'),
  W_KNIGHT: String.fromCharCode('9816'),
  W_PAWN: String.fromCharCode('9817'),

  //Blacks
  B_KING: String.fromCharCode('9818'),
  B_QUEEN: String.fromCharCode('9819'),
  B_ROOK: String.fromCharCode('9820'),
  B_BISHOP: String.fromCharCode('9821'),
  B_KNIGHT: String.fromCharCode('9822'),
  B_PAWN: String.fromCharCode('9823'),

}

export const WHITES = [
  PIECES.W_KING, PIECES.W_QUEEN, PIECES.W_ROOK,
  PIECES.W_BISHOP, PIECES.W_KNIGHT, PIECES.W_PAWN,
]
export const BLACKS = [
  PIECES.B_KING, PIECES.B_QUEEN, PIECES.B_ROOK,
  PIECES.B_BISHOP, PIECES.B_KNIGHT, PIECES.B_PAWN,
]

export const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
export const NUMBERS = [8,7,6,5,4,3,2,1]

export const MAX_QUEEN_MOVEMENT = 2, MAX_PAWN_MOVEMENT = 2