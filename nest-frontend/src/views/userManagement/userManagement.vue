<template>
  <el-card>
    <ProTable
      ref="proTable"
      :dataCallback="dataCallback"
      :columns="columns"
      :requestApi="getUserManagementInfoList"
      :initParam="initParam"
      :stripe="true"
    ></ProTable>
  </el-card>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { ColumnProps } from '@/components/ProTable/src/types'
import ProTable from '@/components/ProTable/src/ProTable.vue'
import { UserStatus, UserStatusMap } from '@/enums/constEnums'
import {
  getUserManagementInfoList,
  updateUserManagementStatus,
} from '@/api/userManagement'
import { UserManagementInfoInterface } from '@/api/userManagement/types'


const proTable = ref<InstanceType<typeof ProTable>>()


const columns: ColumnProps[] = [
  {
    prop: 'nickname',
    label: 'nickname',
  },
  {
    prop: 'avatarUrl',
    label: 'avatarUrl',
    render: ({ row }: { row: UserManagementInfoInterface }) => {
      return (
        <el-image
          style={{ width: '60px', height: '60px' }}
          src={row.avatarUrl}
          fit="cover"
        ></el-image>
      )
    },
  },
  {
    prop: 'phone',
    label: 'phone',
    search: { el: 'input', props: { placeholder: 'Phone_Number' } },
  },
  {
    prop: 'status',
    label: 'status',
    enum: UserStatusMap,
    search: {
      el: 'select',
      props: { placeholder: 'status' },
    },
    render: ({ row }: { row: UserManagementInfoInterface }) => {
      return (
        <el-switch
          active-value={UserStatus.NORMAL}
          inactive-value={UserStatus.DISABLED}
          v-model={row.status}
          onChange={() =>
            updateUserManagementStatus(row.id, row.status as UserStatus)
          }
        ></el-switch>
      )
    },
  },
]


const initParam = reactive({})


const dataCallback = (data: any) => {
  return {
    list: data?.records,
    total: data?.total,
  }
}
</script>
