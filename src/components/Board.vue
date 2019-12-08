<template>
    <span class="board-container">
        <div class="numbers-container"><div v-for="num in numbers" :key="num">{{ num }}</div></div>
        <div style="margin-right: auto;">
            <span class="letters-container"><span v-for="letter in letters" :key="letter">{{ letter }}</span></span>
            <div class="board">
                <div v-for="index in numbers" :key="index" class="row">
                    <span v-for="letter in letters" :key="letter" class="cell">
                        <span class="cell-content" draggable="true">
                            {{ pieces[index+letter] !== undefined? String.fromCharCode(pieces[index+letter]) : ''}}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    </span>
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

        margin-left: auto;
        margin-right: 0;
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
    }

</style>