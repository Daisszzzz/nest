<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ formData.id ? 'Edit Apartment ' : 'Add Apartment' }}Apartment</span>
      </div>
    </template>
    <el-form
      ref="apartmentFormRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      style="max-width: 660px"
      status-icon
    >
      <el-form-item label="Apartment Name" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="Apartment Description" prop="introduction">
        <el-input type="textarea" v-model="formData.introduction" />
      </el-form-item>
      <el-form-item label="Location" required>
        <div class="flex-center">
          <el-form-item prop="provinceId">
            <el-select
              v-model="formData.provinceId"
              placeholder="Select Province"
              clearable
              @change="provinceChangeCallback"
              @clear="provinceClearCallback"
            >
              <el-option
                v-for="item in areaInfo.provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="cityId">
            <el-select
              v-model="formData.cityId"
              placeholder="	Select City"
              clearable
              @change="cityChangeCallback"
              @clear="cityClearCallback"
            >
              <el-option
                v-for="item in areaInfo.cityList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="districtId">
            <el-select
              v-model="formData.districtId"
              placeholder="	Select District"
              clearable
              @change="districtChangeCallback"
              @clear="districtClearCallback"
            >
              <el-option
                v-for="item in areaInfo.districtList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="Detailed Address" prop="addressDetail">
        <el-select
          v-model="formData.addressDetail"
          filterable
          remote
          clearable
          placeholder="	Enter detailed address to search"
          :remote-method="remoteMethod"
          style="width: 100%"
          @change="addressDetailChangeCallback"
        >
          <el-option
            v-for="item in addressDetailOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Front Desk Phone" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item label="	Publish Status" prop="isRelease">
        <el-radio-group v-model="formData.isRelease" class="ml-4">
          <el-radio :label="ApartmentReleaseStatus.NOT_RELEASED">
            {{
              getLabelByValue(
                ApartmentReleaseStatusMap,
                ApartmentReleaseStatus.NOT_RELEASED,
              )
            }}
          </el-radio>
          <el-radio :label="ApartmentReleaseStatus.RELEASED">
            {{
              getLabelByValue(
                ApartmentReleaseStatusMap,
                ApartmentReleaseStatus.RELEASED,
              )
            }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Apartment Facilities" prop="facilityInfoIds">
        <el-select
          style="width: 100%"
          v-model="formData.facilityInfoIds"
          placeholder="Select Apartment Facilities"
          multiple
          clearable
        >
          <el-option
            v-for="item in facilityInfoList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Apartment Tags" prop="labelIds">
        <el-select
          style="width: 100%"
          v-model="formData.labelIds"
          placeholder="Select Apartment Tags"
          multiple
          clearable
        >
          <el-option
            v-for="item in labelInfoList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Apartment Fees" prop="feeValueIds">
        <el-tree-select
          style="width: 100%"
          v-model="formData.feeValueIds"
          placeholder="Select Apartment Fees"
          :data="feeInfoList"
          multiple
          clearable
          node-key="value"
          :render-after-expand="false"
          @node-click="feeNodeClickHandle"
        ></el-tree-select>
      </el-form-item>
      <el-form-item label="Images" prop="graphVoList">
        <upload-img
          v-model:file-list="formData.graphVoList"
          :on-success="uploadSuccessHandle"
          list-type="picture-card"
          :limit="5"
        ></upload-img>
      </el-form-item>
    </el-form>
    <div class="flex-center m-t-20">
      <el-button style="width: 150px" type="info" @click="router.back()">
        取消
      </el-button>
      <el-button style="width: 150px" type="primary" @click="submitHandle">
        {{ formData.id ? 'Save' : 'Create' }}
      </el-button>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { ElMessage, FormInstance, UploadFiles } from 'element-plus'
import {
  AddressOptionsInterface,
  ApartmentInterface,
  FacilityInfoInterface,
  LabelInfoInterface,
  RegionInterface,
} from '@/api/apartmentManagement/types'
import {
  ApartmentReleaseStatus,
  getLabelByValue,
  ApartmentReleaseStatusMap,
  BuildingType,
} from '@/enums/constEnums'
import {
  getApartmentById,
  getCityList,
  getDistrictList,
  getFacilityInfoList,
  getFeeInfoList,
  getLabelInfoList,
  getProvinceList,
  saveOrUpdateApartment,
} from '@/api/apartmentManagement'
import { useMap } from '@/hooks/useMap'
import { TreeData } from '@/api/apartmentManagement/types'
// import { ElTree } from 'element-plus/es/components/tree'
import { UploadFile } from 'element-plus/es/components/upload/src/upload'
import UploadImg from '@/components/uploadImg/uploadImg.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
//#region <表单相关>
// 	Form data
type FormDataInstance = Required<
  Omit<
    ApartmentInterface,
    | 'totalRoomCount'
    | 'freeRoomCount'
    | 'facilityInfoList'
    | 'labelInfoList'
    | 'feeValueVoList'
  >
>
const apartmentFormRef = ref<FormInstance>()
const formData = ref<FormDataInstance>({
  id: '',
  name: '',
  introduction: '',
  districtId: '',
  districtName: '',
  cityId: '',
  cityName: '',
  provinceId: '',
  provinceName: '',
  addressDetail: '',
  latitude: '',
  longitude: '',
  phone: '',
  isRelease: ApartmentReleaseStatus.NOT_RELEASED,
  facilityInfoIds: [],
  labelIds: [],
  feeValueIds: [],
  graphVoList: [
    // {
    //   name: 'food.jpeg',
    //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    // },
  ] as UploadFile[],
})
// 	Form validation rules
const rules = reactive({
  name: [{ required: true, message: 'Please enter the apartment name', trigger: 'blur' }],
  introduction: [
    { required: true, message: 'Please enter the apartment description', trigger: 'blur' },
  ],
  provinceId: [{ required: true, message: 'Please select a province', trigger: 'change' }],
  cityId: [{ required: true, message: 'Please select a city', trigger: 'change' }],
  districtId: [{ required: true, message: 'Please select a district', trigger: 'change' }],
  addressDetail: [
    { required: true, message: 'Please select a detailed address', trigger: 'change' },
  ],
  phone: [{ required: true, message: 'Please enter the front desk phone number', trigger: 'blur' }],
  graphVoList: [{ required: true, message: 'Please upload images', trigger: 'change' }],
})
//#region <Region-related data>
// 	Region-related data
const areaInfo = reactive({
  // Province Data
  provinceList: [] as RegionInterface[],
  // City Data
  cityList: [] as RegionInterface[],
  // District Data
  districtList: [] as RegionInterface[],
})
//#region <Address-related data>
// 	Fetch province list
async function getProvinceListHandle() {
  try {
    const { data } = await getProvinceList()
    areaInfo.provinceList = data
  } catch (error) {
    console.log(error)
  }
}

// 	Fetch city list
async function getCityListHandle(
  provinceId: number | string = formData.value.provinceId,
) {
  if (!provinceId) return
  try {
    const { data } = await getCityList(provinceId)
    areaInfo.cityList = data
  } catch (error) {
    console.log(error)
  }
}

// 	Fetch district list
async function getDistrictListHandle(
  cityId: number | string = formData.value.cityId,
) {
  if (!cityId) return
  try {
    const { data } = await getDistrictList(cityId)
    areaInfo.districtList = data
  } catch (error) {
    console.log(error)
  }
}

// 	Reset city data
function resetCity() {
  formData.value.cityId = ''
  areaInfo.cityList = []
}

// 	Reset district data
function resetDistrict() {
  formData.value.districtId = ''
  areaInfo.districtList = []
}

// 	Province selection change handler
const provinceChangeCallback = async () => {
  const provinceId = formData.value.provinceId
  if (provinceId) {
    // Also assign provinceName
    const pItem = areaInfo.provinceList.find((item) => item.id === provinceId)
    formData.value.provinceName = pItem ? pItem.name : ''

    // Reset and load cities
    resetCity()
    resetDistrict()
    await getCityListHandle(provinceId)
  }
}
// Province clear handler
const provinceClearCallback = () => {
  formData.value.provinceId = ''
  resetCity()
  resetDistrict()
}

// City selection change handler
const cityChangeCallback = async () => {
  const cityId = formData.value.cityId
  if (cityId) {
    const cItem = areaInfo.cityList.find((item) => item.id === cityId)
    formData.value.cityName = cItem ? cItem.name : ''
    resetDistrict()
    await getDistrictListHandle(cityId)
  }
}
// City clear handler
const cityClearCallback = () => {
  console.log('clear city')
  formData.value.cityId = ''
  resetDistrict()
}
// District selection change handler
const districtChangeCallback = async () => {
  const dItem = areaInfo.districtList.find(
    (item) => item.id === formData.value.districtId,
  )
  formData.value.districtName = dItem ? dItem.name : ''
}
// District clear handler
const districtClearCallback = () => {
  console.log('clear district')
  formData.value.districtId = ''
}
//#endregion
//#endregion

//#endregion
//#region Google Map / Address Suggestion
// 详细地址建议列表
const addressDetailOptions = ref<AddressOptionsInterface[]>([])

// Google map instance
const { map } = useMap()

// Autocomplete keyword suggestion method
function remoteMethod(keywords: string) {
  if (keywords.trim()) {

    const provinceName =
      areaInfo.provinceList.find(
        (item) => item.id === formData.value.provinceId,
      )?.name || ''
    const cityName =
      areaInfo.provinceList.find((item) => item.id === formData.value.cityId)
        ?.name || ''
    const districtName =
      areaInfo.districtList.find(
        (item) => item.id === formData.value.districtId,
      )?.name || ''

    // keywords = provinceName + districtName + keywords
    keywords = [provinceName, cityName, districtName, keywords]
      .filter(Boolean) 
      .join(' ') 


    const service = new google.maps.places.AutocompleteService()
    service.getPlacePredictions({ input: keywords }, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        addressDetailOptions.value = predictions.map((item: any) => ({
          label: item.description,
          value: item.place_id,
        }))
      } else {
        addressDetailOptions.value = []
      }
    })
  } else {
    addressDetailOptions.value = []
  }
}

// On address selection, get full details and coordinates
function addressDetailChangeCallback(value: string | number) {
  const targetObj = addressDetailOptions.value.find(
    (item: any) => item.value === value,
  )
  if (targetObj) {
    // 如果 map.value 为空，则创建一个虚拟容器
    const container = map.value || document.createElement('div')
    const service = new google.maps.places.PlacesService(container)
    service.getDetails(
      {
        placeId: targetObj.value,
        fields: ['geometry', 'formatted_address'],
      },
      (placeResult, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          placeResult
        ) {
          // 需要先判断 placeResult.geometry 是否存在
          if (placeResult.geometry && placeResult.geometry.location) {
            formData.value.latitude = placeResult.geometry.location.lat()
            formData.value.longitude = placeResult.geometry.location.lng()
          } else {
            console.warn('placeResult.geometry 不存在，无法获取经纬度')
          }
          // 将可读地址写回 formData.addressDetail
          formData.value.addressDetail = placeResult.formatted_address || ''
          console.log('formData after getDetails:', formData.value)
        } else {
          console.error('获取地址详情失败', status)
        }
      },
    )
  }
}

//#endregion
//#region Facilities / Tags / Fees data
// 配套信息
const facilityInfoList = ref<FacilityInfoInterface[]>([])
// 标签信息
const labelInfoList = ref<LabelInfoInterface[]>([])
// 杂费信息
const feeInfoList = ref<TreeData[]>([])
// const feeTreeSelectRef = ref<InstanceType<typeof ElTree>>()
// Fetch apartment facilities
async function getFacilityInfoListHandle() {
  try {
    const { data } = await getFacilityInfoList(BuildingType.APARTMENT)
    facilityInfoList.value = data
  } catch (error) {
    console.log(error)
  }
}


// Fetch apartment tags
async function getLabelInfoListHandle() {
  try {
    const { data } = await getLabelInfoList(BuildingType.APARTMENT)
    labelInfoList.value = data
  } catch (error) {
    console.log(error)
  }
}

// Fetch apartment fee structure
async function getFeeInfoListHandle() {
  try {
    const { data } = await getFeeInfoList()
    feeInfoList.value = data.map((item) => {
      return {
        value: item.id + item.name,
        label: item.name,
        children: item.feeValueList.map((child) => {
          return {
            value: child.id,
            label: `${child.name} ${child.unit}(${item.name})`,
            parentId: item.id + item.name,
          }
        }),
      }
    })
  } catch (error) {
    console.log(error)
  }
}


// Fee tree node selection handler
function feeNodeClickHandle(data: TreeData) {
  //   保证每个子节点只有一个被选中
  if (data.parentId) {
    //   收集当前父节点下所有的子节点列表
    const childrenList = feeInfoList.value
      .find((item) => item.value === data.parentId)
      ?.children?.map((item) => item.value)
    nextTick(() => {
      //   遍历feeValueIds节点，删除所有childrenList中的值
      formData.value.feeValueIds = formData.value.feeValueIds?.filter(
        (item) => !childrenList?.includes(item),
      )
      //   将当前节点的值添加到feeValueIds中
      formData.value.feeValueIds?.push(data.value as number)
    })
  }
}

//#endregion
// Image upload success callback
function uploadSuccessHandle(
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles,
) {
  formData.value.graphVoList = uploadFiles?.map((item) => {
    return {
      ...item,
      url: (item?.response as any)?.data || item.url,
    }
  })
}

// Fetch apartment details by ID
async function getApartmentInfoByIdHandle(id: number | string) {
  try {
    const { data } = await getApartmentById(id)

    data.facilityInfoIds = data.facilityInfoList?.map(
      (item) => item.id,
    ) as number[]
    delete data.facilityInfoList
    data.labelIds = data.labelInfoList?.map((item) => item.id) as number[]
    delete data.labelInfoList
    data.feeValueIds = data.feeValueVoList?.map((item) => item.id) as number[]
    delete data.feeValueVoList
    addressDetailOptions.value = [
      {
        label: data.addressDetail,
        value: data.addressDetail,
        location: {
          lng: data.longitude,
          lat: data.latitude,
        },
      },
    ]
    formData.value = data as FormDataInstance
    // Load city and district data if present

    console.log(formData.value.provinceId, formData.value.cityId)
    formData.value.provinceId && getCityListHandle(formData.value.provinceId)

    formData.value.cityId && getDistrictListHandle(formData.value.cityId)
  } catch (error) {
    console.log(error)
  }
}

// Add or update apartment info
async function addOrUpdateApartmentInfoHandle() {
  try {
    await saveOrUpdateApartment(formData.value)
    ElMessage.success('operate successfully')
    router.back()
  } catch (error) {
    console.log(error)
  }
}

// Submit handler
function submitHandle() {
  apartmentFormRef.value?.validate(async (valid) => {
    if (valid) {
      await addOrUpdateApartmentInfoHandle()
    } else {
      ElMessage.error('Form validation failed. Please check your input.')
      return false
    }
  })
}

onMounted(() => {

  getProvinceListHandle()

  getFacilityInfoListHandle()

  getLabelInfoListHandle()

  getFeeInfoListHandle()
  if (route.query?.id) {
    getApartmentInfoByIdHandle(route.query.id as string)
  }
})
</script>

<style scoped lang="scss">
.card-header {
  font-size: 18px;
  font-weight: bold;
}
</style>
