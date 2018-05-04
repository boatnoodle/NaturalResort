$(function() {
  var vm = new Vue({
    el: "#app",
    data: {
      datas: [],
      arr: [],
      obj: [],
      search: {
        from: '',
        to: ''
      }
    },
    methods: {
      async searchReport(){
        await axios.post("http://localhost:5000/report/getDataReportMonthly", this.search)
        .then((result) => {
          this.datas = result.data
          this.loopMonthYear()
        })
        .catch((err) => {
          console.log(err)
        })
      },
      loopMonthYear(){
        this.arr = []
        this.datas.forEach(element => {
          if(this.arr[element.created] != undefined){
            this.arr[element.created].push(element)
          }else{
            this.arr[element.created] = [element]
          }
        })
        
        var start = new Date(this.search.from)
        var end = new Date(this.search.to)
        
        var loop = new Date(start)
        this.obj = []
        var total = 0
        while(loop <= end){
          var loopDate = moment(loop).format('Y-MM-DD')
          var data
          var subTotal = 0
          if(this.arr[loopDate] != undefined){ // เงื่อนไข วันที่มีข้อมูล
            data = this.arr[loopDate]
            data.forEach(element => {
              subTotal+= element.totalPax
            })
          }else{
            data = []
          }
          var obj = {
            date: moment(loop).format('DD/MM/Y'),
            subTotal: subTotal,
            arr: data
          }
          this.obj.push(obj) 
          total+= subTotal
          var newDate = loop.setDate(loop.getDate() + 1)
          loop = new Date(newDate)
        }
        this.obj.total = total
        console.log(this.obj)
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
