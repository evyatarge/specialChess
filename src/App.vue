<template>
    <div id="app">
        <button @click="initBoard">Restart Game</button>
        Current Turn is:  <div :style="{backgroundColor: this.turn}" class="turn-sign"></div>
        <Board :letters="letters"
               :numbers="numbers"
               :pieces="piecesLocations"
               :picked-cell="pickedPieceLocation"
               @cell-clicked="clickCellHandle"
               id="game-board"/>
    </div>
</template>

<script>
  import Board from './components/Board.vue'
  import { pieces } from "./constants"
  import Vue from "vue"

  let WHITE = "white"
  let BLACK = "black"

  export default {
    name: 'app',
    components: {
      Board,
    },

    data(){
      return {
        letters : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        numbers : [8,7,6,5,4,3,2,1],
        piecesLocations: {},
        turn: WHITE,
        isPicked: false,
        pickedPieceUnicode: '',
        pickedPieceLocation: '',
      }
    },

    computed:{
      maxMove(){
        return this.numbers.length
      }
    },

    methods:{
      clickCellHandle({index, letter}, event){
        if(this.isPicked && this.notOverrideSameColor(index,letter)){
          if(this.isLegalMovement(index, letter)) {
            if(!this.isGameEnded(index,letter)) {
              Vue.set(this.piecesLocations, index + letter, this.pickedPieceUnicode)
              delete this.piecesLocations[this.pickedPieceLocation]
              this.resetPickedData()
              this.turnChange()
            }
            else{
              this.initBoard()
            }
          }
          else{
            alert("This is not a legal movement for this piece")
          }
        }
        // !this.isPicked => use for "Touch-move rule"
        else if(!this.isPicked && this.isPieceClickedFirst(event) && this.isCurrentTurn(index,letter)){
          this.isPicked = true
          this.pickedPieceUnicode = event.target.innerText
          this.pickedPieceLocation = index+letter

          this.releasePickedIfIsStuck()
        }
      },
      isGameEnded(index, letter){
        if(this.piecesLocations[index+letter] === pieces.W_QUEEN ||
                this.piecesLocations[index+letter] === pieces.B_QUEEN){
          alert("GAME ENDED! \n The "+this.turn.toUpperCase()+" is the winner!")
          return true
        }
        return false
      },
      releasePickedIfIsStuck(){// TODO consider if to make it global for any stuck state or add an option to release
        if(this.pickedPieceUnicode===pieces.B_PAWN && this.getPickedIndex()===1 ||
              this.pickedPieceUnicode===pieces.W_PAWN && this.getPickedIndex()===8){
          this.resetPickedData()
        }
      },

      isPieceClickedFirst(event){
        return !(event.target.firstChild.innerText === '' && !this.isPicked)
      },

      resetPickedData(){
        this.pickedPieceUnicode = ''
        this.pickedPieceLocation = ''
        this.isPicked = false
      },

      turnChange(){
        if(this.turn === WHITE){
          this.turn = BLACK
        }
        else{
          this.turn = WHITE
        }
      },

      notOverrideSameColor(index, letter){
        return (this.turn === WHITE && !this.isWhite(this.piecesLocations[index+letter])) ||
                (this.turn === BLACK && !this.isBlack(this.piecesLocations[index+letter]))
      },

      isBlack(piece){
        return piece === pieces.B_KING || piece === pieces.B_QUEEN || piece === pieces.B_PAWN ||
          piece === pieces.B_ROOK || piece === pieces.B_BISHOP || piece === pieces.B_KNIGHT
      },
      isWhite(piece){
        return piece === pieces.W_KING || piece === pieces.W_QUEEN || piece === pieces.W_PAWN ||
          piece === pieces.W_ROOK || piece === pieces.W_BISHOP || piece === pieces.W_KNIGHT
      },

      isCurrentTurn(index,letter){
        return (this.turn === BLACK && this.isBlack(this.piecesLocations[index+letter])) ||
                (this.turn === WHITE && this.isWhite(this.piecesLocations[index+letter]))
      },

      isLegalMovement(destIndex, destLetter){
        switch (this.pickedPieceUnicode) {
          case pieces.W_PAWN:
          case pieces.B_PAWN:
            return this.pawnIsLegalMove(destIndex, destLetter)
          case pieces.W_QUEEN:
          case pieces.B_QUEEN:
            return this.queenIsLegalMove(destIndex,destLetter)
          case pieces.B_ROOK:
          case pieces.W_ROOK:
            return this.rookIsLegalMove(destIndex,destLetter)
          case pieces.W_BISHOP:
          case pieces.B_BISHOP:
            return this.bishopIsLegalMove(destIndex,destLetter)
          case pieces.W_KNIGHT:
          case pieces.B_KNIGHT:
            return this.knightIsLegalMove(destIndex,destLetter)
          case pieces.W_KING:
          case pieces.B_KING:
            return this.kingIsLegalMove(destIndex,destLetter)
          default:
            alert("Error - legal check without match piece !")
            return true
        }
      },

      getPickedIndex(){
        return parseInt(this.pickedPieceLocation.charAt(0))
      },
      getPickedLetter(){
        return this.pickedPieceLocation.charAt(1)
      },

      // All legal movements
      pawnIsLegalMove(destIndex, destLetter){
        let pickedIndex = this.getPickedIndex()
        let pickedLetter = this.getPickedLetter()

        if(pickedLetter !== destLetter){
          return false
        }
        if(this.turn === WHITE){
          let nextSquare = (pickedIndex+1)+pickedLetter
          return pickedIndex+1 === destIndex || (pickedIndex+2 === destIndex && this.piecesLocations[nextSquare]===undefined )
        }
        else {// Black turn
          let prevSquare = (pickedIndex-1)+pickedLetter
          return pickedIndex-1 === destIndex || (pickedIndex-2 === destIndex && this.piecesLocations[prevSquare]===undefined)
        }
      },

      queenIsLegalMove(destIndex, destLetter){
        return this.isLegalVertically(destIndex, destLetter, 2) ||
                this.isLegalHorizontally(destIndex, destLetter, 2) ||
                 this.isLegalDiagonally(destIndex, destLetter, 2)
      },

      rookIsLegalMove(destIndex,destLetter){
        return this.isLegalDiagonally(destIndex, destLetter, this.maxMove)
      },

      bishopIsLegalMove(destIndex,destLetter){
        return this.isLegalDiagonally(destIndex, destLetter, this.maxMove) ||
                this.isLegalVertically(destIndex, destLetter, this.maxMove)
      },

      knightIsLegalMove(destIndex,destLetter){
        if(destIndex && destLetter){
          return true //TODO - need to implement as the regular knight movement rule
        }
      },

      kingIsLegalMove(destIndex,destLetter){
        return this.isLegalVertically(destIndex, destLetter, this.maxMove) ||
                this.isLegalHorizontally(destIndex, destLetter, this.maxMove)
      },

      // VERTICAL
      isLegalVertically(destIndex, destLetter, stepsAllowed){
        if(this.isVerticallyMove(destLetter)) {
          let pickedIndex = this.getPickedIndex()
          let verticalFree = this.isWayFreeVertical(destIndex, pickedIndex)
          return Math.abs(pickedIndex - destIndex) <= stepsAllowed && verticalFree
        }
        return false
      },
      isWayFreeVertical(destIndex, pickedIndex){
        for(let i = Math.min(destIndex, pickedIndex)+1; i < Math.max(destIndex, pickedIndex); i++){
          if(this.piecesLocations[i+this.getPickedLetter()] !== undefined){
            return false
          }
        }
        return true
      },
      isVerticallyMove(destLetter){
        return destLetter === this.getPickedLetter()
      },

      // HORIZONTAL
      isLegalHorizontally(destIndex, destLetter, stepsAllowed){
        if(this.isHorizontallyMove(destIndex)) {
          let destLetterIndex = this.letters.indexOf(destLetter)
          let pickedLetterIndex = this.letters.indexOf(this.getPickedLetter())

          let isAllowedRange = Math.abs(destLetterIndex - pickedLetterIndex) <= stepsAllowed
          if(isAllowedRange) {
            return this.isWayFreeHorizontal(destLetterIndex, pickedLetterIndex)
          }
        }
        return false
      },
      isWayFreeHorizontal(destLetterIndex, pickedLetterIndex){
        for(let i = Math.min(destLetterIndex, pickedLetterIndex)+1; i < Math.max(destLetterIndex, pickedLetterIndex); i++){
          if(this.piecesLocations[this.getPickedIndex()+this.letters[i]] !== undefined){
            return false
          }
        }
        return true
      },
      isHorizontallyMove(destIndex){
        return destIndex === this.getPickedIndex()
      },

      // DIAGONAL
      isLegalDiagonally(destIndex, destLetter, stepsAllowed){
        let pickedIndex = this.getPickedIndex()
        let destLetterIndex = this.letters.indexOf(destLetter)
        let pickedLetterIndex = this.letters.indexOf(this.getPickedLetter())

        let isAllowedRange = Math.abs(destIndex-pickedIndex)<=stepsAllowed
        if(isAllowedRange) {
          let isDiagonal = Math.abs(destIndex - pickedIndex) === Math.abs(destLetterIndex - pickedLetterIndex)
          if (isDiagonal) {
            return this.isWayFreeDiagonal(destIndex, pickedIndex, destLetterIndex, pickedLetterIndex)
          }
        }
        return false
      },
      isWayFreeDiagonal(destIndex, pickedIndex, destLetterIndex, pickedLetterIndex){
        let firstIndex = Math.min(destIndex, pickedIndex)+1
        let firstLetter = Math.min(destLetterIndex, pickedLetterIndex)+1

        for(let i=firstIndex, j=firstLetter; i < Math.max(destIndex, pickedIndex); i++, j++){
          if(this.piecesLocations[i+this.letters[j]] !== undefined){
            return false
          }
        }
        return true
      },

      initBoard(){
        let allPieces = {
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
        this.letters.forEach((letter)=>{
            let whiteLocation = '2'+letter
            let blackLocation = '7'+letter

            allPieces[whiteLocation] = pieces.W_PAWN
            allPieces[blackLocation] = pieces.B_PAWN
          }
        )

        this.piecesLocations = allPieces
        this.turn = WHITE
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

        button{
            background-color: transparent;
            border-radius: 5px;

            margin-right: 40%;
        }

        .turn-sign{
            display: inline-block;
            height: 20px;
            width: 20px;
            border: solid 1px black;
            border-radius: 100px;
        }
    }

    #game-board{

    }

</style>
