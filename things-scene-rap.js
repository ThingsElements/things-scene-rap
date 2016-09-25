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


var controlHandler = {

  ondragstart: function ondragstart(point, index, component) {

    component.mutatePath(null, function (path) {
      path.splice(index + 1, 0, point); // array.insert(index, point) 의 의미임.
    });
  },

  ondragmove: function ondragmove(point, index, component) {

    component.mutatePath(null, function (path) {
      path[index + 1] = point;
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
    key: '_draw',
    value: function _draw(ctx) {
      var _model = this.model;
      var _model$alpha = _model.alpha;
      var alpha = _model$alpha === undefined ? 1 : _model$alpha;
      var _model$path = _model.path;
      var path = _model$path === undefined ? [] : _model$path;
      var direction = _model.direction;


      if (path.length <= 1) return;

      ctx.beginPath();
      ctx.globalAlpha = alpha;

      ctx.moveTo(path[0].x, path[0].y);
      if (direction == 'h') ctx.lineTo(path[1].x, path[0].y);else ctx.lineTo(path[0].x, path[1].y);

      for (var i = 1; i < path.length - 1; i++) {
        ctx.lineTo(path[i].x, path[i].y);
        if (direction == 'h') ctx.lineTo(path[i + 1].x, path[i].y);else ctx.lineTo(path[i].x, path[i + 1].y);
      }
      ctx.lineTo(path[i].x, path[i].y);

      this.drawStroke(ctx);
    }
  }, {
    key: 'contains',
    value: function contains(x, y) {
      var _model2 = this.model;
      var path = _model2.path;
      var direction = _model2.direction;

      var result = false;

      path.forEach(function (p, idx) {
        var j = (idx + path.length + 1) % path.length;

        var x1 = p.x;
        var y1 = p.y;
        var x3 = path[j].x;
        var y3 = path[j].y;
        var x2 = direction == 'h' ? x3 : x1;
        var y2 = direction == 'h' ? y1 : y3;

        if (y1 > y != y2 > y && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1) result = !result;

        if (y2 > y != y3 > y && x < (x3 - x2) * (y - y2) / (y3 - y2) + x2) result = !result;
      });

      return result;
    }
  }, {
    key: 'pathExtendable',
    get: function get() {
      return true;
    }
  }, {
    key: 'controls',
    get: function get() {

      // 폴리라인에서의 control은 새로운 path를 추가하는 포인트이다.
      var _model3 = this.model;
      var _model3$path = _model3.path;
      var path = _model3$path === undefined ? [] : _model3$path;
      var direction = _model3.direction;

      var controls = [];

      for (var i = 0; i < path.length - 1; i++) {
        var p1 = path[i];
        var p2 = path[i + 1];

        if (direction == 'h') controls.push({
          x: path[i + 1].x,
          y: path[i].y,
          handler: controlHandler
        });else controls.push({
          x: path[i].x,
          y: path[i + 1].y,
          handler: controlHandler
        });
      }

      return controls;
    }
  }]);

  return RAP;
}(Polyline);

exports.default = RAP;


Component.memoize(RAP.prototype, 'controls', false);

Component.register('rap', RAP);

},{}]},{},[1]);
