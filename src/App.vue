<template>
    <div id="app">
        <Board :letters="letters" :numbers="numbers" :pieces="initBoard" id="game-board"/>
    </div>
</template>

<script>
  import Board from './components/Board.vue'

  export default {
    name: 'app',
    components: {
      Board,
    },

    data(){
      return {
        letters : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        numbers : [8,7,6,5,4,3,2,1],
      }
    },

    computed: {
      initBoard(){
        let pieces = {
          //Whites
          '1e': '9812',//King
          '1d': '9813',//Queen
          '1a': '9814', '1h': '9814',//Rook
          '1c': '9815', '1f': '9815',//Bishop
          '1b': '9816', '1g': '9816',//Knight

          //Blacks
          '8e': '9818',//King
          '8d': '9819',//Queen
          '8a': '9820', '8h': '9820',//Rook
          '8c': '9821', '8f': '9821',//Bishop
          '8b': '9822', '8g': '9822',//Knight

        }

        // init all Pawns
        this.letters.forEach((letter)=>{
            let whiteLocation = '2'+letter
            let blackLocation = '7'+letter

            pieces[whiteLocation] = '9817'
            pieces[blackLocation] = '9823'
          }
        )

        return pieces
      }
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
