var { Component, Polyline } = scene

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties : [{
    type: 'select',
    label: 'direction',
    name: 'direction',
    property: {
      options: ['h', 'w']
    }
  }]
}

var controlHandler = {

  ondragstart: function(point, index, component) {
    component.mutatePath(null, function(path) {
      path.splice(Math.floor(index / 2) + 1, 0, point)  // array.insert(index, point) 의 의미임.
    })
  },

  ondragmove: function(point, index, component) {
    component.mutatePath(null, function(path) {
      path[Math.floor(index / 2) + 1] = point
    })
  },

  ondragend: function(point, index, component) {
  }
}

export default class RAP extends Polyline {

  _draw(ctx) {

    var {
      alpha = 1,
      path = [],
      direction,
      begin = 'oval',
      end = 'oval',
      beginSize = 'size5',
      endSize = 'size5',
      lineWidth = 2,
      lineCap = false,
      strokeStyle = '#000'
    } = this.model;

    // 양 끝 라인 그리기.
    if(begin != 'none' || end != 'none'){

      beginSize = this.sizes(beginSize)
      endSize = this.sizes(endSize)

      lineWidth = parseInt(lineWidth)
      ctx.lineCap = lineCap;
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = strokeStyle
      ctx.fillStyle = strokeStyle
      ctx.globalAlpha = alpha

      this._drawEndPoint(ctx, path[0].x, path[0].y, path[path.length - 1].x, path[path.length - 1].y, lineWidth, begin, end, beginSize, endSize)
    }

    if(path.length <= 1)
      return;

    ctx.beginPath();
    ctx.globalAlpha = alpha;

    ctx.moveTo(path[0].x, path[0].y)
    if(direction == 'h')
      ctx.lineTo(path[1].x, path[0].y)
    else
      ctx.lineTo(path[0].x, path[1].y)

    for(var i = 1;i < path.length - 1;i++) {
      ctx.lineTo(path[i].x, path[i].y)
      if(direction == 'h')
        ctx.lineTo(path[i + 1].x, path[i].y)
      else
        ctx.lineTo(path[i].x, path[i + 1].y)
    }
    ctx.lineTo(path[i].x, path[i].y)

    this.drawStroke(ctx)
  }

  contains(x, y) {

    var { path, direction } = this.model
    var result = false;

    path.forEach((p, idx) => {
      let j =  (idx + path.length + 1) % path.length;

      let x1 = p.x;
      let y1 = p.y;
      let x3 = path[j].x;
      let y3 = path[j].y;
      let x2 = direction == 'h' ? x3 : x1;
      let y2 = direction == 'h' ? y1 : y3;

      if((y1 > y) != (y2 > y) && (x < (x2 - x1) * (y - y1) / (y2 - y1) + x1))
        result = !result;

      if((y2 > y) != (y3 > y) && (x < (x3 - x2) * (y - y2) / (y3 - y2) + x2))
        result = !result;
    });

    return result;
  }

  get pathExtendable() {
    return true;
  }

  get controls() {

    // 폴리라인에서의 control은 새로운 path를 추가하는 포인트이다.
    var { path = [], direction } = this.model
    var controls = []

    for(let i = 0;i < path.length - 1;i++) {
      let p1 = path[i]
      let p2 = path[i + 1]

      if(direction == 'h'){
        controls.push({
          x: path[i + 1].x - (path[i + 1].x - path[i].x) / 2,
          y: path[i].y,
          handler: controlHandler
        })
        controls.push({
          x: path[i + 1].x,
          y: path[i].y + (path[i + 1].y - path[i].y) / 2,
          handler: controlHandler
        })
      } else {
        controls.push({
          x: path[i].x + (path[i + 1].x - path[i].x) / 2,
          y: path[i + 1].y,
          handler: controlHandler
        })
        controls.push({
          x: path[i].x,
          y: path[i + 1].y - (path[i + 1].y - path[i].y) / 2,
          handler: controlHandler
        })
      }
    }

    return controls
  }

  get nature(){
    return NATURE
  }


  isLine() {
    return true;
  }

  _drawEndPoint(ctx, x1, y1, x2, y2, lineWidth, beginType, endType, beginSize, endSize) {
    var theta = Math.atan2(y2 - y1, x2 - x1)

    if(beginType)
      this._drawArrow(ctx, beginType, x1, y1, theta, lineWidth, beginSize)

    if(endType)
      this._drawArrow(ctx, endType, x2, y2, theta + Math.PI, lineWidth, endSize)
  }

  _drawArrow(ctx, type, x, y, theta, lineWidth, size) {

    ctx.beginPath()

    ctx.translate(x, y)
    ctx.rotate(theta)

    switch(type){
      case 'oval':
        ctx.ellipse(0, 0, size.X, size.Y, 0, 0, 2 * Math.PI)
        ctx.fill()
        // ctx.scale(1, 1 / arc_scale_y)
        break;
      case 'diamond':
        ctx.moveTo(-size.X, 0)
        ctx.lineTo(0, -size.Y)
        ctx.lineTo(size.X, 0)
        ctx.lineTo(0, size.Y)
        ctx.fill()
        break;
      case 'arrow':
        ctx.moveTo(0, 0)
        ctx.lineTo((WING_FACTOR * size.X), -size.Y)
        ctx.lineTo((WING_FACTOR * size.X), size.Y)
        ctx.fill()
        break;
      case 'sharp-arrow':
        ctx.moveTo(0, 0)
        ctx.lineTo((WING_FACTOR * size.X), -size.Y)
        ctx.lineTo(- size.X / 1.5 + ((WING_FACTOR * size.X)), 0)
        ctx.lineTo((WING_FACTOR * size.X), size.Y)
        ctx.fill()
        break;
      case 'open-arrow':
        ctx.moveTo((WING_FACTOR * size.X) + lineWidth, -size.Y)
        ctx.lineTo(lineWidth, 0)
        ctx.lineTo((WING_FACTOR * size.X) + lineWidth, size.Y)
        ctx.stroke()
        break;
     default:
        break;
    }

    ctx.rotate(-theta)
    ctx.translate(-x, -y)

    ctx.closePath()
  }

  sizes(size){
    let length = {}
    let lineWidth = this.model.lineWidth * 1.2

    switch(size){
      case 'size1':
        length.X = lineWidth
        length.Y = lineWidth
        break;
      case 'size2':
        length.X = lineWidth * 1.5
        length.Y = lineWidth
        break;
      case 'size3':
        length.X = lineWidth * 2
        length.Y = lineWidth
        break;
      case 'size4':
        length.X = lineWidth
        length.Y = lineWidth * 1.5
        break;
      case 'size5':
        length.X = lineWidth * 1.5
        length.Y = lineWidth * 1.5
        break;
      case 'size6':
        length.X = lineWidth * 2
        length.Y = lineWidth * 1.5
        break;
      case 'size7':
        length.X = lineWidth
        length.Y = lineWidth * 2
        break;
      case 'size8':
        length.X = lineWidth * 1.5
        length.Y = lineWidth * 2
        break;
      case 'size9':
        length.X = lineWidth * 2
        length.Y = lineWidth * 2
        break;
      default:
        length.X = lineWidth * 1.5
        length.Y = lineWidth * 1.5
        break;
    }
    return length
  }

}

Component.memoize(RAP.prototype, 'controls', false);

Component.register('rap', RAP);
