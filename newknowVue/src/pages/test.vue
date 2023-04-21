<template>
  <div class="indexBox">
    <video id="example_video_1"
           class="video-js vjs-default-skin"
           controls
           preload="auto"
           width="1280"
           height="720"
           data-setup="{}">
      <source src="rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov"
              type="rtsp/flv">
    </video>
  </div>

</template>

<script>

export default {
  name: 'index',
  data () {
    return {

    }
  },

  methods: {
    playervideo (id) {
      var player = this.$video(id, {}, function onPlayerReady () {
        this.play();
        this.on('ended', function () {
          console.log('Awww...over so soon?!');
        });
      });
    }

  },
  created () {

  },
  mounted () {
    this.playervideo('example_video_1');
  },

}
</script>

<style scoped>
</style>
