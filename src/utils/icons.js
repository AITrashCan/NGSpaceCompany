// Vite-compatible dynamic image loading
// Replaces webpack's require() for images

const interfaceIcons = import.meta.glob('../assets/interface/*.png', { eager: true })
const assetImages = import.meta.glob('../assets/*.png', { eager: true })

const iconCache = {}
for (const path in interfaceIcons) {
    const name = path.split('/').pop()
    iconCache[name] = interfaceIcons[path].default
}

const assetCache = {}
for (const path in assetImages) {
    const name = path.split('/').pop()
    assetCache[name] = assetImages[path].default
}

export function getIcon(name) {
    return iconCache[name] || ''
}

export function getAsset(name) {
    return assetCache[name] || ''
}
