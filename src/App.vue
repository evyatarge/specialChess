<template>
    <div id="app">
        <div class="warnings-info" v-show="warningMessageVisible" @mouseover="warningMessageVisible=false">{{ warningMessage }}</div>
        <Header :restart-game="this.restartGame" :turn="this.turn"/>

        <Board :piecesLocations="piecesLocations"
               :picked-cell="pickedPieceLocation"
               @cell-clicked="clickCellHandle"/>
    </div>
</template>

<script>
  import Board from './components/Board'
  import Header from './components/Header'
  import { PIECES, LETTERS, WHITES, BLACKS, MAX_QUEEN_MOVEMENT, MAX_PAWN_MOVEMENT } from "./constants"

  const WHITE = "white"
  const BLACK = "black"

  export default {
    name: 'app',
    components: {
      Header,
      Board,
    },

    data(){
      return {
        piecesLocations: {},
        turn: WHITE,
        isPicked: false,
        pickedPieceUnicode: '',
        pickedPieceLocation: '',
        warningMessage:'This is not a legal movement',
        warningMessageVisible: false,
      }
    },

    computed:{
      pickedIndex(){
        return parseInt(this.pickedPieceLocation.charAt(0))
      },
      pickedLetter(){
        return this.pickedPieceLocation.charAt(1)
      },
      pickedLetterIndex(){
        return LETTERS.indexOf(this.pickedLetter)
      },
      isWhiteTurn(){
        return this.turn === WHITE
      },
      isBlackTurn(){
        return this.turn === BLACK
      },
    },

    methods:{
      clickCellHandle({index, letter}){
        if(!this.isPicked){
          this.pick(index,letter)
        }
        else {
          if(this.isClickSamePieceTwice(index,letter)){
            this.resetPickedData()
          }
          this.putDownPickedPiece(index,letter)
        }
      },

      pick(index, letter){
        if (this.pieceBelongsToPlayer(this.piecesLocations[index+letter])) {
          this.isPicked = true
          this.pickedPieceUnicode = this.piecesLocations[index+letter]
          this.pickedPieceLocation = index + letter
        }
      },

      putDownPickedPiece(index, letter){
        if(this.isLegalMovement(index, letter)) {
          this.warningMessageVisible = false
          if (!this.doesMoveEndTheGame(this.piecesLocations[index + letter])) {
            this.movePieceTo(index, letter)
          }
          else {
            this.endGame(index,letter)
          }
        }
        else{
          this.warningMessageVisible = true
        }
      },
      doesMoveEndTheGame(targetPiece){
        return targetPiece === PIECES.W_QUEEN || targetPiece === PIECES.B_QUEEN;
      },
      endGame(index,letter){
        const message = `GAME OVER ! \n ${this.turn.toUpperCase()} is the winner! \n Do you want to start a new game?`
        confirm(message) ? this.restartGame() : this.movePieceTo(index, letter)
      },

      movePieceTo(index, letter){
        this.piecesLocations[index+letter] = this.pickedPieceUnicode
        delete this.piecesLocations[this.pickedPieceLocation]
        this.resetPickedData()
        this.switchTurn()
      },

      isClickSamePieceTwice(index, letter){
        return this.isPicked &&
                index===this.pickedIndex &&
                letter===this.pickedLetter
      },

      resetPickedData(){
        this.pickedPieceUnicode = ''
        this.pickedPieceLocation = ''
        this.isPicked = false
      },

      switchTurn(){
        this.turn = this.isWhiteTurn? BLACK : WHITE
      },

      notOverrideSameColor(targetPiece){
        return (this.isWhiteTurn && !this.isWhite(targetPiece)) ||
                (this.isBlackTurn && !this.isBlack(targetPiece))
      },

      isBlack(piece){
        return BLACKS.includes(piece)
      },
      isWhite(piece){
        return  WHITES.includes(piece)
      },

      pieceBelongsToPlayer(piece){
        return !!piece && (this.isBlackTurn && this.isBlack(piece)) ||
                            (this.isWhiteTurn && this.isWhite(piece))
      },

      isLegalMovement(destIndex, destLetter){
        if(this.notOverrideSameColor(this.piecesLocations[destIndex+destLetter])) {
          switch (this.pickedPieceUnicode) {
            case PIECES.W_PAWN:
            case PIECES.B_PAWN:
              return this.pawnIsLegalMove(destIndex, destLetter)
            case PIECES.W_QUEEN:
            case PIECES.B_QUEEN:
              return this.queenIsLegalMove(destIndex, destLetter)
            case PIECES.B_ROOK:
            case PIECES.W_ROOK:
              return this.rookIsLegalMove(destIndex, destLetter)
            case PIECES.W_BISHOP:
            case PIECES.B_BISHOP:
              return this.bishopIsLegalMove(destIndex, destLetter)
            case PIECES.W_KNIGHT:
            case PIECES.B_KNIGHT:
              return this.knightIsLegalMove(destIndex, destLetter)
            case PIECES.W_KING:
            case PIECES.B_KING:
              return this.kingIsLegalMove(destIndex, destLetter)
          }
        }
      },

      // All legal movements
      pawnIsLegalMove(destIndex, destLetter){
        const isAllowedRange = Math.abs(this.pickedIndex-destIndex) <= MAX_PAWN_MOVEMENT
        if(this.isVerticalMove(destLetter) && this.isWayFreeVertical(destIndex) && isAllowedRange) {
          if (this.isWhiteTurn) {
            return this.pickedIndex < destIndex
          }
          else {// Black turn
            return this.pickedIndex > destIndex
          }
        }
        return false
      },

      queenIsLegalMove(destIndex, destLetter){
        const isAllowedRange = this.rangeAllowedForQueen(destIndex, destLetter)

        return isAllowedRange &&
                (this.isLegalVertically(destIndex, destLetter) ||
                this.isLegalHorizontally(destIndex, destLetter) ||
                this.isLegalDiagonally(destIndex, destLetter))
      },

      rangeAllowedForQueen(destIndex, destLetter){
        if(this.isHorizontalMove(destIndex)){
          const destLetterIndex = LETTERS.indexOf(destLetter)
          return Math.abs(destLetterIndex - this.pickedLetterIndex) <= MAX_QUEEN_MOVEMENT
        }
        else {
          return Math.abs(destIndex - this.pickedIndex) <= MAX_QUEEN_MOVEMENT
        }
      },

      rookIsLegalMove(destIndex,destLetter){
        return this.isLegalDiagonally(destIndex, destLetter)
      },

      bishopIsLegalMove(destIndex,destLetter){
        return this.isLegalDiagonally(destIndex, destLetter) ||
                this.isLegalVertically(destIndex, destLetter)
      },

      // ♚
      kingIsLegalMove(destIndex,destLetter){
        return this.isLegalVertically(destIndex, destLetter) ||
                this.isLegalHorizontally(destIndex, destLetter)
      },

      // ♞
      knightIsLegalMove(destIndex,destLetter){
        let destLetterIndex = LETTERS.indexOf(destLetter)

        let lettersMovement = Math.abs(destLetterIndex - this.pickedLetterIndex)
        let indexMovement = Math.abs(destIndex - this.pickedIndex)

        return (lettersMovement===1 && indexMovement===2) ||
                (lettersMovement===2 && indexMovement===1)
      },

      // VERTICAL
      isLegalVertically(destIndex, destLetter){
        if(this.isVerticalMove(destLetter)) {
          return this.isWayFreeVertical(destIndex)
        }
        return false
      },
      isWayFreeVertical(destIndex){
        let minIndex = Math.min(destIndex, this.pickedIndex)
        let maxIndex = Math.max(destIndex, this.pickedIndex)
        for(let i = minIndex+1; i < maxIndex; i++){
          if(this.piecesLocations[i+this.pickedLetter] !== undefined){
            return false
          }
        }
        return true
      },
      isVerticalMove(destLetter){
        return destLetter === this.pickedLetter
      },

      // HORIZONTAL
      isLegalHorizontally(destIndex, destLetter){
        if(this.isHorizontalMove(destIndex)) {
          let destLetterIndex = LETTERS.indexOf(destLetter)
          return this.isWayFreeHorizontal(destLetterIndex)
        }
        return false
      },
      isWayFreeHorizontal(destLetterIndex){
        let minLetter = Math.min(destLetterIndex, this.pickedLetterIndex)
        let maxLetter = Math.max(destLetterIndex, this.pickedLetterIndex)
        for(let i = minLetter+1; i < maxLetter; i++){
          if(this.piecesLocations[this.pickedIndex+LETTERS[i]] !== undefined){
            return false
          }
        }
        return true
      },
      isHorizontalMove(destIndex){
        return destIndex === this.pickedIndex
      },

      // DIAGONAL
      isLegalDiagonally(destIndex, destLetter){
        const destLetterIndex = LETTERS.indexOf(destLetter)
        if(this.isDiagonalMove(destIndex, destLetterIndex)) {
          return this.isWayFreeDiagonal(destIndex, destLetterIndex)
        }
        return false
      },
      isDiagonalMove(destIndex, destLetterIndex){
        return Math.abs(destIndex - this.pickedIndex) === Math.abs(destLetterIndex - this.pickedLetterIndex)
      },
      isWayFreeDiagonal(destIndex, destLetterIndex){
        let increaseAccordingly = this.isSecondaryDiagonal(destIndex, destLetterIndex)
        let minLetterToCheck = Math.min(destLetterIndex, this.pickedLetterIndex)+1
        let maxLetterToCheck = Math.max(destLetterIndex, this.pickedLetterIndex)-1
        let maxIndexToCheck = Math.max(destIndex, this.pickedIndex)

        let indexToCheck = Math.min(destIndex, this.pickedIndex)+1
        let letterToCheck = increaseAccordingly? minLetterToCheck : maxLetterToCheck

        while(indexToCheck < maxIndexToCheck){
          if(this.piecesLocations[indexToCheck+LETTERS[letterToCheck]] !== undefined){
            return false
          }
          indexToCheck++
          increaseAccordingly? letterToCheck++ : letterToCheck--
        }

        return true
      },

      isSecondaryDiagonal(destIndex, destLetterIndex){
        return (destIndex > this.pickedIndex && destLetterIndex > this.pickedLetterIndex) ||
                (destIndex < this.pickedIndex && destLetterIndex < this.pickedLetterIndex)
      },

      initBoard(){
        const allPiecesLocations = {
          //Whites
          '1e': PIECES.W_KING,
          '1d': PIECES.W_QUEEN,
          '1a': PIECES.W_ROOK, '1h': PIECES.W_ROOK,
          '1c': PIECES.W_BISHOP, '1f': PIECES.W_BISHOP,
          '1b': PIECES.W_KNIGHT, '1g': PIECES.W_KNIGHT,

          //Blacks
          '8e': PIECES.B_KING,
          '8d': PIECES.B_QUEEN,
          '8a': PIECES.B_ROOK, '8h': PIECES.B_ROOK,
          '8c': PIECES.B_BISHOP, '8f': PIECES.B_BISHOP,
          '8b': PIECES.B_KNIGHT, '8g': PIECES.B_KNIGHT,
        }
        // init all Pawns
        for(let letter of LETTERS) {
          let whiteLocation = '2' + letter
          let blackLocation = '7' + letter

          allPiecesLocations[whiteLocation] = PIECES.W_PAWN
          allPiecesLocations[blackLocation] = PIECES.B_PAWN
        }

        this.piecesLocations = allPiecesLocations
      },

      restartGame(){
        this.turn = WHITE
        this.resetPickedData()
        this.initBoard()
      }
    },

    created() {
      this.initBoard()
    }
  }
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #862e11;
        margin-top: 30px;
    }

    .warnings-info{
        position: absolute;
        top: 20px;
        left: 20px;
        font-size: x-large;
        color: red;
        -webkit-animation: fadeinout 3s linear forwards;
        animation: fadeinout 3s linear forwards;
    }
    @-webkit-keyframes fadeinout {
        0%,100% { opacity: 0; }
        100% { opacity: 1; }
    }
    @keyframes fadeinout {
        0%,100% { opacity: 0; }
        100% { opacity: 1; }
    }

</style>
