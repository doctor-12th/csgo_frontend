import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import UnoCSS from 'unocss/vite'
import SvgComponent from "unplugin-svg-component/vite"
import svgLoader from "vite-svg-loader"

const pathSrc = path.resolve(__dirname, './src')
// https://vite.dev/config/
export default ({ mode }: ConfigEnv):UserConfig =>{
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      UnoCSS({}),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({}),
        ],
        vueTemplate: true,

        imports: ['vue', 'vue-router','pinia'],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          // globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        dts: path.resolve(pathSrc,"types",'auto-imports.d.ts')
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ['ep']
          })
        ],
        dts: path.resolve(pathSrc,"types",'components.d.ts')
      }),
      Icons({
        autoInstall: true,
        compiler: 'vue3',
      }),
      svgLoader({
        defaultImport: "url",
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  // @see https://github.com/svg/svgo/issues/1128
                  removeViewBox: false
                }
              }
            }
          ]
        }
      }),
      // 自动生成 SvgIcon 组件和 SVG 雪碧图
      SvgComponent({
        iconDir: [path.resolve(__dirname, "src/common/assets/icons")],
        preserveColor: path.resolve(__dirname, "src/common/assets/icons/preserve-color"),
        dts: true,
        dtsDir: path.resolve(pathSrc,"types")
      }),
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: pathSrc
        }
      ]
    },
    server: {
      [env.VITE_APP_BASE_URL]: {
        target: env.VITE_APP_BASE_URL,
        changeOrigin: true,
        rewrite: (path:string) => 
          path.replace(new RegExp(`^${env.VITE_APP_BASE_URL}`), '')
      }
    }

  }
}
