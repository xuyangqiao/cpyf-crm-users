<template>
  <div>
    <div class="time-bar" v-if="data">
      <group label-align="left" gutter='0'>
        <span class="selectDay" :class='{disabled: preDisable}' @click='prevDay'>
          <span class="prevDay"></span>
          <span class="text">上一天</span>
        </span>
        <popup-picker title="" :data="timeList" @on-hide='sureSelectTime' value-text-align='center' v-model="time"></popup-picker>
        <span class="selectDay" :class='{disabled: nextDisable}' @click='nextDay'>
          <span class="text">下一天</span>
          <span class="nextDay"></span>
        </span>
      </group>
      <group label-align="left" gutter='0' class="filter-bar">
        <x-switch title="只显示坐诊有号医生" v-model="filterValue"></x-switch>
      </group>
    </div>
    <div class="doctor-section">
      <div class="doctor-item" v-for="(item, index) in filterList">
        <div class="doctor-top" @click='showMarkIndex(index)'>
          <div class="avatar">
            <img :src="item.avatar">
          </div>
          <div class="doctor-msg">
            <h2 class="name">{{item.name}}<span class="text">{{item.title_title}}</span></h2>
            <span class="desc" v-html="item.disease"></span>
          </div>
          <div class="doctor-mark">
            <!--<h2 class="number">{{item.am + item.pm | filterCount(item)}}</h2>-->
            <!-- <h2 class="number">{{filterCount(item)}}</h2> -->
            <span class="number green" v-if="item.am + item.pm > 10">有号</span>
            <span class="number red" v-else-if="item.am + item.pm <= 10 && item.am + item.pm > 0">紧张</span>
            <span class="number red" v-else-if="item.am + item.pm === 0">号满</span>
            <span class="number gray" v-else-if="item.am < 0 && item.pm < 0">未坐诊</span>
          </div>
          <div class="arrow-icon" :class='{active: showIndex === index}'></div>
        </div>
        <div class="doctor-content vux-1px-t" v-if="showIndex === index">
          <div class="content-item">
            <div class="mark-logo">am</div>
            <div class="mark-title">上午</div>
            <!-- <div class="mark-number" v-if="item.am > 0">{{item.am}}</div> -->
            <div class="mark-number" v-if="item.am > 10">有号</div>
            <div class="mark-number red" v-else-if="item.am <= 10 && item.am > 0">紧张</div>
            <div class="mark-number gray" v-else-if="item.am < 0">未坐诊</div>
            <div class="mark-number red" v-else-if="item.am === 0">号满</div>
            <x-button @click.native='message(item, 1)' :disabled='item.am <= 0'>预约</x-button>
          </div>
          <div class="content-item">
            <div class="mark-logo">pm</div>
            <div class="mark-title">下午</div>
            <!-- <div class="mark-number" v-if="item.pm > 0">{{item.pm}}</div> -->
            <div class="mark-number" v-if="item.pm > 10">有号</div>
            <div class="mark-number red" v-else-if="item.pm <= 10 && item.pm > 0">紧张</div>
            <div class="mark-number red" v-else-if="item.pm === 0">号满</div>
            <div class="mark-number gray" v-else-if="item.pm < 0">未坐诊</div>
            <x-button :disabled='item.pm <= 0' @click.native='message(item, 2)'>预约</x-button>
          </div>
        </div>
      </div>
    </div>

    <!--就诊人提示-->
    <noclient :tipShow='!!$store.state.userDefault.count'></noclient>
  </div>
</template>

<script>
  import { Group, PopupPicker, XSwitch, XButton } from 'vux'
  import noclient from '@/components/noclient'
  import { listTime } from '@/utils'
  import api from '@/api'

  export default {
    components: {
      Group,
      PopupPicker,
      XSwitch,
      XButton,
      noclient
    },
    data () {
      return {
        timeList: [],
        time: [],
        filterValue: false,
        showIndex: -1,
        data: '',
        doctorList: []
      }
    },
    // watch: {
    //   'time': 'fetchDataInfo'
    // },
    created () {
      this.fetchData()
    },
    computed: {
      userDefault () {
        return this.$store.state.userDefault
      },
      preDisable () {
        let index = this.timeList[0].indexOf(this.time[0])
        if (index <= 0) {
          return true
        } else {
          return false
        }
      },
      nextDisable () {
        let index = this.timeList[0].indexOf(this.time[0])
        if (index >= this.timeList[0].length - 1) {
          return true
        } else {
          return false
        }
      },
      filterList () {
        if (this.filterValue) {
          return this.doctorList.filter((item) => {
            return item.am + item.pm > 0
          })
        } else {
          return this.doctorList
        }
      }
    },
    methods: {
      message (item, time) {
        // time => 1代表上午 2代表下午，由按钮传入
        const date = this.time[0].split(' ')[0]
        const handDate = date.replace(/-/g, '/')
        if (time === 1) {
          let maxTime = new Date(handDate + ' 09:30').getTime()
          let nowTime = new Date().getTime()
          if (nowTime >= maxTime) {
            this.toast('上午预约时间已截止')
            return
          }
        } else {
          let maxTime = new Date(handDate + ' 14:30').getTime()
          let nowTime = new Date().getTime()
          if (nowTime >= maxTime) {
            this.toast('下午预约时间已截止')
            return
          }
        }
        let data = {}
        data = Object.assign({date: date}, {time: time}, item)
        this.$store.commit('reserveInfo', data)
        this.$router.push('/message')
      },
      showMarkIndex (index) {
        this.showIndex = this.showIndex === index ? -1 : index
      },
      sureSelectTime (type) {
        if (type) {
          this.fetchDataInfo()
        }
      },

      // 过滤总数，因为其中会出现-1
      filterCount (item) {
        if (item.am < 0 && item.pm < 0) {
          return '未坐诊'
        }
        if (item.am < 0) {
          return 0 + item.pm
        }
        if (item.pm < 0) {
          return 0 + item.am
        }
        return item.am + item.pm
      },
      async fetchData () {
        const {data: {code, data}} = await api.get('/Users/Doctorwork/DoctorWork')
        if (code === 200 && data) {
          this.shareMsg()
          this.data = data
          let list = listTime(data.start_time, data.end_time)
          this.timeList.push(list)

          let today = data.start_time
          let formatToday = new Date(today).format()
          this.time[0] = formatToday

          // 判断当前时间
          const date = data.start_time
          const handDate = date.replace(/-/g, '/')
          let maxTime = new Date(handDate + ' 14:30').getTime()
          let nowTime = new Date().getTime()
          if (nowTime >= maxTime) {
            this.nextDay()
            return
          }
          this.doctorList = data.doctor_list
        }
      },
      nextDay () {
        let index = this.timeList[0].indexOf(this.time[0])
        index++
        if (index >= this.timeList[0].length) {
          return
        }
        this.time.splice(0, 1, this.timeList[0][index])
        this.fetchDataInfo()
      },
      prevDay () {
        let index = this.timeList[0].indexOf(this.time[0])
        index--
        if (index < 0) {
          return
        }
        this.time.splice(0, 1, this.timeList[0][index])
        this.fetchDataInfo()
      },
      async fetchDataInfo () {
        const date = this.time[0].split(' ')[0]
        const {data: {code, data}} = await api.get('Users/Doctorwork/EveryDayWork', {work_time: date})
        if (code === 200 && data) {
          this.doctorList = data.doctor_list
        }
      },
      shareMsg () {
        this.$wechat.ready(() => {
          this.$wechat.ready(() => {
            this.wechatShare({
              title: this.userDefault.truename + '推荐您预约川派医方馆疼痛专家',
              link: this.handUrl(location.hash),
              img: 'http://qpic.cn/6oICaLv7r',
              desc: '川派医方馆，专治头颈肩腰四肢关节疼痛！'
            })
          })
        })
      }
    }
  }
</script>

<style lang="less">
  .time-bar{
    color: #09bb07;
    box-shadow: 0 2px 2px rgba(16, 4, 10, 0.11);
    .weui-cell{
      padding: 0;
      height: 100%;
    }
    .weui-cells{
      display: flex;
      justify-content: space-between;
      height: 0.88rem;
      line-height: 0.88rem;
      &:before{
        display: none;
      }
      .selectDay{
        font-size: 0.3rem;
        padding: 0 0.3rem;
        .prevDay{
          display: inline-block;
          width: 0;
          height: 0;
          border-top: 4px solid transparent;
          border-right: 4px solid #09bb07;
          border-bottom: 4px solid transparent;
        }
        .nextDay{
          display: inline-block;
          width: 0;
          height: 0;
          border-top: 4px solid transparent;
          border-left: 4px solid #09bb07;
          border-bottom: 4px solid transparent;
        }
        &.disabled{
          color: #e7e7e7;
          .prevDay{
            border-right-color: #e7e7e7;
          }
          .nextDay{
            border-left-color: #e7e7e7;
          }
        }
        .text{
          vertical-align: middle;
        }
      }
      .vux-cell-box{
        flex: 1;
        &:before{
          display: none;
        }
        .vux-popup-picker-value{
          position: relative;
          font-size: 0.3rem;
          padding: 0 0 0 0.1rem;
          &:after{
            content: '';
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.1rem;
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 4px solid #09bb07;
          }
        }
      }
      .weui-cell__ft{
        padding: 0;
        &:after{
          display: none;
        }
      }
    }
    .filter-bar{
      height: 0.88rem;
      line-height: 0.88rem;
      .vux-x-switch{
        padding: 0;
        width: 100%;
      }
      .vux-no-group-title{
        font-size: 0.26rem;
        color: #393939;
        padding: 0 0.3rem;
      }
      .weui-cell__ft{
        height: 100%;
        .weui-switch{
          margin-top: 0.15rem;
        }
      }
    }
  }
  .doctor-section{
    padding: 0.08rem;
    .doctor-item{
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 0.1rem;
      .doctor-top{
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0.24rem;
        background: #fff;
        height: 1.34rem;
        .avatar{
          height: 0.88rem;
          width: 0.88rem;
          border-radius: 50%;
          margin-right: 0.24rem;
          img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .doctor-msg{
          color: #393939;
          font-size: 0.32rem;
          flex: 1;
          max-width: 12em;
          .text{
            font-size: 0.26rem;
            margin-left: 0.1rem;
          }
          .desc{
            display: inline-block;
            font-size: 0.2rem;
            color: #a3a3a3;
            margin-top: 0.1rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 100%;
            height: 0.3rem;
            line-height: 0.3rem;
          }
        }
        .doctor-mark{
          color: #393939;
          font-size: 0.32rem;
          text-align: right;
          margin-right: 0.3rem;
          min-width: 4em;
          .number{
            border: 1px solid;
            padding: 0.08rem 0.18rem;
            box-sizing: border-box;
            border-radius: 0.2rem;
            &.green{
              color: #09bb07;
              border-color: #09bb07;
            }
            &.gray{
              color: #ccc;
              border-color: #ccc;
            }
            &.red{
              color: red;
              border-color: red;
            }
          }
          .desc{
            display: inline-block;
            font-size: 0.2rem;
            margin-top: 0.1rem;
            color: #ff0000;
            border: 1px solid;
            &.green{
              color: #09bb07;
              border-color: #09bb07;
            }
            &.gray{
              color: #ccc;
              border-color: #ccc;
            }
          }
        }
        .arrow-icon{
          background: url('./../../assets/images/icon/arrow-top.png') no-repeat center center;
          background-size: contain;
          width: 9px;
          height: 9px;
          transition: all linear .2s;
          transform: rotate(180deg);
          &.active{
            transform: rotate(0);
          }
        }
      }
      .doctor-content{
        font-size: 0.32rem;
        background: #f9f9f9;
        .content-item{
          display: flex;
          align-items: center;
          padding: 0.2rem 0.24rem 0.2rem 0.8rem;
          color: #393939;
          .mark-logo{
            width: 24px;
            height: 24px;
            background-color: #a3a3a3;
            border-radius: 50%;
            font-size: 12px;
            text-align: center;
            color: #fff;
            line-height: 24px;
          }
          .mark-number{
            width: 4em;
            text-align: center;
            &.gray{
              color: #ccc;
            }
          }
          .mark-title{
            margin-left: 0.16rem;
            margin-right: 2rem;
          }
          .weui-btn{
            height: 0.62rem;
            width: 1.41rem;
            line-height: 0.62rem;
            margin-right: 0;
            border-radius: 0.2rem;
            &:after{
              border: none;
            }
          }
        }
      }
    }
  }
</style>
