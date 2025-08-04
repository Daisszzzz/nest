<template>
  <el-card>
    <ProTable
      ref="proTable"
      :dataCallback="dataCallback"
      :columns="columns"
      :requestApi="getRoomList"
      :initParam="initParam"
      :stripe="true"
    >
      <template #tableHeader>
        <el-button type="primary" icon="Plus" @click="addHandle">
          Add Room
        </el-button>
      </template>
      <!-- Table Operations -->
      <template #operation="scope">
        <el-button type="success" icon="Edit" @click="editHandle(scope.row)">
          Edit
        </el-button>
        <el-button type="danger" icon="Delete" @click="deleteHandle(scope.row)">
          Delete
        </el-button>
      </template>
    </ProTable>
  </el-card>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue'
import { ColumnProps } from '@/components/ProTable/src/types'
import ProTable from '@/components/ProTable/src/ProTable.vue'
import { useRouter } from 'vue-router'
import { useHandleData } from '@/hooks/useHandleData'
import {
  deleteRoomById,
  getApartmentListByDistrictId,
  getCityList,
  getDistrictList,
  getProvinceList,
  getRoomList,
  updateRoomReleaseStatus,
} from '@/api/apartmentManagement'
import {
  ApartmentInterface,
  RegionInterface,
  RoomInterface,
} from '@/api/apartmentManagement/types'
import {
  getLabelByValue,
  RoomCheckInStatus,
  RoomCheckInStatusMap,
  RoomReleaseStatus,
} from '@/enums/constEnums'

const router = useRouter()

// *Get ProTable element, call its refresh method
const proTable = ref<InstanceType<typeof ProTable>>()
// Area data
const areaInfo = reactive({
  // Province data
  provinceList: [] as RegionInterface[],
  provinceId: '',
  // City data
  cityList: [] as RegionInterface[],
  cityId: '',
  // District data
  districtList: [] as RegionInterface[],
  districtId: '',
  // Apartment data
  apartmentList: [] as ApartmentInterface[],
  apartmentId: '',
})
// *Table columns config
const columns: ColumnProps[] = [
  {
    prop: 'provinceId',
    label: 'Province',
    isShow: false,
    fieldNames: { label: 'name', value: 'id' },
    search: {
      el: 'select',
      render: () => {
        return (
          <el-select
            v-model={areaInfo.provinceId}
            placeholder="Select Province"
            clearable
            key="provinceId"
            onChange={provinceChangeCallback}
            onClear={provinceClearCallback}
          >
            {areaInfo.provinceList.map((item) => (
              <el-option
                key={item.id}
                label={item.name}
                value={item.id}
              ></el-option>
            ))}
          </el-select>
        )
      },
    },
  },
  {
    prop: 'cityId',
    label: 'City',
    isShow: false,
    fieldNames: { label: 'name', value: 'id' },
    search: {
      el: 'select',
      key: 'cityId',
      render: () => {
        return (
          <el-select
            v-model={areaInfo.cityId}
            placeholder="Select City"
            clearable
            key="cityId"
            onChange={cityChangeCallback}
            onClear={cityClearCallback}
          >
            {areaInfo.cityList.map((item) => (
              <el-option
                key={item.id}
                label={item.name}
                value={item.id}
              ></el-option>
            ))}
          </el-select>
        )
      },
    },
  },
  {
    prop: 'districtId',
    label: 'District',
    isShow: false,
    fieldNames: { label: 'name', value: 'id' },
    search: {
      el: 'select',
      key: 'districtId',
      render: () => {
        return (
          <el-select
            v-model={areaInfo.districtId}
            placeholder="Select District"
            clearable
            onChange={districtChangeCallback}
            onClear={districtClearCallback}
          >
            {areaInfo.districtList.map((item) => (
              <el-option
                key={item.id}
                label={item.name}
                value={item.id}
              ></el-option>
            ))}
          </el-select>
        )
      },
    },
  },
  {
    prop: 'apartmentId',
    label: 'Apartment',
    isShow: false,
    fieldNames: { label: 'name', value: 'id' },
    search: {
      el: 'select',
      key: 'apartmentId',
      render: () => {
        return (
          <el-select
            v-model={areaInfo.apartmentId}
            placeholder="Select Apartment"
            clearable
            onChange={apartmentChangeCallback}
            onClear={apartmentClearCallback}
          >
            {areaInfo.apartmentList.map((item) => (
              <el-option
                key={item.id}
                label={item.name}
                value={item.id}
              ></el-option>
            ))}
          </el-select>
        )
      },
    },
  },
  { prop: 'roomNumber', label: 'Room Number' },
  { prop: 'rent', label: 'Rent (Yuan/Month)' },
  { prop: 'apartmentInfo.provinceName', label: 'Province' },
  { prop: 'apartmentInfo.cityName', label: 'City' },
  { prop: 'apartmentInfo.districtName', label: 'District' },
  { prop: 'apartmentInfo.name', label: 'Apartment' },
  {
    prop: 'isCheckIn',
    label: 'Check-in Status',
    render: ({ row }: { row: RoomInterface }) => {
      return row.isCheckIn === RoomCheckInStatus.NOT_CHECK_IN ? (
        <el-tag type="info">
          {getLabelByValue(RoomCheckInStatusMap, row.isCheckIn)}
        </el-tag>
      ) : (
        <el-tag type="success">
          {getLabelByValue(RoomCheckInStatusMap, row.isCheckIn)}
        </el-tag>
      )
    },
  },
  {
    prop: 'isRelease',
    label: 'Release Status',
    render: ({ row }: { row: RoomInterface }) => {
      return (
        <el-switch
          active-value={RoomReleaseStatus.RELEASED}
          inactive-value={RoomReleaseStatus.NOT_RELEASED}
          v-model={row.isRelease}
          onChange={() =>
            updateRoomReleaseStatus(row.id, row.isRelease as RoomReleaseStatus)
          }
        ></el-switch>
      )
    },
  },
  { prop: 'operation', label: 'Operation', fixed: 'right', width: 230 },
]

// *Search parameters
const initParam = reactive({})

//#region <Province/City/District Query>
// Get provinces
async function getProvinceListHandle() {
  try {
    const { data } = await getProvinceList()
    areaInfo.provinceList = data
    proTable.value?.enumMap.set('provinceId', areaInfo.provinceList)
  } catch (error) {
    console.log(error)
  }
}
// Get cities
async function getCityListHandle(provinceId: number) {
  try {
    const { data } = await getCityList(provinceId)
    areaInfo.cityList = data
    proTable.value?.enumMap.set('cityId', areaInfo.cityList)
  } catch (error) {
    console.log(error)
  }
}
// Get districts
async function getDistrictListHandle(cityId: number) {
  try {
    const { data } = await getDistrictList(cityId)
    areaInfo.districtList = data
    proTable.value?.enumMap.set('districtId', areaInfo.districtList)
  } catch (error) {
    console.log(error)
  }
}
// Get apartments
async function getApartmentListHandle(districtId: number) {
  try {
    const { data } = await getApartmentListByDistrictId(districtId)
    areaInfo.apartmentList = data
    proTable.value?.enumMap.set('apartmentId', areaInfo.apartmentList)
  } catch (error) {
    console.log(error)
  }
}
// Reset city data
function resetCity() {
  areaInfo.cityId = ''
  areaInfo.cityList = []
  proTable.value?.enumMap.set('cityId', [])
  proTable.value!.searchParam.cityId = ''
}
// Reset district data
function resetDistrict() {
  areaInfo.districtId = ''
  areaInfo.districtList = []
  proTable.value?.enumMap.set('districtId', [])
  proTable.value!.searchParam.districtId = ''
}
// Reset apartment data
function resetApartment() {
  areaInfo.apartmentId = ''
  areaInfo.apartmentList = []
  proTable.value?.enumMap.set('apartmentId', [])
  proTable.value!.searchParam.apartmentId = ''
}
// Province change callback
const provinceChangeCallback = async () => {
  let provinceId = proTable.value!.searchParam.provinceId
  if (provinceId) {
    resetCity()
    resetDistrict()
    resetApartment()
    await getCityListHandle(provinceId)
  }
}
// Province clear callback
const provinceClearCallback = () => {
  areaInfo.provinceId = ''
  proTable.value!.searchParam.provinceId = ''
  resetCity()
  resetDistrict()
  resetApartment()
}
// City change callback
const cityChangeCallback = async () => {
  let cityId = proTable.value!.searchParam.cityId
  if (cityId) {
    resetDistrict()
    resetApartment()
    await getDistrictListHandle(cityId)
  }
}
// City clear callback
const cityClearCallback = () => {
  console.log('Clear city')
  areaInfo.cityId = ''
  proTable.value!.searchParam.cityId = ''
  resetDistrict()
  resetApartment()
}
// District change callback
const districtChangeCallback = async () => {
  let districtId = proTable.value!.searchParam.districtId
  if (districtId) {
    resetApartment()
    await getApartmentListHandle(districtId)
  }
}
// District clear callback
const districtClearCallback = () => {
  console.log('Clear district')
  areaInfo.districtId = ''
  proTable.value!.searchParam.districtId = ''
  resetApartment()
}
// Apartment change callback
const apartmentChangeCallback = async () => {
  console.log('Apartment changed')
}
// Apartment clear callback
const apartmentClearCallback = () => {
  console.log('Clear apartment')
  areaInfo.apartmentId = ''
  proTable.value!.searchParam.apartmentId = ''
}
//#endregion

// Handle returned data format
const dataCallback = (data: any) => {
  return {
    list: data?.records,
    total: data?.total,
  }
}
// Edit
const editHandle = (row: RoomInterface) => {
  console.log(row)
  router.push({
    path: '/apartmentManagement/roomManagement/addOrEditRoom',
    query: {
      id: row.id,
    },
  })
}
// Add
const addHandle = () => {
  router.push({
    path: '/apartmentManagement/roomManagement/addOrEditRoom',
  })
}
// Delete
const deleteHandle = async (row: RoomInterface) => {
  const apartmentName = row.apartmentInfo?.name || 'unknown apartment'
  await useHandleData(
    deleteRoomById,
    row.id,
    `delete ${apartmentName} Room ${row.roomNumber}`,
  )
  proTable.value?.getTableList()
}
onMounted(() => {
  // Get provinces
  getProvinceListHandle()
})
</script>
