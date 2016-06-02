var { Component, Polyline } = scene

var controlHandler = {

  ondragstart: function(point, index, component) {

    component.mutatePath(null, function(path) {
      path.splice(index + 1, 0, point)  // array.insert(index, point) 의 의미임.
    })
  },

  ondragmove: function(point, index, component) {

    component.mutatePath(null, function(path) {
      path[index + 1] = point
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
      direction
    } = this.model;

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

  get controls() {

    // 폴리라인에서의 control은 새로운 path를 추가하는 포인트이다.
    var { path = [], direction } = this.model
    var controls = []

    for(let i = 0;i < path.length - 1;i++) {
      let p1 = path[i]
      let p2 = path[i + 1]

      if(direction == 'h')
        controls.push({
          x: path[i + 1].x,
          y: path[i].y,
          handler: controlHandler
        })
      else
        controls.push({
          x: path[i].x,
          y: path[i + 1].y,
          handler: controlHandler
        })
    }

    return controls
  }

}

Component.register('rap', RAP)
