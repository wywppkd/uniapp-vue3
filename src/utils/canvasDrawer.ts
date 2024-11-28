export type ShapeType =
  | 'roundTable'
  | 'rectTable'
  | 'arcTable'
  | 'rowAndColumn'
  | 'circle'
  | 'rect';
// 座位
export interface SeatInfo {
  order: string; //座位序号
  userInfo: UserInfo; //人员
  isCenter: number; //是否中心位，是否主座
  disable: number; //是否参与排座
  select: number; //是否选中
  row: number;
  column: number;
  x: number; //座位的中心坐标x
  y: number; //座位的中心坐标y
  angle: number; //角度
  color: string; //颜色
  delete?: number; //排和列删除状态记录
  rowNumber?: number | null; //排和列的展示排号
  columnNumber?: number | null; //排和列的展示列号
}
export interface UserInfo {
  name: string; //名字
  userId: string;
}
// 形状 公共数据
export interface ShapeBase {
  name: string; //名称
  centerX: number; //中心x坐标
  centerY: number; //中心y坐标
  active: number; //激活状态
  shapeType: ShapeType; //形状类型
  seatsInfo: SeatInfo[]; //座位信息
}
// 圆桌
export interface RoundTableOwn {
  order: number; //桌的序号
  seats: number; //座位数
}
export type RoundTable = ShapeBase & RoundTableOwn;
// 方桌
export interface RectTableOwn {
  rotate: number; //旋转度
  order: number; //桌的序号
  seatsTop: number; //座位数上
  seatsRight: number; //座位数右
  seatsBottom: number; //座位数下
  seatsLeft: number; //座位数左
}
export type RectTable = ShapeBase & RectTableOwn;
// 排&列
export interface RowAndColumnOwn {
  rows: number; //行
  columns: number; //列
  seatWidth: number; //宽
  seatHeight: number; //高
}
export type RowAndColumn = ShapeBase & RowAndColumnOwn;
// 圆形
export interface CircleOwn {
  diameter: number; //直径
}
export type Circle = ShapeBase & CircleOwn;
// 矩形
export interface RectOwn {
  width: number; //宽
  height: number; //高
}
export type Rect = ShapeBase & RectOwn;
// 扇形
export interface ArcTableOwn {
  order: number; //桌的序号
  rotate: number; //旋转度
  radian: number; //弯曲度
  seatsTop: number; //座位数上
  seatsBottom: number; //座位数下
}
export type ArcTable = ShapeBase & ArcTableOwn;
//
export type SelectRange = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
// 联合类型，各种形状
export type ShapeAllType = ShapeBase &
  Partial<RoundTableOwn & RectTableOwn & RowAndColumnOwn & CircleOwn & RectOwn & ArcTableOwn>;
export const CANVAS_WIDTH = 2000; //画布宽度
export const CANVAS_HEIGHT = 2000; //画布高度
export const SEAT_WIDTH = 16; //座位宽度
export const SEAT_HEIGHT = 16; //座位高度
export const TEXT_WIDTH = 52; //人名占位宽度
export const TEXT_HEIGHT = 32; //人名占位高度
const SEAT_RADIUS = 4; //座位圆角
const SPACE = 10; // 座位距离桌子间距
const TABLE_SPACE = 15; //桌与桌的间距
export const TABLE_LENGTH = 40; //圆桌一个座位大概的边长
export const MIN_W_H = 80; //方桌的最小宽高、圆桌的最小直径

const SHAPE_COLOR = '#efefef'; //形状的填充颜色
const SHAPE_BORDER_COLOR = '#CFD4DB'; //形状的边框颜色
const SHAPE_TEXT_COLOR = '#333333'; // 形状的文字颜色

const TABLE_COLOR = '#efefef'; //桌子颜色
const SEAT_BORDER_COLOR = '#CFD4DB'; //座位默认边框
const SEAT_TEXT_COLOR = '#666666'; //人名默认颜色
const DISABLE_SEAT_COLOR = '#DEE2E8'; //不参与排座座位颜色
const ACTIVE_COLOR = '#9C99ED'; //激活状态颜色
// const CENTER_SEAT_COLOR = '#605CE5'; //中心座边框

// 文字偏移
const OFFSET_X = SEAT_WIDTH / 2 + SPACE / 2 + TEXT_WIDTH / 2; //文字左右偏移参数 8+5+26=39
const OFFSET_Y = SEAT_HEIGHT / 2 + SPACE / 2 + TEXT_HEIGHT / 2; //文字上下偏移参数 8+5+16=29

// 矩形的
const RECT_RADIUS = 20; // 矩形桌的圆角
// 扇形
export const ARC_LENGTH = 60;
export const ARC_HEIGHT = 80;
// 排&列
export const ROW_SPACE = 4;
// 宽高计算
export const ALL_WIDTH = (SEAT_WIDTH + 2 * SPACE + TEXT_WIDTH) * 2 + TABLE_SPACE;
export const ALL_HEIGHT = (SEAT_HEIGHT + 2 * SPACE + TEXT_HEIGHT) * 2 + TABLE_SPACE;

// 公共形状类
export class Shape {
  protected shapeParams: ShapeAllType;
  protected ctx: CanvasRenderingContext2D | undefined;
  protected scale: number;
  protected step: number;
  protected canvasW: number;
  protected canvasH: number;
  constructor(
    shapeParams: ShapeAllType,
    ctx?: CanvasRenderingContext2D,
    scale?: number,
    step?: number,
    canvasW?: number,
    canvasH?: number,
  ) {
    this.ctx = ctx;
    this.shapeParams = shapeParams;
    this.scale = scale ? scale : 1;
    this.step = step ? step : 2;
    this.canvasW = canvasW ? canvasW : CANVAS_WIDTH;
    this.canvasH = canvasH ? canvasH : CANVAS_HEIGHT;
    if (this.ctx) this.ctx.scale(this.scale, this.scale);
  }

  drawCircle(
    centerX: number,
    centerY: number,
    radius: number,
    color: string,
    borderColor?: string,
  ) {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
    if (borderColor) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.fillStyle = color;
    ctx.fill();
  }
  drawRect(
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    topLeftRadius: number,
    topRightRadius: number,
    bottomRightRadius: number,
    bottomLeftRadius: number,
    fillColor?: string,
    borderColor?: string,
  ) {
    const ctx = this.ctx;
    if (!ctx) return;
    const rectX = centerX - width / 2;
    const rectY = centerY - height / 2;
    ctx.beginPath();
    ctx.moveTo(rectX + topLeftRadius, rectY);
    ctx.lineTo(rectX + width - topRightRadius, rectY);
    ctx.quadraticCurveTo(rectX + width, rectY, rectX + width, rectY + topRightRadius);
    ctx.lineTo(rectX + width, rectY + height - bottomRightRadius);
    ctx.quadraticCurveTo(
      rectX + width,
      rectY + height,
      rectX + width - bottomRightRadius,
      rectY + height,
    );
    ctx.lineTo(rectX + bottomLeftRadius, rectY + height);
    ctx.quadraticCurveTo(rectX, rectY + height, rectX, rectY + height - bottomLeftRadius);
    ctx.lineTo(rectX, rectY + topLeftRadius);
    ctx.quadraticCurveTo(rectX, rectY, rectX + topLeftRadius, rectY);
    ctx.closePath();
    if (borderColor) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
  }
  drawText(centerX: number, centerY: number, text: string, font = '12px Arial', color = '#000000') {
    if (!font) font = '12px Arial';
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.font = font; // 字体大小和类型
    ctx.fillStyle = color; // 文字颜色
    ctx.textAlign = 'center'; // 水平对齐方式
    ctx.textBaseline = 'middle'; // 垂直对齐方式
    ctx.fillText(text, centerX, centerY + 1);
  }
  drawTableText(centerX: number, centerY: number, seats: number, text: string, active: number) {
    const color = active === 1 ? '#FFFFFF' : SHAPE_TEXT_COLOR; // 圆桌颜色
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, centerX, centerY - 5);
    ctx.fillText('座位数 ' + seats, centerX, centerY + 13);
  }
  drawSeatText(textX: number, textY: number, order: string, name: string, color = SEAT_TEXT_COLOR) {
    if (!color) color = SEAT_TEXT_COLOR;
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    const text = name ? name : this.step === 1 ? '落座人员' : '';
    if (text) {
      ctx.fillText(order, textX, textY - 3); // 座位编号位置
      ctx.fillText(text, textX, textY + 12); // 落座人员文本位置
    } else {
      ctx.fillText(order, textX, textY + 4); // 落座人员文本位置
    }
  }
  drawLine(x1: number, x2: number, y1: number, y2: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = ACTIVE_COLOR;
    // 上下左右的虚线
    ctx.beginPath();
    ctx.moveTo(x1, 0);
    ctx.lineTo(x1, this.canvasH);
    ctx.moveTo(x2, 0);
    ctx.lineTo(x2, this.canvasH);
    ctx.moveTo(0, y1);
    ctx.lineTo(this.canvasW, y1);
    ctx.moveTo(0, y2);
    ctx.lineTo(this.canvasW, y2);
    ctx.stroke();
    ctx.setLineDash([]); // 重置虚线样式
  }
  inSideCircle(mouseX: number, mouseY: number, centerX: number, centerY: number, radius: number) {
    const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);
    if (distance <= radius) {
      return true;
    } else {
      return false;
    }
  }
  inSideRect(
    mouseX: number,
    mouseY: number,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
  ) {
    if (
      mouseX >= centerX - width / 2 &&
      mouseX <= centerX + width / 2 &&
      mouseY >= centerY - height / 2 &&
      mouseY <= centerY + height / 2
    ) {
      return true;
    } else {
      return false;
    }
  }
  inSideSeats(mouseX: number, mouseY: number, seatX: number, seatY: number) {
    const dx = mouseX - seatX;
    const dy = mouseY - seatY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < SEAT_WIDTH / 2; // 判断是否在座位半径内
  }
  getRowSeatTextColor(tableActive: number, seatsInfo: SeatInfo) {
    let currentSeatTextColor;
    if (tableActive === 1 || seatsInfo.select === 1) {
      currentSeatTextColor = '#FFFFFF';
    } else if (seatsInfo.color) {
      currentSeatTextColor = seatsInfo.color;
    } else {
      currentSeatTextColor = SEAT_TEXT_COLOR;
    }
    return currentSeatTextColor;
  }
  getSeatFillColor(tableActive: number, seatsInfo: SeatInfo) {
    let currentSeatFillColor;
    if (tableActive === 1 || seatsInfo.select === 1) {
      currentSeatFillColor = ACTIVE_COLOR;
    } else if (seatsInfo.disable === 1) {
      currentSeatFillColor = DISABLE_SEAT_COLOR;
    } else {
      currentSeatFillColor = '#ffffff';
    }
    return currentSeatFillColor;
  }
  getSeatBorderColor(tableActive: number, seatsInfo: SeatInfo) {
    let currentSeatBorderColor;
    if (tableActive === 1 || seatsInfo.select === 1) {
      currentSeatBorderColor = ACTIVE_COLOR;
    } else if (seatsInfo.disable === 1) {
      currentSeatBorderColor = DISABLE_SEAT_COLOR;
    } else if (seatsInfo.color) {
      currentSeatBorderColor = seatsInfo.color;
    } else {
      currentSeatBorderColor = SEAT_BORDER_COLOR;
    }
    return currentSeatBorderColor;
  }
  drawSeatsShape(
    centerX: number,
    centerY: number,
    angleInRadians: number,
    tableActive: number,
    seatsInfo: SeatInfo,
  ) {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angleInRadians + Math.PI / 2);
    const x = -SEAT_WIDTH / 2;
    const y = -SEAT_HEIGHT / 2;
    const fillColor = this.getSeatFillColor(tableActive, seatsInfo);
    const borderColor = this.getSeatBorderColor(tableActive, seatsInfo);
    const rectX = x + SEAT_WIDTH / 2;
    const rectY = y + SEAT_HEIGHT / 2;
    this.drawRect(
      rectX,
      rectY,
      SEAT_WIDTH,
      SEAT_HEIGHT,
      SEAT_RADIUS,
      SEAT_RADIUS,
      0,
      0,
      fillColor,
      borderColor,
    );
    if (seatsInfo.isCenter === 1 && this.step === 2) {
      const color = tableActive === 1 ? '#ffffff' : SEAT_TEXT_COLOR;
      this.drawText(rectX, rectY, '主', '10px Arial', color);
    }
    ctx.restore();
  }
  // 旋转后反向角度计算鼠标位置
  rotatePoint(mouseX: number, mouseY: number, centerX: number, centerY: number, rotate: number) {
    const rotationAngle = (rotate * Math.PI) / 180;
    const cos = Math.cos(-rotationAngle);
    const sin = Math.sin(-rotationAngle);
    const translatedX = mouseX - centerX;
    const translatedY = mouseY - centerY;
    const xRotated = translatedX * cos - translatedY * sin;
    const yRotated = translatedX * sin + translatedY * cos;
    const xPrime = xRotated + centerX;
    const yPrime = yRotated + centerY;
    return { x: xPrime, y: yPrime };
  }
  rotateLine(
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    rotationAngle: number,
  ) {
    const wCos = (width / 2) * Math.cos(rotationAngle);
    const wSin = (width / 2) * Math.sin(rotationAngle);
    const hCos = (height / 2) * Math.cos(rotationAngle);
    const hSin = (height / 2) * Math.sin(rotationAngle);
    const topLeftX = centerX - wCos - hSin;
    const topLeftY = centerY - wSin + hCos;
    const topRightX = centerX + wCos - hSin;
    const topRightY = centerY + wSin + hCos;
    const bottomLeftX = centerX - wCos + hSin;
    const bottomLeftY = centerY - wSin - hCos;
    const bottomRightX = centerX + wCos + hSin;
    const bottomRightY = centerY + wSin - hCos;
    const x1 = Math.min(topLeftX, topRightX, bottomLeftX, bottomRightX);
    const x2 = Math.max(topLeftX, topRightX, bottomLeftX, bottomRightX);
    const y1 = Math.min(topLeftY, topRightY, bottomLeftY, bottomRightY);
    const y2 = Math.max(topLeftY, topRightY, bottomLeftY, bottomRightY);
    return { x1, x2, y1, y2 };
  }
}
// 圆桌
export class DrawRoundTable extends Shape {
  diameter: number;
  width: number;
  height: number;
  constructor(
    shapeParams: ShapeAllType,
    ctx?: CanvasRenderingContext2D,
    scale?: number,
    step?: number,
    canvasW?: number,
    canvasH?: number,
  ) {
    super(shapeParams, ctx, scale, step, canvasW, canvasH);
    const { seats = 0 } = this.shapeParams;
    this.diameter = Math.max((seats * TABLE_LENGTH) / Math.PI, MIN_W_H);
    this.width = this.diameter;
    this.height = this.diameter;
  }
  draw() {
    const { name, centerX, centerY, order, active, seats = 0, seatsInfo } = this.shapeParams;
    const tableRadius = this.diameter / 2; // 圆桌半径
    const tableColor = active === 1 ? ACTIVE_COLOR : TABLE_COLOR; // 圆桌颜色
    // const borderColor = active === 1 ? ACTIVE_COLOR : SHAPE_BORDER_COLOR; // 圆桌颜色
    // 绘制圆桌
    this.drawCircle(centerX, centerY, tableRadius, tableColor);
    this.drawTableText(centerX, centerY, seats, `${name}${order}`, active);

    // 绘制座位
    for (let i = 0; i < seats; i++) {
      const angle = (360 / seats) * i - 90;
      const angleInRadians = angle * (Math.PI / 180);
      const x = centerX + (tableRadius + SEAT_WIDTH / 2 + SPACE) * Math.cos(angleInRadians);
      const y = centerY + (tableRadius + SEAT_HEIGHT / 2 + SPACE) * Math.sin(angleInRadians);
      this.drawSeatsShape(x, y, angleInRadians, active, seatsInfo[i]);
      // 计算文本位置
      const textOffsetX = OFFSET_X * Math.cos(angleInRadians); // 根据角度计算偏移
      const textOffsetY = OFFSET_Y * Math.sin(angleInRadians); // 根据角度计算偏移
      const textX = x + textOffsetX; // 文本 X 坐标
      const textY = y + textOffsetY; // 文本 Y 坐标

      // 座位编号和落座人员文本
      this.drawSeatText(
        textX,
        textY,
        seatsInfo[i].order,
        seatsInfo[i].userInfo.name,
        seatsInfo[i].color,
      );

      // 补充数据
      seatsInfo[i].x = x;
      seatsInfo[i].y = y;
      seatsInfo[i].angle = angle;
    }

    // 绘制虚线
    if (active === 1) {
      const x1 = centerX - tableRadius;
      const x2 = centerX + tableRadius;
      const y1 = centerY - tableRadius;
      const y2 = centerY + tableRadius;
      this.drawLine(x1, x2, y1, y2);
    }
  }
  inSide(mouseX: number, mouseY: number) {
    const { centerX, centerY } = this.shapeParams;
    return this.inSideCircle(mouseX, mouseY, centerX, centerY, this.diameter / 2);
  }
}
// 方桌
export class DrawRectTable extends Shape {
  width: number;
  height: number;
  constructor(
    shapeParams: ShapeAllType,
    ctx?: CanvasRenderingContext2D,
    scale?: number,
    step?: number,
    canvasW?: number,
    canvasH?: number,
  ) {
    super(shapeParams, ctx, scale, step, canvasW, canvasH);
    const { seatsTop = 0, seatsRight = 0, seatsBottom = 0, seatsLeft = 0 } = this.shapeParams;
    this.width = Math.max(Math.max(seatsTop, seatsBottom) * TEXT_WIDTH, MIN_W_H);
    this.height = Math.max(Math.max(seatsLeft, seatsRight) * TEXT_HEIGHT, MIN_W_H);
  }
  draw() {
    const {
      name,
      order,
      centerX,
      centerY,
      active,
      rotate = 0,
      seatsTop = 0,
      seatsRight = 0,
      seatsBottom = 0,
      seatsLeft = 0,
      seatsInfo,
    } = this.shapeParams;
    const tableColor = active === 1 ? ACTIVE_COLOR : TABLE_COLOR;
    // const borderColor = active === 1 ? ACTIVE_COLOR : SHAPE_BORDER_COLOR;
    const ctx = this.ctx;
    if (!ctx) return;
    const rotationAngle = (rotate * Math.PI) / 180;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);
    ctx.translate(-centerX, -centerY);
    // 绘制圆角方形桌
    this.drawRect(
      centerX,
      centerY,
      this.width,
      this.height,
      RECT_RADIUS,
      RECT_RADIUS,
      RECT_RADIUS,
      RECT_RADIUS,
      tableColor,
    );
    // 绘制文字
    const seats = seatsTop + seatsRight + seatsBottom + seatsLeft;
    this.drawTableText(centerX, centerY, seats, `${name}${order}`, active);

    // 绘制座位
    const halfWidth = this.width / 2 + SEAT_WIDTH / 2 + SPACE;
    const halfHeight = this.height / 2 + SEAT_WIDTH / 2 + SPACE;
    if (seatsInfo && seatsInfo.length > 0) {
      seatsInfo.forEach((e, i) => {
        const angle = (e.row - 2) * 90;
        const angleInRadians = angle * (Math.PI / 180);
        let baseX = 0,
          baseY = 0,
          offsetX,
          offsetY;
        if ([1, 3].includes(e.row)) {
          baseX = centerX;
          baseY = centerY + (e.row - 2) * halfHeight;
        } else if ([2, 4].includes(e.row)) {
          baseX = centerX + (3 - e.row) * halfWidth;
          baseY = centerY;
        }
        let pSeats = 0;
        if (e.row === 1) pSeats = seatsTop;
        if (e.row === 2) pSeats = seatsRight;
        if (e.row === 3) pSeats = seatsBottom;
        if (e.row === 4) pSeats = seatsLeft;
        if (e.row === 1 || e.row === 2) {
          offsetX = (e.column - 1 - (pSeats - 1) / 2) * TEXT_WIDTH; // 计算偏移量
          offsetY = (e.column - 1 - (pSeats - 1) / 2) * TEXT_HEIGHT; // 计算偏移量
        } else {
          offsetX = ((pSeats - 1) / 2 - (e.column - 1)) * TEXT_WIDTH; // 计算偏移量
          offsetY = ((pSeats - 1) / 2 - (e.column - 1)) * TEXT_HEIGHT; // 计算偏移量
        }
        const x = baseX + ([1, 3].includes(e.row) ? offsetX : 0);
        const y = baseY + ([2, 4].includes(e.row) ? offsetY : 0);
        this.drawSeatsShape(x, y, angleInRadians, active, seatsInfo[i]);
        // 计算文本位置
        const textOffsetX = e.row === 4 ? -OFFSET_X : OFFSET_X; // 计算偏移量
        const textOffsetY = e.row === 1 ? -OFFSET_Y : OFFSET_Y; // 计算偏移量
        const textX = x + ([2, 4].includes(e.row) ? textOffsetX : 0);
        const textY = y + ([1, 3].includes(e.row) ? textOffsetY : 0);
        // 座位编号和落座人员文本
        this.drawSeatText(textX, textY, e.order, seatsInfo[i].userInfo.name, seatsInfo[i].color);
        // 补充数据
        seatsInfo[i].x = x;
        seatsInfo[i].y = y;
        seatsInfo[i].angle = angle;
      });
    }
    ctx.restore();
    // 绘制虚线
    if (active === 1) {
      const c = this.rotateLine(this.width, this.height, centerX, centerY, rotationAngle);
      this.drawLine(c.x1, c.x2, c.y1, c.y2);
    }
  }
  inSide(mouseX: number, mouseY: number) {
    const { centerX, centerY, rotate = 0 } = this.shapeParams;
    const newMouse = this.rotatePoint(mouseX, mouseY, centerX, centerY, rotate);
    return this.inSideRect(newMouse.x, newMouse.y, centerX, centerY, this.width, this.height);
  }
  inSideSeats(mouseX: number, mouseY: number, seatX: number, seatY: number): boolean {
    const { centerX, centerY, rotate = 0 } = this.shapeParams;
    const newMouse = this.rotatePoint(mouseX, mouseY, centerX, centerY, rotate);
    return this.inSideRect(newMouse.x, newMouse.y, seatX, seatY, SEAT_WIDTH, SEAT_HEIGHT);
  }
}
// 扇形
export class DrawArcTable extends Shape {
  angleLeft: number;
  angleRight: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  radius: number;
  circleCenterY: number;
  cY: number;
  constructor(
    shapeParams: ShapeAllType,
    ctx?: CanvasRenderingContext2D,
    scale?: number,
    step?: number,
    canvasW?: number,
    canvasH?: number,
  ) {
    super(shapeParams, ctx, scale, step, canvasW, canvasH);
    const { centerX, centerY, seatsTop = 0, seatsBottom = 0, radian = 0 } = this.shapeParams;
    const innerLength = seatsTop * ARC_LENGTH;
    const outerLength = seatsBottom * ARC_LENGTH;
    const innerRadius = ((360 / radian) * innerLength) / 2 / Math.PI;
    const outerRadius = ((360 / radian) * outerLength) / 2 / Math.PI;
    const offset = ARC_HEIGHT / 2 + SPACE + SEAT_HEIGHT + TEXT_HEIGHT / 2;
    this.radius = Math.max(innerRadius + offset, outerRadius - offset);
    this.angleLeft = ((90 - radian / 2) * Math.PI) / 180;
    this.angleRight = ((90 + radian / 2) * Math.PI) / 180;
    this.top = centerY - this.radius + (this.radius - ARC_HEIGHT / 2) * Math.sin(this.angleLeft);
    this.left = centerX - (this.radius + ARC_HEIGHT / 2) * Math.cos(this.angleLeft);
    this.right = centerX + (this.radius + ARC_HEIGHT / 2) * Math.cos(this.angleLeft);
    this.bottom = centerY + ARC_HEIGHT / 2;
    this.width = this.right - this.left;
    this.height = this.bottom - this.top;
    this.cY = (this.bottom - this.top) / 2 + this.top;
    this.circleCenterY = centerY - this.radius;
  }
  draw() {
    const {
      name,
      order,
      centerX,
      centerY,
      rotate = 0,
      radian = 10,
      active,
      seatsTop = 0,
      seatsBottom = 0,
      seatsInfo,
    } = this.shapeParams;

    const tableColor = active === 1 ? ACTIVE_COLOR : TABLE_COLOR; // 圆桌颜色
    const rotationAngle = (rotate * Math.PI) / 180;
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.save();
    ctx.translate(centerX, this.cY);
    ctx.rotate(rotationAngle);
    ctx.translate(-centerX, -this.cY);
    // 绘制扇形
    ctx.beginPath();
    ctx.arc(centerX, this.circleCenterY, this.radius, this.angleLeft, this.angleRight);
    ctx.strokeStyle = tableColor;
    ctx.lineWidth = ARC_HEIGHT;
    ctx.stroke();
    // 绘制文字
    const seats = seatsTop + seatsBottom;
    this.drawTableText(centerX, centerY, seats, `${name}${order}`, active);
    const seatOffset = ARC_HEIGHT / 2 + SEAT_HEIGHT / 2 + SPACE;
    // 绘制座位
    if (seatsInfo && seatsInfo.length > 0) {
      seatsInfo.forEach((e, i) => {
        const pSeats = e.row === 1 ? seatsBottom : seatsTop;
        let angle, seatAngle, seatRadius;
        if (e.row === 1) {
          angle = 90 + radian / 2 - radian / pSeats / 2 - i * (radian / pSeats);
          seatRadius = this.radius + seatOffset;
          seatAngle = angle;
        } else {
          angle = 90 - radian / 2 + radian / pSeats / 2 + (i - seatsBottom) * (radian / pSeats);
          seatRadius = this.radius - seatOffset;
          seatAngle = angle + 180;
        }
        const angleInRadians = (angle * Math.PI) / 180;
        const seatAngleInRadians = (seatAngle * Math.PI) / 180;
        const x = centerX + seatRadius * Math.cos(angleInRadians);
        const y = centerY + seatRadius * Math.sin(angleInRadians) - this.radius;
        this.drawSeatsShape(x, y, seatAngleInRadians, active, seatsInfo[i]);
        const textOffsetX = (e.row === 1 ? OFFSET_X : -OFFSET_X) * Math.cos(angleInRadians); // 根据角度计算偏移
        const textOffsetY = (e.row === 1 ? OFFSET_Y : -OFFSET_Y) * Math.sin(angleInRadians); // 根据角度计算偏移
        const textX = x + textOffsetX; // 文本 X 坐标
        const textY = y + textOffsetY; // 文本 Y 坐标
        // 座位编号和落座人员文本
        this.drawSeatText(
          textX,
          textY,
          seatsInfo[i].order,
          seatsInfo[i].userInfo.name,
          seatsInfo[i].color,
        );
        // 补充数据
        seatsInfo[i].x = x;
        seatsInfo[i].y = y;
        seatsInfo[i].angle = angle;
      });
    }
    ctx.restore();
    // 绘制虚线
    if (active === 1) {
      const c = this.rotateLine(this.width, this.height, centerX, this.cY, rotationAngle);
      this.drawLine(c.x1, c.x2, c.y1, c.y2);
    }
  }
  inSide(mouseX: number, mouseY: number) {
    const { centerX, rotate = 0, radian = 0 } = this.shapeParams;
    const newMouse = this.rotatePoint(mouseX, mouseY, centerX, this.cY, rotate);
    const distanceToCenter = Math.sqrt(
      (newMouse.x - centerX) ** 2 + (newMouse.y - this.circleCenterY) ** 2,
    );
    if (
      distanceToCenter >= this.radius - ARC_HEIGHT / 2 &&
      distanceToCenter <= this.radius + ARC_HEIGHT / 2
    ) {
      const dx = newMouse.x - centerX;
      const dy = newMouse.y - this.circleCenterY;
      let angle = Math.atan2(dy, dx);
      if (angle < 0) {
        angle += 2 * Math.PI;
      }
      const startAngle = ((90 - radian / 2) * Math.PI) / 180;
      const endAngle = ((90 + radian / 2) * Math.PI) / 180;
      if (angle >= startAngle && angle <= endAngle) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  inSideSeats(mouseX: number, mouseY: number, seatX: number, seatY: number): boolean {
    const { centerX, rotate = 0 } = this.shapeParams;
    const newMouse = this.rotatePoint(mouseX, mouseY, centerX, this.cY, rotate);
    return this.inSideRect(newMouse.x, newMouse.y, seatX, seatY, SEAT_WIDTH, SEAT_HEIGHT);
  }
}
// 排&列
export class DrawRowAndColumn extends Shape {
  width: number;
  height: number;
  startX: number;
  startY: number;
  constructor(
    shapeParams: ShapeAllType,
    ctx?: CanvasRenderingContext2D,
    scale?: number,
    step?: number,
    canvasW?: number,
    canvasH?: number,
  ) {
    super(shapeParams, ctx, scale, step, canvasW, canvasH);
    const {
      centerX,
      centerY,
      rows = 0,
      columns = 0,
      seatWidth = 0,
      seatHeight = 0,
    } = this.shapeParams;
    this.width = (seatWidth + ROW_SPACE) * (columns + 1) - ROW_SPACE;
    this.height = (seatHeight + ROW_SPACE) * (rows + 1) - ROW_SPACE;
    this.startX = centerX - seatWidth / 2;
    this.startY = centerY - seatHeight / 2;
  }
  draw() {
    const {
      name,
      centerX,
      centerY,
      active,
      rows = 0,
      columns = 0,
      seatWidth = 0,
      seatHeight = 0,
      seatsInfo,
    } = this.shapeParams;
    const rowColumnTipFillColor = active === 1 ? ACTIVE_COLOR : '#ffffff';
    const rowColumnTipBorderColor = active === 1 ? ACTIVE_COLOR : SEAT_BORDER_COLOR;
    const rowColumnTextColor = active === 1 ? '#ffffff' : SEAT_TEXT_COLOR;
    // 绘制左上角区域
    this.drawRect(
      centerX,
      centerY,
      seatWidth,
      seatHeight,
      0,
      0,
      0,
      0,
      rowColumnTipFillColor,
      rowColumnTipBorderColor,
    );
    this.drawText(centerX, centerY, `${name}`, '', rowColumnTextColor);

    // 绘制排号
    let rowNumber = 0;
    for (let row = 0; row <= rows; row++) {
      const rowSeat = seatsInfo.filter((seat) => seat.row === row && seat.delete === 0);
      if (rowSeat.length > 0) {
        rowNumber++;
        const cX = centerX;
        const cY = centerY + row * (seatHeight + ROW_SPACE);
        const text = `${rowNumber}排`;
        this.drawRect(
          cX,
          cY,
          seatWidth,
          seatHeight,
          0,
          0,
          0,
          0,
          rowColumnTipFillColor,
          rowColumnTipBorderColor,
        );
        this.drawText(cX, cY, text, '', rowColumnTextColor);
        seatsInfo.forEach((seat) => {
          if (seat.row === row) seat.rowNumber = rowNumber;
        });
      }
    }
    // 绘制列号
    let columnNumber = 0;
    for (let column = 0; column <= columns; column++) {
      const columnSeat = seatsInfo.filter((seat) => seat.column === column && seat.delete === 0);
      if (columnSeat.length > 0) {
        columnNumber++;
        const cX = centerX + column * (seatWidth + ROW_SPACE);
        const cY = centerY;
        const text = `${columnNumber}列`;
        this.drawRect(
          cX,
          cY,
          seatWidth,
          seatHeight,
          0,
          0,
          0,
          0,
          rowColumnTipFillColor,
          rowColumnTipBorderColor,
        );
        this.drawText(cX, cY, text, '', rowColumnTextColor);
        seatsInfo.forEach((seat) => {
          if (seat.column === column) seat.columnNumber = columnNumber;
        });
      }
    }
    // 绘制座
    seatsInfo.forEach((e) => {
      const cX = centerX + e.column * (seatWidth + ROW_SPACE);
      const cY = centerY + e.row * (seatHeight + ROW_SPACE);
      if (e.delete !== 1) {
        const fillColor = this.getSeatFillColor(active, e);
        const borderColor = this.getSeatBorderColor(active, e);
        this.drawRect(cX, cY, seatWidth, seatHeight, 0, 0, 0, 0, fillColor, borderColor);
        const text = e.userInfo.name ? e.userInfo.name : this.step === 1 ? '落座人员' : '';
        const color = this.getRowSeatTextColor(active, e);
        this.drawText(cX, cY, text, '', color);
      }
      e.x = cX;
      e.y = cY;
      if (e.delete === 1) {
        e.rowNumber = null;
        e.columnNumber = null;
      }
    });
    // 绘制虚线
    if (active === 1) {
      const x1 = this.startX;
      const x2 = this.startX + this.width;
      const y1 = this.startY;
      const y2 = this.startY + this.height;
      this.drawLine(x1, x2, y1, y2);
    }
  }
  inSide(mouseX: number, mouseY: number) {
    const { seatWidth = 0, seatHeight = 0 } = this.shapeParams;
    if (
      mouseX >= this.startX &&
      mouseX <= this.startX + seatWidth &&
      mouseY >= this.startY &&
      mouseY <= this.startY + seatHeight
    ) {
      return true;
    } else {
      return false;
    }
  }
  inSideRowTip(mouseX: number, mouseY: number, x: number, y: number) {
    const { seatWidth = 0, seatHeight = 0 } = this.shapeParams;
    if (
      mouseX >= x - seatWidth / 2 &&
      mouseX <= x + seatWidth / 2 &&
      mouseY >= y - seatHeight * 1.5 - ROW_SPACE &&
      mouseY <= y - seatHeight / 2 - ROW_SPACE
    ) {
      return true;
    } else {
      return false;
    }
  }
  inSideColumnTip(mouseX: number, mouseY: number, x: number, y: number) {
    const { seatWidth = 0, seatHeight = 0 } = this.shapeParams;
    if (
      mouseX >= x - seatWidth * 1.5 - ROW_SPACE &&
      mouseX <= x - seatWidth / 2 - ROW_SPACE &&
      mouseY >= y - seatHeight / 2 &&
      mouseY <= y + seatHeight / 2
    ) {
      return true;
    } else {
      return false;
    }
  }
  inSideSeats(mouseX: number, mouseY: number, seatX: number, seatY: number) {
    const { seatWidth = 0, seatHeight = 0 } = this.shapeParams;
    return this.inSideRect(mouseX, mouseY, seatX, seatY, seatWidth, seatHeight);
  }
}
// 圆柱
export class DrawCircle extends Shape {
  width: number;
  height: number;
  constructor(
    shapeParams: ShapeAllType,
    ctx?: CanvasRenderingContext2D,
    scale?: number,
    step?: number,
    canvasW?: number,
    canvasH?: number,
  ) {
    super(shapeParams, ctx, scale, step, canvasW, canvasH);
    const { diameter = 0 } = this.shapeParams;
    this.width = diameter;
    this.height = diameter;
  }
  draw() {
    const { centerX, centerY, active, diameter = 0, name } = this.shapeParams;
    const fillColor = active === 1 ? ACTIVE_COLOR : SHAPE_COLOR;
    const borderColor = active === 1 ? ACTIVE_COLOR : SHAPE_BORDER_COLOR;
    const textColor = active === 1 ? '#ffffff' : SHAPE_TEXT_COLOR;
    const radius = diameter / 2;
    this.drawCircle(centerX, centerY, radius, fillColor, borderColor);
    this.drawText(centerX, centerY, name, '14px Arial', textColor);
    // 绘制虚线
    if (active === 1) {
      const x1 = centerX - radius;
      const x2 = centerX + radius;
      const y1 = centerY - radius;
      const y2 = centerY + radius;
      this.drawLine(x1, x2, y1, y2);
    }
  }
  inSide(mouseX: number, mouseY: number) {
    const { centerX, centerY, diameter = 0 } = this.shapeParams;
    return this.inSideCircle(mouseX, mouseY, centerX, centerY, diameter / 2);
  }
}
// 方柱
export class DrawRect extends Shape {
  width: number;
  height: number;
  constructor(
    shapeParams: ShapeAllType,
    ctx?: CanvasRenderingContext2D,
    scale?: number,
    step?: number,
    canvasW?: number,
    canvasH?: number,
  ) {
    super(shapeParams, ctx, scale, step, canvasW, canvasH);
    const { width = 0, height = 0 } = this.shapeParams;
    this.width = width;
    this.height = height;
  }
  draw() {
    const { centerX, centerY, active, name, width = 0, height = 0 } = this.shapeParams;
    const fillColor = active === 1 ? ACTIVE_COLOR : SHAPE_COLOR;
    const borderColor = active === 1 ? ACTIVE_COLOR : SHAPE_BORDER_COLOR;
    const textColor = active === 1 ? '#ffffff' : SHAPE_TEXT_COLOR;
    this.drawRect(centerX, centerY, width, height, 0, 0, 0, 0, fillColor, borderColor);
    this.drawText(centerX, centerY, name, '14px Arial', textColor);
    // 绘制虚线
    if (active === 1) {
      const x1 = centerX - width / 2;
      const x2 = centerX + width / 2;
      const y1 = centerY - height / 2;
      const y2 = centerY + height / 2;
      this.drawLine(x1, x2, y1, y2);
    }
  }
  inSide(mouseX: number, mouseY: number) {
    const { centerX, centerY, width = 0, height = 0 } = this.shapeParams;
    return this.inSideRect(mouseX, mouseY, centerX, centerY, width, height);
  }
}

// 圈选范围
export class DrawSelectRange {
  protected ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D, scale: number) {
    this.ctx = ctx;
    this.ctx.scale(scale, scale);
  }
  draw(shapeParams: SelectRange) {
    const { startX = 0, startY = 0, endX = 0, endY = 0 } = shapeParams;
    const sX = Math.min(startX, endX);
    const sY = Math.min(startY, endY);
    const eX = Math.max(startX, endX);
    const eY = Math.max(startY, endY);
    const ctx = this.ctx;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = ACTIVE_COLOR;
    // 上下左右的虚线
    ctx.beginPath();
    ctx.moveTo(sX, sY);
    ctx.lineTo(eX, sY);
    ctx.moveTo(eX, sY);
    ctx.lineTo(eX, eY);
    ctx.moveTo(eX, eY);
    ctx.lineTo(sX, eY);
    ctx.moveTo(sX, eY);
    ctx.lineTo(sX, sY);
    ctx.stroke();
    ctx.setLineDash([]); // 重置虚线样式
  }
}

export const shapeTypesMap = {
  roundTable: {
    instance: DrawRoundTable,
    shapeTypeName: '圆桌',
    key: 'roundTable',
  },
  rectTable: {
    instance: DrawRectTable,
    shapeTypeName: '方桌',
    key: 'rectTable',
  },
  arcTable: {
    instance: DrawArcTable,
    shapeTypeName: '扇形',
    key: 'arcTable',
  },
  rowAndColumn: {
    instance: DrawRowAndColumn,
    shapeTypeName: '排&列',
    key: 'rowAndColumn',
  },
  circle: {
    instance: DrawCircle,
    shapeTypeName: '圆形',
    key: 'circle',
  },
  rect: {
    instance: DrawRect,
    shapeTypeName: '方形',
    key: 'rect',
  },
};
