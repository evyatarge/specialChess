<template>
    <div class="board-container">
        <div class="numbers-container left"><div v-for="num in numbers" :key="num">{{ num }}</div></div>
        <div>
            <span class="letters-container"><span v-for="letter in letters" :key="letter">{{ letter }}</span></span>
            <div class="board">
                <div v-for="index in numbers" :key="index" class="row">
                    <span v-for="letter in letters"
                          :key="letter"
                          :id="index+letter"
                          class="cell"
                          :style="{border: pickedCell===(index+letter)? '1px solid red' : 'transparent'}"
                          @click="cellClicked({index, letter}, $event)">
                        <span class="cell-content">
                            {{ pieces[index+letter] !== undefined ? pieces[index+letter] : ''}}
                        </span>
                    </span>
                </div>
            </div>
            <span class="letters-container"><span v-for="letter in letters" :key="letter">{{ letter }}</span></span>
        </div>
        <div class="numbers-container right"><div v-for="num in numbers" :key="num">{{ num }}</div></div>
    </div>
</template>

<script>
  export default {
    name: "Board",
    props:{
      pieces:{
        type: Object,
      },
      letters: {
        type: Array,
      },
      numbers: {
        type: Array,
      },
      pickedCell: {
        type: String,
      },
    },

    methods: {
      cellClicked({index, letter}, event){
        this.$emit('cell-clicked', {index: index, letter: letter}, event)
      }
    },
  }
</script>

<style lang="scss" scoped>

    .board-container{
        display: flex;
        flex-direction: row;
    }

    .numbers-container {
        writing-mode: vertical-rl;
        text-orientation: upright;
        line-height: 34px;
        font-size: 28px;
        font-weight: bold;

        display: flex;
        justify-content: space-around;
        padding-top: 20px;

        &.left {
            margin-left: auto;
            margin-right: 0;
        }
        &.right{
            margin-left: 0;
            margin-right: auto;
        }
    }
    .letters-container {
        line-height: 34px;
        font-size: 28px;
        font-weight: bold;

        display: flex;
        justify-content: space-around;
        font-variant-caps: all-petite-caps;
    }

    .board{
        border: black solid 1px;

        display: flex;
        flex-direction: column;

        width: 800px;
        height: 800px;

        :nth-child(even){
            background-color: black;

            :nth-child(even){
                background-color: white;
            }
        }
    }

    .row{
        flex: 8;
        display: flex;
        border: black solid 1px;
    }

    .cell{
        flex: 8;
        font-size: 70px;
        border: transparent solid 1px;

        .cell-content{
            cursor: pointer;
        }
    }

</style>