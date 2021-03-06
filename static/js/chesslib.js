require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
"use strict";
var $__13 = $traceurRuntime.initGeneratorFunction(pieces),
    $__14 = $traceurRuntime.initGeneratorFunction(candidates);
Object.defineProperties(exports, {
  Algebraic: {get: function() {
      return Algebraic;
    }},
  chunker: {get: function() {
      return chunker;
    }},
  parse: {get: function() {
      return parse;
    }},
  stringify: {get: function() {
      return stringify;
    }},
  __esModule: {value: true}
});
var $__0 = require('./brands'),
    WHITE = $__0.WHITE,
    KING = $__0.KING,
    QUEEN = $__0.QUEEN,
    ROOK = $__0.ROOK,
    BISHOP = $__0.BISHOP,
    KNIGHT = $__0.KNIGHT,
    PAWN = $__0.PAWN;
var Point = require('./point').Point;
var $__2 = require('./standard'),
    King = $__2.King,
    Queen = $__2.Queen,
    Rook = $__2.Rook,
    Bishop = $__2.Bishop,
    Knight = $__2.Knight,
    Pawn = $__2.Pawn;
var EnPassantTarget = require('./eptarget').EnPassantTarget;
var $__4 = require('./error'),
    ChessError = $__4.ChessError,
    AmbiguityError = $__4.AmbiguityError,
    MobilityError = $__4.MobilityError;
var $__5 = require('./util'),
    squareCoords = $__5.squareCoords,
    rankIndex = $__5.rankIndex,
    fileIndex = $__5.fileIndex,
    rankName = $__5.rankName,
    fileName = $__5.fileName,
    squareName = $__5.squareName;
var unique = require('lodash.uniq');
var Algebraic = {
  parse: parse,
  stringify: stringify,
  get chunker() {
    return chunker;
  }
};
var chunker = /([KQRBN])?([a-h]?[1-8]?)?x?([a-h][1-8])(?:=([QRBN]))?/;
function parse(algStr, position) {
  if (algStr === 'O-O' || algStr === 'O-O-O') {
    return castlingMove(algStr, position);
  }
  return normalMove(algStr, position);
}
function stringify($__8, position) {
  var $__10,
      $__11,
      $__12;
  var $__9 = $traceurRuntime.assertObject($__8),
      piece = $__9.piece,
      target = $__9.target,
      source = ($__10 = $__9.source) === void 0 ? position.pieceCoords(piece) : $__10,
      isCapture = ($__11 = $__9.isCapture) === void 0 ? position.pieceByCoords(target) != null : $__11,
      promotionPrize = ($__12 = $__9.promotionPrize) === void 0 ? null : $__12;
  var disambiguator = [];
  for (var $__6 = pieces(position, null, target, stringifyPiece(piece))[$traceurRuntime.toProperty(Symbol.iterator)](),
      $__7; !($__7 = $__6.next()).done; ) {
    var p = $__7.value;
    {
      if (p === piece) {
        continue;
      }
      if (position.pieceCoords(p).y === source.y) {
        disambiguator.push(rankName(source.y));
      } else {
        disambiguator.push(fileName(source.x));
      }
    }
  }
  return $traceurRuntime.spread([stringifyPiece(piece)], unique(disambiguator), [isCapture ? 'x' : '', squareName(target)]).join('');
}
function pieces(position, source, target) {
  var i,
      Brand,
      $__6,
      $__7,
      p;
  var $arguments = arguments;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          i = $arguments[3] !== (void 0) ? $arguments[3] : '';
          Brand = pieceBrand(i);
          $ctx.state = 15;
          break;
        case 15:
          $ctx.state = (Brand === King) ? 1 : 12;
          break;
        case 1:
          $ctx.state = 2;
          return getKing(position);
        case 2:
          $ctx.maybeThrow();
          $ctx.state = -2;
          break;
        case 12:
          $__6 = candidates(position, Brand.brand, source, target)[$traceurRuntime.toProperty(Symbol.iterator)]();
          $ctx.state = 8;
          break;
        case 8:
          $ctx.state = (!($__7 = $__6.next()).done) ? 9 : -2;
          break;
        case 9:
          p = $__7.value;
          $ctx.state = 10;
          break;
        case 10:
          $ctx.state = 6;
          return p;
        case 6:
          $ctx.maybeThrow();
          $ctx.state = 8;
          break;
        default:
          return $ctx.end();
      }
  }, $__13, this);
}
function candidates(position, brand, source, target) {
  var $__6,
      $__7,
      p,
      e,
      loc;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $__6 = position.pieces({
            brand: brand,
            color: position.activeColor
          })[$traceurRuntime.toProperty(Symbol.iterator)]();
          $ctx.state = 29;
          break;
        case 29:
          $ctx.state = (!($__7 = $__6.next()).done) ? 31 : -2;
          break;
        case 31:
          p = $__7.value;
          $ctx.state = 32;
          break;
        case 32:
          $ctx.pushTry(22, null);
          $ctx.state = 25;
          break;
        case 25:
          throw undefined;
          $ctx.state = 27;
          break;
        case 27:
          $ctx.popTry();
          $ctx.state = 29;
          break;
        case 22:
          $ctx.popTry();
          loc = $ctx.storedException;
          $ctx.state = 20;
          break;
        case 20:
          loc = position.pieceCoords(p);
          $ctx.state = 21;
          break;
        case 21:
          $ctx.state = (source == null || source.x === loc.x || source.y === loc.y) ? 14 : 29;
          break;
        case 14:
          $ctx.pushTry(12, null);
          $ctx.state = 15;
          break;
        case 15:
          position.movePiece(p, target);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return p;
        case 2:
          $ctx.maybeThrow();
          $ctx.state = 4;
          break;
        case 4:
          $ctx.popTry();
          $ctx.state = 29;
          break;
        case 12:
          $ctx.popTry();
          e = $ctx.storedException;
          $ctx.state = 9;
          break;
        case 9:
          $ctx.state = (e instanceof ChessError) ? 29 : 8;
          break;
        case 8:
          throw e;
          $ctx.state = 29;
          break;
        default:
          return $ctx.end();
      }
  }, $__14, this);
}
function pieceBrand(i) {
  switch (i) {
    case 'K':
      return King;
    case 'Q':
      return Queen;
    case 'R':
      return Rook;
    case 'B':
      return Bishop;
    case 'N':
      return Knight;
    case '':
      return Pawn;
  }
}
function parsePromotionPrize(i, color) {
  switch (i) {
    case 'Q':
      return new Queen({color: color});
    case 'R':
      return new Rook({color: color});
    case 'B':
      return new Bishop({color: color});
    case 'N':
      return new Knight({color: color});
  }
}
function parseSource(s) {
  if (s == null) {
    return null;
  }
  if (!isNaN(Number(s))) {
    return new Point(NaN, rankIndex(s));
  }
  return new Point(fileIndex(s), NaN);
}
function normalMove(algStr, position) {
  var $__8 = $traceurRuntime.assertObject(chunker.exec(algStr)),
      _ = $__8[0],
      i = $__8[1],
      s = $__8[2],
      t = $__8[3],
      p = $__8[4];
  var source = parseSource(s);
  var target = squareCoords(t);
  var promotionPrize = parsePromotionPrize(p, position.activeColor);
  var $__8 = $traceurRuntime.spread(pieces(position, source, target, i)),
      piece = $__8[0],
      extra = $__8[1];
  if (piece == null) {
    throw new MobilityError(algStr, position);
  }
  if (extra != null) {
    throw new AmbiguityError(algStr);
  }
  var $__8 = $traceurRuntime.assertObject(EnPassantTarget.capturablePiece(position, piece, target)),
      captureTarget = $__8.captureTarget,
      capturePiece = $__8.capturePiece,
      isEnPassant = $__8.isEnPassant;
  return {
    piece: piece,
    source: position.pieceCoords(piece),
    target: target,
    isCapture: capturePiece != null,
    captureTarget: captureTarget,
    capturePiece: capturePiece,
    isEnPassant: isEnPassant,
    promotionPrize: promotionPrize
  };
}
function castlingMove(algStr, position) {
  var king = position.piece({
    brand: KING,
    color: position.activeColor
  });
  return {
    piece: king,
    source: position.pieceCoords(king),
    target: getCastlingCoords(algStr, position),
    isCapture: false,
    capturePiece: null,
    isEnPassant: false,
    promotionPrize: null
  };
}
function getCastlingCoords(algStr, position) {
  switch (algStr) {
    case 'O-O':
      return squareCoords(position.activeColor === WHITE ? 'g1' : 'g8');
    case 'O-O-O':
      return squareCoords(position.activeColor === WHITE ? 'c1' : 'c8');
  }
}
function getKing(position) {
  return position.piece({
    brand: King.brand,
    color: position.activeColor
  });
}
function stringifyPiece(piece) {
  switch (piece.brand) {
    case KING:
      return 'K';
    case QUEEN:
      return 'Q';
    case ROOK:
      return 'R';
    case BISHOP:
      return 'B';
    case KNIGHT:
      return 'N';
    case PAWN:
      return '';
  }
}

},{"./brands":4,"./eptarget":6,"./error":7,"./point":18,"./standard":23,"./util":24,"lodash.uniq":63}],3:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Board: {get: function() {
      return Board;
    }},
  __esModule: {value: true}
});
var $__0 = require('./brands'),
    KING = $__0.KING,
    QUEEN = $__0.QUEEN,
    KNIGHT = $__0.KNIGHT,
    BISHOP = $__0.BISHOP,
    ROOK = $__0.ROOK,
    PAWN = $__0.PAWN;
var Point = require('./point').Point;
var Board = function Board() {
  var files = arguments[0] !== (void 0) ? arguments[0] : 8;
  var ranks = arguments[1] !== (void 0) ? arguments[1] : 8;
  var boardArr = arguments[2];
  this.files = files;
  this.ranks = ranks;
  this.storage = createStorage(files, ranks);
  this.pieces = new Set();
  $traceurRuntime.setProperty(this.pieces, KING, new Set());
  $traceurRuntime.setProperty(this.pieces, QUEEN, new Set());
  $traceurRuntime.setProperty(this.pieces, KNIGHT, new Set());
  $traceurRuntime.setProperty(this.pieces, BISHOP, new Set());
  $traceurRuntime.setProperty(this.pieces, ROOK, new Set());
  $traceurRuntime.setProperty(this.pieces, PAWN, new Set());
  if (boardArr != null) {
    this.decorate(boardArr);
  }
};
var $Board = Board;
($traceurRuntime.createClass)(Board, {
  map: function(fn) {
    return new $Board(this.ranks, this.files, this.storage.map((function(rank, i) {
      return rank.map((function(piece, j) {
        return fn(piece, new Point(j, i));
      }));
    })));
  },
  getPieces: function(brand) {
    return brand == null ? this.pieces : this.pieces[$traceurRuntime.toProperty(brand)];
  },
  getPieceCoords: function(piece) {
    for (var i = 0,
        iLen = this.storage.length; i < iLen; i++) {
      try {
        throw undefined;
      } catch (rank) {
        {
          rank = this.storage[$traceurRuntime.toProperty(i)];
          for (var j = 0,
              jLen = rank.length; j < jLen; j++) {
            try {
              throw undefined;
            } catch (p) {
              {
                p = rank[$traceurRuntime.toProperty(j)];
                if (p && p === piece) {
                  return new Point(j, i);
                }
              }
            }
          }
        }
      }
    }
    return null;
  },
  getPieceByCoords: function($__4) {
    var $__5 = $traceurRuntime.assertObject($__4),
        x = $__5.x,
        y = $__5.y;
    var rotated = arguments[1] !== (void 0) ? arguments[1] : false;
    var rank = this.storage[$traceurRuntime.toProperty(rotated ? this.ranks - y - 1 : y)];
    return rank == null ? null : rank[$traceurRuntime.toProperty(rotated ? this.files - x - 1 : x)];
  },
  placePiece: function(piece, $__4) {
    var $__5 = $traceurRuntime.assertObject($__4),
        file = $__5.x,
        rank = $__5.y;
    $traceurRuntime.setProperty(this.storage[$traceurRuntime.toProperty(rank)], file, piece);
    this.pieces.add(piece);
    this.pieces[$traceurRuntime.toProperty(piece.brand)].add(piece);
  },
  decorate: function(board) {
    var $__2 = this;
    board.forEach((function(rank, i) {
      rank.forEach((function(file, j) {
        var piece = board[$traceurRuntime.toProperty(i)][$traceurRuntime.toProperty(j)];
        if (piece != null) {
          $__2.placePiece(piece, new Point(j, i));
        }
      }));
    }));
  }
}, {});
function createStorage() {
  var ranks = arguments[0] !== (void 0) ? arguments[0] : 8;
  var files = arguments[1] !== (void 0) ? arguments[1] : 8;
  var board = [];
  for (var i = 0; i < ranks; i++) {
    try {
      throw undefined;
    } catch (rank) {
      {
        rank = [];
        for (var j = 0; j < files; j++) {
          rank.push(null);
        }
        board.push(rank);
      }
    }
  }
  return board;
}

},{"./brands":4,"./point":18}],4:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  WHITE: {get: function() {
      return WHITE;
    }},
  BLACK: {get: function() {
      return BLACK;
    }},
  KINGSIDE: {get: function() {
      return KINGSIDE;
    }},
  QUEENSIDE: {get: function() {
      return QUEENSIDE;
    }},
  KING: {get: function() {
      return KING;
    }},
  QUEEN: {get: function() {
      return QUEEN;
    }},
  KNIGHT: {get: function() {
      return KNIGHT;
    }},
  BISHOP: {get: function() {
      return BISHOP;
    }},
  ROOK: {get: function() {
      return ROOK;
    }},
  PAWN: {get: function() {
      return PAWN;
    }},
  DARK: {get: function() {
      return DARK;
    }},
  LIGHT: {get: function() {
      return LIGHT;
    }},
  __esModule: {value: true}
});
var WHITE = 'white';
var BLACK = 'black';
var KINGSIDE = 'kingside';
var QUEENSIDE = 'queenside';
var KING = 'king';
var QUEEN = 'queen';
var KNIGHT = 'knight';
var BISHOP = 'bishop';
var ROOK = 'rook';
var PAWN = 'pawn';
var DARK = 'dark';
var LIGHT = 'light';

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Castling: {get: function() {
      return Castling;
    }},
  __esModule: {value: true}
});
var Point = require('./point').Point;
var $__1 = require('./brands'),
    KING = $__1.KING,
    ROOK = $__1.ROOK,
    QUEENSIDE = $__1.QUEENSIDE,
    KINGSIDE = $__1.KINGSIDE,
    WHITE = $__1.WHITE,
    BLACK = $__1.BLACK;
var CheckError = require('./error').CheckError;
var oppositeColor = require('./util').oppositeColor;
var Castling = function Castling($__8) {
  var $__10,
      $__11;
  var $__9 = $traceurRuntime.assertObject($__8),
      fenEncoding = ($__10 = $__9.fenEncoding) === void 0 ? '' : $__10,
      modes = ($__11 = $__9.modes) === void 0 ? parseCastlingModes(fenEncoding) : $__11,
      rook = $__9.rook,
      square = $__9.square;
  this.modes = modes;
  this.rook = rook;
  this.square = square;
};
var $Castling = Castling;
($traceurRuntime.createClass)(Castling, {
  isLegal: function(color, side) {
    return this.modes[$traceurRuntime.toProperty(color)][$traceurRuntime.toProperty(side)];
  },
  toString: function() {
    var modes = this.modes;
    return [modes[$traceurRuntime.toProperty(WHITE)][$traceurRuntime.toProperty(KINGSIDE)] ? 'K' : '', modes[$traceurRuntime.toProperty(WHITE)][$traceurRuntime.toProperty(QUEENSIDE)] ? 'Q' : '', modes[$traceurRuntime.toProperty(BLACK)][$traceurRuntime.toProperty(KINGSIDE)] ? 'k' : '', modes[$traceurRuntime.toProperty(BLACK)][$traceurRuntime.toProperty(QUEENSIDE)] ? 'q' : ''].join('') || '-';
  }
}, {
  analyze: function(position, piece, coords) {
    var $__8 = $traceurRuntime.assertObject(piece),
        brand = $__8.brand,
        color = $__8.color;
    var castling = $traceurRuntime.assertObject(position).castling;
    if (brand !== KING) {
      return new $Castling({modes: castling.modes});
    }
    var side = $Castling.side(position, piece, coords);
    var modes = blankModes();
    var opponent = oppositeColor(position.activeColor);
    $traceurRuntime.setProperty(modes, opponent, position.castling.modes[$traceurRuntime.toProperty(opponent)]);
    if (side == null || !castling.isLegal(color, side)) {
      return new $Castling({modes: modes});
    }
    if (!isValid(position, color, side)) {
      throw new CheckError();
    }
    return new $Castling({
      rook: $Castling.rook(position, color, side),
      square: position.pieceCoords(piece).sum($Castling.rookOffset(color, side)),
      modes: modes
    });
  },
  side: function(position, king, coords) {
    if (king.brand !== KING) {
      return null;
    }
    for (var $__6 = [KINGSIDE, QUEENSIDE][$traceurRuntime.toProperty(Symbol.iterator)](),
        $__7; !($__7 = $__6.next()).done; ) {
      var side = $__7.value;
      {
        if ($Castling.isCastlingMove(position, king, side, coords)) {
          return side;
        }
      }
    }
    return null;
  },
  rook: function(position, color, side) {
    var kingX = $traceurRuntime.assertObject(position.pieceCoords(position.piece({
      brand: KING,
      color: color
    }))).x;
    for (var $__6 = position.pieces({
      brand: ROOK,
      color: color
    })[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__7; !($__7 = $__6.next()).done; ) {
      var rook = $__7.value;
      {
        try {
          throw undefined;
        } catch (rookX) {
          {
            rookX = $traceurRuntime.assertObject(position.pieceCoords(rook)).x;
            if (color === WHITE ? ((rookX > kingX && side === KINGSIDE) || (rookX < kingX && side === QUEENSIDE)) : ((rookX > kingX && side === QUEENSIDE) || (rookX < kingX && side === KINGSIDE))) {
              return rook;
            }
          }
        }
      }
    }
  },
  isCastlingMove: function(position, king, side, coords) {
    return (position.pieceCoords(king).sum($Castling.kingOffset(king.color, side)).equal(coords));
  },
  kingOffset: function(color, side) {
    return new Point(xOffset(color, side, 2), 0);
  },
  rookOffset: function(color, side) {
    return new Point(xOffset(color, side, -1), 0).sum($Castling.kingOffset(color, side));
  }
});
var blankMode = (function() {
  var $__5;
  return (($__5 = {}, Object.defineProperty($__5, KINGSIDE, {
    value: false,
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__5, QUEENSIDE, {
    value: false,
    configurable: true,
    enumerable: true,
    writable: true
  }), $__5));
});
var blankModes = (function() {
  var $__5;
  return (($__5 = {}, Object.defineProperty($__5, WHITE, {
    value: blankMode(),
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__5, BLACK, {
    value: blankMode(),
    configurable: true,
    enumerable: true,
    writable: true
  }), $__5));
});
var sides = {
  'q': QUEENSIDE,
  'k': KINGSIDE
};
function parseCastlingModes(castling) {
  var modes = blankModes();
  String(castling || '').split('').forEach((function(mode) {
    var modeLower = mode.toLowerCase();
    var color = modeLower === mode ? BLACK : WHITE;
    $traceurRuntime.setProperty(modes[$traceurRuntime.toProperty(color)], sides[$traceurRuntime.toProperty(modeLower)], true);
  }));
  return modes;
}
function xOffset(color, side) {
  var m = arguments[2] !== (void 0) ? arguments[2] : 1;
  if (color === WHITE) {
    if (side === KINGSIDE) {
      return m;
    } else if (side === QUEENSIDE) {
      return -m;
    }
  } else if (color === BLACK) {
    if (side === KINGSIDE) {
      return -m;
    } else if (side === QUEENSIDE) {
      return m;
    }
  }
}
function isValid(position, color, side) {
  var loc = position.pieceCoords(position.piece({
    brand: KING,
    color: color
  }));
  for (var $__6 = loc.to(loc.sum(Castling.kingOffset(color, side)))[$traceurRuntime.toProperty(Symbol.iterator)](),
      $__7; !($__7 = $__6.next()).done; ) {
    var pt = $__7.value;
    {
      if (position.isCheck(color, pt)) {
        return false;
      }
    }
  }
  return true;
}

},{"./brands":4,"./error":7,"./point":18,"./util":24}],6:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  EnPassantTarget: {get: function() {
      return EnPassantTarget;
    }},
  NullEnPassantTarget: {get: function() {
      return NullEnPassantTarget;
    }},
  __esModule: {value: true}
});
var PAWN = require('./brands').PAWN;
var Point = require('./point').Point;
var $__2 = require('./util'),
    squareCoords = $__2.squareCoords,
    squareName = $__2.squareName;
var EnPassantTarget = function EnPassantTarget() {
  $traceurRuntime.defaultSuperCall(this, $EnPassantTarget.prototype, arguments);
};
var $EnPassantTarget = EnPassantTarget;
($traceurRuntime.createClass)(EnPassantTarget, {
  offset: function() {
    return new Point(0, this.y === 3 ? -1 : 1);
  },
  toString: function() {
    return squareName(this);
  }
}, {
  fromPoint: function(point) {
    return new $EnPassantTarget(point.x, point.y);
  },
  analyze: function(position, piece, target) {
    if (piece.brand !== PAWN) {
      return new NullEnPassantTarget();
    }
    var thrust = $traceurRuntime.assertObject(target.difference(position.pieceCoords(piece))).y;
    if (Math.abs(thrust) === 2) {
      return $EnPassantTarget.fromPoint(new Point(0, -piece.reach).sum(target));
    }
    return new NullEnPassantTarget();
  },
  capturablePiece: function(position, capturer, target) {
    if (capturer.brand !== PAWN || !target.equal(position.enPassantTarget)) {
      return {
        capturePiece: position.pieceByCoords(target),
        captureTarget: target,
        isEnPassant: false
      };
    }
    var captureTarget = target.sum(new Point(0, -capturer.reach));
    var capturePiece = position.pieceByCoords(captureTarget);
    if (capturePiece != null) {
      return {
        capturePiece: capturePiece,
        captureTarget: captureTarget,
        isEnPassant: true
      };
    }
  },
  null: function() {
    return new NullEnPassantTarget();
  }
}, Point);
var NullEnPassantTarget = function NullEnPassantTarget() {};
var $NullEnPassantTarget = NullEnPassantTarget;
($traceurRuntime.createClass)(NullEnPassantTarget, {
  equal: function(other) {
    if (other instanceof $NullEnPassantTarget) {
      return true;
    }
    return false;
  },
  toString: function() {
    return '-';
  }
}, {}, EnPassantTarget);

},{"./brands":4,"./point":18,"./util":24}],7:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  ChessError: {get: function() {
      return ChessError;
    }},
  MobilityError: {get: function() {
      return MobilityError;
    }},
  CheckError: {get: function() {
      return CheckError;
    }},
  PromotionError: {get: function() {
      return PromotionError;
    }},
  ResultError: {get: function() {
      return ResultError;
    }},
  AmbiguityError: {get: function() {
      return AmbiguityError;
    }},
  __esModule: {value: true}
});
var ChessError = function ChessError(message, position) {
  Error.call(this);
  this.name = this.constructor.name;
  this.message = message != null ? message : this.name;
  this.position = position;
};
($traceurRuntime.createClass)(ChessError, {}, {}, Error);
var MobilityError = function MobilityError() {
  $traceurRuntime.defaultSuperCall(this, $MobilityError.prototype, arguments);
};
var $MobilityError = MobilityError;
($traceurRuntime.createClass)(MobilityError, {}, {}, ChessError);
var CheckError = function CheckError() {
  $traceurRuntime.defaultSuperCall(this, $CheckError.prototype, arguments);
};
var $CheckError = CheckError;
($traceurRuntime.createClass)(CheckError, {}, {}, ChessError);
var PromotionError = function PromotionError() {
  $traceurRuntime.defaultSuperCall(this, $PromotionError.prototype, arguments);
};
var $PromotionError = PromotionError;
($traceurRuntime.createClass)(PromotionError, {}, {}, ChessError);
var ResultError = function ResultError() {
  $traceurRuntime.defaultSuperCall(this, $ResultError.prototype, arguments);
};
var $ResultError = ResultError;
($traceurRuntime.createClass)(ResultError, {}, {}, ChessError);
var AmbiguityError = function AmbiguityError(rejection, candidates) {
  $traceurRuntime.superCall(this, $AmbiguityError.prototype, "constructor", [("Ambiguous notation: " + rejection)]);
  this.rejection = rejection;
  this.candidates = candidates;
};
var $AmbiguityError = AmbiguityError;
($traceurRuntime.createClass)(AmbiguityError, {}, {}, ChessError);

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  FEN: {get: function() {
      return FEN;
    }},
  standard: {get: function() {
      return standard;
    }},
  standardPosition: {get: function() {
      return standardPosition;
    }},
  __esModule: {value: true}
});
var $__0 = require('./brands'),
    WHITE = $__0.WHITE,
    BLACK = $__0.BLACK;
var $__1 = require('./standard'),
    Pawn = $__1.Pawn,
    Rook = $__1.Rook,
    Knight = $__1.Knight,
    Bishop = $__1.Bishop,
    King = $__1.King,
    Queen = $__1.Queen;
var Castling = require('./castling').Castling;
var $__3 = require('./eptarget'),
    EnPassantTarget = $__3.EnPassantTarget,
    NullEnPassantTarget = $__3.NullEnPassantTarget;
var Position = require('./position').Position;
var Board = require('./board').Board;
var Point = require('./point').Point;
var HalfmoveClock = require('./halfmoveclock').HalfmoveClock;
var squareCoords = require('./util').squareCoords;
var FEN = {
  parse: function(fenStr) {
    var $__9 = $traceurRuntime.assertObject(fenStr.split(' ')),
        ranks = $__9[0],
        activeColor = $__9[1],
        castling = $__9[2],
        enPassantTarget = $__9[3],
        halfmoveClock = $__9[4],
        fullmoveCounter = $__9[5];
    return new Position({
      board: parseRanks(ranks),
      activeColor: parseActiveColor(activeColor),
      castling: parseCastling(castling),
      enPassantTarget: parseEPTarget(enPassantTarget),
      halfmoveClock: parseClock(halfmoveClock),
      fullmoveCounter: parseCounter(fullmoveCounter)
    });
  },
  stringify: function(position) {
    return stringifyPosition(position);
  },
  get standard() {
    return standard;
  },
  get standardPosition() {
    return standardPosition;
  }
};
var standard = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
var standardPosition = FEN.parse(standard);
function parseRanks(ranks) {
  var board = new Board();
  ranks.split('/').forEach((function(rank, i) {
    parseRank(rank, board, i);
  }));
  return board;
}
function parseRank(rank, board, i) {
  var cells = rank.split('');
  for (var j = 0,
      c = 0; j < board.files; c++) {
    var cell = rank[$traceurRuntime.toProperty(c)];
    if (!isNaN(Number(cell))) {
      j += Number(cell);
      continue;
    }
    board.placePiece(createPiece(cell), new Point(j, i));
    j += 1;
  }
}
function createPiece(piece) {
  var lowered = piece.toLowerCase();
  var options = {color: lowered === piece ? BLACK : WHITE};
  switch (lowered) {
    case 'p':
      return new Pawn(options);
    case 'r':
      return new Rook(options);
    case 'n':
      return new Knight(options);
    case 'b':
      return new Bishop(options);
    case 'k':
      return new King(options);
    case 'q':
      return new Queen(options);
  }
}
function parseActiveColor(activeColor) {
  switch (activeColor) {
    case 'w':
      return WHITE;
    case 'b':
      return BLACK;
  }
}
function parseCastling(castling) {
  return new Castling({fenEncoding: castling});
}
function parseEPTarget(enPassantTarget) {
  switch (enPassantTarget) {
    case '-':
      return EnPassantTarget.null();
    default:
      return EnPassantTarget.fromPoint(squareCoords(enPassantTarget));
  }
}
function parseCounter(clock) {
  if (clock == null) {
    return null;
  }
  return Number(clock);
}
function stringifyPosition(position) {
  return [stringifyRanks(position), stringifyActiveColor(position.activeColor), stringifyCastling(position.castling), stringifyEPTarget(position.enPassantTarget), stringifyClock(position.halfmoveClock), stringifyCounter(position.fullmoveCounter)].filter(Boolean).join(' ');
}
function stringifyRanks(position) {
  var ranks = '';
  for (var i = 0; i < 8; i++) {
    for (var j = 0,
        count = 0; j < 8; j++) {
      var piece = position.pieceByCoords(new Point(j, i));
      if (piece == null) {
        count += 1;
        if (j === 7) {
          ranks += ("" + (count ? count : '') + (i !== 7 ? '/' : ''));
        }
        continue;
      }
      ranks += ("" + (count ? count : '') + piece.fenEncoding);
      if (j === 7 && i !== 7) {
        ranks += '/';
      }
      count = 0;
    }
  }
  return ranks;
}
function stringifyActiveColor(activeColor) {
  switch (activeColor) {
    case WHITE:
      return 'w';
    case BLACK:
      return 'b';
  }
}
function stringifyCastling(castling) {
  return String(castling);
}
function stringifyEPTarget(enPassantTarget) {
  if (enPassantTarget == null || enPassantTarget instanceof NullEnPassantTarget) {
    return '-';
  }
  return String(enPassantTarget);
}
function stringifyClock(clock) {
  if (String(clock) === '0') {
    return clock.source;
  }
  return String(clock);
}
function stringifyCounter(counter) {
  if (counter == null) {
    return null;
  }
  return String(counter);
}
function parseClock(halfmoveClock) {
  return new HalfmoveClock(halfmoveClock != null ? Number(halfmoveClock) : 0, halfmoveClock);
}

},{"./board":3,"./brands":4,"./castling":5,"./eptarget":6,"./halfmoveclock":11,"./point":18,"./position":19,"./standard":23,"./util":24}],9:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  fischerandom: {get: function() {
      return fischerandom;
    }},
  doubleFischerandom: {get: function() {
      return doubleFischerandom;
    }},
  ninesixty: {get: function() {
      return ninesixty;
    }},
  __esModule: {value: true}
});
var $__0 = require('./brands'),
    WHITE = $__0.WHITE,
    BLACK = $__0.BLACK,
    DARK = $__0.DARK,
    LIGHT = $__0.LIGHT;
var $__1 = require('./standard'),
    King = $__1.King,
    Queen = $__1.Queen,
    Rook = $__1.Rook,
    Bishop = $__1.Bishop,
    Knight = $__1.Knight,
    Pawn = $__1.Pawn;
var Point = require('./point').Point;
var Board = require('./board').Board;
var FEN = require('./fen').FEN;
var $__5 = require('./util'),
    isEven = $__5.isEven,
    isOdd = $__5.isOdd,
    oppositeColor = $__5.oppositeColor;
var Die = require('jsdice');
function fischerandom() {
  var board = new Board();
  randomizeSide(board);
  copySide(board);
  placePawns(board);
  return position(board);
}
;
function doubleFischerandom() {
  var board = new Board();
  randomizeSide(board, WHITE);
  randomizeSide(board, BLACK);
  placePawns(board);
  return position(board);
}
;
var ninesixty = fischerandom;
function randomizeSide(board) {
  var color = arguments[1] !== (void 0) ? arguments[1] : WHITE;
  var rank = colorRank(color);
  var place = placeOnEmptySquare.bind(null, rank, board);
  var b1 = rollDie('d8');
  board.placePiece(new Bishop({color: color}), new Point(b1, rank));
  var b2 = rollDie('d4');
  var b2Prime = colorClash(b1, b2) ? b2 + 1 : b2;
  board.placePiece(new Bishop({color: color}), new Point(b2Prime, rank));
  place(new Queen({color: color}), rollDie('d6'));
  var n = rollDie('d20');
  place(new Knight({color: color}), Math.floor(n / 4));
  place(new Knight({color: color}), n % 4);
  place(new Rook({color: color}), 0);
  place(new King({color: color}), 0);
  place(new Rook({color: color}), 0);
}
function placePawns(board) {
  for (var j = 0; j < board.files; j++) {
    board.placePiece(new Pawn({color: WHITE}), new Point(j, 6));
    board.placePiece(new Pawn({color: BLACK}), new Point(j, 1));
  }
}
function copySide(board) {
  var color = arguments[1] !== (void 0) ? arguments[1] : BLACK;
  var rank = colorRank(color);
  var oppRank = colorRank(oppositeColor(color));
  for (var j = 0; j < board.files; j++) {
    try {
      throw undefined;
    } catch (Brand) {
      {
        Brand = $traceurRuntime.assertObject(board.getPieceByCoords(new Point(j, oppRank))).constructor;
        board.placePiece(new Brand({color: color}), new Point(j, rank));
      }
    }
  }
}
function colorRank(color) {
  return color === WHITE ? 7 : 0;
}
function colorClash(a, b) {
  return ((isEven(a) && isEven(b)) || (isOdd(a) && isOdd(b)));
}
function placeOnEmptySquare(rank, board, piece, n) {
  for (var j = 0,
      count = 0; j < board.files; j++) {
    var point = new Point(j, rank);
    if (board.getPieceByCoords(point) != null) {
      continue;
    }
    if (n === count++) {
      board.placePiece(piece, point);
    }
  }
}
function rollDie(signature) {
  return new Die(signature).roll().total - 1;
}
function position(board) {
  return FEN.standardPosition.beget({board: board});
}

},{"./board":3,"./brands":4,"./fen":8,"./point":18,"./standard":23,"./util":24,"jsdice":25}],10:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Game: {get: function() {
      return Game;
    }},
  __esModule: {value: true}
});
var Line = require('./line').Line;
var Game = function Game() {
  $traceurRuntime.superCall(this, $Game.prototype, "constructor", []);
  this.tags = Object.create(null);
};
var $Game = Game;
($traceurRuntime.createClass)(Game, {
  addTag: function(key, value) {
    $traceurRuntime.setProperty(this.tags, key, value);
  },
  finish: function(result) {
    this.result;
  }
}, {}, Line);

},{"./line":13}],11:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  HalfmoveClock: {get: function() {
      return HalfmoveClock;
    }},
  __esModule: {value: true}
});
var PAWN = require('./brands').PAWN;
var HalfmoveClock = function HalfmoveClock() {
  var count = arguments[0] !== (void 0) ? arguments[0] : 0;
  var source = arguments[1] !== (void 0) ? arguments[1] : null;
  this.count = count;
  this.source = source;
};
var $HalfmoveClock = HalfmoveClock;
($traceurRuntime.createClass)(HalfmoveClock, {
  inc: function() {
    return new $HalfmoveClock(this.count + 1);
  },
  toString: function() {
    return String(this.count);
  }
}, {analyze: function(position, piece, target) {
    if ((piece.brand === PAWN) || (position.pieceByCoords(target) != null)) {
      return new $HalfmoveClock(0);
    }
    return position.halfmoveClock.inc();
  }});

},{"./brands":4}],12:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Leaper: {get: function() {
      return Leaper;
    }},
  __esModule: {value: true}
});
var Point = require('./point').Point;
var $__1 = require('./mobility'),
    Mobility = $__1.Mobility,
    quadrants = $__1.quadrants;
var LeaperMobility = function LeaperMobility() {
  $traceurRuntime.defaultSuperCall(this, $LeaperMobility.prototype, arguments);
};
var $LeaperMobility = LeaperMobility;
($traceurRuntime.createClass)(LeaperMobility, {adjacentPoints: $traceurRuntime.initGeneratorFunction(function $__8(position, p0) {
    var $__7,
        m,
        n,
        $__5,
        $__6,
        o,
        $__3,
        $__4,
        p1;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__7 = this, m = $__7.m, n = $__7.n;
            $ctx.state = 14;
            break;
          case 14:
            $__5 = [new Point(m, n), new Point(n, m)][$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 7;
            break;
          case 7:
            $ctx.state = (!($__6 = $__5.next()).done) ? 9 : -2;
            break;
          case 9:
            o = $__6.value;
            $ctx.state = 10;
            break;
          case 10:
            $__3 = quadrants[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = (!($__4 = $__3.next()).done) ? 5 : 7;
            break;
          case 5:
            p1 = $__4.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return p0.sum(p1.product(o));
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          default:
            return $ctx.end();
        }
    }, $__8, this);
  })}, {}, Mobility);
function Leaper(m, n) {
  this.mobility.push(new LeaperMobility(m, n));
}

},{"./mobility":14,"./point":18}],13:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Line: {get: function() {
      return Line;
    }},
  __esModule: {value: true}
});
var FEN = require('./fen').FEN;
var last = require('./util').last;
var Line = function Line() {
  var position = arguments[0] !== (void 0) ? arguments[0] : FEN.standardPosition;
  this.position = position;
  this.ply = [];
};
($traceurRuntime.createClass)(Line, {
  addPly: function(ply) {
    this.ply.push(ply);
  },
  move: function(move) {
    var note = arguments[1] !== (void 0) ? arguments[1] : null;
    var position = this.position.move(move);
    this.addPly({
      position: position,
      move: move,
      note: note
    });
    this.position = position;
    return this;
  },
  annotate: function(note) {
    if (this.ply.length === 0) {
      throw new Error("no move to annotate");
    }
    last(this.ply).note = note;
    return this;
  },
  get plyLength() {
    return this.ply.length;
  },
  get length() {
    return Math.ceil(this.ply.length / 2);
  }
}, {});

},{"./fen":8,"./util":24}],14:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Mobility: {get: function() {
      return Mobility;
    }},
  quadrants: {get: function() {
      return quadrants;
    }},
  __esModule: {value: true}
});
var PAWN = require('./brands').PAWN;
var Point = require('./point').Point;
var $__2 = require('./util'),
    squareName = $__2.squareName,
    squareCoords = $__2.squareCoords;
var Mobility = function Mobility(m, n) {
  this.m = m;
  this.n = n;
};
($traceurRuntime.createClass)(Mobility, {
  test: function(position, src, dest) {
    for (var $__4 = this.adjacentPoints(position, src)[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__5; !($__5 = $__4.next()).done; ) {
      var adj = $__5.value;
      {
        if (dest.equal(adj)) {
          return true;
        }
      }
    }
    return false;
  },
  adjacentPoints: $traceurRuntime.initGeneratorFunction(function $__8(position, coords) {
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            throw new Error("subclass must override Mobility#adjacentPoints");
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__8, this);
  })
}, {isLegal: function($__6) {
    var $__7 = $traceurRuntime.assertObject($__6),
        position = $__7.position,
        piece = $__7.piece,
        target = $__7.target,
        capturePiece = $__7.capturePiece;
    if (position.activeColor !== piece.color) {
      return false;
    }
    if (capturePiece != null) {
      if (piece.color === capturePiece.color) {
        return false;
      }
      return legally('canCapture', position, piece, target);
    }
    return legally('canMove', position, piece, target);
  }});
var quadrants = [new Point(1, 1), new Point(1, -1), new Point(-1, 1), new Point(-1, -1)];
function legally(method, position, piece, target) {
  return piece[$traceurRuntime.toProperty(method)](position, position.pieceCoords(piece), target);
}

},{"./brands":4,"./point":18,"./util":24}],15:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Pawn: {get: function() {
      return Pawn;
    }},
  __esModule: {value: true}
});
var PAWN = require('./brands').PAWN;
var Piece = require('./piece').Piece;
var Point = require('./point').Point;
var squareName = require('./util').squareName;
var Pawn = function Pawn() {
  $traceurRuntime.defaultSuperCall(this, $Pawn.prototype, arguments);
};
var $Pawn = Pawn;
($traceurRuntime.createClass)(Pawn, {
  get fenEncoding() {
    return this.isWhite ? 'P' : 'p';
  },
  get homeRank() {
    return this.isWhite ? 6 : 1;
  },
  get reach() {
    return this.isWhite ? -1 : 1;
  },
  canMove: function(position, from, to) {
    if (from.x !== to.x) {
      return false;
    }
    var reach = this.reach;
    if (from.y === this.homeRank) {
      return to.y === from.y + reach || ((to.y === from.y + reach * 2) && (position.pieceByCoords(new Point(from.x, from.y + reach)) == null));
    }
    return to.y === from.y + reach;
  },
  canCapture: function(position, from, to) {
    return (to.y === from.y + this.reach && (from.x === to.x + 1 || from.x === to.x - 1));
  }
}, {get brand() {
    return PAWN;
  }}, Piece);

},{"./brands":4,"./piece":17,"./point":18,"./util":24}],16:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  PGN: {get: function() {
      return PGN;
    }},
  __esModule: {value: true}
});
var FEN = require('./fen').FEN;
var Game = require('./game').Game;
var ChessError = require('./error').ChessError;
var $__3 = require('./util'),
    partition = $__3.partition,
    last = $__3.last;
var TOKEN_TAG = 'tag';
var TOKEN_RESULT = 'result';
var TOKEN_MOVE_NUMBER_NOTATION = 'move number';
var TOKEN_PLY_NOTATION = 'ply';
var TOKEN_ANNOTATION_NOTATION = 'annotation';
var PGN = {
  parse: function(pgnStr) {
    return pgnStr.split(/\r\n\r\n\r\n|\n\n\n/).map(parseGame);
  },
  stringify: function(game) {}
};
function parseGame(gameStr) {
  var tokens = tokenizePGN((" " + gameStr.split(/[\n\r\r\t]+/g).join(' ') + " "));
  var game = new Game();
  try {
    tokens.forEach((function($__4) {
      var $__6;
      var $__5 = $traceurRuntime.assertObject($__4),
          mode = $__5.mode,
          source = $__5.source;
      switch (mode) {
        case TOKEN_TAG:
          ($__6 = game).addTag.apply($__6, $traceurRuntime.spread(parseTag(source)));
          break;
        case TOKEN_PLY_NOTATION:
          game.move(source);
          break;
        case TOKEN_ANNOTATION_NOTATION:
          game.annotate(source);
          break;
        case TOKEN_RESULT:
          game.finish(source);
          break;
      }
    }));
  } catch (err) {
    if (err instanceof ChessError) {
      err.lastPosition = FEN.stringify(last(game.ply).position);
    }
    throw err;
  }
  return game;
}
function parseTag(line) {
  var $__4 = $traceurRuntime.assertObject(line.split(/\s+/)),
      key = $__4[0],
      value = $__4[1];
  return [key, cleanValue(value)];
}
function cleanValue(value) {
  return value.replace(/^[\"\']|[\"\']$/g, '');
}
function tokenizePGN(transcript) {
  var tokens = [];
  var mode = null;
  var lastMode = null;
  var buffer = [];
  var halfmoveToggle = false;
  var skipping = 0;
  transcript.split('').forEach((function(char, i) {
    if (i < skipping) {
      return;
    }
    switch (char) {
      case '[':
      case '{':
        skip(1);
        lastMode = mode;
        finishToken();
        mode = char == '[' ? TOKEN_TAG : TOKEN_ANNOTATION_NOTATION;
        break;
      case '}':
      case ']':
        finishToken();
        mode = lastMode;
        lastMode = null;
        return;
      case ' ':
      case '.':
        if (mode === TOKEN_PLY_NOTATION) {
          if (buffer.length == 0) {
            return;
          }
          finishToken();
          if (halfmove()) {
            mode = TOKEN_PLY_NOTATION;
          }
          return;
        }
        if (mode === TOKEN_MOVE_NUMBER_NOTATION) {
          if ('.' === char) {
            buffer.push(char);
          }
          finishToken();
          mode = TOKEN_PLY_NOTATION;
          return;
        }
        break;
      default:
        if (!/\d/.test(char)) {
          break;
        }
        if (mode === null || mode === TOKEN_PLY_NOTATION) {
          var p3 = peek(3),
              p7 = peek(7);
          if (p3 === '1-0' || p3 === '0-1') {
            result(p3);
            skip(3);
            return;
          }
          if (p7 === '1/2-1/2') {
            result(p7);
            skip(7);
            return;
          }
        }
        if (mode === null) {
          mode = TOKEN_MOVE_NUMBER_NOTATION;
        }
    }
    if (mode !== null && skipping < i) {
      buffer.push(char);
    }
    function skip(n) {
      skipping = i + n - 1;
    }
    function peek(n) {
      var str = '';
      for (var j = 0; j < n; j++) {
        str += transcript[$traceurRuntime.toProperty(i + j)];
      }
      return str;
    }
  }));
  return tokens;
  function halfmove() {
    return halfmoveToggle = !halfmoveToggle;
  }
  function result(source) {
    tokens.push({
      mode: TOKEN_RESULT,
      source: source
    });
    mode = null;
    buffer = [];
  }
  function finishToken() {
    if (mode == null) {
      return;
    }
    if (buffer.length > 0) {
      try {
        throw undefined;
      } catch (source) {
        {
          source = buffer.join('');
          tokens.push({
            mode: mode,
            source: source
          });
        }
      }
    }
    mode = null;
    buffer = [];
  }
}

},{"./error":7,"./fen":8,"./game":10,"./util":24}],17:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Piece: {get: function() {
      return Piece;
    }},
  __esModule: {value: true}
});
var $__0 = require('./brands'),
    WHITE = $__0.WHITE,
    BLACK = $__0.BLACK;
var Piece = function Piece() {
  var color = $traceurRuntime.assertObject(arguments[0] !== (void 0) ? arguments[0] : {}).color;
  this.color = color;
  this.mobility = [];
};
($traceurRuntime.createClass)(Piece, {
  moves: $traceurRuntime.initGeneratorFunction(function $__7(position) {
    var loc,
        $__4,
        $__5,
        m,
        $__2,
        $__3,
        move;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            loc = position.pieceCoords(this);
            $ctx.state = 14;
            break;
          case 14:
            $__4 = this.mobility[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 7;
            break;
          case 7:
            $ctx.state = (!($__5 = $__4.next()).done) ? 9 : -2;
            break;
          case 9:
            m = $__5.value;
            $ctx.state = 10;
            break;
          case 10:
            $__2 = m.adjacentPoints(position, loc)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = (!($__3 = $__2.next()).done) ? 5 : 7;
            break;
          case 5:
            move = $__3.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return move;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          default:
            return $ctx.end();
        }
    }, $__7, this);
  }),
  canMove: function(position, from, to) {
    for (var $__2 = this.mobility[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__3; !($__3 = $__2.next()).done; ) {
      var m = $__3.value;
      {
        try {
          throw undefined;
        } catch (success) {
          {
            success = m.test(position, from, to);
            if (success) {
              return true;
            }
          }
        }
      }
    }
    return false;
  },
  canCapture: function(position, from, to) {
    return this.canMove(position, from, to);
  },
  toString: function() {
    return this.constructor.name;
  },
  get isWhite() {
    return this.color === WHITE;
  },
  get isBlack() {
    return this.color === BLACK;
  },
  get brand() {
    return this.constructor.brand;
  }
}, {});

},{"./brands":4}],18:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Point: {get: function() {
      return Point;
    }},
  __esModule: {value: true}
});
var Point = function Point(x, y) {
  this.x = x;
  this.y = y;
};
var $Point = Point;
($traceurRuntime.createClass)(Point, {
  equal: function($__1) {
    var $__2 = $traceurRuntime.assertObject($__1),
        x = $__2.x,
        y = $__2.y;
    return this.x === x && this.y === y;
  },
  sum: function($__1) {
    var $__2 = $traceurRuntime.assertObject($__1),
        x = $__2.x,
        y = $__2.y;
    return new $Point(this.x + x, this.y + y);
  },
  difference: function($__1) {
    var $__2 = $traceurRuntime.assertObject($__1),
        x = $__2.x,
        y = $__2.y;
    return new $Point(this.x - x, this.y - y);
  },
  product: function($__1) {
    var $__2 = $traceurRuntime.assertObject($__1),
        x = $__2.x,
        y = $__2.y;
    return new $Point(this.x * x, this.y * y);
  },
  lt: function($__1) {
    var $__2 = $traceurRuntime.assertObject($__1),
        x = $__2.x,
        y = $__2.y;
    return this.x < x && this.y < y;
  },
  lte: function($__1) {
    var $__2 = $traceurRuntime.assertObject($__1),
        x = $__2.x,
        y = $__2.y;
    return this.x <= x && this.y <= y;
  },
  gt: function($__1) {
    var $__2 = $traceurRuntime.assertObject($__1),
        x = $__2.x,
        y = $__2.y;
    return this.x > x && this.y > y;
  },
  gte: function($__1) {
    var $__2 = $traceurRuntime.assertObject($__1),
        x = $__2.x,
        y = $__2.y;
    return this.x >= x && this.y >= y;
  },
  to: $traceurRuntime.initGeneratorFunction(function $__4(to) {
    var $__1,
        $__2,
        x0,
        x1,
        $__3,
        y0,
        y1,
        i,
        j;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__1 = [[Math.min(this.x, to.x), Math.max(this.x, to.x)], [Math.min(this.y, to.y), Math.max(this.y, to.y)]], $__2 = $traceurRuntime.assertObject($__1[0]), x0 = $__2[0], x1 = $__2[1], $__3 = $traceurRuntime.assertObject($__1[1]), y0 = $__3[0], y1 = $__3[1];
            $ctx.state = 12;
            break;
          case 12:
            i = y0;
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = (i < y1) ? 6 : -2;
            break;
          case 5:
            i++;
            $ctx.state = 10;
            break;
          case 6:
            j = x0;
            $ctx.state = 7;
            break;
          case 7:
            $ctx.state = (j < x1) ? 1 : 5;
            break;
          case 4:
            j++;
            $ctx.state = 7;
            break;
          case 1:
            $ctx.state = 2;
            return new $Point(j, i);
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          default:
            return $ctx.end();
        }
    }, $__4, this);
  })
}, {});

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Position: {get: function() {
      return Position;
    }},
  __esModule: {value: true}
});
var $__0 = require('./brands'),
    WHITE = $__0.WHITE,
    BLACK = $__0.BLACK,
    KING = $__0.KING,
    PAWN = $__0.PAWN,
    LIGHT = $__0.LIGHT,
    DARK = $__0.DARK;
var Board = require('./board').Board;
var Mobility = require('./mobility').Mobility;
var Castling = require('./castling').Castling;
var EnPassantTarget = require('./eptarget').EnPassantTarget;
var Point = require('./point').Point;
var Promotion = require('./promotion').Promotion;
var Algebraic = require('./algebraic').Algebraic;
var HalfmoveClock = require('./halfmoveclock').HalfmoveClock;
var $__9 = require('./util'),
    entries = $__9.entries,
    identity = $__9.identity,
    squareName = $__9.squareName,
    squareCoords = $__9.squareCoords,
    oppositeColor = $__9.oppositeColor,
    bounded = $__9.bounded;
var $__10 = require('./error'),
    ChessError = $__10.ChessError,
    MobilityError = $__10.MobilityError,
    CheckError = $__10.CheckError,
    PromotionError = $__10.PromotionError;
var assign = require('lodash.assign');
var Position = function Position() {
  var $__18,
      $__19,
      $__20,
      $__21,
      $__22,
      $__23,
      $__24,
      $__25;
  var $__17 = $traceurRuntime.assertObject(arguments[0] !== (void 0) ? arguments[0] : {}),
      ranks = ($__18 = $__17.ranks) === void 0 ? 8 : $__18,
      files = ($__19 = $__17.files) === void 0 ? 8 : $__19,
      activeColor = ($__20 = $__17.activeColor) === void 0 ? WHITE : $__20,
      castling = ($__21 = $__17.castling) === void 0 ? null : $__21,
      enPassantTarget = ($__22 = $__17.enPassantTarget) === void 0 ? null : $__22,
      halfmoveClock = ($__23 = $__17.halfmoveClock) === void 0 ? null : $__23,
      fullmoveCounter = ($__24 = $__17.fullmoveCounter) === void 0 ? 0 : $__24,
      board = ($__25 = $__17.board) === void 0 ? new Board(ranks, files) : $__25;
  this.board = board;
  this.activeColor = activeColor;
  this.castling = castling;
  this.enPassantTarget = enPassantTarget;
  this.halfmoveClock = halfmoveClock;
  this.fullmoveCounter = fullmoveCounter;
  this.promotionSquare = Promotion.square(this);
};
var $Position = Position;
($traceurRuntime.createClass)(Position, {
  beget: function(overrides) {
    return new $Position(assign({}, this, overrides));
  },
  get files() {
    return this.board.files;
  },
  get ranks() {
    return this.board.ranks;
  },
  material: function(brand) {
    return this.board.getPieces(brand);
  },
  pieceBySquare: function(squareName) {
    return this.pieceByCoords(squareCoords(squareName));
  },
  pieceCoords: function(piece) {
    return this.board.getPieceCoords(piece);
  },
  pieceByCoords: function(point) {
    var rotated = arguments[1] !== (void 0) ? arguments[1] : false;
    return this.board.getPieceByCoords(point, rotated);
  },
  pieces: $traceurRuntime.initGeneratorFunction(function $__26() {
    var selector,
        $__15,
        $__16,
        piece,
        $__13,
        $__14,
        $__18,
        val,
        key;
    var $arguments = arguments;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            selector = $arguments[0] !== (void 0) ? $arguments[0] : {};
            $ctx.state = 20;
            break;
          case 20:
            $__15 = this.material(selector.brand)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 2;
            break;
          case 2:
            $ctx.state = (!($__16 = $__15.next()).done) ? 15 : -2;
            break;
          case 15:
            piece = $__16.value;
            $ctx.state = 16;
            break;
          case 16:
            $__13 = entries(selector)[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 5;
            break;
          case 5:
            $ctx.state = (!($__14 = $__13.next()).done) ? 7 : 9;
            break;
          case 7:
            $__18 = $traceurRuntime.assertObject($__14.value), val = $__18[0], key = $__18[1];
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = (piece[$traceurRuntime.toProperty(key)] !== val) ? 2 : 5;
            break;
          case 9:
            $ctx.state = 12;
            return piece;
          case 12:
            $ctx.maybeThrow();
            $ctx.state = 2;
            break;
          default:
            return $ctx.end();
        }
    }, $__26, this);
  }),
  piece: function(selector) {
    for (var $__13 = this.pieces(selector)[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__14; !($__14 = $__13.next()).done; ) {
      var i = $__14.value;
      {
        return i;
      }
    }
    return null;
  },
  all: function(selector) {
    return $traceurRuntime.spread(this.pieces(selector));
  },
  checks: $traceurRuntime.initGeneratorFunction(function $__27() {
    var color,
        loc,
        $__13,
        $__14,
        enemy;
    var $arguments = arguments;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            color = $arguments[0] !== (void 0) ? $arguments[0] : this.activeColor;
            loc = $arguments[1] !== (void 0) ? $arguments[1] : this.pieceCoords(this.piece({
              brand: KING,
              color: color
            }));
            $ctx.state = 11;
            break;
          case 11:
            $__13 = this.pieces({color: oppositeColor(color)})[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = (!($__14 = $__13.next()).done) ? 6 : -2;
            break;
          case 6:
            enemy = $__14.value;
            $ctx.state = 7;
            break;
          case 7:
            $ctx.state = (enemy.canCapture(this, this.pieceCoords(enemy), loc)) ? 1 : 4;
            break;
          case 1:
            $ctx.state = 2;
            return enemy;
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          default:
            return $ctx.end();
        }
    }, $__27, this);
  }),
  moves: $traceurRuntime.initGeneratorFunction(function $__28() {
    var color,
        $__15,
        $__16,
        piece,
        $__13,
        $__14,
        move;
    var $arguments = arguments;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            color = $arguments[0] !== (void 0) ? $arguments[0] : this.activeColor;
            $ctx.state = 14;
            break;
          case 14:
            $__15 = this.pieces({color: color})[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 7;
            break;
          case 7:
            $ctx.state = (!($__16 = $__15.next()).done) ? 9 : -2;
            break;
          case 9:
            piece = $__16.value;
            $ctx.state = 10;
            break;
          case 10:
            $__13 = bounded(this.board, piece.moves(this))[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = (!($__14 = $__13.next()).done) ? 5 : 7;
            break;
          case 5:
            move = $__14.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return {
              piece: piece,
              move: move
            };
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          default:
            return $ctx.end();
        }
    }, $__28, this);
  }),
  isCheck: function(color, loc) {
    for (var $__13 = this.checks(color, loc)[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__14; !($__14 = $__13.next()).done; ) {
      var _ = $__14.value;
      {
        return true;
      }
    }
    return false;
  },
  isCheckmate: function() {
    var color = this.activeColor;
    if (!this.isCheck(color)) {
      return false;
    }
    for (var $__13 = this.moves()[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__14; !($__14 = $__13.next()).done; ) {
      try {
        throw undefined;
      } catch (move) {
        try {
          throw undefined;
        } catch (piece) {
          try {
            throw undefined;
          } catch ($__18) {
            {
              {
                $__18 = $traceurRuntime.assertObject($__14.value);
                piece = $__18.piece;
                move = $__18.move;
              }
              {
                try {
                  if (!this.movePiece(piece, move).isCheck(color)) {
                    return false;
                  }
                } catch (err) {
                  if (err instanceof ChessError) {
                    continue;
                  }
                  throw err;
                }
              }
            }
          }
        }
      }
    }
    return true;
  },
  is50MoveDraw: function() {
    return this.halfmoveClock.count >= 50 * 2;
  },
  isCheckmatePossible: function() {
    var pieces = this.all();
    var kings = pieces.filter((function(piece) {
      return piece.brand === KING;
    }));
    var nonKings = pieces.filter((function(piece) {
      return piece.brand !== KING;
    }));
    if ((kings.length !== 2) || (pieces.length === 2) || (pieces.length === 3 && nonKings[0].brand === KNIGHT) || (nonKings.every((function($__18) {
      var brand = $traceurRuntime.assertObject($__18).brand;
      return brand === BISHOP;
    })) && (nonKings.every((function(piece) {
      return squareColor(position.pieceCoords(piece)) === LIGHT;
    })) || nonKings.every((function(piece) {
      return squareColor(position.pieceCoords(piece)) === DARK;
    }))))) {
      return false;
    }
    return true;
  },
  tryMovePiece: function(piece, target) {
    try {
      return this.movePiece(piece, target);
    } catch (err) {
      if (err instanceof ChessError) {
        return this;
      }
      throw err;
    }
  },
  movePiece: function(piece, target) {
    if (target == null || piece == null) {
      throw new Error("Argument error");
    }
    var $__18 = $traceurRuntime.assertObject(EnPassantTarget.capturablePiece(this, piece, target)),
        capturePiece = $__18.capturePiece,
        captureTarget = $__18.captureTarget,
        isEnPassant = $__18.isEnPassant;
    if (!Mobility.isLegal({
      position: this,
      piece: piece,
      target: target,
      capturePiece: capturePiece
    })) {
      throw new MobilityError();
    }
    var castling = Castling.analyze(this, piece, target);
    var position = this.beget({
      activeColor: oppositeColor(this.activeColor),
      castling: castling,
      enPassantTarget: EnPassantTarget.analyze(this, piece, target),
      halfmoveClock: HalfmoveClock.analyze(this, piece, target),
      fullmoveCounter: (this.activeColor === BLACK ? this.fullmoveCounter + 1 : this.fullmoveCounter),
      board: this.board.map((function(p, square) {
        if ((p === piece) || (isEnPassant && square.equal(captureTarget)) || (p && p === castling.rook)) {
          return null;
        }
        if (castling.square && square.equal(castling.square)) {
          return castling.rook;
        }
        if (square.equal(target)) {
          return piece;
        }
        return p;
      }))
    });
    if (position.isCheck(this.activeColor)) {
      throw new CheckError();
    }
    return position;
  },
  promote: function(prize) {
    var $__11 = this;
    if (this.promotionSquare == null) {
      throw new PromotionError();
    }
    return this.beget({
      board: this.board.map((function(p, square) {
        return square.equal($__11.promotionSquare) ? prize : p;
      })),
      promotionSquare: null
    });
  },
  move: function(notation) {
    var $__18 = $traceurRuntime.assertObject(Algebraic.parse(notation, this)),
        piece = $__18.piece,
        target = $__18.target,
        promotionPrize = $__18.promotionPrize;
    var position = this.movePiece(piece, target);
    if (promotionPrize != null) {
      return position.promote(promotionPrize);
    }
    return position;
  }
}, {});

},{"./algebraic":2,"./board":3,"./brands":4,"./castling":5,"./eptarget":6,"./error":7,"./halfmoveclock":11,"./mobility":14,"./point":18,"./promotion":20,"./util":24,"lodash.assign":51}],20:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Promotion: {get: function() {
      return Promotion;
    }},
  __esModule: {value: true}
});
var $__0 = require('./brands'),
    WHITE = $__0.WHITE,
    BLACK = $__0.BLACK,
    PAWN = $__0.PAWN;
var oppositeColor = require('./util').oppositeColor;
var Promotion = {
  square: function(position) {
    var color = oppositeColor(position.activeColor);
    for (var $__2 = position.pieces({
      brand: PAWN,
      color: color
    })[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__3; !($__3 = $__2.next()).done; ) {
      var pawn = $__3.value;
      {
        try {
          throw undefined;
        } catch (square) {
          {
            square = position.pieceCoords(pawn);
            if (square.y === Promotion.rank(color)) {
              return square;
            }
          }
        }
      }
    }
    return null;
  },
  rank: function(color) {
    switch (color) {
      case WHITE:
        return 0;
      case BLACK:
        return 7;
    }
  }
};

},{"./brands":4,"./util":24}],21:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Rider: {get: function() {
      return Rider;
    }},
  __esModule: {value: true}
});
var Point = require('./point').Point;
var $__1 = require('./mobility'),
    Mobility = $__1.Mobility,
    quadrants = $__1.quadrants;
var RiderMobility = function RiderMobility() {
  $traceurRuntime.defaultSuperCall(this, $RiderMobility.prototype, arguments);
};
var $RiderMobility = RiderMobility;
($traceurRuntime.createClass)(RiderMobility, {adjacentPoints: $traceurRuntime.initGeneratorFunction(function $__8(position, p0) {
    var $__7,
        m,
        n,
        $__5,
        $__6,
        o,
        $__3,
        $__4,
        p1,
        r,
        pN;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__7 = this, m = $__7.m, n = $__7.n;
            $ctx.state = 34;
            break;
          case 34:
            $__5 = [new Point(m, n), new Point(n, m)][$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 3;
            break;
          case 3:
            $ctx.state = (!($__6 = $__5.next()).done) ? 29 : -2;
            break;
          case 29:
            o = $__6.value;
            $ctx.state = 30;
            break;
          case 30:
            $__3 = quadrants[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 2;
            break;
          case 2:
            $ctx.state = (!($__4 = $__3.next()).done) ? 25 : 3;
            break;
          case 25:
            p1 = $__4.value;
            $ctx.state = 26;
            break;
          case 26:
            r = 1;
            $ctx.state = 24;
            break;
          case 24:
            $ctx.state = (r < 8) ? 15 : 2;
            break;
          case 20:
            r++;
            $ctx.state = 24;
            break;
          case 15:
            $ctx.pushTry(13, null);
            $ctx.state = 16;
            break;
          case 16:
            throw undefined;
            $ctx.state = 18;
            break;
          case 18:
            $ctx.popTry();
            $ctx.state = 20;
            break;
          case 13:
            $ctx.popTry();
            pN = $ctx.storedException;
            $ctx.state = 11;
            break;
          case 11:
            pN = p0.sum(p1.product(o.product(new Point(r, r))));
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 5;
            return pN;
          case 5:
            $ctx.maybeThrow();
            $ctx.state = 7;
            break;
          case 7:
            $ctx.state = (position.pieceByCoords(pN) != null) ? 2 : 20;
            break;
          default:
            return $ctx.end();
        }
    }, $__8, this);
  })}, {}, Mobility);
function Rider(m, n) {
  this.mobility.push(new RiderMobility(m, n));
}

},{"./mobility":14,"./point":18}],22:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Royal: {get: function() {
      return Royal;
    }},
  __esModule: {value: true}
});
var $__0 = require('./brands'),
    KINGSIDE = $__0.KINGSIDE,
    QUEENSIDE = $__0.QUEENSIDE;
var Point = require('./point').Point;
var $__2 = require('./mobility'),
    Mobility = $__2.Mobility,
    quadrants = $__2.quadrants;
var Castling = require('./castling').Castling;
var RoyalMobility = function RoyalMobility() {
  $traceurRuntime.defaultSuperCall(this, $RoyalMobility.prototype, arguments);
};
var $RoyalMobility = RoyalMobility;
($traceurRuntime.createClass)(RoyalMobility, {adjacentPoints: $traceurRuntime.initGeneratorFunction(function $__10(position, p0) {
    var $__9,
        m,
        n,
        $__7,
        $__8,
        o,
        $__5,
        $__6,
        p1;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__9 = this, m = $__9.m, n = $__9.n;
            $ctx.state = 14;
            break;
          case 14:
            $__7 = [new Point(m, n), new Point(n, m)][$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 7;
            break;
          case 7:
            $ctx.state = (!($__8 = $__7.next()).done) ? 9 : -2;
            break;
          case 9:
            o = $__8.value;
            $ctx.state = 10;
            break;
          case 10:
            $__5 = quadrants[$traceurRuntime.toProperty(Symbol.iterator)]();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = (!($__6 = $__5.next()).done) ? 5 : 7;
            break;
          case 5:
            p1 = $__6.value;
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return p0.sum(p1.product(o));
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          default:
            return $ctx.end();
        }
    }, $__10, this);
  })}, {}, Mobility);
var CastlingMobility = function CastlingMobility(color, side) {
  this.color = color;
  this.side = side;
};
($traceurRuntime.createClass)(CastlingMobility, {adjacentPoints: $traceurRuntime.initGeneratorFunction(function $__11(position, p0) {
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = (position.castling.isLegal(this.color, this.side)) ? 1 : -2;
            break;
          case 1:
            $ctx.state = 2;
            return p0.sum(Castling.kingOffset(this.color, this.side));
          case 2:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__11, this);
  })}, {}, Mobility);
function Royal() {
  this.mobility.push(new RoyalMobility(1, 0));
  this.mobility.push(new RoyalMobility(1, 1));
  this.mobility.push(new CastlingMobility(this.color, KINGSIDE));
  this.mobility.push(new CastlingMobility(this.color, QUEENSIDE));
}

},{"./brands":4,"./castling":5,"./mobility":14,"./point":18}],23:[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  Pawn: {get: function() {
      return $__pawn__.Pawn;
    }},
  King: {get: function() {
      return King;
    }},
  Queen: {get: function() {
      return Queen;
    }},
  Rook: {get: function() {
      return Rook;
    }},
  Bishop: {get: function() {
      return Bishop;
    }},
  Knight: {get: function() {
      return Knight;
    }},
  __esModule: {value: true}
});
var $__0 = require('./brands'),
    KING = $__0.KING,
    QUEEN = $__0.QUEEN,
    KNIGHT = $__0.KNIGHT,
    BISHOP = $__0.BISHOP,
    ROOK = $__0.ROOK;
var Piece = require('./piece').Piece;
var Leaper = require('./leaper').Leaper;
var Rider = require('./rider').Rider;
var Royal = require('./royal').Royal;
var $__pawn__ = require('./pawn');
var King = function King(options) {
  $traceurRuntime.superCall(this, $King.prototype, "constructor", [options]);
  Royal.call(this);
};
var $King = King;
($traceurRuntime.createClass)(King, {
  canCapture: function(position, from, to) {
    for (var $__6 = [this.mobility[0], this.mobility[1]][$traceurRuntime.toProperty(Symbol.iterator)](),
        $__7; !($__7 = $__6.next()).done; ) {
      var m = $__7.value;
      {
        try {
          throw undefined;
        } catch (success) {
          {
            success = m.test(position, from, to);
            if (success) {
              return true;
            }
          }
        }
      }
    }
    return false;
  },
  get fenEncoding() {
    return this.isWhite ? 'K' : 'k';
  }
}, {get brand() {
    return KING;
  }}, Piece);
var Queen = function Queen(options) {
  $traceurRuntime.superCall(this, $Queen.prototype, "constructor", [options]);
  Rider.call(this, 1, 0);
  Rider.call(this, 1, 1);
};
var $Queen = Queen;
($traceurRuntime.createClass)(Queen, {get fenEncoding() {
    return this.isWhite ? 'Q' : 'q';
  }}, {get brand() {
    return QUEEN;
  }}, Piece);
var Rook = function Rook(options) {
  $traceurRuntime.superCall(this, $Rook.prototype, "constructor", [options]);
  Rider.call(this, 1, 0);
};
var $Rook = Rook;
($traceurRuntime.createClass)(Rook, {get fenEncoding() {
    return this.isWhite ? 'R' : 'r';
  }}, {get brand() {
    return ROOK;
  }}, Piece);
var Bishop = function Bishop(options) {
  $traceurRuntime.superCall(this, $Bishop.prototype, "constructor", [options]);
  Rider.call(this, 1, 1);
};
var $Bishop = Bishop;
($traceurRuntime.createClass)(Bishop, {get fenEncoding() {
    return this.isWhite ? 'B' : 'b';
  }}, {get brand() {
    return BISHOP;
  }}, Piece);
var Knight = function Knight(options) {
  $traceurRuntime.superCall(this, $Knight.prototype, "constructor", [options]);
  Leaper.call(this, 1, 2);
};
var $Knight = Knight;
($traceurRuntime.createClass)(Knight, {get fenEncoding() {
    return this.isWhite ? 'N' : 'n';
  }}, {get brand() {
    return KNIGHT;
  }}, Piece);

},{"./brands":4,"./leaper":12,"./pawn":15,"./piece":17,"./rider":21,"./royal":22}],24:[function(require,module,exports){
"use strict";
var $__6 = $traceurRuntime.initGeneratorFunction(entries),
    $__11 = $traceurRuntime.initGeneratorFunction(bounded);
Object.defineProperties(exports, {
  entries: {get: function() {
      return entries;
    }},
  bounded: {get: function() {
      return bounded;
    }},
  identity: {get: function() {
      return identity;
    }},
  squareName: {get: function() {
      return squareName;
    }},
  fileName: {get: function() {
      return fileName;
    }},
  rankName: {get: function() {
      return rankName;
    }},
  fileIndex: {get: function() {
      return fileIndex;
    }},
  rankIndex: {get: function() {
      return rankIndex;
    }},
  squareCoords: {get: function() {
      return squareCoords;
    }},
  squareCoordsByName: {get: function() {
      return squareCoordsByName;
    }},
  oppositeColor: {get: function() {
      return oppositeColor;
    }},
  squareColor: {get: function() {
      return squareColor;
    }},
  isEven: {get: function() {
      return isEven;
    }},
  isOdd: {get: function() {
      return isOdd;
    }},
  partition: {get: function() {
      return partition;
    }},
  last: {get: function() {
      return last;
    }},
  __esModule: {value: true}
});
var $__0 = require('./brands'),
    WHITE = $__0.WHITE,
    BLACK = $__0.BLACK,
    LIGHT = $__0.LIGHT,
    DARK = $__0.DARK;
var Point = require('./point').Point;
var isNumber = require('lodash.isnumber');
function entries(collection) {
  var $__7,
      $__8,
      $__9,
      $__10,
      k;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $__7 = [];
          $__8 = collection;
          for ($__9 in $__8)
            $__7.push($__9);
          $ctx.state = 14;
          break;
        case 14:
          $__10 = 0;
          $ctx.state = 12;
          break;
        case 12:
          $ctx.state = ($__10 < $__7.length) ? 8 : -2;
          break;
        case 4:
          $__10++;
          $ctx.state = 12;
          break;
        case 8:
          k = $__7[$traceurRuntime.toProperty($__10)];
          $ctx.state = 9;
          break;
        case 9:
          $ctx.state = (!($traceurRuntime.toProperty(k) in $__8)) ? 4 : 6;
          break;
        case 6:
          $ctx.state = 2;
          return [collection[$traceurRuntime.toProperty(k)], k];
        case 2:
          $ctx.maybeThrow();
          $ctx.state = 4;
          break;
        default:
          return $ctx.end();
      }
  }, $__6, this);
}
function bounded($__4, iterator) {
  var $__5,
      files,
      ranks,
      $__2,
      $__3,
      pt;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $__5 = $traceurRuntime.assertObject($__4), files = $__5.files, ranks = $__5.ranks;
          $ctx.state = 11;
          break;
        case 11:
          $__2 = iterator[$traceurRuntime.toProperty(Symbol.iterator)]();
          $ctx.state = 4;
          break;
        case 4:
          $ctx.state = (!($__3 = $__2.next()).done) ? 6 : -2;
          break;
        case 6:
          pt = $__3.value;
          $ctx.state = 7;
          break;
        case 7:
          $ctx.state = (new Point(0, 0).lte(pt) && new Point(files, ranks).gt(pt)) ? 1 : 4;
          break;
        case 1:
          $ctx.state = 2;
          return pt;
        case 2:
          $ctx.maybeThrow();
          $ctx.state = 4;
          break;
        default:
          return $ctx.end();
      }
  }, $__11, this);
}
var identity = (function(it) {
  return it;
});
var squareName = (function($__4) {
  var $__5 = $traceurRuntime.assertObject($__4),
      file = $__5.x,
      rank = $__5.y;
  return ("" + fileName(file) + rankName(rank));
});
var fileName = (function(file) {
  return 'abcdefgh'.charAt(file);
});
var rankName = (function(rank) {
  var top = arguments[1] !== (void 0) ? arguments[1] : 8;
  return String(top - rank);
});
var fileIndex = (function(fileName) {
  return 'abcdefgh'.indexOf(fileName);
});
var rankIndex = (function(rankName) {
  var top = arguments[1] !== (void 0) ? arguments[1] : 8;
  return top - Number(rankName);
});
var squareCoords = (function(squareName) {
  var $__4 = $traceurRuntime.assertObject(squareName.split('')),
      fileName = $__4[0],
      rankName = $__4[1];
  return squareCoordsByName(fileName, rankName);
});
var squareCoordsByName = (function(fileName, rankName) {
  return new Point(fileIndex(fileName), rankIndex(rankName));
});
var oppositeColor = (function(color) {
  return color === WHITE ? BLACK : WHITE;
});
var squareColor = (function($__4) {
  var $__5 = $traceurRuntime.assertObject($__4),
      x = $__5.x,
      y = $__5.y;
  return (isEven(x) && isEven(y) || isOdd(x) && isOdd(y)) ? LIGHT : DARK;
});
var isEven = (function(n) {
  return isNumber(n) && n % 2 === 0;
});
var isOdd = (function(n) {
  return !isEven(n);
});
var partition = (function(list, fn) {
  var result = [[], []];
  for (var $__2 = list[$traceurRuntime.toProperty(Symbol.iterator)](),
      $__3; !($__3 = $__2.next()).done; ) {
    var item = $__3.value;
    {
      result[$traceurRuntime.toProperty(+!fn(item))].push(item);
    }
  }
  return result;
});
var last = (function(arr) {
  return arr[$traceurRuntime.toProperty(arr.length - 1)];
});

},{"./brands":4,"./point":18,"lodash.isnumber":57}],25:[function(require,module,exports){

function stringSupplant (string, obj) {
    return String.prototype.replace.call(string, /{([^{}]*)}/g, function (a, b) {
        var r = obj[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
}

var Dice = function(phrase, stats) {
    this.phrase = phrase;
    this.dice = [];
    this.named_dice = [];
    this.parse(stats);
};

(function () {
    this.parse = function (stats) {
        var dice = this.phrase;
        if (typeof stats !== 'undefined') {
            dice = stringSupplant(dice, stats);
        }
        var dice = dice.replace(/- */,'+ -');
        var dice = dice.replace(/D/,'d');
        var re = / *\+ */;
        var items = dice.split(re);
        for ( var i=0; i<items.length; i++) {
            var match = items[i].match(/^[ \t]*(-)?(\d+)?(?:(d)(\d+))?[ \t]*$/);
            if (match) {
                var sign = match[1]?-1:1;
                var num = parseInt(match[2] || "1");
                var max = parseInt(match[4] || "0");
                if (match[3]) {
                    this.dice.push([sign, num, max]);
                    this.named_dice.push(sign * num + 'd' + max);
                } else {
                    this.dice.push([sign, num]);
                    this.named_dice.push(sign * num);
                }
            } else {
                return null;
            }
        }
    };

    this.roll = function() {
        var total = 0;
        var results = [];
        var die;
        var j, d;
        for (var didx in this.dice) {
            die = this.dice[didx];
            if (die.length === 3) {
                for (j=1; j<=die[1]; j++) {
                    d = die[0] * Math.ceil(die[2]*Math.random());
                    results.push(d);
                    total += d;
                }
            } else {
                d = die[0] * die[1];
                results.push(d);
                total += d;
            }
        };
        return {results: results, total: total};
    };

}).call(Dice.prototype);

module.exports = Dice;


},{}],26:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to pool arrays and objects used internally */
var arrayPool = [];

module.exports = arrayPool;

},{}],27:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = require('lodash._basecreate'),
    isObject = require('lodash.isobject'),
    setBindData = require('lodash._setbinddata'),
    slice = require('lodash._slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `_.bind` that creates the bound function and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new bound function.
 */
function baseBind(bindData) {
  var func = bindData[0],
      partialArgs = bindData[2],
      thisArg = bindData[4];

  function bound() {
    // `Function#bind` spec
    // http://es5.github.io/#x15.3.4.5
    if (partialArgs) {
      // avoid `arguments` object deoptimizations by using `slice` instead
      // of `Array.prototype.slice.call` and not assigning `arguments` to a
      // variable as a ternary expression
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    // mimic the constructor's `return` behavior
    // http://es5.github.io/#x13.2.2
    if (this instanceof bound) {
      // ensure `new bound` is an instance of `func`
      var thisBinding = baseCreate(func.prototype),
          result = func.apply(thisBinding, args || arguments);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisArg, args || arguments);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseBind;

},{"lodash._basecreate":28,"lodash._setbinddata":48,"lodash._slice":50,"lodash.isobject":58}],28:[function(require,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('lodash._isnative'),
    isObject = require('lodash.isobject'),
    noop = require('lodash.noop');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(prototype, properties) {
  return isObject(prototype) ? nativeCreate(prototype) : {};
}
// fallback for browsers without `Object.create`
if (!nativeCreate) {
  baseCreate = (function() {
    function Object() {}
    return function(prototype) {
      if (isObject(prototype)) {
        Object.prototype = prototype;
        var result = new Object;
        Object.prototype = null;
      }
      return result || global.Object();
    };
  }());
}

module.exports = baseCreate;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash._isnative":40,"lodash.isobject":58,"lodash.noop":60}],29:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var bind = require('lodash.bind'),
    identity = require('lodash.identity'),
    setBindData = require('lodash._setbinddata'),
    support = require('lodash.support');

/** Used to detected named functions */
var reFuncName = /^\s*function[ \n\r\t]+\w/;

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/** Native method shortcuts */
var fnToString = Function.prototype.toString;

/**
 * The base implementation of `_.createCallback` without support for creating
 * "_.pluck" or "_.where" style callbacks.
 *
 * @private
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 */
function baseCreateCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  // exit early for no `thisArg` or already bound by `Function#bind`
  if (typeof thisArg == 'undefined' || !('prototype' in func)) {
    return func;
  }
  var bindData = func.__bindData__;
  if (typeof bindData == 'undefined') {
    if (support.funcNames) {
      bindData = !func.name;
    }
    bindData = bindData || !support.funcDecomp;
    if (!bindData) {
      var source = fnToString.call(func);
      if (!support.funcNames) {
        bindData = !reFuncName.test(source);
      }
      if (!bindData) {
        // checks if `func` references the `this` keyword and stores the result
        bindData = reThis.test(source);
        setBindData(func, bindData);
      }
    }
  }
  // exit early if there are no `this` references or `func` is bound
  if (bindData === false || (bindData !== true && bindData[1] & 1)) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 2: return function(a, b) {
      return func.call(thisArg, a, b);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
  }
  return bind(func, thisArg);
}

module.exports = baseCreateCallback;

},{"lodash._setbinddata":48,"lodash.bind":52,"lodash.identity":55,"lodash.support":62}],30:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = require('lodash._basecreate'),
    isObject = require('lodash.isobject'),
    setBindData = require('lodash._setbinddata'),
    slice = require('lodash._slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `createWrapper` that creates the wrapper and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new function.
 */
function baseCreateWrapper(bindData) {
  var func = bindData[0],
      bitmask = bindData[1],
      partialArgs = bindData[2],
      partialRightArgs = bindData[3],
      thisArg = bindData[4],
      arity = bindData[5];

  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      key = func;

  function bound() {
    var thisBinding = isBind ? thisArg : this;
    if (partialArgs) {
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    if (partialRightArgs || isCurry) {
      args || (args = slice(arguments));
      if (partialRightArgs) {
        push.apply(args, partialRightArgs);
      }
      if (isCurry && args.length < arity) {
        bitmask |= 16 & ~32;
        return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
      }
    }
    args || (args = arguments);
    if (isBindKey) {
      func = thisBinding[key];
    }
    if (this instanceof bound) {
      thisBinding = baseCreate(func.prototype);
      var result = func.apply(thisBinding, args);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisBinding, args);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseCreateWrapper;

},{"lodash._basecreate":28,"lodash._setbinddata":48,"lodash._slice":50,"lodash.isobject":58}],31:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * The base implementation of `_.indexOf` without support for binary searches
 * or `fromIndex` constraints.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the matched value or `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  var index = (fromIndex || 0) - 1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{}],32:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var forIn = require('lodash.forin'),
    getArray = require('lodash._getarray'),
    isFunction = require('lodash.isfunction'),
    objectTypes = require('lodash._objecttypes'),
    releaseArray = require('lodash._releasearray');

/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.isEqual`, without support for `thisArg` binding,
 * that allows partial "_.where" style comparisons.
 *
 * @private
 * @param {*} a The value to compare.
 * @param {*} b The other value to compare.
 * @param {Function} [callback] The function to customize comparing values.
 * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `a` objects.
 * @param {Array} [stackB=[]] Tracks traversed `b` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
  // used to indicate that when comparing objects, `a` has at least the properties of `b`
  if (callback) {
    var result = callback(a, b);
    if (typeof result != 'undefined') {
      return !!result;
    }
  }
  // exit early for identical values
  if (a === b) {
    // treat `+0` vs. `-0` as not equal
    return a !== 0 || (1 / a == 1 / b);
  }
  var type = typeof a,
      otherType = typeof b;

  // exit early for unlike primitive values
  if (a === a &&
      !(a && objectTypes[type]) &&
      !(b && objectTypes[otherType])) {
    return false;
  }
  // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
  // http://es5.github.io/#x15.3.4.4
  if (a == null || b == null) {
    return a === b;
  }
  // compare [[Class]] names
  var className = toString.call(a),
      otherClass = toString.call(b);

  if (className == argsClass) {
    className = objectClass;
  }
  if (otherClass == argsClass) {
    otherClass = objectClass;
  }
  if (className != otherClass) {
    return false;
  }
  switch (className) {
    case boolClass:
    case dateClass:
      // coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
      return +a == +b;

    case numberClass:
      // treat `NaN` vs. `NaN` as equal
      return (a != +a)
        ? b != +b
        // but treat `+0` vs. `-0` as not equal
        : (a == 0 ? (1 / a == 1 / b) : a == +b);

    case regexpClass:
    case stringClass:
      // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
      // treat string primitives and their corresponding object instances as equal
      return a == String(b);
  }
  var isArr = className == arrayClass;
  if (!isArr) {
    // unwrap any `lodash` wrapped values
    var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
        bWrapped = hasOwnProperty.call(b, '__wrapped__');

    if (aWrapped || bWrapped) {
      return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
    }
    // exit for functions and DOM nodes
    if (className != objectClass) {
      return false;
    }
    // in older versions of Opera, `arguments` objects have `Array` constructors
    var ctorA = a.constructor,
        ctorB = b.constructor;

    // non `Object` object instances with different constructors are not equal
    if (ctorA != ctorB &&
          !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
          ('constructor' in a && 'constructor' in b)
        ) {
      return false;
    }
  }
  // assume cyclic structures are equal
  // the algorithm for detecting cyclic structures is adapted from ES 5.1
  // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
  var initedStack = !stackA;
  stackA || (stackA = getArray());
  stackB || (stackB = getArray());

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == a) {
      return stackB[length] == b;
    }
  }
  var size = 0;
  result = true;

  // add `a` and `b` to the stack of traversed objects
  stackA.push(a);
  stackB.push(b);

  // recursively compare objects and arrays (susceptible to call stack limits)
  if (isArr) {
    // compare lengths to determine if a deep comparison is necessary
    length = a.length;
    size = b.length;
    result = size == length;

    if (result || isWhere) {
      // deep compare the contents, ignoring non-numeric properties
      while (size--) {
        var index = length,
            value = b[size];

        if (isWhere) {
          while (index--) {
            if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
          break;
        }
      }
    }
  }
  else {
    // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
    // which, in this case, is more costly
    forIn(b, function(value, key, b) {
      if (hasOwnProperty.call(b, key)) {
        // count the number of properties.
        size++;
        // deep compare each property value.
        return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
      }
    });

    if (result && !isWhere) {
      // ensure both objects have the same number of properties
      forIn(a, function(value, key, a) {
        if (hasOwnProperty.call(a, key)) {
          // `size` will be `-1` if `a` has more properties than `b`
          return (result = --size > -1);
        }
      });
    }
  }
  stackA.pop();
  stackB.pop();

  if (initedStack) {
    releaseArray(stackA);
    releaseArray(stackB);
  }
  return result;
}

module.exports = baseIsEqual;

},{"lodash._getarray":38,"lodash._objecttypes":45,"lodash._releasearray":46,"lodash.forin":54,"lodash.isfunction":56}],33:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = require('lodash._baseindexof'),
    cacheIndexOf = require('lodash._cacheindexof'),
    createCache = require('lodash._createcache'),
    getArray = require('lodash._getarray'),
    largeArraySize = require('lodash._largearraysize'),
    releaseArray = require('lodash._releasearray'),
    releaseObject = require('lodash._releaseobject');

/**
 * The base implementation of `_.uniq` without support for callback shorthands
 * or `thisArg` binding.
 *
 * @private
 * @param {Array} array The array to process.
 * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
 * @param {Function} [callback] The function called per iteration.
 * @returns {Array} Returns a duplicate-value-free array.
 */
function baseUniq(array, isSorted, callback) {
  var index = -1,
      indexOf = baseIndexOf,
      length = array ? array.length : 0,
      result = [];

  var isLarge = !isSorted && length >= largeArraySize,
      seen = (callback || isLarge) ? getArray() : result;

  if (isLarge) {
    var cache = createCache(seen);
    indexOf = cacheIndexOf;
    seen = cache;
  }
  while (++index < length) {
    var value = array[index],
        computed = callback ? callback(value, index, array) : value;

    if (isSorted
          ? !index || seen[seen.length - 1] !== computed
          : indexOf(seen, computed) < 0
        ) {
      if (callback || isLarge) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  if (isLarge) {
    releaseArray(seen.array);
    releaseObject(seen);
  } else if (callback) {
    releaseArray(seen);
  }
  return result;
}

module.exports = baseUniq;

},{"lodash._baseindexof":31,"lodash._cacheindexof":34,"lodash._createcache":36,"lodash._getarray":38,"lodash._largearraysize":42,"lodash._releasearray":46,"lodash._releaseobject":47}],34:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = require('lodash._baseindexof'),
    keyPrefix = require('lodash._keyprefix');

/**
 * An implementation of `_.contains` for cache objects that mimics the return
 * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
 *
 * @private
 * @param {Object} cache The cache object to inspect.
 * @param {*} value The value to search for.
 * @returns {number} Returns `0` if `value` is found, else `-1`.
 */
function cacheIndexOf(cache, value) {
  var type = typeof value;
  cache = cache.cache;

  if (type == 'boolean' || value == null) {
    return cache[value] ? 0 : -1;
  }
  if (type != 'number' && type != 'string') {
    type = 'object';
  }
  var key = type == 'number' ? value : keyPrefix + value;
  cache = (cache = cache[type]) && cache[key];

  return type == 'object'
    ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
    : (cache ? 0 : -1);
}

module.exports = cacheIndexOf;

},{"lodash._baseindexof":31,"lodash._keyprefix":41}],35:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var keyPrefix = require('lodash._keyprefix');

/**
 * Adds a given value to the corresponding cache object.
 *
 * @private
 * @param {*} value The value to add to the cache.
 */
function cachePush(value) {
  var cache = this.cache,
      type = typeof value;

  if (type == 'boolean' || value == null) {
    cache[value] = true;
  } else {
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value,
        typeCache = cache[type] || (cache[type] = {});

    if (type == 'object') {
      (typeCache[key] || (typeCache[key] = [])).push(value);
    } else {
      typeCache[key] = true;
    }
  }
}

module.exports = cachePush;

},{"lodash._keyprefix":41}],36:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var cachePush = require('lodash._cachepush'),
    getObject = require('lodash._getobject'),
    releaseObject = require('lodash._releaseobject');

/**
 * Creates a cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [array=[]] The array to search.
 * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
 */
function createCache(array) {
  var index = -1,
      length = array.length,
      first = array[0],
      mid = array[(length / 2) | 0],
      last = array[length - 1];

  if (first && typeof first == 'object' &&
      mid && typeof mid == 'object' && last && typeof last == 'object') {
    return false;
  }
  var cache = getObject();
  cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

  var result = getObject();
  result.array = array;
  result.cache = cache;
  result.push = cachePush;

  while (++index < length) {
    result.push(array[index]);
  }
  return result;
}

module.exports = createCache;

},{"lodash._cachepush":35,"lodash._getobject":39,"lodash._releaseobject":47}],37:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseBind = require('lodash._basebind'),
    baseCreateWrapper = require('lodash._basecreatewrapper'),
    isFunction = require('lodash.isfunction'),
    slice = require('lodash._slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push,
    unshift = arrayRef.unshift;

/**
 * Creates a function that, when called, either curries or invokes `func`
 * with an optional `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of method flags to compose.
 *  The bitmask may be composed of the following flags:
 *  1 - `_.bind`
 *  2 - `_.bindKey`
 *  4 - `_.curry`
 *  8 - `_.curry` (bound)
 *  16 - `_.partial`
 *  32 - `_.partialRight`
 * @param {Array} [partialArgs] An array of arguments to prepend to those
 *  provided to the new function.
 * @param {Array} [partialRightArgs] An array of arguments to append to those
 *  provided to the new function.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new function.
 */
function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      isPartial = bitmask & 16,
      isPartialRight = bitmask & 32;

  if (!isBindKey && !isFunction(func)) {
    throw new TypeError;
  }
  if (isPartial && !partialArgs.length) {
    bitmask &= ~16;
    isPartial = partialArgs = false;
  }
  if (isPartialRight && !partialRightArgs.length) {
    bitmask &= ~32;
    isPartialRight = partialRightArgs = false;
  }
  var bindData = func && func.__bindData__;
  if (bindData && bindData !== true) {
    // clone `bindData`
    bindData = slice(bindData);
    if (bindData[2]) {
      bindData[2] = slice(bindData[2]);
    }
    if (bindData[3]) {
      bindData[3] = slice(bindData[3]);
    }
    // set `thisBinding` is not previously bound
    if (isBind && !(bindData[1] & 1)) {
      bindData[4] = thisArg;
    }
    // set if previously bound but not currently (subsequent curried functions)
    if (!isBind && bindData[1] & 1) {
      bitmask |= 8;
    }
    // set curried arity if not yet set
    if (isCurry && !(bindData[1] & 4)) {
      bindData[5] = arity;
    }
    // append partial left arguments
    if (isPartial) {
      push.apply(bindData[2] || (bindData[2] = []), partialArgs);
    }
    // append partial right arguments
    if (isPartialRight) {
      unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
    }
    // merge flags
    bindData[1] |= bitmask;
    return createWrapper.apply(null, bindData);
  }
  // fast path for `_.bind`
  var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
  return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
}

module.exports = createWrapper;

},{"lodash._basebind":27,"lodash._basecreatewrapper":30,"lodash._slice":50,"lodash.isfunction":56}],38:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = require('lodash._arraypool');

/**
 * Gets an array from the array pool or creates a new one if the pool is empty.
 *
 * @private
 * @returns {Array} The array from the pool.
 */
function getArray() {
  return arrayPool.pop() || [];
}

module.exports = getArray;

},{"lodash._arraypool":26}],39:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectPool = require('lodash._objectpool');

/**
 * Gets an object from the object pool or creates a new one if the pool is empty.
 *
 * @private
 * @returns {Object} The object from the pool.
 */
function getObject() {
  return objectPool.pop() || {
    'array': null,
    'cache': null,
    'criteria': null,
    'false': false,
    'index': 0,
    'null': false,
    'number': null,
    'object': null,
    'push': null,
    'string': null,
    'true': false,
    'undefined': false,
    'value': null
  };
}

module.exports = getObject;

},{"lodash._objectpool":44}],40:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Used to detect if a method is native */
var reNative = RegExp('^' +
  String(toString)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/toString| for [^\]]+/g, '.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
 */
function isNative(value) {
  return typeof value == 'function' && reNative.test(value);
}

module.exports = isNative;

},{}],41:[function(require,module,exports){
/**
 * Lo-Dash 2.4.2 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2014 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
var keyPrefix = '__1335248838000__';

module.exports = keyPrefix;

},{}],42:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used as the size when optimizations are enabled for large arrays */
var largeArraySize = 75;

module.exports = largeArraySize;

},{}],43:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used as the max size of the `arrayPool` and `objectPool` */
var maxPoolSize = 40;

module.exports = maxPoolSize;

},{}],44:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to pool arrays and objects used internally */
var objectPool = [];

module.exports = objectPool;

},{}],45:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to determine if values are of the language type Object */
var objectTypes = {
  'boolean': false,
  'function': true,
  'object': true,
  'number': false,
  'string': false,
  'undefined': false
};

module.exports = objectTypes;

},{}],46:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var arrayPool = require('lodash._arraypool'),
    maxPoolSize = require('lodash._maxpoolsize');

/**
 * Releases the given array back to the array pool.
 *
 * @private
 * @param {Array} [array] The array to release.
 */
function releaseArray(array) {
  array.length = 0;
  if (arrayPool.length < maxPoolSize) {
    arrayPool.push(array);
  }
}

module.exports = releaseArray;

},{"lodash._arraypool":26,"lodash._maxpoolsize":43}],47:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var maxPoolSize = require('lodash._maxpoolsize'),
    objectPool = require('lodash._objectpool');

/**
 * Releases the given object back to the object pool.
 *
 * @private
 * @param {Object} [object] The object to release.
 */
function releaseObject(object) {
  var cache = object.cache;
  if (cache) {
    releaseObject(cache);
  }
  object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
  if (objectPool.length < maxPoolSize) {
    objectPool.push(object);
  }
}

module.exports = releaseObject;

},{"lodash._maxpoolsize":43,"lodash._objectpool":44}],48:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('lodash._isnative'),
    noop = require('lodash.noop');

/** Used as the property descriptor for `__bindData__` */
var descriptor = {
  'configurable': false,
  'enumerable': false,
  'value': null,
  'writable': false
};

/** Used to set meta data on functions */
var defineProperty = (function() {
  // IE 8 only accepts DOM elements
  try {
    var o = {},
        func = isNative(func = Object.defineProperty) && func,
        result = func(o, o, o) && func;
  } catch(e) { }
  return result;
}());

/**
 * Sets `this` binding data on a given function.
 *
 * @private
 * @param {Function} func The function to set data on.
 * @param {Array} value The data array to set.
 */
var setBindData = !defineProperty ? noop : function(func, value) {
  descriptor.value = value;
  defineProperty(func, '__bindData__', descriptor);
};

module.exports = setBindData;

},{"lodash._isnative":40,"lodash.noop":60}],49:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = require('lodash._objecttypes');

/** Used for native method references */
var objectProto = Object.prototype;

/** Native method shortcuts */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which produces an array of the
 * given object's own enumerable property names.
 *
 * @private
 * @type Function
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 */
var shimKeys = function(object) {
  var index, iterable = object, result = [];
  if (!iterable) return result;
  if (!(objectTypes[typeof object])) return result;
    for (index in iterable) {
      if (hasOwnProperty.call(iterable, index)) {
        result.push(index);
      }
    }
  return result
};

module.exports = shimKeys;

},{"lodash._objecttypes":45}],50:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Slices the `collection` from the `start` index up to, but not including,
 * the `end` index.
 *
 * Note: This function is used instead of `Array#slice` to support node lists
 * in IE < 9 and to ensure dense arrays are returned.
 *
 * @private
 * @param {Array|Object|string} collection The collection to slice.
 * @param {number} start The start index.
 * @param {number} end The end index.
 * @returns {Array} Returns the new array.
 */
function slice(array, start, end) {
  start || (start = 0);
  if (typeof end == 'undefined') {
    end = array ? array.length : 0;
  }
  var index = -1,
      length = end - start || 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = array[start + index];
  }
  return result;
}

module.exports = slice;

},{}],51:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('lodash._basecreatecallback'),
    keys = require('lodash.keys'),
    objectTypes = require('lodash._objecttypes');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources will overwrite property assignments of previous
 * sources. If a callback is provided it will be executed to produce the
 * assigned values. The callback is bound to `thisArg` and invoked with two
 * arguments; (objectValue, sourceValue).
 *
 * @static
 * @memberOf _
 * @type Function
 * @alias extend
 * @category Objects
 * @param {Object} object The destination object.
 * @param {...Object} [source] The source objects.
 * @param {Function} [callback] The function to customize assigning values.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns the destination object.
 * @example
 *
 * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
 * // => { 'name': 'fred', 'employer': 'slate' }
 *
 * var defaults = _.partialRight(_.assign, function(a, b) {
 *   return typeof a == 'undefined' ? b : a;
 * });
 *
 * var object = { 'name': 'barney' };
 * defaults(object, { 'name': 'fred', 'employer': 'slate' });
 * // => { 'name': 'barney', 'employer': 'slate' }
 */
var assign = function(object, source, guard) {
  var index, iterable = object, result = iterable;
  if (!iterable) return result;
  var args = arguments,
      argsIndex = 0,
      argsLength = typeof guard == 'number' ? 2 : args.length;
  if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
    var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
  } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
    callback = args[--argsLength];
  }
  while (++argsIndex < argsLength) {
    iterable = args[argsIndex];
    if (iterable && objectTypes[typeof iterable]) {
    var ownIndex = -1,
        ownProps = objectTypes[typeof iterable] && keys(iterable),
        length = ownProps ? ownProps.length : 0;

    while (++ownIndex < length) {
      index = ownProps[ownIndex];
      result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
    }
    }
  }
  return result
};

module.exports = assign;

},{"lodash._basecreatecallback":29,"lodash._objecttypes":45,"lodash.keys":59}],52:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = require('lodash._createwrapper'),
    slice = require('lodash._slice');

/**
 * Creates a function that, when called, invokes `func` with the `this`
 * binding of `thisArg` and prepends any additional `bind` arguments to those
 * provided to the bound function.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to bind.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {...*} [arg] Arguments to be partially applied.
 * @returns {Function} Returns the new bound function.
 * @example
 *
 * var func = function(greeting) {
 *   return greeting + ' ' + this.name;
 * };
 *
 * func = _.bind(func, { 'name': 'fred' }, 'hi');
 * func();
 * // => 'hi fred'
 */
function bind(func, thisArg) {
  return arguments.length > 2
    ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
    : createWrapper(func, 1, null, null, thisArg);
}

module.exports = bind;

},{"lodash._createwrapper":37,"lodash._slice":50}],53:[function(require,module,exports){
/**
 * Lo-Dash 2.4.3 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('lodash._basecreatecallback'),
    baseIsEqual = require('lodash._baseisequal'),
    isObject = require('lodash.isobject'),
    keys = require('lodash.keys'),
    property = require('lodash.property');

/**
 * Produces a callback bound to an optional `thisArg`. If `func` is a property
 * name the created callback will return the property value for a given element.
 * If `func` is an object the created callback will return `true` for elements
 * that contain the equivalent object properties, otherwise it will return `false`.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} [func=identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of the created callback.
 * @param {number} [argCount] The number of arguments the callback accepts.
 * @returns {Function} Returns a callback function.
 * @example
 *
 * var characters = [
 *   { 'name': 'barney', 'age': 36 },
 *   { 'name': 'fred',   'age': 40 }
 * ];
 *
 * // wrap to create custom callback shorthands
 * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
 *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
 *   return !match ? func(callback, thisArg) : function(object) {
 *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
 *   };
 * });
 *
 * _.filter(characters, 'age__gt38');
 * // => [{ 'name': 'fred', 'age': 40 }]
 */
function createCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (func == null || type == 'function') {
    return baseCreateCallback(func, thisArg, argCount);
  }
  // handle "_.pluck" style callback shorthands
  if (type != 'object') {
    return property(func);
  }
  var props = keys(func),
      key = props[0],
      a = func[key];

  // handle "_.where" style callback shorthands
  if (props.length == 1 && a === a && !isObject(a)) {
    // fast path the common case of providing an object with a single
    // property containing a primitive value
    return function(object) {
      var b = object[key];
      return a === b && (a !== 0 || (1 / a == 1 / b));
    };
  }
  return function(object) {
    var length = props.length,
        result = false;

    while (length--) {
      if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
        break;
      }
    }
    return result;
  };
}

module.exports = createCallback;

},{"lodash._basecreatecallback":29,"lodash._baseisequal":32,"lodash.isobject":58,"lodash.keys":59,"lodash.property":61}],54:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreateCallback = require('lodash._basecreatecallback'),
    objectTypes = require('lodash._objecttypes');

/**
 * Iterates over own and inherited enumerable properties of an object,
 * executing the callback for each property. The callback is bound to `thisArg`
 * and invoked with three arguments; (value, key, object). Callbacks may exit
 * iteration early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Objects
 * @param {Object} object The object to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * Shape.prototype.move = function(x, y) {
 *   this.x += x;
 *   this.y += y;
 * };
 *
 * _.forIn(new Shape, function(value, key) {
 *   console.log(key);
 * });
 * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
 */
var forIn = function(collection, callback, thisArg) {
  var index, iterable = collection, result = iterable;
  if (!iterable) return result;
  if (!objectTypes[typeof iterable]) return result;
  callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    for (index in iterable) {
      if (callback(iterable[index], index, collection) === false) return result;
    }
  return result
};

module.exports = forIn;

},{"lodash._basecreatecallback":29,"lodash._objecttypes":45}],55:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],56:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a function.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 */
function isFunction(value) {
  return typeof value == 'function';
}

module.exports = isFunction;

},{}],57:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** `Object#toString` result shortcuts */
var numberClass = '[object Number]';

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/**
 * Checks if `value` is a number.
 *
 * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(8.4 * 5);
 * // => true
 */
function isNumber(value) {
  return typeof value == 'number' ||
    value && typeof value == 'object' && toString.call(value) == numberClass || false;
}

module.exports = isNumber;

},{}],58:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = require('lodash._objecttypes');

/**
 * Checks if `value` is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // check if the value is the ECMAScript language type of Object
  // http://es5.github.io/#x8
  // and avoid a V8 bug
  // http://code.google.com/p/v8/issues/detail?id=2291
  return !!(value && objectTypes[typeof value]);
}

module.exports = isObject;

},{"lodash._objecttypes":45}],59:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('lodash._isnative'),
    isObject = require('lodash.isobject'),
    shimKeys = require('lodash._shimkeys');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Creates an array composed of the own enumerable property names of an object.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {Object} object The object to inspect.
 * @returns {Array} Returns an array of property names.
 * @example
 *
 * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
 * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  if (!isObject(object)) {
    return [];
  }
  return nativeKeys(object);
};

module.exports = keys;

},{"lodash._isnative":40,"lodash._shimkeys":49,"lodash.isobject":58}],60:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * A no-operation function.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // no operation performed
}

module.exports = noop;

},{}],61:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Creates a "_.pluck" style function, which returns the `key` value of a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @param {string} key The name of the property to retrieve.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var characters = [
 *   { 'name': 'fred',   'age': 40 },
 *   { 'name': 'barney', 'age': 36 }
 * ];
 *
 * var getName = _.property('name');
 *
 * _.map(characters, getName);
 * // => ['barney', 'fred']
 *
 * _.sortBy(characters, getName);
 * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
 */
function property(key) {
  return function(object) {
    return object[key];
  };
}

module.exports = property;

},{}],62:[function(require,module,exports){
(function (global){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('lodash._isnative');

/** Used to detect functions containing a `this` reference */
var reThis = /\bthis\b/;

/**
 * An object used to flag environments features.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

/**
 * Detect if functions can be decompiled by `Function#toString`
 * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcDecomp = !isNative(global.WinRTError) && reThis.test(function() { return this; });

/**
 * Detect if `Function#name` is supported (all but IE).
 *
 * @memberOf _.support
 * @type boolean
 */
support.funcNames = typeof Function.name == 'string';

module.exports = support;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash._isnative":40}],63:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseUniq = require('lodash._baseuniq'),
    createCallback = require('lodash.createcallback');

/**
 * Creates a duplicate-value-free version of an array using strict equality
 * for comparisons, i.e. `===`. If the array is sorted, providing
 * `true` for `isSorted` will use a faster algorithm. If a callback is provided
 * each element of `array` is passed through the callback before uniqueness
 * is computed. The callback is bound to `thisArg` and invoked with three
 * arguments; (value, index, array).
 *
 * If a property name is provided for `callback` the created "_.pluck" style
 * callback will return the property value of the given element.
 *
 * If an object is provided for `callback` the created "_.where" style callback
 * will return `true` for elements that have the properties of the given object,
 * else `false`.
 *
 * @static
 * @memberOf _
 * @alias unique
 * @category Arrays
 * @param {Array} array The array to process.
 * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
 * @param {Function|Object|string} [callback=identity] The function called
 *  per iteration. If a property name or object is provided it will be used
 *  to create a "_.pluck" or "_.where" style callback, respectively.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array} Returns a duplicate-value-free array.
 * @example
 *
 * _.uniq([1, 2, 1, 3, 1]);
 * // => [1, 2, 3]
 *
 * _.uniq([1, 1, 2, 2, 3], true);
 * // => [1, 2, 3]
 *
 * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
 * // => ['A', 'b', 'C']
 *
 * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
 * // => [1, 2.5, 3]
 *
 * // using "_.pluck" callback shorthand
 * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniq(array, isSorted, callback, thisArg) {
  // juggle arguments
  if (typeof isSorted != 'boolean' && isSorted != null) {
    thisArg = callback;
    callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
    isSorted = false;
  }
  if (callback != null) {
    callback = createCallback(callback, thisArg, 3);
  }
  return baseUniq(array, isSorted, callback);
}

module.exports = uniq;

},{"lodash._baseuniq":33,"lodash.createcallback":53}],64:[function(require,module,exports){
(function (process,global){
(function(global) {
  'use strict';
  if (global.$traceurRuntime) {
    return;
  }
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $Object.defineProperties;
  var $defineProperty = $Object.defineProperty;
  var $freeze = $Object.freeze;
  var $getOwnPropertyDescriptor = $Object.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $Object.getOwnPropertyNames;
  var $keys = $Object.keys;
  var $hasOwnProperty = $Object.prototype.hasOwnProperty;
  var $toString = $Object.prototype.toString;
  var $preventExtensions = Object.preventExtensions;
  var $seal = Object.seal;
  var $isExtensible = Object.isExtensible;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var types = {
    void: function voidType() {},
    any: function any() {},
    string: function string() {},
    number: function number() {},
    boolean: function boolean() {}
  };
  var method = nonEnum;
  var counter = 0;
  function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
  }
  var symbolInternalProperty = newUniqueString();
  var symbolDescriptionProperty = newUniqueString();
  var symbolDataProperty = newUniqueString();
  var symbolValues = $create(null);
  var privateNames = $create(null);
  function createPrivateName() {
    var s = newUniqueString();
    privateNames[s] = true;
    return s;
  }
  function isSymbol(symbol) {
    return typeof symbol === 'object' && symbol instanceof SymbolValue;
  }
  function typeOf(v) {
    if (isSymbol(v))
      return 'symbol';
    return typeof v;
  }
  function Symbol(description) {
    var value = new SymbolValue(description);
    if (!(this instanceof Symbol))
      return value;
    throw new TypeError('Symbol cannot be new\'ed');
  }
  $defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(Symbol.prototype, 'toString', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    var desc = symbolValue[symbolDescriptionProperty];
    if (desc === undefined)
      desc = '';
    return 'Symbol(' + desc + ')';
  }));
  $defineProperty(Symbol.prototype, 'valueOf', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    return symbolValue;
  }));
  function SymbolValue(description) {
    var key = newUniqueString();
    $defineProperty(this, symbolDataProperty, {value: this});
    $defineProperty(this, symbolInternalProperty, {value: key});
    $defineProperty(this, symbolDescriptionProperty, {value: description});
    freeze(this);
    symbolValues[key] = this;
  }
  $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(SymbolValue.prototype, 'toString', {
    value: Symbol.prototype.toString,
    enumerable: false
  });
  $defineProperty(SymbolValue.prototype, 'valueOf', {
    value: Symbol.prototype.valueOf,
    enumerable: false
  });
  var hashProperty = createPrivateName();
  var hashPropertyDescriptor = {value: undefined};
  var hashObjectProperties = {
    hash: {value: undefined},
    self: {value: undefined}
  };
  var hashCounter = 0;
  function getOwnHashObject(object) {
    var hashObject = object[hashProperty];
    if (hashObject && hashObject.self === object)
      return hashObject;
    if ($isExtensible(object)) {
      hashObjectProperties.hash.value = hashCounter++;
      hashObjectProperties.self.value = object;
      hashPropertyDescriptor.value = $create(null, hashObjectProperties);
      $defineProperty(object, hashProperty, hashPropertyDescriptor);
      return hashPropertyDescriptor.value;
    }
    return undefined;
  }
  function freeze(object) {
    getOwnHashObject(object);
    return $freeze.apply(this, arguments);
  }
  function preventExtensions(object) {
    getOwnHashObject(object);
    return $preventExtensions.apply(this, arguments);
  }
  function seal(object) {
    getOwnHashObject(object);
    return $seal.apply(this, arguments);
  }
  Symbol.iterator = Symbol();
  freeze(SymbolValue.prototype);
  function toProperty(name) {
    if (isSymbol(name))
      return name[symbolInternalProperty];
    return name;
  }
  function getOwnPropertyNames(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (!symbolValues[name] && !privateNames[name])
        rv.push(name);
    }
    return rv;
  }
  function getOwnPropertyDescriptor(object, name) {
    return $getOwnPropertyDescriptor(object, toProperty(name));
  }
  function getOwnPropertySymbols(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var symbol = symbolValues[names[i]];
      if (symbol)
        rv.push(symbol);
    }
    return rv;
  }
  function hasOwnProperty(name) {
    return $hasOwnProperty.call(this, toProperty(name));
  }
  function getOption(name) {
    return global.traceur && global.traceur.options[name];
  }
  function setProperty(object, name, value) {
    var sym,
        desc;
    if (isSymbol(name)) {
      sym = name;
      name = name[symbolInternalProperty];
    }
    object[name] = value;
    if (sym && (desc = $getOwnPropertyDescriptor(object, name)))
      $defineProperty(object, name, {enumerable: false});
    return value;
  }
  function defineProperty(object, name, descriptor) {
    if (isSymbol(name)) {
      if (descriptor.enumerable) {
        descriptor = $create(descriptor, {enumerable: {value: false}});
      }
      name = name[symbolInternalProperty];
    }
    $defineProperty(object, name, descriptor);
    return object;
  }
  function polyfillObject(Object) {
    $defineProperty(Object, 'defineProperty', {value: defineProperty});
    $defineProperty(Object, 'getOwnPropertyNames', {value: getOwnPropertyNames});
    $defineProperty(Object, 'getOwnPropertyDescriptor', {value: getOwnPropertyDescriptor});
    $defineProperty(Object.prototype, 'hasOwnProperty', {value: hasOwnProperty});
    $defineProperty(Object, 'freeze', {value: freeze});
    $defineProperty(Object, 'preventExtensions', {value: preventExtensions});
    $defineProperty(Object, 'seal', {value: seal});
    Object.getOwnPropertySymbols = getOwnPropertySymbols;
  }
  function exportStar(object) {
    for (var i = 1; i < arguments.length; i++) {
      var names = $getOwnPropertyNames(arguments[i]);
      for (var j = 0; j < names.length; j++) {
        var name = names[j];
        if (privateNames[name])
          continue;
        (function(mod, name) {
          $defineProperty(object, name, {
            get: function() {
              return mod[name];
            },
            enumerable: true
          });
        })(arguments[i], names[j]);
      }
    }
    return object;
  }
  function isObject(x) {
    return x != null && (typeof x === 'object' || typeof x === 'function');
  }
  function toObject(x) {
    if (x == null)
      throw $TypeError();
    return $Object(x);
  }
  function assertObject(x) {
    if (!isObject(x))
      throw $TypeError(x + ' is not an Object');
    return x;
  }
  function checkObjectCoercible(argument) {
    if (argument == null) {
      throw new TypeError('Value cannot be converted to an Object');
    }
    return argument;
  }
  function setupGlobals(global) {
    global.Symbol = Symbol;
    global.Reflect = global.Reflect || {};
    global.Reflect.global = global.Reflect.global || global;
    polyfillObject(global.Object);
  }
  setupGlobals(global);
  global.$traceurRuntime = {
    assertObject: assertObject,
    createPrivateName: createPrivateName,
    exportStar: exportStar,
    getOwnHashObject: getOwnHashObject,
    privateNames: privateNames,
    setProperty: setProperty,
    setupGlobals: setupGlobals,
    toObject: toObject,
    isObject: isObject,
    toProperty: toProperty,
    type: types,
    typeof: typeOf,
    checkObjectCoercible: checkObjectCoercible,
    hasOwnProperty: function(o, p) {
      return hasOwnProperty.call(o, p);
    },
    defineProperties: $defineProperties,
    defineProperty: $defineProperty,
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    getOwnPropertyNames: $getOwnPropertyNames,
    keys: $keys
  };
})(typeof global !== 'undefined' ? global : this);
(function() {
  'use strict';
  function spread() {
    var rv = [],
        j = 0,
        iterResult;
    for (var i = 0; i < arguments.length; i++) {
      var valueToSpread = $traceurRuntime.checkObjectCoercible(arguments[i]);
      if (typeof valueToSpread[$traceurRuntime.toProperty(Symbol.iterator)] !== 'function') {
        throw new TypeError('Cannot spread non-iterable object.');
      }
      var iter = valueToSpread[$traceurRuntime.toProperty(Symbol.iterator)]();
      while (!(iterResult = iter.next()).done) {
        rv[j++] = iterResult.value;
      }
    }
    return rv;
  }
  $traceurRuntime.spread = spread;
})();
(function() {
  'use strict';
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $traceurRuntime.defineProperties;
  var $defineProperty = $traceurRuntime.defineProperty;
  var $getOwnPropertyDescriptor = $traceurRuntime.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $traceurRuntime.getOwnPropertyNames;
  var $getPrototypeOf = Object.getPrototypeOf;
  function superDescriptor(homeObject, name) {
    var proto = $getPrototypeOf(homeObject);
    do {
      var result = $getOwnPropertyDescriptor(proto, name);
      if (result)
        return result;
      proto = $getPrototypeOf(proto);
    } while (proto);
    return undefined;
  }
  function superCall(self, homeObject, name, args) {
    return superGet(self, homeObject, name).apply(self, args);
  }
  function superGet(self, homeObject, name) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if (!descriptor.get)
        return descriptor.value;
      return descriptor.get.call(self);
    }
    return undefined;
  }
  function superSet(self, homeObject, name, value) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor && descriptor.set) {
      descriptor.set.call(self, value);
      return value;
    }
    throw $TypeError("super has no setter '" + name + "'.");
  }
  function getDescriptors(object) {
    var descriptors = {},
        name,
        names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      descriptors[name] = $getOwnPropertyDescriptor(object, name);
    }
    return descriptors;
  }
  function createClass(ctor, object, staticObject, superClass) {
    $defineProperty(object, 'constructor', {
      value: ctor,
      configurable: true,
      enumerable: false,
      writable: true
    });
    if (arguments.length > 3) {
      if (typeof superClass === 'function')
        ctor.__proto__ = superClass;
      ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
    } else {
      ctor.prototype = object;
    }
    $defineProperty(ctor, 'prototype', {
      configurable: false,
      writable: false
    });
    return $defineProperties(ctor, getDescriptors(staticObject));
  }
  function getProtoParent(superClass) {
    if (typeof superClass === 'function') {
      var prototype = superClass.prototype;
      if ($Object(prototype) === prototype || prototype === null)
        return superClass.prototype;
      throw new $TypeError('super prototype must be an Object or null');
    }
    if (superClass === null)
      return null;
    throw new $TypeError('Super expression must either be null or a function');
  }
  function defaultSuperCall(self, homeObject, args) {
    if ($getPrototypeOf(homeObject) !== null)
      superCall(self, homeObject, 'constructor', args);
  }
  $traceurRuntime.createClass = createClass;
  $traceurRuntime.defaultSuperCall = defaultSuperCall;
  $traceurRuntime.superCall = superCall;
  $traceurRuntime.superGet = superGet;
  $traceurRuntime.superSet = superSet;
})();
(function() {
  'use strict';
  var createPrivateName = $traceurRuntime.createPrivateName;
  var $defineProperties = $traceurRuntime.defineProperties;
  var $defineProperty = $traceurRuntime.defineProperty;
  var $create = Object.create;
  var $TypeError = TypeError;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var ST_NEWBORN = 0;
  var ST_EXECUTING = 1;
  var ST_SUSPENDED = 2;
  var ST_CLOSED = 3;
  var END_STATE = -2;
  var RETHROW_STATE = -3;
  function getInternalError(state) {
    return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
  }
  function GeneratorContext() {
    this.state = 0;
    this.GState = ST_NEWBORN;
    this.storedException = undefined;
    this.finallyFallThrough = undefined;
    this.sent_ = undefined;
    this.returnValue = undefined;
    this.tryStack_ = [];
  }
  GeneratorContext.prototype = {
    pushTry: function(catchState, finallyState) {
      if (finallyState !== null) {
        var finallyFallThrough = null;
        for (var i = this.tryStack_.length - 1; i >= 0; i--) {
          if (this.tryStack_[i].catch !== undefined) {
            finallyFallThrough = this.tryStack_[i].catch;
            break;
          }
        }
        if (finallyFallThrough === null)
          finallyFallThrough = RETHROW_STATE;
        this.tryStack_.push({
          finally: finallyState,
          finallyFallThrough: finallyFallThrough
        });
      }
      if (catchState !== null) {
        this.tryStack_.push({catch: catchState});
      }
    },
    popTry: function() {
      this.tryStack_.pop();
    },
    get sent() {
      this.maybeThrow();
      return this.sent_;
    },
    set sent(v) {
      this.sent_ = v;
    },
    get sentIgnoreThrow() {
      return this.sent_;
    },
    maybeThrow: function() {
      if (this.action === 'throw') {
        this.action = 'next';
        throw this.sent_;
      }
    },
    end: function() {
      switch (this.state) {
        case END_STATE:
          return this;
        case RETHROW_STATE:
          throw this.storedException;
        default:
          throw getInternalError(this.state);
      }
    },
    handleException: function(ex) {
      this.GState = ST_CLOSED;
      this.state = END_STATE;
      throw ex;
    }
  };
  function nextOrThrow(ctx, moveNext, action, x) {
    switch (ctx.GState) {
      case ST_EXECUTING:
        throw new Error(("\"" + action + "\" on executing generator"));
      case ST_CLOSED:
        if (action == 'next') {
          return {
            value: undefined,
            done: true
          };
        }
        throw x;
      case ST_NEWBORN:
        if (action === 'throw') {
          ctx.GState = ST_CLOSED;
          throw x;
        }
        if (x !== undefined)
          throw $TypeError('Sent value to newborn generator');
      case ST_SUSPENDED:
        ctx.GState = ST_EXECUTING;
        ctx.action = action;
        ctx.sent = x;
        var value = moveNext(ctx);
        var done = value === ctx;
        if (done)
          value = ctx.returnValue;
        ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
        return {
          value: value,
          done: done
        };
    }
  }
  var ctxName = createPrivateName();
  var moveNextName = createPrivateName();
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  $defineProperty(GeneratorFunctionPrototype, 'constructor', nonEnum(GeneratorFunction));
  GeneratorFunctionPrototype.prototype = {
    constructor: GeneratorFunctionPrototype,
    next: function(v) {
      return nextOrThrow(this[ctxName], this[moveNextName], 'next', v);
    },
    throw: function(v) {
      return nextOrThrow(this[ctxName], this[moveNextName], 'throw', v);
    }
  };
  $defineProperties(GeneratorFunctionPrototype.prototype, {
    constructor: {enumerable: false},
    next: {enumerable: false},
    throw: {enumerable: false}
  });
  Object.defineProperty(GeneratorFunctionPrototype.prototype, Symbol.iterator, nonEnum(function() {
    return this;
  }));
  function createGeneratorInstance(innerFunction, functionObject, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new GeneratorContext();
    var object = $create(functionObject.prototype);
    object[ctxName] = ctx;
    object[moveNextName] = moveNext;
    return object;
  }
  function initGeneratorFunction(functionObject) {
    functionObject.prototype = $create(GeneratorFunctionPrototype.prototype);
    functionObject.__proto__ = GeneratorFunctionPrototype;
    return functionObject;
  }
  function AsyncFunctionContext() {
    GeneratorContext.call(this);
    this.err = undefined;
    var ctx = this;
    ctx.result = new Promise(function(resolve, reject) {
      ctx.resolve = resolve;
      ctx.reject = reject;
    });
  }
  AsyncFunctionContext.prototype = $create(GeneratorContext.prototype);
  AsyncFunctionContext.prototype.end = function() {
    switch (this.state) {
      case END_STATE:
        this.resolve(this.returnValue);
        break;
      case RETHROW_STATE:
        this.reject(this.storedException);
        break;
      default:
        this.reject(getInternalError(this.state));
    }
  };
  AsyncFunctionContext.prototype.handleException = function() {
    this.state = RETHROW_STATE;
  };
  function asyncWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new AsyncFunctionContext();
    ctx.createCallback = function(newState) {
      return function(value) {
        ctx.state = newState;
        ctx.value = value;
        moveNext(ctx);
      };
    };
    ctx.errback = function(err) {
      handleCatch(ctx, err);
      moveNext(ctx);
    };
    moveNext(ctx);
    return ctx.result;
  }
  function getMoveNext(innerFunction, self) {
    return function(ctx) {
      while (true) {
        try {
          return innerFunction.call(self, ctx);
        } catch (ex) {
          handleCatch(ctx, ex);
        }
      }
    };
  }
  function handleCatch(ctx, ex) {
    ctx.storedException = ex;
    var last = ctx.tryStack_[ctx.tryStack_.length - 1];
    if (!last) {
      ctx.handleException(ex);
      return;
    }
    ctx.state = last.catch !== undefined ? last.catch : last.finally;
    if (last.finallyFallThrough !== undefined)
      ctx.finallyFallThrough = last.finallyFallThrough;
  }
  $traceurRuntime.asyncWrap = asyncWrap;
  $traceurRuntime.initGeneratorFunction = initGeneratorFunction;
  $traceurRuntime.createGeneratorInstance = createGeneratorInstance;
})();
(function() {
  function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = [];
    if (opt_scheme) {
      out.push(opt_scheme, ':');
    }
    if (opt_domain) {
      out.push('//');
      if (opt_userInfo) {
        out.push(opt_userInfo, '@');
      }
      out.push(opt_domain);
      if (opt_port) {
        out.push(':', opt_port);
      }
    }
    if (opt_path) {
      out.push(opt_path);
    }
    if (opt_queryData) {
      out.push('?', opt_queryData);
    }
    if (opt_fragment) {
      out.push('#', opt_fragment);
    }
    return out.join('');
  }
  ;
  var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
  var ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
  };
  function split(uri) {
    return (uri.match(splitRe));
  }
  function removeDotSegments(path) {
    if (path === '/')
      return '/';
    var leadingSlash = path[0] === '/' ? '/' : '';
    var trailingSlash = path.slice(-1) === '/' ? '/' : '';
    var segments = path.split('/');
    var out = [];
    var up = 0;
    for (var pos = 0; pos < segments.length; pos++) {
      var segment = segments[pos];
      switch (segment) {
        case '':
        case '.':
          break;
        case '..':
          if (out.length)
            out.pop();
          else
            up++;
          break;
        default:
          out.push(segment);
      }
    }
    if (!leadingSlash) {
      while (up-- > 0) {
        out.unshift('..');
      }
      if (out.length === 0)
        out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
  }
  function joinAndCanonicalizePath(parts) {
    var path = parts[ComponentIndex.PATH] || '';
    path = removeDotSegments(path);
    parts[ComponentIndex.PATH] = path;
    return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
  }
  function canonicalizeUrl(url) {
    var parts = split(url);
    return joinAndCanonicalizePath(parts);
  }
  function resolveUrl(base, url) {
    var parts = split(url);
    var baseParts = split(base);
    if (parts[ComponentIndex.SCHEME]) {
      return joinAndCanonicalizePath(parts);
    } else {
      parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
    }
    for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
      if (!parts[i]) {
        parts[i] = baseParts[i];
      }
    }
    if (parts[ComponentIndex.PATH][0] == '/') {
      return joinAndCanonicalizePath(parts);
    }
    var path = baseParts[ComponentIndex.PATH];
    var index = path.lastIndexOf('/');
    path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
    parts[ComponentIndex.PATH] = path;
    return joinAndCanonicalizePath(parts);
  }
  function isAbsolute(name) {
    if (!name)
      return false;
    if (name[0] === '/')
      return true;
    var parts = split(name);
    if (parts[ComponentIndex.SCHEME])
      return true;
    return false;
  }
  $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
  $traceurRuntime.isAbsolute = isAbsolute;
  $traceurRuntime.removeDotSegments = removeDotSegments;
  $traceurRuntime.resolveUrl = resolveUrl;
})();
(function(global) {
  'use strict';
  var $__2 = $traceurRuntime.assertObject($traceurRuntime),
      canonicalizeUrl = $__2.canonicalizeUrl,
      resolveUrl = $__2.resolveUrl,
      isAbsolute = $__2.isAbsolute;
  var moduleInstantiators = Object.create(null);
  var baseURL;
  if (global.location && global.location.href)
    baseURL = resolveUrl(global.location.href, './');
  else
    baseURL = '';
  var UncoatedModuleEntry = function UncoatedModuleEntry(url, uncoatedModule) {
    this.url = url;
    this.value_ = uncoatedModule;
  };
  ($traceurRuntime.createClass)(UncoatedModuleEntry, {}, {});
  var ModuleEvaluationError = function ModuleEvaluationError(erroneousModuleName, cause) {
    this.message = this.constructor.name + (cause ? ': \'' + cause + '\'' : '') + ' in ' + erroneousModuleName;
  };
  ($traceurRuntime.createClass)(ModuleEvaluationError, {loadedBy: function(moduleName) {
      this.message += '\n loaded by ' + moduleName;
    }}, {}, Error);
  var UncoatedModuleInstantiator = function UncoatedModuleInstantiator(url, func) {
    $traceurRuntime.superCall(this, $UncoatedModuleInstantiator.prototype, "constructor", [url, null]);
    this.func = func;
  };
  var $UncoatedModuleInstantiator = UncoatedModuleInstantiator;
  ($traceurRuntime.createClass)(UncoatedModuleInstantiator, {getUncoatedModule: function() {
      if (this.value_)
        return this.value_;
      try {
        return this.value_ = this.func.call(global);
      } catch (ex) {
        if (ex instanceof ModuleEvaluationError) {
          ex.loadedBy(this.url);
          throw ex;
        }
        throw new ModuleEvaluationError(this.url, ex);
      }
    }}, {}, UncoatedModuleEntry);
  function getUncoatedModuleInstantiator(name) {
    if (!name)
      return;
    var url = ModuleStore.normalize(name);
    return moduleInstantiators[url];
  }
  ;
  var moduleInstances = Object.create(null);
  var liveModuleSentinel = {};
  function Module(uncoatedModule) {
    var isLive = arguments[1];
    var coatedModule = Object.create(null);
    Object.getOwnPropertyNames(uncoatedModule).forEach((function(name) {
      var getter,
          value;
      if (isLive === liveModuleSentinel) {
        var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
        if (descr.get)
          getter = descr.get;
      }
      if (!getter) {
        value = uncoatedModule[name];
        getter = function() {
          return value;
        };
      }
      Object.defineProperty(coatedModule, name, {
        get: getter,
        enumerable: true
      });
    }));
    Object.preventExtensions(coatedModule);
    return coatedModule;
  }
  var ModuleStore = {
    normalize: function(name, refererName, refererAddress) {
      if (typeof name !== "string")
        throw new TypeError("module name must be a string, not " + typeof name);
      if (isAbsolute(name))
        return canonicalizeUrl(name);
      if (/[^\.]\/\.\.\//.test(name)) {
        throw new Error('module name embeds /../: ' + name);
      }
      if (name[0] === '.' && refererName)
        return resolveUrl(refererName, name);
      return canonicalizeUrl(name);
    },
    get: function(normalizedName) {
      var m = getUncoatedModuleInstantiator(normalizedName);
      if (!m)
        return undefined;
      var moduleInstance = moduleInstances[m.url];
      if (moduleInstance)
        return moduleInstance;
      moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
      return moduleInstances[m.url] = moduleInstance;
    },
    set: function(normalizedName, module) {
      normalizedName = String(normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, (function() {
        return module;
      }));
      moduleInstances[normalizedName] = module;
    },
    get baseURL() {
      return baseURL;
    },
    set baseURL(v) {
      baseURL = String(v);
    },
    registerModule: function(name, func) {
      var normalizedName = ModuleStore.normalize(name);
      if (moduleInstantiators[normalizedName])
        throw new Error('duplicate module named ' + normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
    },
    bundleStore: Object.create(null),
    register: function(name, deps, func) {
      if (!deps || !deps.length && !func.length) {
        this.registerModule(name, func);
      } else {
        this.bundleStore[name] = {
          deps: deps,
          execute: function() {
            var $__0 = arguments;
            var depMap = {};
            deps.forEach((function(dep, index) {
              return depMap[dep] = $__0[index];
            }));
            var registryEntry = func.call(this, depMap);
            registryEntry.execute.call(this);
            return registryEntry.exports;
          }
        };
      }
    },
    getAnonymousModule: function(func) {
      return new Module(func.call(global), liveModuleSentinel);
    },
    getForTesting: function(name) {
      var $__0 = this;
      if (!this.testingPrefix_) {
        Object.keys(moduleInstances).some((function(key) {
          var m = /(traceur@[^\/]*\/)/.exec(key);
          if (m) {
            $__0.testingPrefix_ = m[1];
            return true;
          }
        }));
      }
      return this.get(this.testingPrefix_ + name);
    }
  };
  ModuleStore.set('@traceur/src/runtime/ModuleStore', new Module({ModuleStore: ModuleStore}));
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
  };
  $traceurRuntime.ModuleStore = ModuleStore;
  global.System = {
    register: ModuleStore.register.bind(ModuleStore),
    get: ModuleStore.get,
    set: ModuleStore.set,
    normalize: ModuleStore.normalize
  };
  $traceurRuntime.getModuleImpl = function(name) {
    var instantiator = getUncoatedModuleInstantiator(name);
    return instantiator && instantiator.getUncoatedModule();
  };
})(typeof global !== 'undefined' ? global : this);
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/utils", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/utils";
  var $ceil = Math.ceil;
  var $floor = Math.floor;
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var $pow = Math.pow;
  var $min = Math.min;
  var toObject = $traceurRuntime.toObject;
  function toUint32(x) {
    return x >>> 0;
  }
  function isObject(x) {
    return x && (typeof x === 'object' || typeof x === 'function');
  }
  function isCallable(x) {
    return typeof x === 'function';
  }
  function isNumber(x) {
    return typeof x === 'number';
  }
  function toInteger(x) {
    x = +x;
    if ($isNaN(x))
      return 0;
    if (x === 0 || !$isFinite(x))
      return x;
    return x > 0 ? $floor(x) : $ceil(x);
  }
  var MAX_SAFE_LENGTH = $pow(2, 53) - 1;
  function toLength(x) {
    var len = toInteger(x);
    return len < 0 ? 0 : $min(len, MAX_SAFE_LENGTH);
  }
  function checkIterable(x) {
    return !isObject(x) ? undefined : x[Symbol.iterator];
  }
  function isConstructor(x) {
    return isCallable(x);
  }
  function createIteratorResultObject(value, done) {
    return {
      value: value,
      done: done
    };
  }
  return {
    get toObject() {
      return toObject;
    },
    get toUint32() {
      return toUint32;
    },
    get isObject() {
      return isObject;
    },
    get isCallable() {
      return isCallable;
    },
    get isNumber() {
      return isNumber;
    },
    get toInteger() {
      return toInteger;
    },
    get toLength() {
      return toLength;
    },
    get checkIterable() {
      return checkIterable;
    },
    get isConstructor() {
      return isConstructor;
    },
    get createIteratorResultObject() {
      return createIteratorResultObject;
    }
  };
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Array", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Array";
  var $__3 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils"),
      isCallable = $__3.isCallable,
      isConstructor = $__3.isConstructor,
      checkIterable = $__3.checkIterable,
      toInteger = $__3.toInteger,
      toLength = $__3.toLength,
      toObject = $__3.toObject;
  function from(arrLike) {
    var mapFn = arguments[1];
    var thisArg = arguments[2];
    var C = this;
    var items = toObject(arrLike);
    var mapping = mapFn !== undefined;
    var k = 0;
    var arr,
        len;
    if (mapping && !isCallable(mapFn)) {
      throw TypeError();
    }
    if (checkIterable(items)) {
      arr = isConstructor(C) ? new C() : [];
      for (var $__4 = items[Symbol.iterator](),
          $__5; !($__5 = $__4.next()).done; ) {
        var item = $__5.value;
        {
          if (mapping) {
            arr[k] = mapFn.call(thisArg, item, k);
          } else {
            arr[k] = item;
          }
          k++;
        }
      }
      arr.length = k;
      return arr;
    }
    len = toLength(items.length);
    arr = isConstructor(C) ? new C(len) : new Array(len);
    for (; k < len; k++) {
      if (mapping) {
        arr[k] = typeof thisArg === 'undefined' ? mapFn(items[k], k) : mapFn.call(thisArg, items[k], k);
      } else {
        arr[k] = items[k];
      }
    }
    arr.length = len;
    return arr;
  }
  function fill(value) {
    var start = arguments[1] !== (void 0) ? arguments[1] : 0;
    var end = arguments[2];
    var object = toObject(this);
    var len = toLength(object.length);
    var fillStart = toInteger(start);
    var fillEnd = end !== undefined ? toInteger(end) : len;
    fillStart = fillStart < 0 ? Math.max(len + fillStart, 0) : Math.min(fillStart, len);
    fillEnd = fillEnd < 0 ? Math.max(len + fillEnd, 0) : Math.min(fillEnd, len);
    while (fillStart < fillEnd) {
      object[fillStart] = value;
      fillStart++;
    }
    return object;
  }
  function find(predicate) {
    var thisArg = arguments[1];
    return findHelper(this, predicate, thisArg);
  }
  function findIndex(predicate) {
    var thisArg = arguments[1];
    return findHelper(this, predicate, thisArg, true);
  }
  function findHelper(self, predicate) {
    var thisArg = arguments[2];
    var returnIndex = arguments[3] !== (void 0) ? arguments[3] : false;
    var object = toObject(self);
    var len = toLength(object.length);
    if (!isCallable(predicate)) {
      throw TypeError();
    }
    for (var i = 0; i < len; i++) {
      if (i in object) {
        var value = object[i];
        if (predicate.call(thisArg, value, i, object)) {
          return returnIndex ? i : value;
        }
      }
    }
    return returnIndex ? -1 : undefined;
  }
  return {
    get from() {
      return from;
    },
    get fill() {
      return fill;
    },
    get find() {
      return find;
    },
    get findIndex() {
      return findIndex;
    }
  };
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/ArrayIterator", [], function() {
  "use strict";
  var $__8;
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/ArrayIterator";
  var $__6 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils"),
      toObject = $__6.toObject,
      toUint32 = $__6.toUint32,
      createIteratorResultObject = $__6.createIteratorResultObject;
  var ARRAY_ITERATOR_KIND_KEYS = 1;
  var ARRAY_ITERATOR_KIND_VALUES = 2;
  var ARRAY_ITERATOR_KIND_ENTRIES = 3;
  var ArrayIterator = function ArrayIterator() {};
  ($traceurRuntime.createClass)(ArrayIterator, ($__8 = {}, Object.defineProperty($__8, "next", {
    value: function() {
      var iterator = toObject(this);
      var array = iterator.iteratorObject_;
      if (!array) {
        throw new TypeError('Object is not an ArrayIterator');
      }
      var index = iterator.arrayIteratorNextIndex_;
      var itemKind = iterator.arrayIterationKind_;
      var length = toUint32(array.length);
      if (index >= length) {
        iterator.arrayIteratorNextIndex_ = Infinity;
        return createIteratorResultObject(undefined, true);
      }
      iterator.arrayIteratorNextIndex_ = index + 1;
      if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
        return createIteratorResultObject(array[index], false);
      if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
        return createIteratorResultObject([index, array[index]], false);
      return createIteratorResultObject(index, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__8, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__8), {});
  function createArrayIterator(array, kind) {
    var object = toObject(array);
    var iterator = new ArrayIterator;
    iterator.iteratorObject_ = object;
    iterator.arrayIteratorNextIndex_ = 0;
    iterator.arrayIterationKind_ = kind;
    return iterator;
  }
  function entries() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
  }
  function keys() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
  }
  function values() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
  }
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    }
  };
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Map", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Map";
  var isObject = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils").isObject;
  var getOwnHashObject = $traceurRuntime.getOwnHashObject;
  var $hasOwnProperty = Object.prototype.hasOwnProperty;
  var deletedSentinel = {};
  function lookupIndex(map, key) {
    if (isObject(key)) {
      var hashObject = getOwnHashObject(key);
      return hashObject && map.objectIndex_[hashObject.hash];
    }
    if (typeof key === 'string')
      return map.stringIndex_[key];
    return map.primitiveIndex_[key];
  }
  function initMap(map) {
    map.entries_ = [];
    map.objectIndex_ = Object.create(null);
    map.stringIndex_ = Object.create(null);
    map.primitiveIndex_ = Object.create(null);
    map.deletedCount_ = 0;
  }
  var Map = function Map() {
    var iterable = arguments[0];
    if (!isObject(this))
      throw new TypeError('Map called on incompatible type');
    if ($hasOwnProperty.call(this, 'entries_')) {
      throw new TypeError('Map can not be reentrantly initialised');
    }
    initMap(this);
    if (iterable !== null && iterable !== undefined) {
      for (var $__11 = iterable[Symbol.iterator](),
          $__12; !($__12 = $__11.next()).done; ) {
        var $__13 = $traceurRuntime.assertObject($__12.value),
            key = $__13[0],
            value = $__13[1];
        {
          this.set(key, value);
        }
      }
    }
  };
  ($traceurRuntime.createClass)(Map, {
    get size() {
      return this.entries_.length / 2 - this.deletedCount_;
    },
    get: function(key) {
      var index = lookupIndex(this, key);
      if (index !== undefined)
        return this.entries_[index + 1];
    },
    set: function(key, value) {
      var objectMode = isObject(key);
      var stringMode = typeof key === 'string';
      var index = lookupIndex(this, key);
      if (index !== undefined) {
        this.entries_[index + 1] = value;
      } else {
        index = this.entries_.length;
        this.entries_[index] = key;
        this.entries_[index + 1] = value;
        if (objectMode) {
          var hashObject = getOwnHashObject(key);
          var hash = hashObject.hash;
          this.objectIndex_[hash] = index;
        } else if (stringMode) {
          this.stringIndex_[key] = index;
        } else {
          this.primitiveIndex_[key] = index;
        }
      }
      return this;
    },
    has: function(key) {
      return lookupIndex(this, key) !== undefined;
    },
    delete: function(key) {
      var objectMode = isObject(key);
      var stringMode = typeof key === 'string';
      var index;
      var hash;
      if (objectMode) {
        var hashObject = getOwnHashObject(key);
        if (hashObject) {
          index = this.objectIndex_[hash = hashObject.hash];
          delete this.objectIndex_[hash];
        }
      } else if (stringMode) {
        index = this.stringIndex_[key];
        delete this.stringIndex_[key];
      } else {
        index = this.primitiveIndex_[key];
        delete this.primitiveIndex_[key];
      }
      if (index !== undefined) {
        this.entries_[index] = deletedSentinel;
        this.entries_[index + 1] = undefined;
        this.deletedCount_++;
      }
    },
    clear: function() {
      initMap(this);
    },
    forEach: function(callbackFn) {
      var thisArg = arguments[1];
      for (var i = 0,
          len = this.entries_.length; i < len; i += 2) {
        var key = this.entries_[i];
        var value = this.entries_[i + 1];
        if (key === deletedSentinel)
          continue;
        callbackFn.call(thisArg, value, key, this);
      }
    },
    entries: $traceurRuntime.initGeneratorFunction(function $__14() {
      var i,
          len,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0, len = this.entries_.length;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < len) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return [key, value];
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__14, this);
    }),
    keys: $traceurRuntime.initGeneratorFunction(function $__15() {
      var i,
          len,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0, len = this.entries_.length;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < len) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return key;
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__15, this);
    }),
    values: $traceurRuntime.initGeneratorFunction(function $__16() {
      var i,
          len,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0, len = this.entries_.length;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < len) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return value;
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__16, this);
    })
  }, {});
  Object.defineProperty(Map.prototype, Symbol.iterator, {
    configurable: true,
    writable: true,
    value: Map.prototype.entries
  });
  return {get Map() {
      return Map;
    }};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Number", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Number";
  var $__17 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils"),
      isNumber = $__17.isNumber,
      toInteger = $__17.toInteger;
  var $abs = Math.abs;
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
  var MIN_SAFE_INTEGER = -Math.pow(2, 53) + 1;
  var EPSILON = Math.pow(2, -52);
  function NumberIsFinite(number) {
    return isNumber(number) && $isFinite(number);
  }
  ;
  function isInteger(number) {
    return NumberIsFinite(number) && toInteger(number) === number;
  }
  function NumberIsNaN(number) {
    return isNumber(number) && $isNaN(number);
  }
  ;
  function isSafeInteger(number) {
    if (NumberIsFinite(number)) {
      var integral = toInteger(number);
      if (integral === number)
        return $abs(integral) <= MAX_SAFE_INTEGER;
    }
    return false;
  }
  return {
    get MAX_SAFE_INTEGER() {
      return MAX_SAFE_INTEGER;
    },
    get MIN_SAFE_INTEGER() {
      return MIN_SAFE_INTEGER;
    },
    get EPSILON() {
      return EPSILON;
    },
    get isFinite() {
      return NumberIsFinite;
    },
    get isInteger() {
      return isInteger;
    },
    get isNaN() {
      return NumberIsNaN;
    },
    get isSafeInteger() {
      return isSafeInteger;
    }
  };
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Object", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Object";
  var $__18 = $traceurRuntime.assertObject($traceurRuntime),
      defineProperty = $__18.defineProperty,
      getOwnPropertyDescriptor = $__18.getOwnPropertyDescriptor,
      getOwnPropertyNames = $__18.getOwnPropertyNames,
      keys = $__18.keys,
      privateNames = $__18.privateNames;
  function is(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    return left !== left && right !== right;
  }
  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      var props = keys(source);
      var p,
          length = props.length;
      for (p = 0; p < length; p++) {
        var name = props[p];
        if (privateNames[name])
          continue;
        target[name] = source[name];
      }
    }
    return target;
  }
  function mixin(target, source) {
    var props = getOwnPropertyNames(source);
    var p,
        descriptor,
        length = props.length;
    for (p = 0; p < length; p++) {
      var name = props[p];
      if (privateNames[name])
        continue;
      descriptor = getOwnPropertyDescriptor(source, props[p]);
      defineProperty(target, props[p], descriptor);
    }
    return target;
  }
  return {
    get is() {
      return is;
    },
    get assign() {
      return assign;
    },
    get mixin() {
      return mixin;
    }
  };
});
System.register("traceur-runtime@0.0.55/node_modules/rsvp/lib/rsvp/asap", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/node_modules/rsvp/lib/rsvp/asap";
  var length = 0;
  function asap(callback, arg) {
    queue[length] = callback;
    queue[length + 1] = arg;
    length += 2;
    if (length === 2) {
      scheduleFlush();
    }
  }
  var $__default = asap;
  var browserGlobal = (typeof window !== 'undefined') ? window : {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
  function useNextTick() {
    return function() {
      process.nextTick(flush);
    };
  }
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function() {
      channel.port2.postMessage(0);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < length; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];
      callback(arg);
      queue[i] = undefined;
      queue[i + 1] = undefined;
    }
    length = 0;
  }
  var scheduleFlush;
  if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else {
    scheduleFlush = useSetTimeout();
  }
  return {get default() {
      return $__default;
    }};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Promise", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Promise";
  var async = System.get("traceur-runtime@0.0.55/node_modules/rsvp/lib/rsvp/asap").default;
  var promiseRaw = {};
  function isPromise(x) {
    return x && typeof x === 'object' && x.status_ !== undefined;
  }
  function idResolveHandler(x) {
    return x;
  }
  function idRejectHandler(x) {
    throw x;
  }
  function chain(promise) {
    var onResolve = arguments[1] !== (void 0) ? arguments[1] : idResolveHandler;
    var onReject = arguments[2] !== (void 0) ? arguments[2] : idRejectHandler;
    var deferred = getDeferred(promise.constructor);
    switch (promise.status_) {
      case undefined:
        throw TypeError;
      case 0:
        promise.onResolve_.push(onResolve, deferred);
        promise.onReject_.push(onReject, deferred);
        break;
      case +1:
        promiseEnqueue(promise.value_, [onResolve, deferred]);
        break;
      case -1:
        promiseEnqueue(promise.value_, [onReject, deferred]);
        break;
    }
    return deferred.promise;
  }
  function getDeferred(C) {
    if (this === $Promise) {
      var promise = promiseInit(new $Promise(promiseRaw));
      return {
        promise: promise,
        resolve: (function(x) {
          promiseResolve(promise, x);
        }),
        reject: (function(r) {
          promiseReject(promise, r);
        })
      };
    } else {
      var result = {};
      result.promise = new C((function(resolve, reject) {
        result.resolve = resolve;
        result.reject = reject;
      }));
      return result;
    }
  }
  function promiseSet(promise, status, value, onResolve, onReject) {
    promise.status_ = status;
    promise.value_ = value;
    promise.onResolve_ = onResolve;
    promise.onReject_ = onReject;
    return promise;
  }
  function promiseInit(promise) {
    return promiseSet(promise, 0, undefined, [], []);
  }
  var Promise = function Promise(resolver) {
    if (resolver === promiseRaw)
      return;
    if (typeof resolver !== 'function')
      throw new TypeError;
    var promise = promiseInit(this);
    try {
      resolver((function(x) {
        promiseResolve(promise, x);
      }), (function(r) {
        promiseReject(promise, r);
      }));
    } catch (e) {
      promiseReject(promise, e);
    }
  };
  ($traceurRuntime.createClass)(Promise, {
    catch: function(onReject) {
      return this.then(undefined, onReject);
    },
    then: function(onResolve, onReject) {
      if (typeof onResolve !== 'function')
        onResolve = idResolveHandler;
      if (typeof onReject !== 'function')
        onReject = idRejectHandler;
      var that = this;
      var constructor = this.constructor;
      return chain(this, function(x) {
        x = promiseCoerce(constructor, x);
        return x === that ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
      }, onReject);
    }
  }, {
    resolve: function(x) {
      if (this === $Promise) {
        return promiseSet(new $Promise(promiseRaw), +1, x);
      } else {
        return new this(function(resolve, reject) {
          resolve(x);
        });
      }
    },
    reject: function(r) {
      if (this === $Promise) {
        return promiseSet(new $Promise(promiseRaw), -1, r);
      } else {
        return new this((function(resolve, reject) {
          reject(r);
        }));
      }
    },
    cast: function(x) {
      if (x instanceof this)
        return x;
      if (isPromise(x)) {
        var result = getDeferred(this);
        chain(x, result.resolve, result.reject);
        return result.promise;
      }
      return this.resolve(x);
    },
    all: function(values) {
      var deferred = getDeferred(this);
      var resolutions = [];
      try {
        var count = values.length;
        if (count === 0) {
          deferred.resolve(resolutions);
        } else {
          for (var i = 0; i < values.length; i++) {
            this.resolve(values[i]).then(function(i, x) {
              resolutions[i] = x;
              if (--count === 0)
                deferred.resolve(resolutions);
            }.bind(undefined, i), (function(r) {
              deferred.reject(r);
            }));
          }
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    },
    race: function(values) {
      var deferred = getDeferred(this);
      try {
        for (var i = 0; i < values.length; i++) {
          this.resolve(values[i]).then((function(x) {
            deferred.resolve(x);
          }), (function(r) {
            deferred.reject(r);
          }));
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }
  });
  var $Promise = Promise;
  var $PromiseReject = $Promise.reject;
  function promiseResolve(promise, x) {
    promiseDone(promise, +1, x, promise.onResolve_);
  }
  function promiseReject(promise, r) {
    promiseDone(promise, -1, r, promise.onReject_);
  }
  function promiseDone(promise, status, value, reactions) {
    if (promise.status_ !== 0)
      return;
    promiseEnqueue(value, reactions);
    promiseSet(promise, status, value);
  }
  function promiseEnqueue(value, tasks) {
    async((function() {
      for (var i = 0; i < tasks.length; i += 2) {
        promiseHandle(value, tasks[i], tasks[i + 1]);
      }
    }));
  }
  function promiseHandle(value, handler, deferred) {
    try {
      var result = handler(value);
      if (result === deferred.promise)
        throw new TypeError;
      else if (isPromise(result))
        chain(result, deferred.resolve, deferred.reject);
      else
        deferred.resolve(result);
    } catch (e) {
      try {
        deferred.reject(e);
      } catch (e) {}
    }
  }
  var thenableSymbol = '@@thenable';
  function isObject(x) {
    return x && (typeof x === 'object' || typeof x === 'function');
  }
  function promiseCoerce(constructor, x) {
    if (!isPromise(x) && isObject(x)) {
      var then;
      try {
        then = x.then;
      } catch (r) {
        var promise = $PromiseReject.call(constructor, r);
        x[thenableSymbol] = promise;
        return promise;
      }
      if (typeof then === 'function') {
        var p = x[thenableSymbol];
        if (p) {
          return p;
        } else {
          var deferred = getDeferred(constructor);
          x[thenableSymbol] = deferred.promise;
          try {
            then.call(x, deferred.resolve, deferred.reject);
          } catch (r) {
            deferred.reject(r);
          }
          return deferred.promise;
        }
      }
    }
    return x;
  }
  return {get Promise() {
      return Promise;
    }};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/Set", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/Set";
  var isObject = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils").isObject;
  var Map = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Map").Map;
  var getOwnHashObject = $traceurRuntime.getOwnHashObject;
  var $hasOwnProperty = Object.prototype.hasOwnProperty;
  function initSet(set) {
    set.map_ = new Map();
  }
  var Set = function Set() {
    var iterable = arguments[0];
    if (!isObject(this))
      throw new TypeError('Set called on incompatible type');
    if ($hasOwnProperty.call(this, 'map_')) {
      throw new TypeError('Set can not be reentrantly initialised');
    }
    initSet(this);
    if (iterable !== null && iterable !== undefined) {
      for (var $__25 = iterable[Symbol.iterator](),
          $__26; !($__26 = $__25.next()).done; ) {
        var item = $__26.value;
        {
          this.add(item);
        }
      }
    }
  };
  ($traceurRuntime.createClass)(Set, {
    get size() {
      return this.map_.size;
    },
    has: function(key) {
      return this.map_.has(key);
    },
    add: function(key) {
      return this.map_.set(key, key);
    },
    delete: function(key) {
      return this.map_.delete(key);
    },
    clear: function() {
      return this.map_.clear();
    },
    forEach: function(callbackFn) {
      var thisArg = arguments[1];
      var $__23 = this;
      return this.map_.forEach((function(value, key) {
        callbackFn.call(thisArg, key, key, $__23);
      }));
    },
    values: $traceurRuntime.initGeneratorFunction(function $__27() {
      var $__28,
          $__29;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__28 = this.map_.keys()[Symbol.iterator]();
              $ctx.sent = void 0;
              $ctx.action = 'next';
              $ctx.state = 12;
              break;
            case 12:
              $__29 = $__28[$ctx.action]($ctx.sentIgnoreThrow);
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = ($__29.done) ? 3 : 2;
              break;
            case 3:
              $ctx.sent = $__29.value;
              $ctx.state = -2;
              break;
            case 2:
              $ctx.state = 12;
              return $__29.value;
            default:
              return $ctx.end();
          }
      }, $__27, this);
    }),
    entries: $traceurRuntime.initGeneratorFunction(function $__30() {
      var $__31,
          $__32;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__31 = this.map_.entries()[Symbol.iterator]();
              $ctx.sent = void 0;
              $ctx.action = 'next';
              $ctx.state = 12;
              break;
            case 12:
              $__32 = $__31[$ctx.action]($ctx.sentIgnoreThrow);
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = ($__32.done) ? 3 : 2;
              break;
            case 3:
              $ctx.sent = $__32.value;
              $ctx.state = -2;
              break;
            case 2:
              $ctx.state = 12;
              return $__32.value;
            default:
              return $ctx.end();
          }
      }, $__30, this);
    })
  }, {});
  Object.defineProperty(Set.prototype, Symbol.iterator, {
    configurable: true,
    writable: true,
    value: Set.prototype.values
  });
  Object.defineProperty(Set.prototype, 'keys', {
    configurable: true,
    writable: true,
    value: Set.prototype.values
  });
  return {get Set() {
      return Set;
    }};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/StringIterator", [], function() {
  "use strict";
  var $__35;
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/StringIterator";
  var $__33 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/utils"),
      createIteratorResultObject = $__33.createIteratorResultObject,
      isObject = $__33.isObject;
  var $__36 = $traceurRuntime.assertObject($traceurRuntime),
      hasOwnProperty = $__36.hasOwnProperty,
      toProperty = $__36.toProperty;
  var iteratedString = Symbol('iteratedString');
  var stringIteratorNextIndex = Symbol('stringIteratorNextIndex');
  var StringIterator = function StringIterator() {};
  ($traceurRuntime.createClass)(StringIterator, ($__35 = {}, Object.defineProperty($__35, "next", {
    value: function() {
      var o = this;
      if (!isObject(o) || !hasOwnProperty(o, iteratedString)) {
        throw new TypeError('this must be a StringIterator object');
      }
      var s = o[toProperty(iteratedString)];
      if (s === undefined) {
        return createIteratorResultObject(undefined, true);
      }
      var position = o[toProperty(stringIteratorNextIndex)];
      var len = s.length;
      if (position >= len) {
        o[toProperty(iteratedString)] = undefined;
        return createIteratorResultObject(undefined, true);
      }
      var first = s.charCodeAt(position);
      var resultString;
      if (first < 0xD800 || first > 0xDBFF || position + 1 === len) {
        resultString = String.fromCharCode(first);
      } else {
        var second = s.charCodeAt(position + 1);
        if (second < 0xDC00 || second > 0xDFFF) {
          resultString = String.fromCharCode(first);
        } else {
          resultString = String.fromCharCode(first) + String.fromCharCode(second);
        }
      }
      o[toProperty(stringIteratorNextIndex)] = position + resultString.length;
      return createIteratorResultObject(resultString, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__35, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__35), {});
  function createStringIterator(string) {
    var s = String(string);
    var iterator = Object.create(StringIterator.prototype);
    iterator[toProperty(iteratedString)] = s;
    iterator[toProperty(stringIteratorNextIndex)] = 0;
    return iterator;
  }
  return {get createStringIterator() {
      return createStringIterator;
    }};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/String", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/String";
  var createStringIterator = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/StringIterator").createStringIterator;
  var $toString = Object.prototype.toString;
  var $indexOf = String.prototype.indexOf;
  var $lastIndexOf = String.prototype.lastIndexOf;
  function startsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) == start;
  }
  function endsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var pos = stringLength;
    if (arguments.length > 1) {
      var position = arguments[1];
      if (position !== undefined) {
        pos = position ? Number(position) : 0;
        if (isNaN(pos)) {
          pos = 0;
        }
      }
    }
    var end = Math.min(Math.max(pos, 0), stringLength);
    var start = end - searchLength;
    if (start < 0) {
      return false;
    }
    return $lastIndexOf.call(string, searchString, start) == start;
  }
  function contains(search) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) != -1;
  }
  function repeat(count) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var n = count ? Number(count) : 0;
    if (isNaN(n)) {
      n = 0;
    }
    if (n < 0 || n == Infinity) {
      throw RangeError();
    }
    if (n == 0) {
      return '';
    }
    var result = '';
    while (n--) {
      result += string;
    }
    return result;
  }
  function codePointAt(position) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var size = string.length;
    var index = position ? Number(position) : 0;
    if (isNaN(index)) {
      index = 0;
    }
    if (index < 0 || index >= size) {
      return undefined;
    }
    var first = string.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  }
  function raw(callsite) {
    var raw = callsite.raw;
    var len = raw.length >>> 0;
    if (len === 0)
      return '';
    var s = '';
    var i = 0;
    while (true) {
      s += raw[i];
      if (i + 1 === len)
        return s;
      s += arguments[++i];
    }
  }
  function fromCodePoint() {
    var codeUnits = [];
    var floor = Math.floor;
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
    }
    return String.fromCharCode.apply(null, codeUnits);
  }
  function stringPrototypeIterator() {
    var o = $traceurRuntime.checkObjectCoercible(this);
    var s = String(o);
    return createStringIterator(s);
  }
  return {
    get startsWith() {
      return startsWith;
    },
    get endsWith() {
      return endsWith;
    },
    get contains() {
      return contains;
    },
    get repeat() {
      return repeat;
    },
    get codePointAt() {
      return codePointAt;
    },
    get raw() {
      return raw;
    },
    get fromCodePoint() {
      return fromCodePoint;
    },
    get stringPrototypeIterator() {
      return stringPrototypeIterator;
    }
  };
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfills/polyfills", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfills/polyfills";
  var Map = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Map").Map;
  var Set = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Set").Set;
  var Promise = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Promise").Promise;
  var $__41 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/String"),
      codePointAt = $__41.codePointAt,
      contains = $__41.contains,
      endsWith = $__41.endsWith,
      fromCodePoint = $__41.fromCodePoint,
      repeat = $__41.repeat,
      raw = $__41.raw,
      startsWith = $__41.startsWith,
      stringPrototypeIterator = $__41.stringPrototypeIterator;
  var $__42 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Array"),
      fill = $__42.fill,
      find = $__42.find,
      findIndex = $__42.findIndex,
      from = $__42.from;
  var $__43 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/ArrayIterator"),
      entries = $__43.entries,
      keys = $__43.keys,
      values = $__43.values;
  var $__44 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Object"),
      assign = $__44.assign,
      is = $__44.is,
      mixin = $__44.mixin;
  var $__45 = System.get("traceur-runtime@0.0.55/src/runtime/polyfills/Number"),
      MAX_SAFE_INTEGER = $__45.MAX_SAFE_INTEGER,
      MIN_SAFE_INTEGER = $__45.MIN_SAFE_INTEGER,
      EPSILON = $__45.EPSILON,
      isFinite = $__45.isFinite,
      isInteger = $__45.isInteger,
      isNaN = $__45.isNaN,
      isSafeInteger = $__45.isSafeInteger;
  var getPrototypeOf = $traceurRuntime.assertObject(Object).getPrototypeOf;
  function maybeDefine(object, name, descr) {
    if (!(name in object)) {
      Object.defineProperty(object, name, descr);
    }
  }
  function maybeDefineMethod(object, name, value) {
    maybeDefine(object, name, {
      value: value,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  function maybeDefineConst(object, name, value) {
    maybeDefine(object, name, {
      value: value,
      configurable: false,
      enumerable: false,
      writable: false
    });
  }
  function maybeAddFunctions(object, functions) {
    for (var i = 0; i < functions.length; i += 2) {
      var name = functions[i];
      var value = functions[i + 1];
      maybeDefineMethod(object, name, value);
    }
  }
  function maybeAddConsts(object, consts) {
    for (var i = 0; i < consts.length; i += 2) {
      var name = consts[i];
      var value = consts[i + 1];
      maybeDefineConst(object, name, value);
    }
  }
  function maybeAddIterator(object, func, Symbol) {
    if (!Symbol || !Symbol.iterator || object[Symbol.iterator])
      return;
    if (object['@@iterator'])
      func = object['@@iterator'];
    Object.defineProperty(object, Symbol.iterator, {
      value: func,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  function polyfillPromise(global) {
    if (!global.Promise)
      global.Promise = Promise;
  }
  function polyfillCollections(global, Symbol) {
    if (!global.Map)
      global.Map = Map;
    var mapPrototype = global.Map.prototype;
    if (mapPrototype.entries) {
      maybeAddIterator(mapPrototype, mapPrototype.entries, Symbol);
      maybeAddIterator(getPrototypeOf(new global.Map().entries()), function() {
        return this;
      }, Symbol);
    }
    if (!global.Set)
      global.Set = Set;
    var setPrototype = global.Set.prototype;
    if (setPrototype.values) {
      maybeAddIterator(setPrototype, setPrototype.values, Symbol);
      maybeAddIterator(getPrototypeOf(new global.Set().values()), function() {
        return this;
      }, Symbol);
    }
  }
  function polyfillString(String) {
    maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'contains', contains, 'endsWith', endsWith, 'startsWith', startsWith, 'repeat', repeat]);
    maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
    maybeAddIterator(String.prototype, stringPrototypeIterator, Symbol);
  }
  function polyfillArray(Array, Symbol) {
    maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values, 'fill', fill, 'find', find, 'findIndex', findIndex]);
    maybeAddFunctions(Array, ['from', from]);
    maybeAddIterator(Array.prototype, values, Symbol);
    maybeAddIterator(getPrototypeOf([].values()), function() {
      return this;
    }, Symbol);
  }
  function polyfillObject(Object) {
    maybeAddFunctions(Object, ['assign', assign, 'is', is, 'mixin', mixin]);
  }
  function polyfillNumber(Number) {
    maybeAddConsts(Number, ['MAX_SAFE_INTEGER', MAX_SAFE_INTEGER, 'MIN_SAFE_INTEGER', MIN_SAFE_INTEGER, 'EPSILON', EPSILON]);
    maybeAddFunctions(Number, ['isFinite', isFinite, 'isInteger', isInteger, 'isNaN', isNaN, 'isSafeInteger', isSafeInteger]);
  }
  function polyfill(global) {
    polyfillPromise(global);
    polyfillCollections(global, global.Symbol);
    polyfillString(global.String);
    polyfillArray(global.Array, global.Symbol);
    polyfillObject(global.Object);
    polyfillNumber(global.Number);
  }
  polyfill(this);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
    polyfill(global);
  };
  return {};
});
System.register("traceur-runtime@0.0.55/src/runtime/polyfill-import", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.55/src/runtime/polyfill-import";
  System.get("traceur-runtime@0.0.55/src/runtime/polyfills/polyfills");
  return {};
});
System.get("traceur-runtime@0.0.55/src/runtime/polyfill-import" + '');

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}],"chesslib":[function(require,module,exports){
"use strict";
Object.defineProperties(exports, {
  brands: {get: function() {
      return brands;
    }},
  util: {get: function() {
      return util;
    }},
  Algebraic: {get: function() {
      return $__algebraic__.Algebraic;
    }},
  Board: {get: function() {
      return $__board__.Board;
    }},
  Position: {get: function() {
      return $__position__.Position;
    }},
  Point: {get: function() {
      return $__point__.Point;
    }},
  Line: {get: function() {
      return $__line__.Line;
    }},
  Game: {get: function() {
      return $__game__.Game;
    }},
  FEN: {get: function() {
      return $__fen__.FEN;
    }},
  PGN: {get: function() {
      return $__pgn__.PGN;
    }},
  Rider: {get: function() {
      return $__rider__.Rider;
    }},
  Leaper: {get: function() {
      return $__leaper__.Leaper;
    }},
  King: {get: function() {
      return $__standard__.King;
    }},
  Queen: {get: function() {
      return $__standard__.Queen;
    }},
  Rook: {get: function() {
      return $__standard__.Rook;
    }},
  Bishop: {get: function() {
      return $__standard__.Bishop;
    }},
  Knight: {get: function() {
      return $__standard__.Knight;
    }},
  Pawn: {get: function() {
      return $__standard__.Pawn;
    }},
  fischerandom: {get: function() {
      return $__fischerandom__.fischerandom;
    }},
  doubleFischerandom: {get: function() {
      return $__fischerandom__.doubleFischerandom;
    }},
  ninesixty: {get: function() {
      return $__fischerandom__.ninesixty;
    }},
  ChessError: {get: function() {
      return $__error__.ChessError;
    }},
  MobilityError: {get: function() {
      return $__error__.MobilityError;
    }},
  CheckError: {get: function() {
      return $__error__.CheckError;
    }},
  PromotionError: {get: function() {
      return $__error__.PromotionError;
    }},
  ResultError: {get: function() {
      return $__error__.ResultError;
    }},
  AmbiguityError: {get: function() {
      return $__error__.AmbiguityError;
    }},
  __esModule: {value: true}
});
require('traceur/bin/traceur-runtime.js');
var brands = require('./brands');
var util = require('./util');
var $__algebraic__ = require('./algebraic');
var $__board__ = require('./board');
var $__position__ = require('./position');
var $__point__ = require('./point');
var $__line__ = require('./line');
var $__game__ = require('./game');
var $__fen__ = require('./fen');
var $__pgn__ = require('./pgn');
var $__rider__ = require('./rider');
var $__leaper__ = require('./leaper');
var $__standard__ = require('./standard');
var $__fischerandom__ = require('./fischerandom');
var $__error__ = require('./error');

},{"./algebraic":2,"./board":3,"./brands":4,"./error":7,"./fen":8,"./fischerandom":9,"./game":10,"./leaper":12,"./line":13,"./pgn":16,"./point":18,"./position":19,"./rider":21,"./standard":23,"./util":24,"traceur/bin/traceur-runtime.js":64}]},{},[]);
