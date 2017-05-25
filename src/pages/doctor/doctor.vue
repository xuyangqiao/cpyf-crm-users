<template>
  <div class="container" v-if="doctorInfo">
    <div class="doctor-top">
      <div class="avatar">
        <img :src="doctorInfo.avatar">
      </div>
      <div class="content">
        <h1 class="name">{{doctorInfo.name}}</h1>
        <p class="title">{{doctorInfo.title_title}}</p>
        <p class="info">{{doctorInfo.hospital_title}}</p>
        <p class="info">{{doctorInfo.profession_title}} {{doctorInfo.position_title}}</p>
        <p class="info">{{doctorInfo.degree_title}}</p>
        <!--<p class="info">{{doctorInfo.}}</p>-->
      </div>
      <div class="share" @click='shareShow=true'>
        <span class="share-icon"></span>
        <span class="text">分享</span>
      </div>
    </div>

    <!--擅长技术-->
    <div class="skill">
      <h1 class="title">个人简介</h1>
      <p class="text" :class='{hidden: doctorInfo.desc.length > 75 && !showMore}'>{{doctorInfo.desc}}</p>
      <div class="other-text" v-show="showMore">
        <h1 class="title" v-if="doctorInfo.skill">擅长技术</h1>
        <p class="text">{{doctorInfo.skill}}</p>
        <h1 class="title" v-if="doctorInfo.disease">擅长病种</h1>
        <p class="text">{{doctorInfo.disease}}</p>
        <h1 class="title" v-if="doctorInfo.work_process">工作经历</h1>
        <p class="text">{{doctorInfo.work_process}}</p>
      </div>
      
      <div class="open" :class='{active: showMore}' @click='showMore = !showMore'>
        <x-icon type="ios-arrow-down" size="20"></x-icon>
      </div>
    </div>

    <!--排班表-->
    <div class="office-wrap">
      <div class="office-title">
        <p class="selectDay" :class='{disabled: disabledMin}' @click='preMonth'>
          <span class="prevDay"></span>
          <span class="text">上月</span>
        </p>
        <h1 class="title">{{officeTime}}排班信息表</h1>
        <p class="selectDay" :class='{disabled: disabledMax}' @click='nextMonth'>
          <span class="text">下月</span>
          <span class="nextDay"></span>
        </p>
      </div>
      <inline-calendar
        class="office-date"
        :show.sync="true"
        v-model="value"
        :start-date="minMouth"
        :end-date="maxMouth"
        :highlight-weekend="true"
        :return-six-rows="true"
        :disable-past="true"
        :hide-header="true"
        :show-last-month="false"
        :show-next-month="false"
        :weeks-list="['日', '一', '二', '三', '四', '五', '六 ']"
        :render-on-value-change="true"
        :render-function="doctorNumber">
      </inline-calendar>
    </div>

    <!--推荐医生-->
    <div class='push-doctor'>
      <h1 class='push-title'>推荐医生</h1>
      <router-link :to='{path: "doctor", query: {yid: item.id}}' class="doctor-item" v-for="(item, index) in doctorList" :key='item.id'>
        <div class="avatar">
          <img :src="item.avatar">
        </div>
        <div class="content">
          <p class="name">{{item.name}}</p>
          <p class="title">{{item.title_title}}</p>
        </div>
        <x-icon type="ios-arrow-forward" size="20"></x-icon>
      </router-link>
    </div>
    
    <!--分享提示-->
    <transition name="fade" mode="out-in">
      <div class="share-mask" v-show="shareShow" @click='shareShow=false'>
        <div class="share-content">
          <span>从此处将医生分享给朋友或分享到朋友圈</span>
          <span class="share-hand"></span>
        </div>
      </div>
    </transition>

    <!--提示抢号-->
    <actionsheet v-model="tipShow" :menus="markList" show-cancel @on-click-menu="clickMaskItem"></actionsheet>
  </div>
</template>

<script>
  import { InlineCalendar, Actionsheet } from 'vux'
  import { handleOffice, todayTime } from '@/utils'
  import api from '@/api'

  export default {
    components: {
      InlineCalendar,
      Actionsheet
    },
    data () {
      return {
        showMore: false,
        value: '',
        monthFlag: 0,
        minMouth: '2017-4-4',
        maxMouth: '2017-10-30',
        month: 0,
        year: 0,
        shareShow: false,
        tipShow: false,
        doctorInfo: '',
        workList: [],
        doctorList: [],
        markList: [
          {
            label: '请选择您的预约时段：',
            type: 'info'
          },
          {
            label: '上午仅剩50个号',
            type: 'primary',
            value: '1'
          },
          {
            label: '下午仅剩50个号',
            type: 'primary',
            value: '2'
          }
        ],
        mock: [
          {
            up: 2,
            down: 0
          }
        ]
      }
    },
    computed: {
      officeTime () {
        return handleOffice(this.value)
      },
      disabledMin () {
        if (this.value === '') {
          return true
        }
        return this.handleMinMouth()
      },
      disabledMax () {
        return this.handleMaxMouth()
      }
    },
    watch: {
      value () {
        let temp = this.value.split('-')
        temp[1] = parseInt(temp[1])
        this.month = temp[1]
        this.year = parseInt(temp[0])
        this.maskShow()
      },
      '$route': 'fetchData'
    },
    created () {
      // this.year = parseInt(handleDay().split('-')[0])
      // this.month = parseInt(handleDay().split('-')[1])
      this.fetchData()
    },
    methods: {
      async fetchData () {
        const {data: {code, data}} = await api.get('/Users/Doctor/DoctorDetail', {id: this.$route.query.yid})
        if (code === 200 && data) {
          document.body.scrollTop = 0
          this.workList = data.work_list
          this.minMouth = data.start_time
          this.maxMouth = data.end_time
          this.year = parseInt(data.start_time.split('-')[0])
          this.month = parseInt(data.start_time.split('-')[1])
          this.doctorInfo = data.doctor_list
          this.doctorList = data.doctor_rand
          this.value = this.year + '-' + this.month
          this.shareMsg()
        }
      },
      // 抢号提示
      maskShow () {
        const length = this.value.split('-').length
        if (length <= 2) {
          return
        }
        let todayData = this.getTodayData()
        if (todayData) {
          if (todayData.am === 0) {
            this.markList[1].type = 'disabled'
            this.markList[1].label = '上午 号满'
          } else if (todayData.am < 0) {
            this.markList[1].type = 'disabled'
            this.markList[1].label = '未坐诊'
          } else {
            this.markList[1].type = 'primary'
            this.markList[1].label = '上午 仅剩' + todayData.am + '个号'
          }
          if (todayData.pm === 0) {
            this.markList[2].type = 'disabled'
            this.markList[2].label = '下午 号满'
          } else if (todayData.pm < 0) {
            this.markList[2].type = 'disabled'
            this.markList[2].label = '未坐诊'
          } else {
            this.markList[2].type = 'primary'
            this.markList[2].label = '下午 仅剩' + todayData.pm + '个号'
          }
          this.tipShow = true
        }
      },
      getTodayData () {
        const day = this.value.split('-')[2]
        for (let i = 0; i < this.workList.length; i++) {
          if (parseInt(this.workList[i].month) === this.month) {
            for (let k = 0; k < this.workList[i].day_list.length; k++) {
              if (this.workList[i].day_list[k].day === day) {
                return this.workList[i].day_list[k]
              }
            }
          }
        }
      },
      clickMaskItem (key) {
        if (key === 'cancel') {
          return
        }
        const date = this.value.replace(/-/g, '/')
        if (key === '1') {
          let maxTime = new Date(date + ' 09:30').getTime()
          let nowTime = new Date().getTime()
          if (nowTime >= maxTime) {
            this.toast('上午预约时间已截止')
            return
          }
        } else {
          let maxTime = new Date(date + ' 14:30').getTime()
          let nowTime = new Date().getTime()
          if (nowTime >= maxTime) {
            this.toast('下午预约时间已截止')
            return
          }
        }
        let data = {}
        data = Object.assign(this.doctorInfo, this.getTodayData(), {time: parseInt(key)}, {date: this.value})
        this.$store.commit('reserveInfo', data)
        this.$router.push('/message')
      },
      // 渲染日历上的剩余号数
      doctorNumber (line, index, data) {
        // const minMon = parseInt(this.minMouth.split('-')[1])
        // const today = parseInt(new Date().getDate())
        const dayList = this.checkMonthList()
        // if (data.month_str === minMon && data.day >= today || data.month_str > minMon) {
        //   return this.meda
        // }
        if (data.month_str === this.month) {
          for (let i = 0; i < dayList.length; i++) {
            if (data.day === parseInt(dayList[i].day)) {
              if (dayList[i].am < 0 && dayList[i].pm < 0) {
                return `<span style='color: #ccc;'>未坐诊</span>`
              }
              if (dayList[i].am + dayList[i].pm > 10) {
                return `<span class='green'>充足</span>`
              } else if (dayList[i].am + dayList[i].pm <= 0) {
                return `<span class='red'>号满</span>`
              } else {
                return `<span class='red'>紧张</span>`
              }
            }
          }
        }
      },
      checkMonthList () {
        const workList = this.workList
        for (let i = 0; i < workList.length; i++) {
          if (parseInt(workList[i].month) === this.month) {
            return workList[i].day_list
          }
        }
      },
      handleMinMouth () {
        let tempMin = this.minMouth.split('-')
        tempMin[1] = parseInt(tempMin[1]) < 10 ? ('0' + parseInt(tempMin[1])) : tempMin[1]
        tempMin[2] = parseInt(tempMin[2]) < 10 ? ('0' + parseInt(tempMin[2])) : tempMin[2]
        tempMin = tempMin.join('-')

        let tempMax = this.value.split('-')
        tempMax[1] = parseInt(tempMax[1]) < 10 ? ('0' + parseInt(tempMax[1])) : tempMax[1]
        tempMax = tempMax.join('-')
        let d = new Date(tempMin).getMonth() + 1
        let c = new Date(tempMax).getMonth() + 1
        if (this.value === '' || d === c) {
          return true
        } else {
          return false
        }
      },
      handleMaxMouth () {
        // 获取2个月份，如果有差值，证明有下个月，取消disable
        let d = this.maxMouth.split('-')
        d[1] = parseInt(d[1]) < 10 ? ('0' + parseInt(d[1])) : d[1]
        d = d[0] + '-' + d[1]
        let c
        if (this.value === '') {
          c = todayTime().split('-')
        } else {
          c = this.value.split('-')
          c[1] = parseInt(c[1]) < 10 ? ('0' + parseInt(c[1])) : c[1]
        }
        c = c[0] + '-' + c[1]
        d = new Date(d).getTime()
        c = new Date(c).getTime()

        if (d - c > 0) {
          return false
        } else {
          return true
        }
      },
      preMonth () {
        const minMonth = parseInt(this.minMouth.split('-')[1]) < 10 ? ('0' + parseInt(this.minMouth.split('-')[1])) : this.minMouth.split('-')[1]
        const minTime = this.minMouth.split('-')[0] + '-' + minMonth
        const current = this.month < 10 ? ('0' + this.month) : this.month
        if (new Date(`${this.year}-${current}`).getTime() <= new Date(minTime).getTime()) {
          return
        }
        if (this.month === 1) {
          this.month = 12
          this.year = this.year - 1
        } else {
          this.month = this.month - 1
        }
        this.value = `${this.year}-${this.month}`
      },
      nextMonth () {
        const maxMonth = parseInt(this.maxMouth.split('-')[1]) < 10 ? ('0' + parseInt(this.maxMouth.split('-')[1])) : this.maxMouth.split('-')[1]
        const maxTime = this.maxMouth.split('-')[0] + '-' + maxMonth
        const current = this.month < 10 ? ('0' + this.month) : this.month
        if (new Date(`${this.year}-${current}`).getTime() >= new Date(maxTime).getTime()) {
          return
        }
        if (this.month === 12) {
          this.month = 1
          this.year = this.year + 1
        } else {
          this.month = this.month + 1
        }
        this.value = `${this.year}-${this.month}`
      },
      shareMsg () {
        this.$wechat.ready(() => {
          this.wechatShare({
            title: `川派医方馆疼痛专家${this.doctorInfo.name}`,
            link: this.handUrl(location.hash),
            img: `${this.doctorInfo.avatar}`,
            desc: `擅长病种：${this.doctorInfo.disease}`
          })
        })
      }
    }
  }
</script>

<style lang="less">
  .doctor-top{
    position: relative;
    background: #fff;
    padding: 0.56rem 0.7rem 0.4rem;
    display: flex;
    align-items: flex-start;
    border-bottom: 1px solid #e7e7e7;
    .avatar{
      width: 1.8rem;
      height: 1.8rem;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .content{
      margin-left: 0.6rem;
      flex: 1;
      .name{
        font-size: 0.36rem;
        color: #2d2d2d;
      }
      .title{
        margin-top: 0.16rem;
        margin-bottom: 0.26rem;
        color: #2d2d2d;
        font-size: 0.28rem;
      }
      .info{
        margin-bottom: 0.16rem;
        color: #a3a3a3;
        font-size: 0.24rem;
      }
    }
    .share{
      position: absolute;
      top: 0.4rem;
      right: .3rem;
      font-size: 0;
      .share-icon{
        display: inline-block;
        width: 0.28rem;
        height: 0.28rem;
        background: url('../../assets/images/icon/share-icon.png') no-repeat center center;
        vertical-align: middle;
        background-size: contain;
      }
      .text{
        margin-left: 0.1rem;
        font-size: 0.28rem;
        vertical-align: middle;
      }
    }
  }
  .skill{
    position: relative;
    padding: 0.5rem 0.3rem 0.7rem;
    background: #fff;
    .title{
      color: #2d2d2d;
      font-size: 0.32rem;
      font-weight: bold;
      margin-bottom: 0.3rem;
    }
    .text{
      color: #2d2d2d;
      font-size: 0.28rem;
      line-height: 0.48rem;
      margin-bottom: 0.3rem;
      &.hidden{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
    .open{
      text-align: center;
      margin-bottom: -0.7rem;
      &.active{
        .vux-x-icon{
          transform: rotate(180deg);
        }
      }
      .vux-x-icon{
        transition: all linear .2s;
      }
    }
  }
  .office-wrap{
    margin-top: 0.1rem;
    .office-title{
      display: flex;
      height: 0.88rem;
      line-height: 0.88rem;
      background: #fff;
      .selectDay{
        font-size: 0.3rem;
        padding: 0 0.3rem;
        color: #09bb07;
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
      .title{
        flex: 1;
        color: #2d2d2d;
        font-size: 0.32rem;
        text-align: center;
      }
    }
    .office-date{
      .week{
        color: #3b3b3b;
        font-size: 16px;
        height: 0.54rem;
        line-height: 0.54rem;
        border-top: 1px solid #e7e7e7;
        border-bottom: 1px solid #e7e7e7;
      }
      td > div{
        height: 0.28rem;
        font-size: 0.2rem;
      }
      td.current{
        background: #09bb07;
        color: #fff;
        span{
          color: #fff !important;
        }
      }
    }
  }
  .push-doctor{
    margin-top: 0.44rem;
    .push-title{
      padding-left: 0.3rem;
      color: #2d2d2d;
      font-size: 0.26rem;
      margin-bottom: 0.24rem;
    }
    .doctor-item{
      background: #fff;
      display: flex;
      align-items: center;
      padding: 0.2rem 0.3rem;
      border-bottom: 1px solid #e7e7e7;
      &:last-child{
        border: none;
      }
      .avatar{
        width: 0.88rem;
        height: 0.88rem;
        border-radius: 50%;
        margin-right: 0.2rem;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .content{
        flex: 1;
        .name{
          color: #393939;
          font-size: 0.32rem;
        }
        .title{
          margin-top: 0.1rem;
          color: #a3a3a3;
          font-size: 0.24rem;
        }
      }
    }
  }
  .share-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.2);
    .share-content{
      width: 100%;
      height: 1.53rem;
      background: #fff;
      line-height: 1.53rem;
      color: #2d2d2d;
      font-size: 0.26rem;
      text-align: center;
    }
    .share-hand{
      display: inline-block;
      background: url('./../../assets/images/icon/share-hand.png') no-repeat center center;
      background-size: contain;
      width: 0.58rem;
      height: 0.72rem;
    }
  }
</style>
