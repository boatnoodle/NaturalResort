$(function() {
  var vm = new Vue({
    el: "#app",
    data: {
      datas: [],
      userPaxs: [],
      totalPaxs: 0,
      isReprint: false,
      reprintClass: 'reprintClass',
      normalClass: 'normalClass',
      optionSearch:{
        date: moment().format('Y-MM-DD')
      } 
    },
    methods: {
      async getDailyReport(){
        await axios.post('http://localhost:5000/report/getDataReportDaily',this.optionSearch)
        .then((result) => {
          this.datas = result.data
          $(".reportDaily").dataTable().fnDestroy()
        })
        .catch((err) => {
          console.log(err);
        })
        $(".reportDaily").DataTable({
          bDestroy: true,
          order: [[0, "ASC"]],
          lengthMenu: [[10,20,25, 50, -1], [10,20,25, 50, "All"]],
        })
      },
      async getUserPax(){
        await axios.post('http://localhost:5000/report/getUserPax',this.optionSearch)
        .then((result) => {
          this.userPaxs = result.data
          this.userPaxs.forEach(element => {
            console.log(element)
            this.totalPaxs += element.totalPax
          });
        })
        .catch((err) => {
          console.log(err);
        })
      },
      getType(val){
        if(val == "1"){
          return "คูปองปกติ"
        }else{
          return "คูปองสั่งพิมพ์ใหม่"
        }
      },
      getDateToday(){
        return moment().format('DD/MM/Y')
      },
      print(){
        document.getElementsByTagName("BODY")[0].onbeforeprint = function() {
          $(".reportDaily").dataTable().fnDestroy()
        };
        window.print();
        $(".reportDaily").DataTable({
          bDestroy: true,
          order: [[0, "ASC"]],
          lengthMenu: [[10,20,25, 50, -1], [10,20,25, 50, "All"]],
        })
      }
    },
    computed: {
      
    },
    watch: {},
    mounted() {
      this.getDailyReport()
      this.getUserPax()
    }
  });
});
