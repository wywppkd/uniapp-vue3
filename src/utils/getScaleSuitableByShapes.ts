import { ALL_HEIGHT, ALL_WIDTH, shapeTypesMap } from './canvasDrawer';
import type { list } from './data';

/**
 * 根据要绘制的元素左上角和右下角坐标 + 画布尺寸, 计算出合适的缩放比例
 */
export const getScaleSuitableByShapes = (
  canvas: HTMLCanvasElement,
  maxWidth: number,
  maxHeight: number,
) => {
  const { width, height } = canvas;
  const scaleX = width / maxWidth;
  const scaleY = height / maxHeight;
  return Math.min(scaleX, scaleY);
};

// 计算画布图形所占的区域大小
export const getImageSize = (shapes: typeof list) => {
  let maxWidth = 0;
  let maxHeight = 0;
  shapes.forEach((shape) => {
    const DrawShapeClass = shapeTypesMap[shape.shapeType].instance;
    if (DrawShapeClass) {
      const drawInstance = new DrawShapeClass(shape);
      const width = shape.centerX + drawInstance.width / 2 + ALL_WIDTH / 2;
      if (width > maxWidth) maxWidth = width;
      const height = shape.centerY + drawInstance.height / 2 + ALL_HEIGHT / 2;
      if (height > maxHeight) maxHeight = height;
    }
  });
  return { maxWidth, maxHeight };
};
