<template>
    <div id="app">
        <Header :restart-game="this.restartGame" :turn="this.turn"/>

        <Board :piecesLocations="piecesLocations"
               :picked-cell="pickedPieceLocation"
               @cell-clicked="clickCellHandle"/>
    </div>
</template>

<script>
  import Board from './components/Board'
  import Header from './components/Header'
  import { pieces, letters } from "./constants"

  const WHITE = "white"
  const BLACK = "black"
  const maxMove = letters.length

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
        return letters.indexOf(this.pickedLetter)
      }
    },

    methods:{
      clickCellHandle({index, letter}){
        let pieceAtLocation = this.piecesLocations[index+letter]

        if(this.isClickSamePieceAgain(index,letter)){
          this.resetPickedData()
        }
        else if(this.isPicked && this.isLegalMovement(index, letter)){
          if(!this.isGameEnded(pieceAtLocation)) {
            this.movePieceTo(index, letter)
            this.resetPickedData()
            this.switchTurn()
          }
          else{
            let message = "GAME OVER ! \n "+this.turn.toUpperCase()+" is the winner! \n Do you want to start a new game?"
            confirm(message)? this.restartGame() : this.movePieceTo(index,letter)
          }
        }
        else if(!this.isPicked && this.isCurrentTurn(pieceAtLocation)){
          this.isPicked = true
          this.pickedPieceUnicode = pieceAtLocation
          this.pickedPieceLocation = index+letter
        }
      },

      isGameEnded(targetPiece){
        return targetPiece === pieces.W_QUEEN || targetPiece === pieces.B_QUEEN;

      },

      movePieceTo(index, letter){
        this.piecesLocations[index+letter] = this.pickedPieceUnicode
        delete this.piecesLocations[this.pickedPieceLocation]
      },

      isClickSamePieceAgain(index, letter){
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
        this.turn = this.turn===WHITE? BLACK : WHITE
      },

      notOverrideSameColor(targetPiece){
        return (this.turn === WHITE && !this.isWhite(targetPiece)) ||
                (this.turn === BLACK && !this.isBlack(targetPiece))
      },

      isBlack(piece){
        return piece === pieces.B_KING || piece === pieces.B_QUEEN || piece === pieces.B_PAWN ||
                piece === pieces.B_ROOK || piece === pieces.B_BISHOP || piece === pieces.B_KNIGHT
      },
      isWhite(piece){
        return piece === pieces.W_KING || piece === pieces.W_QUEEN || piece === pieces.W_PAWN ||
                piece === pieces.W_ROOK || piece === pieces.W_BISHOP || piece === pieces.W_KNIGHT
      },

      isCurrentTurn(piece){
        return (this.turn === BLACK && this.isBlack(piece)) ||
                (this.turn === WHITE && this.isWhite(piece))
      },

      isLegalMovement(destIndex, destLetter){
        if(this.notOverrideSameColor(this.piecesLocations[destIndex+destLetter])) {
          switch (this.pickedPieceUnicode) {
            case pieces.W_PAWN:
            case pieces.B_PAWN:
              return this.pawnIsLegalMove(destIndex, destLetter)
            case pieces.W_QUEEN:
            case pieces.B_QUEEN:
              return this.queenIsLegalMove(destIndex, destLetter)
            case pieces.B_ROOK:
            case pieces.W_ROOK:
              return this.rookIsLegalMove(destIndex, destLetter)
            case pieces.W_BISHOP:
            case pieces.B_BISHOP:
              return this.bishopIsLegalMove(destIndex, destLetter)
            case pieces.W_KNIGHT:
            case pieces.B_KNIGHT:
              return this.knightIsLegalMove(destIndex, destLetter)
            case pieces.W_KING:
            case pieces.B_KING:
              return this.kingIsLegalMove(destIndex, destLetter)
          }
        }
      },

      // All legal movements
      pawnIsLegalMove(destIndex, destLetter){
        if(this.isVerticalMove(destLetter) && this.isWayFreeVertical(destIndex)) {
          if (this.turn === WHITE) {
            return this.pickedIndex + 1 === destIndex || this.pickedIndex + 2 === destIndex
          }
          else {// Black turn
            return this.pickedIndex - 1 === destIndex || this.pickedIndex - 2 === destIndex
          }
        }
        return false
      },

      queenIsLegalMove(destIndex, destLetter){
        return this.isLegalVertically(destIndex, destLetter, 2) ||
                this.isLegalHorizontally(destIndex, destLetter, 2) ||
                this.isLegalDiagonally(destIndex, destLetter, 2)
      },

      rookIsLegalMove(destIndex,destLetter){
        return this.isLegalDiagonally(destIndex, destLetter, maxMove)
      },

      bishopIsLegalMove(destIndex,destLetter){
        return this.isLegalDiagonally(destIndex, destLetter, maxMove) ||
                this.isLegalVertically(destIndex, destLetter, maxMove)
      },

      // ♚
      kingIsLegalMove(destIndex,destLetter){
        return this.isLegalVertically(destIndex, destLetter, maxMove) ||
                this.isLegalHorizontally(destIndex, destLetter, maxMove)
      },

      // ♞
      knightIsLegalMove(destIndex,destLetter){
        let destLetterIndex = letters.indexOf(destLetter)

        let lettersMovement = Math.abs(destLetterIndex - this.pickedLetterIndex)
        let numbersMovement = Math.abs(destIndex - this.pickedIndex)

        return (lettersMovement===1 && numbersMovement===2) ||
                (lettersMovement===2 && numbersMovement===1)
      },

      // VERTICAL
      isLegalVertically(destIndex, destLetter, stepsAllowed){
        if(this.isVerticalMove(destLetter)) {
          let isAllowedRange = Math.abs(this.pickedIndex - destIndex) <= stepsAllowed
          return isAllowedRange && this.isWayFreeVertical(destIndex)
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
      isLegalHorizontally(destIndex, destLetter, stepsAllowed){
        if(this.isHorizontalMove(destIndex)) {
          let destLetterIndex = letters.indexOf(destLetter)
          let isAllowedRange = Math.abs(destLetterIndex - this.pickedLetterIndex) <= stepsAllowed
          return isAllowedRange && this.isWayFreeHorizontal(destLetterIndex)
        }
        return false
      },
      isWayFreeHorizontal(destLetterIndex){
        let minLetter = Math.min(destLetterIndex, this.pickedLetterIndex)
        let maxLetter = Math.max(destLetterIndex, this.pickedLetterIndex)
        for(let i = minLetter+1; i < maxLetter; i++){
          if(this.piecesLocations[this.pickedIndex+letters[i]] !== undefined){
            return false
          }
        }
        return true
      },
      isHorizontalMove(destIndex){
        return destIndex === this.pickedIndex
      },

      // DIAGONAL
      isLegalDiagonally(destIndex, destLetter, stepsAllowed){
        let destLetterIndex = letters.indexOf(destLetter)
        if(this.isDiagonalMove(destIndex, destLetterIndex)) {
          let isAllowedRange = Math.abs(destIndex - this.pickedIndex) <= stepsAllowed
          if (isAllowedRange) {
            return this.isWayFreeDiagonal(destIndex, destLetterIndex)
          }
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
          if(this.piecesLocations[indexToCheck+letters[letterToCheck]] !== undefined){
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
        let allPiecesLocations = {
          //Whites
          '1e': pieces.W_KING,
          '1d': pieces.W_QUEEN,
          '1a': pieces.W_ROOK, '1h': pieces.W_ROOK,
          '1c': pieces.W_BISHOP, '1f': pieces.W_BISHOP,
          '1b': pieces.W_KNIGHT, '1g': pieces.W_KNIGHT,

          //Blacks
          '8e': pieces.B_KING,
          '8d': pieces.B_QUEEN,
          '8a': pieces.B_ROOK, '8h': pieces.B_ROOK,
          '8c': pieces.B_BISHOP, '8f': pieces.B_BISHOP,
          '8b': pieces.B_KNIGHT, '8g': pieces.B_KNIGHT,

        }
        // init all Pawns
        letters.forEach((letter)=>{
            let whiteLocation = '2'+letter
            let blackLocation = '7'+letter

            allPiecesLocations[whiteLocation] = pieces.W_PAWN
            allPiecesLocations[blackLocation] = pieces.B_PAWN
          }
        )

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
</style>
