<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ formData.id ? 'Edit' : 'Add' }} Room</span>
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
      <el-form-item label="Room Number" prop="roomNumber">
        <el-input v-model="formData.roomNumber" />
      </el-form-item>
      <el-form-item label="Rent (Yuan/Month)" prop="rent">
        <el-input-number v-model="formData.rent" :step="1" step-strictly />
      </el-form-item>
      <el-form-item label="Apartment" required>
        <div class="flex-center">
          <el-form-item prop="provinceId">
            <el-select
              v-model="areaInfo.provinceId"
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
              v-model="areaInfo.cityId"
              placeholder="Select City"
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
              v-model="areaInfo.districtId"
              placeholder="Select District"
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
          <el-form-item prop="apartmentId">
            <el-select
              v-model="areaInfo.apartmentId"
              placeholder="Select Apartment"
              clearable
              @change="apartmentChangeCallback"
              @clear="apartmentClearCallback"
            >
              <el-option
                v-for="item in areaInfo.apartmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="Published" prop="isRelease">
        <el-radio-group v-model="formData.isRelease" class="ml-4">
          <el-radio :label="RoomReleaseStatus.NOT_RELEASED">
            {{
              getLabelByValue(
                RoomReleaseStatusMap,
                RoomReleaseStatus.NOT_RELEASED,
              )
            }}
          </el-radio>
          <el-radio :label="RoomReleaseStatus.RELEASED">
            {{
              getLabelByValue(RoomReleaseStatusMap, RoomReleaseStatus.RELEASED)
            }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Room Attributes" prop="attrValueIds">
        <el-tree-select
          style="width: 100%"
          v-model="formData.attrValueIds"
          placeholder="Select Room Attributes"
          :data="attrInfoList"
          multiple
          clearable
          node-key="value"
          :render-after-expand="false"
          @node-click="attrNodeClickHandle"
        ></el-tree-select>
      </el-form-item>
      <el-form-item label="Room Facilities" prop="facilityInfoIds">
        <el-select
          style="width: 100%"
          v-model="formData.facilityInfoIds"
          placeholder="Select Room Facilities"
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
      <el-form-item label="Room Tags" prop="labelIds">
        <el-select
          style="width: 100%"
          v-model="formData.labelInfoIds"
          placeholder="Select Room Tags"
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
      <el-form-item label="Payment Methods" prop="paymentTypeIds">
        <el-select
          style="width: 100%"
          v-model="formData.paymentTypeIds"
          placeholder="Select Payment Methods"
          multiple
          clearable
        >
          <el-option
            v-for="item in paymentInfoList"
            :key="item.id"
            :label="`${item.name} (${item.additionalInfo})`"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Lease Terms" prop="leaseTermIds">
        <el-select
          style="width: 100%"
          v-model="formData.leaseTermIds"
          placeholder="Select Lease Terms"
          multiple
          clearable
        >
          <el-option
            v-for="item in leaseTermInfoList"
            :key="item.id"
            :label="`${item.monthCount}${item.unit}`"
            :value="item.id"
          ></el-option>
        </el-select>
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
        Cancel
      </el-button>
      <el-button style="width: 150px" type="primary" @click="submitHandle">
        {{ formData.id ? 'Save' : 'Add' }}
      </el-button>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, FormInstance, UploadFiles } from 'element-plus'
import {
  ApartmentInterface,
  FacilityInfoInterface,
  LabelInfoInterface,
  PaymentInfoInterface,
  RegionInterface,
  SaveRoomInterface,
  TermInfoInterface,
  TreeData,
} from '@/api/apartmentManagement/types'
import {
  getApartmentListByDistrictId,
  getAttrInfoList,
  getCityList,
  getDistrictList,
  getFacilityInfoList,
  getLabelInfoList,
  getPaymentList,
  getProvinceList,
  getRoomById,
  getTermList,
  saveOrUpdateRoom,
} from '@/api/apartmentManagement'
import { UploadFile } from 'element-plus/es/components/upload/src/upload'
import UploadImg from '@/components/uploadImg/uploadImg.vue'
import { useRoute, useRouter } from 'vue-router'
// import { ElTree } from 'element-plus/es/components/tree'
import {
  BuildingType,
  getLabelByValue,
  RoomReleaseStatus,
  RoomReleaseStatusMap,
} from '@/enums/constEnums'
const route = useRoute()
const router = useRouter()
//#region <Form Related>
// 表单数据
const apartmentFormRef = ref<FormInstance>()
const formData = ref<SaveRoomInterface>({
  id: '',
  roomNumber: '',
  rent: 0,
  apartmentId: '',
  isRelease: RoomReleaseStatus.NOT_RELEASED,
  // 	属性信息列表
  attrValueIds: [],
  // 	配套id
  facilityInfoIds: [],
  // 	标签信息列表
  labelInfoIds: [],
  // 	支付方式列表
  paymentTypeIds: [],
  // 可选租期列表
  leaseTermIds: [],
  graphVoList: [
    // {
    //   name: 'food.jpeg',
    //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    // },
  ] as UploadFile[],
})
// 表单验证规则
const rules = reactive({
  roomNumber: [{ required: true, message: 'Please enter room number', trigger: 'blur' }],
  rent: [{ required: true, message: 'Please enter rent', trigger: 'blur' }],
  apartmentId: [{ required: true, message: 'Please select apartment', trigger: 'change' }],
  attrValueIds: [{ required: true, message: 'Please select attributes', trigger: 'change' }],
  facilityInfoIds: [
    { required: true, message: 'Please select facilities', trigger: 'change' },
  ],
  labelInfoIds: [{ required: true, message: 'Please select tags', trigger: 'change' }],
  paymentTypeIds: [
    { required: true, message: 'Please select payment methods', trigger: 'change' },
  ],
  leaseTermIds: [
    { required: true, message: 'Please select lease terms', trigger: 'change' },
  ],
  graphVoList: [{ required: true, message: 'Please upload images', trigger: 'change' }],
})
//#endregion
//#region <Province/City/District Query Related>
// 地区数据 -> Area Data
const areaInfo = reactive({

  provinceList: [] as RegionInterface[],
  provinceId: '',

  cityList: [] as RegionInterface[],
  cityId: '',

  districtList: [] as RegionInterface[],
  districtId: '',

  apartmentList: [] as ApartmentInterface[],
  apartmentId: '',
})
// 监视地区信息变化,更新公寓信息
watch(
  () => areaInfo,
  (newVal) => {
    formData.value.apartmentId = newVal.apartmentId
  },
  { immediate: true, deep: true },
)
// 获取省份 -> Get Provinces
async function getProvinceListHandle() {
  try {
    const { data } = await getProvinceList()
    areaInfo.provinceList = data
  } catch (error) {
    console.log(error)
  }
}
// 获取城市 -> Get Cities
async function getCityListHandle(
  provinceId: number | string = areaInfo.provinceId,
) {
  try {
    const { data } = await getCityList(provinceId)
    areaInfo.cityList = data
  } catch (error) {
    console.log(error)
  }
}
// 获取区域 -> Get Districts
async function getDistrictListHandle(
  cityId: number | string = areaInfo.cityId,
) {
  try {
    const { data } = await getDistrictList(cityId)
    areaInfo.districtList = data
  } catch (error) {
    console.log(error)
  }
}
// 获取公寓 -> Get Apartments
async function getApartmentListHandle(
  districtId: number | string = areaInfo.districtId,
) {
  try {
    const { data } = await getApartmentListByDistrictId(districtId)
    areaInfo.apartmentList = data
  } catch (error) {
    console.log(error)
  }
}
// 重置市数据 -> Reset City Data
function resetCity() {
  areaInfo.cityId = ''
  areaInfo.cityList = []
}
// Reset District Data
function resetDistrict() {
  areaInfo.districtId = ''
  areaInfo.districtList = []
}
// 重置公寓数据 -> Reset Apartment Data
function resetApartment() {
  areaInfo.apartmentId = ''
  areaInfo.apartmentList = []
}
// 省份改变回调 -> Province Change Callback
const provinceChangeCallback = async () => {
  let provinceId = areaInfo.provinceId
  if (provinceId) {
    resetCity()
    resetDistrict()
    resetApartment()
    await getCityListHandle(provinceId)
  }
}
// Province Clear Callback
const provinceClearCallback = () => {
  areaInfo.provinceId = ''
  resetCity()
  resetDistrict()
  resetApartment()
}
// City Change Callback
const cityChangeCallback = async () => {
  let cityId = areaInfo.cityId
  if (cityId) {
    resetDistrict()
    resetApartment()
    await getDistrictListHandle(cityId)
  }
}
// City Clear Callback
const cityClearCallback = () => {
  console.log('清空城市')
  areaInfo.cityId = ''
  resetDistrict()
  resetApartment()
}
// District Change Callback
const districtChangeCallback = async () => {
  let districtId = areaInfo.districtId
  if (districtId) {
    resetApartment()
    await getApartmentListHandle(districtId)
  }
}
// District Clear Callback
const districtClearCallback = () => {
  console.log('清空区域')
  areaInfo.districtId = ''
  resetApartment()
}
// Apartment Change Callback
const apartmentChangeCallback = async () => {
  console.log('公寓改变')
}
// Apartment Clear Callback
const apartmentClearCallback = () => {
  console.log('清空公寓')
  areaInfo.apartmentId = ''
}
//#endregion
//#region <Facilities, Tags, Attributes Info>
// 配套信息 -> Facilities Info
const facilityInfoList = ref<FacilityInfoInterface[]>([])
// 标签信息 -> Tags Info
const labelInfoList = ref<LabelInfoInterface[]>([])
// 属性信息 -> Attributes Info
const attrInfoList = ref<TreeData[]>([])
// 支付方式信息 -> Payment Methods Info
const paymentInfoList = ref<PaymentInfoInterface[]>([])
// 可选租期信息 -> Lease Terms Info
const leaseTermInfoList = ref<TermInfoInterface[]>([])
// 配套信息树实例 -> Facilities Info Tree Instance
// 获取配套信息 -> Get Facilities Info
async function getFacilityInfoListHandle() {
  try {
    const { data } = await getFacilityInfoList(BuildingType.ROOM)
    facilityInfoList.value = data
  } catch (error) {
    console.log(error)
  }
}
// 获取标签信息 -> Get Tags Info
async function getLabelInfoListHandle() {
  try {
    const { data } = await getLabelInfoList(BuildingType.ROOM)
    labelInfoList.value = data
  } catch (error) {
    console.log(error)
  }
}
// 获取属性信息 -> Get Attributes Info
async function getAttrInfoListHandle() {
  try {
    const { data } = await getAttrInfoList()
    attrInfoList.value = data.map((item) => {
      return {
        value: item.id + item.name,
        label: item.name,
        children: item.attrValueList.map((child) => {
          return {
            value: child.id,
            label: `${child.name}(${item.name})`,
            parentId: item.id + item.name,
          }
        }),
      }
    })
  } catch (error) {
    console.log(error)
  }
}
// 获取支付方式信息列表 -> Get Payment Methods Info List
async function getPaymentInfoListHandle() {
  try {
    const { data } = await getPaymentList()
    paymentInfoList.value = data
  } catch (error) {
    console.log(error)
  }
}
// 获取可选租期信息列表 -> Get Lease Terms Info List
async function getLeaseTermInfoListHandle() {
  try {
    const { data } = await getTermList()
    leaseTermInfoList.value = data
  } catch (error) {
    console.log(error)
  }
}

// 属性信息节点点击回调 -> Attribute Node Click Callback
function attrNodeClickHandle(data: TreeData) {
  //   保证每个子节点只有一个被选中
  if (data.parentId) {
    //   收集当前父节点下所有的子节点列表
    const childrenList = attrInfoList.value
      .find((item) => item.value === data.parentId)
      ?.children?.map((item) => item.value)
    nextTick(() => {
      //   遍历feeValueIds节点，删除所有childrenList中的值
      formData.value.attrValueIds = formData.value.attrValueIds?.filter(
        (item) => !childrenList?.includes(item),
      )
      //   将当前节点的值添加到feeValueIds中
      formData.value.attrValueIds?.push(data.value as number)
    })
  }
}
//#endregion
// Image Upload Success
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
// Get Room Info By Id
async function getRoomInfoByIdHandle(id: number | string) {
  try {
    const { data } = await getRoomById(id)
    formData.value = data as unknown as SaveRoomInterface
    // 	属性ids
    formData.value.attrValueIds =
      data.attrValueVoList?.map((item) => item.id) || []
    delete data.attrValueVoList
    // 	配套ids
    formData.value.facilityInfoIds =
      (data.facilityInfoList?.map((item) => item.id) as number[]) || []
    delete data.facilityInfoList
    // 	标签ids
    formData.value.labelInfoIds =
      (data.labelInfoList?.map((item) => item.id) as number[]) || []
    delete data.labelInfoList
    // 	支付方式ids
    formData.value.paymentTypeIds =
      (data.paymentTypeList?.map((item) => item.id) as number[]) || []
    delete data.paymentTypeList
    // 可选租期ids
    formData.value.leaseTermIds =
      (data.leaseTermList?.map((item) => item.id) as number[]) || []
    delete data.leaseTermList
    areaInfo.provinceId = data.apartmentInfo.provinceId as string
    areaInfo.cityId = data.apartmentInfo.cityId as string
    areaInfo.districtId = data.apartmentInfo.districtId as string
    areaInfo.apartmentId = data.apartmentId as string
    data.apartmentInfo.provinceId &&
      getCityListHandle(data.apartmentInfo.provinceId)
    // 获取区域
    data.apartmentInfo.cityId &&
      getDistrictListHandle(data.apartmentInfo.cityId)
    // 获取公寓
    data.apartmentInfo.districtId &&
      getApartmentListHandle(data.apartmentInfo.districtId)
  } catch (error) {
    console.log(error)
  }
}
// 新增或更新公寓信息 -> Add or Update Room Info
async function addOrUpdateRoomInfoHandle() {
  try {
    await saveOrUpdateRoom(formData.value)
    ElMessage.success('Successfully saved')
    router.back()
  } catch (error) {
    console.log(error)
  }
}
// 提交 -> Submit
function submitHandle() {
  apartmentFormRef.value?.validate(async (valid) => {
    if (valid) {
      await addOrUpdateRoomInfoHandle()
    } else {
      ElMessage.error('Wrong table')
      return false
    }
  })
}
onMounted(() => {
  // Get Provinces
  getProvinceListHandle()
  // Get Facilities Info
  getFacilityInfoListHandle()
  // Get Tags Info
  getLabelInfoListHandle()
  // Get Attributes Info
  getAttrInfoListHandle()
  // Get Payment Methods Info List
  getPaymentInfoListHandle()
  // Get Lease Terms Info List
  getLeaseTermInfoListHandle()
  if (route.query?.id) {
    getRoomInfoByIdHandle(route.query.id as string)
  }
})
</script>

<style scoped lang="scss">
.card-header {
  font-size: 18px;
  font-weight: bold;
}
</style>
