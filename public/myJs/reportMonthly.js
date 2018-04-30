$(function() {
  var vm = new Vue({
    el: "#app",
    data: {
      datas: [],
      arr: [],
      obj: [],
      objMonths: {
        nameMonth: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        value: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      },
      yearOld: [],
      optionSearch: {
        month: '04',
        year: '2018'
      }
    },
    methods: {
      getYearOld(){
         var yearNow = moment().format('Y');
         for(let i = parseInt(yearNow); i > (yearNow - 5); i--){
           this.yearOld.push(i)
         }
      },
      async searchReport(){
        await axios.post("http://localhost:5000/report/getDataReportMonthly", this.optionSearch)
        .then((result) => {
          this.datas = result.data
          this.loopMonthYear();
        })
        .catch((err) => {
          console.log(err)
        })
      },
      loopMonthYear(){
        this.datas.forEach(element => {
          if(this.arr[element.created] != undefined){
            this.arr[element.created].push(element)
          }else{
            this.arr[element.created] = [element];
          }
        });
        var month = '04';
        var year = '2018'
        var day = daysInMonth(month,year);
        var start = new Date(`${month}/01/${year}`);
        var end = new Date(`${month}/${day}/${year}`);
        
        var loop = new Date(start);
        while(loop <= end){
          var className = 'detail' + moment(loop).format('D');
          var loopDate = moment(loop).format('Y-MM-DD');
          var data;
          var totalPax = 0;
          if(this.arr[loopDate] != undefined){
            data = this.arr[loopDate]
            data.forEach(element => {
              totalPax+= element.totalPax
            });
          }else{
            data = []
          }
          var obj = {
            nameClass: className,
            date: moment(loop).format('DD/MM/Y'),
            totalPax: totalPax,
            arr: data
          }
          this.obj.push(obj) 
          var newDate = loop.setDate(loop.getDate() + 1);
          loop = new Date(newDate);
        }
      },
      openDetail(target){
        $("."+target).toggle();
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.getYearOld()
      this.searchReport()
      // this.loopMonthYear()
    }
  });
});
function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}