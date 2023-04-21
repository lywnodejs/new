export default {
  methods: {
    mapQuery(query) {
      throw Error('Please override the "mapQuery" method')
    }
  },

  created() {
    const query = this.$route.query

    this.mapQuery(query)
  }
}
