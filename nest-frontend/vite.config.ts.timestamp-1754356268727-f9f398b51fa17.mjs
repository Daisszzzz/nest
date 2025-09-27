// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/lenovo/Desktop/ANU%2025%20S1/COMP8715/%E5%89%8D%E7%AB%AF%E4%BB%A3%E7%A0%81/front_end/rentHouseAdmin/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/lenovo/Desktop/ANU%2025%20S1/COMP8715/%E5%89%8D%E7%AB%AF%E4%BB%A3%E7%A0%81/front_end/rentHouseAdmin/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { viteMockServe } from "file:///C:/Users/lenovo/Desktop/ANU%2025%20S1/COMP8715/%E5%89%8D%E7%AB%AF%E4%BB%A3%E7%A0%81/front_end/rentHouseAdmin/node_modules/vite-plugin-mock/dist/index.js";
import { createSvgIconsPlugin } from "file:///C:/Users/lenovo/Desktop/ANU%2025%20S1/COMP8715/%E5%89%8D%E7%AB%AF%E4%BB%A3%E7%A0%81/front_end/rentHouseAdmin/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import VueSetupExtend from "file:///C:/Users/lenovo/Desktop/ANU%2025%20S1/COMP8715/%E5%89%8D%E7%AB%AF%E4%BB%A3%E7%A0%81/front_end/rentHouseAdmin/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import vueJsx from "file:///C:/Users/lenovo/Desktop/ANU%2025%20S1/COMP8715/%E5%89%8D%E7%AB%AF%E4%BB%A3%E7%A0%81/front_end/rentHouseAdmin/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import svgLoader from "file:///C:/Users/lenovo/Desktop/ANU%2025%20S1/COMP8715/%E5%89%8D%E7%AB%AF%E4%BB%A3%E7%A0%81/front_end/rentHouseAdmin/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_dirname = "C:\\Users\\lenovo\\Desktop\\ANU 25 S1\\COMP8715\\\u524D\u7AEF\u4EE3\u7801\\front_end\\rentHouseAdmin";
var vite_config_default = defineConfig((config) => {
  const { command, mode } = config;
  const env = loadEnv(mode, process.cwd());
  return {
    base: "/",
    plugins: [
      vue(),
      viteMockServe({
        // 只在开发阶段开启 mock 服务,mock和后端服务器接口能共存，可以通过配置来区分
        localEnabled: command === "serve"
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      // * vite 可以使用 jsx/tsx 语法
      vueJsx(),
      // * name 可以写在 script 标签上
      VueSetupExtend(),
      // * vite-svg-loader支持，可以直接引入svg图标当作组件使用
      svgLoader()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "src")
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";'
        }
      }
    },
    server: {
      host: "localhost",
      proxy: {
        "/admin": {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxsZW5vdm9cXFxcRGVza3RvcFxcXFxBTlUgMjUgUzFcXFxcQ09NUDg3MTVcXFxcXHU1MjREXHU3QUVGXHU0RUUzXHU3ODAxXFxcXGZyb250X2VuZFxcXFxyZW50SG91c2VBZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbGVub3ZvXFxcXERlc2t0b3BcXFxcQU5VIDI1IFMxXFxcXENPTVA4NzE1XFxcXFx1NTI0RFx1N0FFRlx1NEVFM1x1NzgwMVxcXFxmcm9udF9lbmRcXFxccmVudEhvdXNlQWRtaW5cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2xlbm92by9EZXNrdG9wL0FOVSUyMDI1JTIwUzEvQ09NUDg3MTUvJUU1JTg5JThEJUU3JUFCJUFGJUU0JUJCJUEzJUU3JUEwJTgxL2Zyb250X2VuZC9yZW50SG91c2VBZG1pbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyB2aXRlTW9ja1NlcnZlIH0gZnJvbSAndml0ZS1wbHVnaW4tbW9jaydcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJ1xuaW1wb3J0IFZ1ZVNldHVwRXh0ZW5kIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1zZXR1cC1leHRlbmQnXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKChjb25maWcpID0+IHtcbiAgY29uc3QgeyBjb21tYW5kLCBtb2RlIH0gPSBjb25maWdcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxuXG4gIHJldHVybiB7XG4gICAgYmFzZTogJy8nLFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgICAgdml0ZU1vY2tTZXJ2ZSh7XG4gICAgICAgIC8vIFx1NTNFQVx1NTcyOFx1NUYwMFx1NTNEMVx1OTYzNlx1NkJCNVx1NUYwMFx1NTQyRiBtb2NrIFx1NjcwRFx1NTJBMSxtb2NrXHU1NDhDXHU1NDBFXHU3QUVGXHU2NzBEXHU1MkExXHU1NjY4XHU2M0E1XHU1M0UzXHU4MEZEXHU1MTcxXHU1QjU4XHVGRjBDXHU1M0VGXHU0RUU1XHU5MDFBXHU4RkM3XHU5MTREXHU3RjZFXHU2NzY1XHU1MzNBXHU1MjA2XG4gICAgICAgIGxvY2FsRW5hYmxlZDogY29tbWFuZCA9PT0gJ3NlcnZlJyxcbiAgICAgIH0pLFxuICAgICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgICAgICBpY29uRGlyczogW3BhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjL2Fzc2V0cy9pY29ucycpXSxcbiAgICAgICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXScsXG4gICAgICB9KSxcbiAgICAgIC8vICogdml0ZSBcdTUzRUZcdTRFRTVcdTRGN0ZcdTc1MjgganN4L3RzeCBcdThCRURcdTZDRDVcbiAgICAgIHZ1ZUpzeCgpLFxuICAgICAgLy8gKiBuYW1lIFx1NTNFRlx1NEVFNVx1NTE5OVx1NTcyOCBzY3JpcHQgXHU2ODA3XHU3QjdFXHU0RTBBXG4gICAgICBWdWVTZXR1cEV4dGVuZCgpLFxuICAgICAgLy8gKiB2aXRlLXN2Zy1sb2FkZXJcdTY1MkZcdTYzMDFcdUZGMENcdTUzRUZcdTRFRTVcdTc2RjRcdTYzQTVcdTVGMTVcdTUxNjVzdmdcdTU2RkVcdTY4MDdcdTVGNTNcdTRGNUNcdTdFQzRcdTRFRjZcdTRGN0ZcdTc1MjhcbiAgICAgIHN2Z0xvYWRlcigpLFxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogJ0BpbXBvcnQgXCIuL3NyYy9zdHlsZXMvdmFyaWFibGUuc2Nzc1wiOycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiAnbG9jYWxob3N0JyxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYWRtaW4nOiB7XG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUFBfQkFTRV9VUkwsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnYyxTQUFTLGNBQWMsZUFBZTtBQUN0ZSxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGVBQWU7QUFQdEIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsV0FBVztBQUN0QyxRQUFNLEVBQUUsU0FBUyxLQUFLLElBQUk7QUFDMUIsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUV2QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixjQUFjO0FBQUE7QUFBQSxRQUVaLGNBQWMsWUFBWTtBQUFBLE1BQzVCLENBQUM7QUFBQSxNQUNELHFCQUFxQjtBQUFBLFFBQ25CLFVBQVUsQ0FBQyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUcsa0JBQWtCLENBQUM7QUFBQSxRQUMxRCxVQUFVO0FBQUEsTUFDWixDQUFDO0FBQUE7QUFBQSxNQUVELE9BQU87QUFBQTtBQUFBLE1BRVAsZUFBZTtBQUFBO0FBQUEsTUFFZixVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLE1BQ3BDO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osbUJBQW1CO0FBQUEsVUFDbkIsZ0JBQWdCO0FBQUEsUUFDbEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsVUFBVTtBQUFBLFVBQ1IsUUFBUSxJQUFJO0FBQUEsVUFDWixjQUFjO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
