"use strict";

var _CoinList = _interopRequireDefault(require("./CoinList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var coinList = new _CoinList["default"]();
test("get coin names", function _callee() {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(coinList.getCoinNames());

        case 2:
          result = _context.sent;
          expect(result).toBeTruthy();

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
test("get coin infos", function _callee2() {
  var result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(coinList.getCoinInfos());

        case 2:
          result = _context2.sent;
          expect(result).toBeTruthy();

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});