<template>
  <div class="wrap">
    <!--<div class="manage-top vux-1px-b">-->
      <!--&lt;!&ndash;<span class="msg">您可以绑定24名就诊人</span>&ndash;&gt;-->
      <!--<div class="title" @click='checkNewClient'>-->
        <!--<span>新建就诊人</span>-->
        <!--<x-icon type="ios-plus-empty" size="30"></x-icon>-->
      <!--</div>-->
    <!--</div>-->

    <div class="client-item" @click='itemClick(item, index)' :class='{active: activeIndex === index}' v-for="(item, index) in clientList">
      <div class="client-left">
        <p class="name">
          {{item.name}}
          <span class="default" v-if='item.default === "1"'>默认</span>
        </p>
        <p class="card">{{item.card_number | filterCard}}</p>
      </div>
      <div class="client-right">
        <x-icon type="ios-arrow-forward" size="20"></x-icon>
        <!--<div class="mini-btn">预约挂号</div>-->
      </div>
    </div>

    <div class="btn-wrap">
      <x-button action-type='button' @click.native='checkNewClient'>添加就诊人</x-button>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import {XButton} from 'vux'

export default {
  components: {
    XButton
  },
  data () {
    return {
      activeIndex: -1,
      clientList: []
    }
  },
  filters: {
    filterCard (card) {
      let temp = []
      for (let i = 0; i < card.length; i++) {
        if (i < 3 || i > 13) {
          temp.push(card[i])
        } else {
          temp.push('*')
        }
      }
      return temp.join('')
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    checkNewClient () {
      // if (this.clientList && this.clientList.length > 0) {
      //   for (let i = 0; i < this.clientList.length; i++) {
      //     if (this.clientList[i].default === '1') {
      //       this.$router.push('/newclient')
      //       return
      //     }
      //   }
      //   this.$router.push('/edit')
      //   return
      // }
      this.$router.push('/newclient')
    },
    itemClick (item, index) {
      if (item.default === '1') {
        this.$router.push({path: '/edit'})
      } else {
        this.$router.push({path: '/newclient', query: {isEdit: true, cid: item.id}})
      }
    },
    async fetchData () {
      const {data: {code, data}} = await api.get('/Users/Patient/PatientList')
      if (code === 200 && data) {
        this.clientList = data.patient_list
        if (this.clientList.length <= 0) {
          // 没有就诊人的时候会提交store
          this.$store.commit('deleteDefault')
        }
      }
    }
  },
  mounted () {
    this.$wechat.ready(() => {
      this.wechatShare({
        title: `${this.$store.state.userDefault.truename}推荐您预约川派医方馆疼痛专家`,
        link: '/',
        img: 'http://m.qpic.cn/psb?/V11P0IcO3nwu6m/0iy19ozUJOnxFpSC*edLkx6yh1M7jO6WQq5uscPCnfs!/b/dEEBAAAAAAAA&bo=sQCxAAAAAAADFzI!&rf=viewer_4&t=5',
        desc: '川派医方馆，专治头颈肩腰四肢关节疼痛！'
      })
    })
  }
}
</script>

<style lang="less">
.wrap{
  height: 100vh;
}
.mini-btn{
  display: inline-block;
  border: 1px solid #09bb07;
  border-radius: 4px;
  color: #09bb07;
  font-size: 0.26rem;
  padding: 0.14rem 0.18rem;
}
.manage-top{
  height: 0.8rem;
  line-height: 0.8rem;
  display: flex;
  padding: 0 0.3rem;
  .msg{
    color: #888888;
    font-size: 0.28rem;
    flex: 1;
  }
  .title{
    color: #000;
    font-size: 0;
    span{
      vertical-align: middle;
      font-size: 0.32rem;
    }
    .vux-x-icon{
      vertical-align: middle;
    }
  }
}
.client-item{
  display: flex;
  align-items: center;
  height: 1.42rem;
  padding: 0 0.3rem;
  border-bottom: 1px solid #e7e7e7;
  background: #fff;
  &.active{
    background-color: rgba(9, 187, 7, 0.2);
  }
  .client-left{
    flex: 1;
    .name{
      color: #393939;
      font-size: 0.32rem;
    }
    .default{
      font-size: 0.32rem;
      color: #888888;
    }
    .card{
      margin-top: 0.14rem;
      font-size: 0.26rem;
      color: #393939;
    }
  }
  .client-right{
    position: relative;
    width: .8rem;
    text-align: right;
    font-size: 0.32rem;
    height: 100%;
    .vux-x-icon{
      right: 0.1rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
  .btn-wrap{
    margin-top: 0.8rem;
    padding: 0.4rem;
  }
</style>
