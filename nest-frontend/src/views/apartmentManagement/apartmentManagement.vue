<template>
  <el-card>
    <ProTable
      ref="proTable"
      :dataCallback="dataCallback"
      :columns="columns"
      :requestApi="getApartmentList"
      :initParam="initParam"
      :stripe="true"
    >
      <template #tableHeader>
        <el-button type="primary" icon="Plus" @click="addHandle">
          Add Apartment
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
  deleteApartmentById,
  getApartmentList,
  getCityList,
  getDistrictList,
  getProvinceList,
  updateApartmentReleaseStatus,
} from '@/api/apartmentManagement'
import {
  ApartmentInterface,
  RegionInterface,
} from '@/api/apartmentManagement/types'
import { ApartmentReleaseStatus } from '@/enums/constEnums'
const router = useRouter()

// Get reference to ProTable and trigger data refresh
const proTable = ref<InstanceType<typeof ProTable>>()
// Region data
const areaInfo = reactive({
  // Province Data
  provinceList: [] as RegionInterface[],
  provinceId: '',
  // City Data
  cityList: [] as RegionInterface[],
  cityId: '',
  // District Data
  districtList: [] as RegionInterface[],
  districtId: '',
})
// Table columns configuration
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
  { prop: 'name', label: 'Apartment Name' },
  { prop: 'addressDetail', label: 'Detailed Address' },
  { prop: 'freeRoomCount', label: 'Available Room' },
  { prop: 'totalRoomCount', label: 'Total Rooms' },
  { prop: 'provinceName', label: 'Province Name' },
  { prop: 'cityName', label: 'City Name' },
  { prop: 'districtName', label: 'District Name' },
  { prop: 'phone', label: 'Contact Phone' },
  {
    prop: 'occupancyStatus',
    label: 'Occupancy Status',
    render: ({ row }: { row: ApartmentInterface }) => {
      return row.freeRoomCount === 0 ? (
        <el-tag type="info">Full</el-tag>
      ) : (
        <el-tag type="success">Available</el-tag>
      )
    },
  },
  {
    prop: 'isRelease',
    label: 'Publish Status',
    render: ({ row }: { row: ApartmentInterface }) => {
      return (
        <el-switch
          active-value={ApartmentReleaseStatus.RELEASED}
          inactive-value={ApartmentReleaseStatus.NOT_RELEASED}
          v-model={row.isRelease}
          onChange={() =>
            updateApartmentReleaseStatus(
              row.id,
              row.isRelease as ApartmentReleaseStatus,
            )
          }
        ></el-switch>
      )
    },
  },
  { prop: 'operation', label: 'Actions', fixed: 'right', width: 230 },
]

// Default query parameters
const initParam = reactive({})

//#region Region selection and loading

async function getProvinceListHandle() {
  try {
    const { data } = await getProvinceList()
    areaInfo.provinceList = data
    proTable.value?.enumMap.set('provinceId', areaInfo.provinceList)
  } catch (error) {
    console.log(error)
  }
}

async function getCityListHandle(provinceId: number) {
  try {
    const { data } = await getCityList(provinceId)
    areaInfo.cityList = data
    proTable.value?.enumMap.set('cityId', areaInfo.cityList)
  } catch (error) {
    console.log(error)
  }
}

async function getDistrictListHandle(cityId: number) {
  try {
    const { data } = await getDistrictList(cityId)
    areaInfo.districtList = data
    proTable.value?.enumMap.set('districtId', areaInfo.districtList)
  } catch (error) {
    console.log(error)
  }
}


function resetCity() {
  areaInfo.cityId = ''
  areaInfo.cityList = []
  proTable.value?.enumMap.set('cityId', [])
  proTable.value!.searchParam.cityId = ''
}

function resetDistrict() {
  areaInfo.districtId = ''
  areaInfo.districtList = []
  proTable.value?.enumMap.set('districtId', [])
  proTable.value!.searchParam.districtId = ''
}

const provinceChangeCallback = async () => {
  let provinceId = proTable.value!.searchParam.provinceId
  if (provinceId) {
    resetCity()
    resetDistrict()
    await getCityListHandle(provinceId)
  }
}

const provinceClearCallback = () => {
  areaInfo.provinceId = ''
  proTable.value!.searchParam.provinceId = ''
  resetCity()
  resetDistrict()
}

const cityChangeCallback = async () => {
  let cityId = proTable.value!.searchParam.cityId
  if (cityId) {
    resetDistrict()
    await getDistrictListHandle(cityId)
  }
}

const cityClearCallback = () => {
  console.log('City cleared')
  areaInfo.cityId = ''
  proTable.value!.searchParam.cityId = ''
  resetDistrict()
}

const districtChangeCallback = async () => {
  console.log('District changed')
}

const districtClearCallback = () => {
  console.log('District cleared')
  areaInfo.districtId = ''
  proTable.value!.searchParam.districtId = ''
}
//#endregion


const dataCallback = (data: any) => {
  return {
    list: data?.records,
    total: data?.total,
  }
}

const editHandle = (row: ApartmentInterface) => {
  console.log('Navigate to edit page')
  router.push({
    path: '/apartmentManagement/apartmentManagement/addOrEditApartment',
    query: {
      id: row.id,
    },
  })
}
// Add handler
const addHandle = () => {
  router.push({
    path: '/apartmentManagement/apartmentManagement/addOrEditApartment',
  })
}
// Delete handler
const deleteHandle = async (row: ApartmentInterface) => {

  await useHandleData(deleteApartmentById, row.id, `删除${row.name}`)

  proTable.value?.getTableList()
}
onMounted(() => {

  getProvinceListHandle()
})
</script>
