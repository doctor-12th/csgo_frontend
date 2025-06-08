import type { App } from 'vue'

import { installSvgIcon } from './svg-icon'
import { installElementPlusIcons } from './element-plus-icons'

export function installPlugins(app: App) {
  installSvgIcon(app)
  installElementPlusIcons(app)
}