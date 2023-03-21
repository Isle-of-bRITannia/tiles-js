import { pipe, match } from '../utility/index.js';
import { Alg } from "../algebra.js";

const repeat = (n) => (val) => Array(n).fill(val);
const transpose = (arr2d) => arr2d[0].map((_, colIndex) => arr2d.map(row => row[colIndex]));
const reverse = (arr) => [...arr].reverse();
const rotate = (arr2d) => transpose(arr2d).map(reverse);
const map = (f) => (arr) => arr.map(f);
const splitEvery = (n) => (arr) => {
  return repeat(Math.ceil(arr.length / n))(null)
    .map((_, i) =>  arr.slice(i * n, i * n + n));
};


const rasterize =
  ({width, height}) => match({
    Cw   : ({tile}) => {
      return pipe(
        rasterize({width: height, height: width}),
        rotate
      )(tile);
    },
    FlipH: ({tile}) => {
      return pipe(
        rasterize({width: height, height: width}),
        map(reverse)
      )(tile);
    },
    Above: ({tiles}) => {
      if (tiles.length === 0) throw new Error('Yeah nah you can\'t pass nothing to Above');
      if (tiles.length === 1) return rasterize({width, height})(tiles[0]);

      if (height >= tiles.length) {
        const h = Math.floor(height / tiles.length);
        return [
          ...rasterize({width, height: h})(tiles[0]),
          ...rasterize({width, height: height - h})(Alg.above(...tiles.slice(1)))
        ];
      }
                         
      const zSpan = tiles.length / height;
      return rasterize({width, height})(
        Alg.above(
          ...Array(height).fill(null).map((_, i) => tiles[Math.floor(i * zSpan)])
        )
      );
    },
    Pure : ({value}) => {
      return pipe(
        repeat(width), repeat(height)
      )(value);
    },
    Ap   : ({functionTile, domainTile}) => {
      const functionRaster = rasterize({width, height})(functionTile);
      const domainRaster = rasterize({width, height})(domainTile);
      
      return functionRaster.map((row, i) => row.map((f, j) => f(domainRaster[i][j])));
    },
    FromImage: ({img}) => {
      let imgCanvas = document.createElement('canvas');
      imgCanvas.width = width;
      imgCanvas.height = height;
      let ctx = imgCanvas.getContext('2d');
      
      ctx.drawImage(img, 0, 0, width, height);

      const data = ctx.getImageData(0, 0, width, height).data;

      let matrix = splitEvery(4)([...data])
        .map(([r, g, b, a]) => `rgba(${r}, ${g}, ${b}, ${a / 255})`)
        .reduce(({matrix, row}, rgba) => {
          return row.length === width - 1
            ? {matrix: [...matrix, [...row, rgba]], row: []}
            : {matrix: matrix, row: [...row, rgba]};
        }, {matrix: [], row: []})
        .matrix;
                            
      return matrix;
    }
  });

export {rasterize};