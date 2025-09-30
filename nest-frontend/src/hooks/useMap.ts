// useMap.ts
import { Loader } from '@googlemaps/js-api-loader'
import { ElMessage } from 'element-plus'
import { onMounted, onUnmounted, ref } from 'vue'

export const useMap = ({ domId }: { domId?: string } = {}) => {
  const google = ref<any>(null)
  const map = ref<any>(null)

  async function initMap() {
    try {
      const loader = new Loader({
        apiKey: 'AIzaSyDw4TWTpoLUzygyg_5LJUC8V7JjgIxKOV0', // 替换为你的 Google Maps API Key
        version: 'weekly',
        libraries: ['places'], // 加载 Places 库
        language: 'en', // <-- 显式指定语言为英文
        region: 'AU', // 可选。如果想让地址更偏向澳大利亚，也可以加上 region
      })
      google.value = await loader.load()
      if (domId) {
        // 设定一个默认中心点和缩放级别，根据需求调整
        map.value = new google.value.maps.Map(document.getElementById(domId), {
          center: { lat: 39.9042, lng: 116.4074 }, // 示例：北京
          zoom: 10,
        })
      }
    } catch (error) {
      console.error(error)
      ElMessage.error((error as any)?.message || 'Has Error')
    }
  }

  function destroyMap() {
    // Google Maps 没有直接的 destroy 方法，直接将 map 置空
    map.value = null
  }

  onMounted(() => {
    initMap()
  })
  onUnmounted(() => {
    destroyMap()
  })

  return {
    map,
    google,
  }
}
