import type { App } from 'vue'
import SvgIcon from '~virtual/svg-component' // svg component

export function installSvgIcon(app: App) {
  app.component('SvgIcon', SvgIcon)
}