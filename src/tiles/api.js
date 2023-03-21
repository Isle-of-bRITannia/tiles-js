import {Alg} from './algebra.js';
import {pipe} from './utility/index.js';

const API = {
  clockwise: (tile) => Alg.cw(tile),
  counterclockwise: (tile) => pipe(
    API.clockwise, API.clockwise, API.clockwise
  )(tile),
  flipHorizontal: (tile) => Alg.flipH(tile),
  flipVertical: (tile) => pipe(
    API.clockwise, API.flipHorizontal, API.counterclockwise
  )(tile),
  beside: (...tiles) => (
    API.counterclockwise(API.above(...tiles.map(API.clockwise))) 
  ),
  above: (...tiles) => Alg.above(...tiles),
  quad: (upLeftTile, upRightTile, downLeftTile, downRightTile) => (
    API.above(
      API.beside(upLeftTile, upRightTile),
      API.beside(downLeftTile, downRightTile)
    )
  ),
  swirl: (tile) => (
    API.quad(
      tile, 
      API.clockwise(tile),
      API.counterclockwise(tile), 
      API.clockwise(API.clockwise(tile))
    )
  ),
  behind: (appendOp) => (backTile, frontTile) => (
    API.ap(API.map((a) => (b) => appendOp(a, b))
                  (frontTile))
          (backTile)
  ),
  map: (f) => (tile) => (
    API.ap(API.pure(f))(tile)
  ),
  pure: (value) => Alg.pure(value),
  ap: (functionTile) => (domainTile) => (
    Alg.ap(functionTile, domainTile)
  ),
  fromImage: (img) => (
    Alg.fromImage(img)
  )
};

export {
  API as Tile
}