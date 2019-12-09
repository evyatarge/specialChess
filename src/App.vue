<template>
    <div id="app">
        <Board :letters="letters"
               :numbers="numbers"
               :pieces="piecesLocations"
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

    methods:{
      clickCellHandle({index, letter}, event){
        if(this.isPicked && this.notOverrideSameColor(index,letter)){
          Vue.set(this.piecesLocations, index+letter, this.pickedPieceUnicode)
          delete this.piecesLocations[this.pickedPieceLocation]
          this.resetPickedData()
          this.turnChange()
        }
        // !this.isPicked => use for "Touch-move rule"
        else if(!this.isPicked && this.isPieceClickedFirst(event) && this.isCurrentTurn(index,letter)){
          this.isPicked = true
          this.pickedPieceUnicode = event.target.innerText
          this.pickedPieceLocation = index+letter
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

    },

    created() {
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
    }
  }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    #game-board{

    }

</style>
