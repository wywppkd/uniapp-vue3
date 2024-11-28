<template>
  <div>
    <canvas ref="refCanvas" class="canvas"></canvas>
    <!-- canvas 缩放按钮 -->
    <button @click="zoomIn">放大</button>
    <button @click="zoomOut">缩小</button>
    <button @click="clearRect">清空</button>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue';
const refCanvas = ref<HTMLCanvasElement>() as Ref<HTMLCanvasElement>;
import { list, longHeightList } from '@/utils/data';
import { shapeTypesMap } from '@/utils/canvasDrawer';
import { getScaleSuitableByShapes, getImageSize } from '@/utils/getScaleSuitableByShapes';

let originScale = 1;
let scale = 1;
const step = 0.1;

const SIZE = {
  width: window.innerWidth,
  height: 400,
};
const SIZE_DPR = {
  width: SIZE.width * devicePixelRatio,
  height: SIZE.height * devicePixelRatio,
};

const init = () => {
  const canvas = refCanvas.value;
  if (!canvas) return;
  canvas.width = SIZE_DPR.width;
  canvas.height = SIZE_DPR.height;
  canvas.style.height = `${SIZE.height}px`;
  canvas.style.width = `${SIZE.width}px`;

  // 获取所有元素所占区域最大宽高
  const { maxWidth, maxHeight } = getImageSize(longHeightList);

  /** 计算合适的缩放比例, 保证所有元素能完全展示在 canvas 中 */
  const _scale = getScaleSuitableByShapes(canvas, maxWidth, maxHeight);
  // const _scale = 1
  scale = _scale;
  originScale = _scale;

  console.log('🚀 ~ file: HomeView.vue:39 ~ init ~ scale:', scale);
  drawAll();
};

const drawAll = () => {
  const ctx = refCanvas.value?.getContext('2d');
  if (!ctx) return;

  // ctx?.clearRect(0, 0, SIZE_DPR.width * scale, SIZE_DPR.height * scale)

  // ctx.scale(0.5, 0.5)
  // 绘制一个矩形
  // ctx.fillStyle = 'blue'
  // ctx.fillRect(200, 200, 2000, 2000)

  longHeightList.forEach((item, index) => {
    const DrawShapeClass = shapeTypesMap[item.shapeType].instance;
    if (DrawShapeClass) {
      ctx.save();
      const drawInstance = new DrawShapeClass(
        item,
        ctx,
        scale,
        step,
        refCanvas.value!.width,
        refCanvas.value!.height,
      );
      drawInstance.draw();
      ctx.restore();
    }
  });

  // window.requestAnimationFrame(drawAll)
};

const clearRect = () => {
  const canvas = refCanvas.value;
  const ctx = canvas?.getContext('2d');
  if (!canvas) return;
  if (!ctx) return;
  ctx?.save();
  const scale2 = Number((1 / (originScale * scale)).toFixed(2));
  ctx?.scale(scale2, scale2);
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  ctx?.restore();
};

const zoomIn = () => {
  const ctx = refCanvas.value?.getContext('2d');
  if (!ctx) return;
  clearRect();
  scale = 1 + step;
  ctx?.scale(scale, scale);
  return;
};

const zoomOut = () => {
  if (!refCanvas.value) return;
  const ctx = refCanvas.value?.getContext('2d');
  if (!ctx) return;
  clearRect();
  scale = 1 - step;
  ctx?.scale(scale, scale);
  drawAll();
};

onMounted(() => {
  init();
});
</script>
<style scoped lang="scss">
.canvas {
  border: 1px solid #000;
}
</style>
