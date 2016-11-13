(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rightAnglePath = require('./right-angle-path');

Object.defineProperty(exports, 'RAP', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_rightAnglePath).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./right-angle-path":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _scene = scene;
var Component = _scene.Component;
var Polyline = _scene.Polyline;


var NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [{
    type: 'select',
    label: 'direction',
    name: 'direction',
    property: {
      options: ['h', 'w']
    }
  }]
};

var controlHandler = {

  ondragstart: function ondragstart(point, index, component) {
    component.mutatePath(null, function (path) {
      path.splice(Math.floor(index / 2) + 1, 0, point); // array.insert(index, point) 의 의미임.
    });
  },

  ondragmove: function ondragmove(point, index, component) {
    component.mutatePath(null, function (path) {
      path[Math.floor(index / 2) + 1] = point;
    });
  },

  ondragend: function ondragend(point, index, component) {}
};

var RAP = function (_Polyline) {
  _inherits(RAP, _Polyline);

  function RAP() {
    _classCallCheck(this, RAP);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(RAP).apply(this, arguments));
  }

  _createClass(RAP, [{
    key: 'drawPath',
    get: function get() {
      var _model = this.model;
      var path = _model.path;
      var direction = _model.direction;

      var drawPath = [];

      for (var idx = 0; idx < path.length - 1; idx++) {
        var p = path[idx];
        var q = path[idx + 1];

        drawPath.push(p);
        drawPath.push({
          x: direction == 'h' ? q.x : p.x,
          y: direction == 'h' ? p.y : q.y
        });
      }

      drawPath.push(path[path.length - 1]);

      return drawPath;
    }
  }, {
    key: 'controls',
    get: function get() {

      // 폴리라인에서의 control은 새로운 path를 추가하는 포인트이다.
      var _model2 = this.model;
      var _model2$path = _model2.path;
      var path = _model2$path === undefined ? [] : _model2$path;
      var direction = _model2.direction;

      var controls = [];

      for (var i = 0; i < path.length - 1; i++) {
        var p1 = path[i];
        var p2 = path[i + 1];

        if (direction == 'h') {
          controls.push({
            x: path[i + 1].x - (path[i + 1].x - path[i].x) / 2,
            y: path[i].y,
            handler: controlHandler
          });
          controls.push({
            x: path[i + 1].x,
            y: path[i].y + (path[i + 1].y - path[i].y) / 2,
            handler: controlHandler
          });
        } else {
          controls.push({
            x: path[i].x + (path[i + 1].x - path[i].x) / 2,
            y: path[i + 1].y,
            handler: controlHandler
          });
          controls.push({
            x: path[i].x,
            y: path[i + 1].y - (path[i + 1].y - path[i].y) / 2,
            handler: controlHandler
          });
        }
      }

      return controls;
    }
  }, {
    key: 'nature',
    get: function get() {
      return NATURE;
    }
  }]);

  return RAP;
}(Polyline);

exports.default = RAP;


Component.memoize(RAP.prototype, 'controls', false);
Component.memoize(RAP.prototype, 'drawPath', false);

Component.register('rap', RAP);

},{}]},{},[1]);
