import store from '@/store'

export const config = {
  partnerUrl: location.origin + '/Index/Index',
  posterUrl: location.origin + '/Index/Index/?' + 'agentid=' + store.state.userDefault.agentId + '&share_url=/poster'
}
