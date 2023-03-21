const Alg = {
  cw: (tile) => ({
    _tag: 'Cw',
    tile
  }),
  flipH: (tile) => ({
    _tag: 'FlipH',
    tile
  }),
  above: (...tiles) => ({
    _tag: 'Above',
    tiles
  }),
  pure: (value) => ({
    _tag: 'Pure',
    value
  }),
  ap: (functionTile, domainTile) => ({
    _tag: 'Ap',
    functionTile,
    domainTile
  }),

  // Unfortunate but (as far as I can currently tell) somewhat necessary.
  fromImage: (img) => {
    return {
      _tag: 'FromImage',
      img
    };
  }
};

export {
  Alg
};