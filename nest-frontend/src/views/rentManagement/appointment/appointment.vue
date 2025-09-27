<template>
  <el-card>
    <ProTable
      ref="proTable"
      :dataCallback="dataCallback"
      :columns="columns"
      :requestApi="getAppointmentInfoList"
      :initParam="initParam"
      :stripe="true"
    >
      <template #operation="scope">
        <el-button
          :type="
            scope.row.appointmentStatus === AppointmentStatus.WAITING
              ? 'primary'
              : 'info'
          "
          icon="View"
          :disabled="scope.row.appointmentStatus !== AppointmentStatus.WAITING"
          @click="takeLookHandle(scope.row)"
        >
          Property Viewing
        </el-button>
      </template>
    </ProTable>
  </el-card>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue'
import { ColumnProps } from '@/components/ProTable/src/types'
import ProTable from '@/components/ProTable/src/ProTable.vue'
import {
  getApartmentListByDistrictId,
  getCityList,
  getDistrictList,
  getProvinceList,
} from '@/api/apartmentManagement'
import {
  ApartmentInterface,
  RegionInterface,
} from '@/api/apartmentManagement/types'
import {
  AppointmentStatus,
  getLabelByValue,
  AppointmentStatusMap,
} from '@/enums/constEnums'
import { AppointmentInfoInterface } from '@/api/rentManagement/types'
import {
  getAppointmentInfoList,
  updateAppointmentStatusById,
} from '@/api/rentManagement'
import { ElMessage } from 'element-plus'

// *Get the ProTable element and call its method to refresh data
const proTable = ref<InstanceType<typeof ProTable>>()
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
const columns: ColumnProps[] = [
  {
    prop: 'name',
    label: 'Name',
    search: { el: 'input', props: { placeholder: 'Please type in Name' } },
  },
  {
    prop: 'phone',
    label: 'Phone Number',
    search: { el: 'input', props: { placeholder: 'Please type in Phone Number' } },
  },
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
            placeholder="Please choose province"
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
            placeholder="Please choose City"
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
            placeholder="Please choose District"
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
            placeholder="Please choose Apartment"
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
  { prop: 'apartmentInfo.provinceName', label: 'Province' },
  { prop: 'apartmentInfo.cityName', label: 'City' },
  { prop: 'apartmentInfo.districtName', label: 'District' },
  { prop: 'apartmentInfo.name', label: 'Apartment' },
  { prop: 'appointmentTime', label: 'Reservation Time' },
  { prop: 'additionalInfo', label: 'Remarks' },
  {
    prop: 'appointmentStatus',
    label: 'Reservation Status',
    render: ({ row }: { row: AppointmentInfoInterface }) => {
      switch (row.appointmentStatus) {
        case AppointmentStatus.WAITING:
          return (
            <el-tag type="success">
              {getLabelByValue(AppointmentStatusMap, row.appointmentStatus)}
            </el-tag>
          )
        case AppointmentStatus.CANCELLED:
          return (
            <el-tag type="warning">
              {getLabelByValue(AppointmentStatusMap, row.appointmentStatus)}
            </el-tag>
          )
        case AppointmentStatus.VIEWED:
          return (
            <el-tag type="info">
              {getLabelByValue(AppointmentStatusMap, row.appointmentStatus)}
            </el-tag>
          )
        case AppointmentStatus.EXPIRED:
          return (
            <el-tag type="danger">
              {getLabelByValue(AppointmentStatusMap, row.appointmentStatus)}
            </el-tag>
          )
        default:
          return (
            <el-tag type="info">
              {getLabelByValue(AppointmentStatusMap, row.appointmentStatus) ||
                '—'}
            </el-tag>
          )
      }
    },
  },
  { prop: 'operation', label: 'operation', fixed: 'right', width: 150 },
]

const initParam = reactive({})

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

async function getApartmentListHandle(districtId: number) {
  try {
    const { data } = await getApartmentListByDistrictId(districtId)
    areaInfo.apartmentList = data
    proTable.value?.enumMap.set('apartmentId', areaInfo.apartmentList)
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

function resetApartment() {
  areaInfo.apartmentId = ''
  areaInfo.apartmentList = []
  proTable.value?.enumMap.set('apartmentId', [])
  proTable.value!.searchParam.apartmentId = ''
}

const provinceChangeCallback = async () => {
  let provinceId = proTable.value!.searchParam.provinceId
  if (provinceId) {
    resetCity()
    resetDistrict()
    resetApartment()
    await getCityListHandle(provinceId)
  }
}

const provinceClearCallback = () => {
  areaInfo.provinceId = ''
  proTable.value!.searchParam.provinceId = ''
  resetCity()
  resetDistrict()
  resetApartment()
}

const cityChangeCallback = async () => {
  let cityId = proTable.value!.searchParam.cityId
  if (cityId) {
    resetDistrict()
    resetApartment()
    await getDistrictListHandle(cityId)
  }
}

const cityClearCallback = () => {
  console.log('clear city')
  areaInfo.cityId = ''
  proTable.value!.searchParam.cityId = ''
  resetDistrict()
  resetApartment()
}

const districtChangeCallback = async () => {
  let districtId = proTable.value!.searchParam.districtId
  if (districtId) {
    resetApartment()
    await getApartmentListHandle(districtId)
  }
}

const districtClearCallback = () => {
  console.log('clear district')
  areaInfo.districtId = ''
  proTable.value!.searchParam.districtId = ''
  resetApartment()
}

const apartmentChangeCallback = async () => {
  console.log('change apartment')
}

const apartmentClearCallback = () => {
  console.log('clear apartment')
  areaInfo.apartmentId = ''
  proTable.value!.searchParam.apartmentId = ''
}


const dataCallback = (data: any) => {
  return {
    list: data?.records,
    total: data?.total,
  }
}

const takeLookHandle = async (row: AppointmentInfoInterface) => {
  try {
    await updateAppointmentStatusById(row.id, AppointmentStatus.VIEWED)
    proTable.value?.getTableList()
    ElMessage.success('Operation is successful')
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  getProvinceListHandle()
})
</script>
