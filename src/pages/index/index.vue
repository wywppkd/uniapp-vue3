<template>
  <view>
    <image class="logo" src="~@/assets/img/photo-1.jpeg" />
    <view>
      <text class="title">{{ title }}</text>
      <button @click="handleAdd">{{ counter.count }}</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { listQuerySupportI18nConfig } from '@/api/test';
import { ref } from 'vue';
import { useCounterStore } from '@/stores/counter';
const title = ref('Hello');

const counter = useCounterStore();
function handleAdd() {
  console.log('🚀 ~ file: index.vue:19 ~ handleAdd ~ handleAdd:');
  counter.increment();
}

async function getList() {
  try {
    const res = await listQuerySupportI18nConfig({ mockId: '123' });
    if (res.code === 200) {
      console.log('res index.vue', res.data);
    }
    console.log('res index.vue', res);
  } catch (err) {
    console.log('err index.vue', err);
  }
}
getList();
</script>
<style scoped lang="scss">
.title {
  color: red;
}
</style>
