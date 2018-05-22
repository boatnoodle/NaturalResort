$(function() {
  var vm = new Vue({
    el: "#app",
    data: {
      datas: [],
      search: {
        from: '',
        to: ''
      }
    },
    methods: {
      async searchReport(){
        await axios.post("http://localhost:5000/report/getDataReportRange", this.search)
        .then((result) => {
          console.log(result)
          this.datas = result.data
        })
        .catch((err) => {
          console.log(err)
        })
      },
      print(){
        window.print();
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.searchReport()
    }
  })
})
