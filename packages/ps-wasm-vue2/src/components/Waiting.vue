<template>
  <div>
    <div class="container">
      <div class="one common"></div>
      <div class="two common"></div>
      <div class="three common"></div>
      <div class="four common"></div>
      <div class="five common"></div>
      <div class="six common"></div>
      <div class="seven common"></div>
      <div class="eight common"></div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
$animateTime: 2.4s;
$itemTime: 1s;
$itemDelay: 0.125s;
.container {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 40rem;
  height: 40rem;
  zoom: 0.24;
  filter: brightness(0.6);
  position: absolute;
  overflow: hidden;
}

.common {
  height: 5rem;
  max-height: 100%;
  overflow: auto;
  width: 2rem;
  margin: auto;
  max-width: 100%;
  position: absolute;
  //background-color: ;
  border-radius: 0 10rem 0 10rem;
  box-shadow: inset 0 0 0 .1rem #E645D0, 0 0 1.5rem 0 #E645D0;
}

.one {
  transform: rotate(45deg);
  left: 0;
  right: 0;
  top: 0;
  bottom: 7.5rem;
}

.two {
  transform: rotate(90deg);
  left: 5.5rem;
  right: 0;
  top: 0;
  bottom: 5.5rem;
}

.three {
  transform: rotate(135deg);
  left: 7.5rem;
  right: 0;
  top: 0;
  bottom: 0;
}

.four {
  transform: rotate(180deg);
  left: 5.5rem;
  right: 0;
  top: 5.5rem;
  bottom: 0;
}

.five {
  transform: rotate(225deg);
  left: 0;
  right: 0;
  top: 7.5rem;
  bottom: 0;
}

.six {
  transform: rotate(270deg);
  left: 0;
  right: 5.5rem;
  top: 5.5rem;
  bottom: 0;
}

.seven {
  transform: rotate(315deg);
  left: 0;
  right: 7.5rem;
  top: 0;
  bottom: 0;
}

.eight {
  transform: rotate(360deg);
  left: 0;
  right: 5.5rem;
  top: 0;
  bottom: 5.5rem;
}

.bar {
  width: 12rem;
  height: .25rem;
  position: absolute;
  left: 0;
  right: 0;
  top: 16rem;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  background: #E645D0;
}

.progress {
  width: 12rem;
  height: .5rem;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  background: #17E1E6;
}

.one {
  animation: one $itemTime ease infinite;
}

@keyframes one {
  0%,
  100% {}
  50% {
    //background: ;
    box-shadow: inset 0 0 0 .1rem #17E1E6, 0 0 1.5rem 0 #17E1E6;
  }
}

.two {
  animation: two $itemTime $itemDelay ease infinite;
}

@keyframes two {
  0%,
  100% {}
  50% {
    //background: ;
    box-shadow: inset 0 0 0 .1rem #17E1E6, 0 0 1.5rem 0 #17E1E6;
  }
}

.three {
  animation: three $itemTime $itemDelay * 2 ease infinite;
}

@keyframes three {
  0%,
  100% {}
  50% {
    //background: ;
    box-shadow: inset 0 0 0 .1rem #17E1E6, 0 0 1.5rem 0 #17E1E6;
  }
}

.four {
  animation: four $itemTime $itemDelay * 3 ease infinite;
}

@keyframes four {
  0%,
  100% {}
  50% {
    //background: ;
    box-shadow: inset 0 0 0 .1rem #17E1E6, 0 0 1.5rem 0 #17E1E6;
  }
}

.five {
  animation: five $itemTime $itemDelay * 4 ease infinite;
}

@keyframes five {
  0%,
  100% {}
  50% {
    //background: ;
    box-shadow: inset 0 0 0 .1rem #17E1E6, 0 0 1.5rem 0 #17E1E6;
  }
}

.six {
  animation: six $itemTime $itemDelay * 5 ease infinite;
}

@keyframes six {
  0%,
  100% {}
  50% {
    //background: ;
    box-shadow: inset 0 0 0 .1rem #17E1E6, 0 0 1.5rem 0 #17E1E6;
  }
}

.seven {
  animation: seven $itemTime $itemDelay * 6 ease infinite;
}

@keyframes seven {
  0%,
  100% {}
  50% {
    //background: ;
    box-shadow: inset 0 0 0 .1rem #17E1E6, 0 0 1.5rem 0 #17E1E6;
  }
}

.eight {
  animation: eight $itemTime $itemDelay * 7 ease infinite;
}

@keyframes eight {
  0%,
  100% {}
  50% {
    //background: ;
    box-shadow: inset 0 0 0 .1rem #17E1E6, 0 0 1.5rem 0 #17E1E6;
  }
}

.container {
  animation: container $animateTime linear infinite;
}

@keyframes container {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

.progress {
  animation: progress 15s ease;
}

@keyframes progress {
  0% {
    left: -24rem;
  }
  10% {
    left: -20rem;
  }
  30% {
    left: -16rem;
  }
  50% {
    left: -12rem;
  }
  65% {
    left: -10rem;
  }
  80% {
    left: -4rem;
  }
  100% {
    left: 0;
  }
}

.fade-in {
  animation: fade-in 2s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.out {
  animation: out 2s 15s ease;
}

@keyframes out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
