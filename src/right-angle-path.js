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

  get drawPath() {
    var { path, direction } = this.model
    var drawPath = []

    for(let idx = 0;idx < path.length - 1;idx++) {
      let p = path[idx]
      let q = path[idx + 1]

      drawPath.push(p)
      drawPath.push({
        x: direction == 'h' ? q.x : p.x,
        y: direction == 'h' ? p.y : q.y
      })
    }

    drawPath.push(path[path.length - 1])

    return drawPath
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
}

Component.memoize(RAP.prototype, 'controls', false);
Component.memoize(RAP.prototype, 'drawPath', false);

Component.register('rap', RAP);
