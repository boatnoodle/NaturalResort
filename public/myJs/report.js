$(function() {
  var vm = new Vue({
    el: "#app",
    data: {
      datas: [],
      isReprint: false,
      reprintClass: 'reprintClass',
      normalClass: 'normalClass'
    },
    methods: {
      async getDailyReport(){
        await axios.get('http://localhost:5000/report/getDataReportDaily')
        .then((result) => {
          this.datas = result.data
        })
        .catch((err) => {
          console.log(err);
        })
        $(".dataTable").DataTable({
          order: [[0, "ASC"]],
          lengthMenu: [[15,20,25, 50, -1], [15,20,25, 50, "All"]],
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
      }
    },
    computed: {
      
    },
    watch: {},
    mounted() {
      this.getDailyReport()
    }
  });
});
