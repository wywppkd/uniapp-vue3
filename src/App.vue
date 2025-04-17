<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

const VITE_APP_ENV = import.meta.env.VITE_APP_ENV;
// 区分环境引用eruda
if (VITE_APP_ENV !== 'prod') {
  import('eruda').then((eruda) => {
    eruda?.default?.init();
  });
}

onLaunch(() => {
  console.log('App Launch');
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>
<style lang="scss">
@import '@/assets/css/global.scss';
</style>
