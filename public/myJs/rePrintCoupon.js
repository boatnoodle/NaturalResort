$(function() {
  var vm = new Vue({
    el: "#app",
    data: {
      datas: [],
      dataReprints: [],
      reprints: [],
      selected: [],
      dataEx: {},
      data: {
        runNoStart: "",
        runNoEnd: ""
      },
      dataReprint: {
        runNoStart: "",
        runNoEnd: "",
        remark: ""
      },
      status: "",
      columnsReprint: [
        { data: "couponId" },
        { data: "runNoStart" },
        { data: "runNoEnd" },
        { data: "remarks" },
        { data: "created" }
      ]
    },
    methods: {
      async getReprintCoupon(){
        await axios.get("http://localhost:5000/coupon/getReprint")
        .then((result) => {
          this.dataReprints = result.data
          $(".rePrint").dataTable().fnDestroy()
        })
        .catch((err) => {
          console.log(err)
        })
        $(".rePrint").DataTable({
          bDestroy: true,
          lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
          order: [[0, "DESC"]]
        });
      },
      async searchCoupon() {
        await axios
          .post("http://localhost:5000/coupon/getBetweenCoupon", this.data)
          .then(result => {
            this.datas = result.data;
            this.selected = this.datas;
            $(".searchReprint").dataTable().fnDestroy()
          })
          .catch(err => {
            console.log(err);
          });

        $(".searchReprint").DataTable({
          // bRetrieve: true,
          // bProcessing: true,
          bDestroy: true,
          lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]]
        });
      },
      getStringDate(isoDate) {
        return moment(isoDate).format("DD/MM/YYYY");
      },
      viewCouponEx(obj) {
        var obj = {
          runNo: obj.runNo,
          date: this.getStringDate(obj.date),
          roomNo: obj.roomNo
        };
        $("#date").text(obj.date);
        $("#runNo").text(obj.runNo);
        $("#roomNo").text(obj.roomNo);
      },
      async rePrint() {
        this.selected.forEach(function(data) {
          document.getElementsByTagName("BODY")[0].onbeforeprint = function() {
            $("#date").text(moment(data.date).format("DD/MM/YYYY"));
            $("#runNo").text(data.runNo);
            $("#roomNo").text(data.roomNo);
          };
          window.print();
        });
        this.selected.sort(function(a, b) {
          return a.runNo - b.runNo;
        });
        this.dataReprint.runNoStart = this.selected[0].runNo;
        this.dataReprint.runNoEnd = this.selected[this.selected.length - 1].runNo;

        await axios
          .post("http://localhost:5000/coupon/reprintCoupon", this.dataReprint)
          .then(result => {
            this.dataReprint = {
              runNoStart: "",
              runNoEnd: "",
              remark: ""
            }
            this.status = result.data;
          })
          .catch(err => {
            console.log(err);
          });
          this.getReprintCoupon();
        $("#date, #runNo ,#roomNo").text("");
      },
      dateFormat(date) {
        return moment(date).format("DD/MM/YYYY");
      }
    },
    computed: {
      selectAll: {
        get: function() {
          return this.datas ? this.selected.length == this.datas.length : false;
        },
        set: function(value) {
          var selected = [];

          if (value) {
            this.datas.forEach(function(data) {
              selected.push(data);
            });
          }

          this.selected = selected;
        }
      }
    },
    watch: {},
    mounted() {
      this.getReprintCoupon();
      this.searchCoupon();
    }
  });
});

