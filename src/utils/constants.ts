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
