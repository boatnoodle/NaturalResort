$(function() {
    new Vue({
        el: "#app",
        data: {
            datas: [],
            lastedCoupons: [],
            data: {
                runNoStart: '',
                runNoEnd: '',
                agent: '',
                roomNo: '',
                checkIn: '',
                checkOut: '',
                totalDate: '',
                pax: '',
                remarks: '',
                voucher: ''
            },
            status: '',
            statusVoucher: false,
            errorDate: false
        },
        methods: {
            runningNo(){
                var prefix = moment().format('Y') + moment().format('MM') + moment().format('D');
                axios.get('http://localhost:5000/coupon/getLastIdCoupon')
                .then((result) => {
                    var obj = result.data;
                    var runNoEnd = obj.runNoEnd;
                    if(obj != "" && (runNoEnd.substr(4,2) == prefix.substr(4,2))){
                        runNoEnd = runNoEnd.substr(-4)
                        var newId = '000' + (parseInt(runNoEnd) + 1)
                        var id = newId.substr(-4)
                    }else{
                        var id = '0001'
                    }
                    return this.data.runNoStart = prefix + id 
                })
                .catch((err) => {
                    console.log(err)
                })
            },
            submit(){
                if(!this.errorDate){
                    axios.post('http://localhost:5000/coupon/addCoupon',this.data)
                    .then((result)=>{

                        axios.get('http://localhost:5000/coupon/getLastedCoupon')
                        .then((result) => {
                            console.log('fetch lasted coupon')
                            this.lastedCoupons = result.data;
                        })
                        .catch((err) => {
                            console.log(err)
                        })

                        var dateObj = new Date(this.data.checkIn);
                        var start = dateObj.setDate(dateObj.getDate() + 1);
                        var end = new Date(this.data.checkOut);
                        var runNo = this.data.runNoStart;
                        
                        for(let i = 0; i < this.data.pax; i++){

                            var loop = new Date(start);
                            while(loop <= end){

                                var dd = loop.getDate();
                                var mm = loop.getMonth() + 1;
                                var yyyy = loop.getFullYear();

                                if(dd<10){
                                    dd='0'+dd;
                                } 
                                if(mm<10){
                                    mm='0'+mm;
                                } 

                                var date = dd+'/'+mm+'/'+yyyy;

                                document.getElementsByTagName("BODY")[0].onbeforeprint = function() {
                                    $("#date").text(date)
                                    $("#runNo").text(runNo)
                                };

                                window.print();
                                runNo = parseInt(runNo) + 1;
                                var newDate = loop.setDate(loop.getDate() + 1);
                                loop = new Date(newDate);
                            }
                        }
                        this.status = result.data
                        this.runningNo();
                        this.data =  {
                            runNoStart : '',
                            runNoEnd : '',
                            agent : '',
                            roomNo : '',
                            checkIn : '',
                            checkOut : '',
                            totalDate : '',
                            pax : '',
                            remarks : ''
                        }
                        $("#date,#runNo").text('')
                        this.$nextTick(() => { // ES6 arrow function
                            this.$refs.agent.focus();
                        })
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                }
            },
            getStringDate(isoDate){
                return moment(isoDate).format('DD/MM/YYYY')
                // return isoDate.substring(0, 10)
            }
        },
        computed: {
            getAgent(){
                 axios.get('http://localhost:5000/agent/getDataAgent')
                .then((response) => {
                    this.datas = response.data;
                })
                .catch((err)=> {
                    console.log(err)
                })
            },
            async getLastedCoupon(){
                await axios.get('http://localhost:5000/coupon/getLastedCoupon')
                .then((result) => {
                    this.lastedCoupons = result.data;
                    $("#recentCoupon").dataTable().fnDestroy()
                })
                .catch((err) => {
                    console.log(err)
                })
                $("#recentCoupon").DataTable({
                    bDestroy: true,
                    lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
                    order: [[0, "DESC"]]
                  });
            },
            totalDate(){
                if(this.data.checkIn != '' && this.data.checkOut != ''){
                    var dateFrom = new Date(this.data.checkIn);
                    var dateTo = new Date(this.data.checkOut);
                    var different = dateDiffInDays(dateFrom,dateTo);
                    this.data.totalDate = different;
                    
                    return this.data.totalDate
                }
            },
            runNoEnd(){
                if(this.data.checkIn != '' && this.data.checkOut != '' && this.data.pax != ''){
                    var dateFrom = new Date(this.data.checkIn);
                    var dateTo = new Date(this.data.checkOut);
                    var different = dateDiffInDays(dateFrom,dateTo);
                    
                    var prefix = this.data.runNoStart.substr(0,8);
                    var runNoTmp = this.data.runNoStart.substr(-4);

                    var pluseRunNo = different * parseInt(this.data.pax)
                    var newId = '000' + ((parseInt(runNoTmp) + pluseRunNo) - 1);
                    var finalId = newId.substr(-4);
                    var runNoEnd = prefix + finalId;
                    this.data.runNoEnd = runNoEnd
                    return this.data.runNoEnd;
                }
            }
        },
        watch: {
            "data.agent"(val){
                if(val.statusWalkIn){
                    this.statusVoucher = true
                }else{
                    this.statusVoucher = false
                }
            },
            "data.checkIn"(val){
                var dateCheckIn = moment(val),
                    dateCheckOut = moment(this.data.checkOut)
                    if(dateCheckIn != '' && dateCheckOut != '' && dateCheckOut <= dateCheckIn){
                        this.errorDate = true
                    }else{
                        this.errorDate = false
                    }
            },
            "data.checkOut"(val){
                var dateCheckOut = moment(val),
                    dateCheckIn = moment(this.data.checkIn)
                    if(dateCheckIn != '' && dateCheckOut != '' && dateCheckOut <= dateCheckIn){
                        this.errorDate = true
                    }else{
                        this.errorDate = false
                    }
            }
        },
        created(){
            this.getAgent;
            this.getLastedCoupon;
            this.runningNo();
        },
        mounted(){
        }
    });
});
// a and b are javascript Date objects
function dateDiffInDays(a, b) {
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }