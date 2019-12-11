<template>
    <div class="header-container">
        <button @click="restartGame">Restart Game</button>
        <span class="pipe"></span>
        Current Turn  <div :style="{backgroundColor: turn}" class="turn-sign"></div>
    </div>
</template>

<script>
  export default {
    name: "Header",
    props: {
      restartGame: {
        type: Function,
      },
      turn: {
        type: String,
      },
    }
  }
</script>

<style lang="scss" scoped>

    .header-container {
        margin-bottom: 10px;
        color: black;
        button {
            background-color: transparent;
            border-radius: 5px;
            font-size: inherit;
            padding: 4px 10px;
            cursor: pointer;
        }

        .pipe {
            border: 0.5px solid rgba(128, 128, 128, 0.75);
            margin: 0 4px 0 13px;
            padding: 7px 0 9px 0;

        }

        .turn-sign {
            display: inline-block;
            height: 20px;
            width: 20px;
            border-radius: 100px;
            margin-bottom: -5px;
            border: 2px outset buttonface;
            border-image: initial;
        }
    }

</style>