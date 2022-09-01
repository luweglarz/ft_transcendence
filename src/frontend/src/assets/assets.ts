// List assets as relative paths
const _assets = {
  defaultAvatar: './images/default-avatar.png',
};

// Make paths absolute
let key: keyof typeof _assets;
for (key in _assets) _assets[key] = '/assets' + _assets[key].substring(1);

export const assets = _assets;
