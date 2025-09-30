<template>
  <div>
    <ProTable
      ref="proTable"
      :dataCallback="dataCallback"
      :columns="columns"
      :requestApi="getSysUserList"
      :initParam="initParam"
    >
      <template #tableHeader="scope">
        <el-button type="primary" icon="Plus" @click="openDrawer('Add')">
          Add
        </el-button>
        <el-button
          v-if="false"
          type="danger"
          icon="Delete"
          plain
          @click="batchDelete(scope.selectedListIds)"
          :disabled="!scope.isSelected"
        >
          Batch Delete
        </el-button>
      </template>
      <!-- Table Operations -->
      <template #operation="scope">
        <el-button
          type="primary"
          link
          icon="Edit"
          @click="openDrawer('Edit', scope.row)"
        >
          Edit
        </el-button>
        <el-button
          type="primary"
          link
          icon="Delete"
          @click="handleDelete(scope.row)"
        >
          Delete
        </el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue'
import { ColumnProps } from '@/components/ProTable/src/types'
import UserDrawer from './components/UserDrawer.vue'
import { useHandleData } from '@/hooks/useHandleData'
import { ElMessage } from 'element-plus'
import {
  addSysUser,
  assignSysUserRoles,
  batchSysUser,
  deleteSysUserById,
  getSysPostList,
  getSysUserList,
  updateSysUser,
  updateSysUserStatus,
} from '@/api/system'
import { PostInterfacesRes, SysUserInterfaceRes } from '@/api/system/types'
import {
  getLabelByValue,
  SystemUserStatus,
  SystemUserTypeMap,
} from '@/enums/constEnums'
// *Get ProTable element, call its refresh method
const proTable = ref()

// *Query parameters
const initParam = reactive({})

// Handle returned data format
const dataCallback = (data: any) => {
  return {
    list: data?.records,
    total: data?.total,
  }
}

// *Add, Edit, Assign Role
const drawerRef = ref()
const openDrawer = async (
  title: string,
  rowData: Partial<SysUserInterfaceRes> = {} as SysUserInterfaceRes,
) => {
  let params = {
    title,
    rowData: { ...rowData },
    api:
      title === 'Add'
        ? addSysUser
        : title === 'Edit'
        ? updateSysUser
        : assignSysUserRoles,
    getTableList: proTable.value?.getTableList,
    postList: postList.value,
  }
  console.log(params)
  drawerRef.value.acceptParams(params)
}
// *Delete user by id
const handleDelete = async (row: SysUserInterfaceRes) => {
  if (row?.username === 'admin') {
    ElMessage({
      type: 'warning',
      message: `System user cannot be deleted`,
    })
    return
  }
  await useHandleData(
    deleteSysUserById,
    row.id as number,
    `Delete user ${row.username}`,
  )
  proTable.value?.getTableList()
}

// *Batch delete users
const batchDelete = async (ids: string[]) => {
  await useHandleData(batchSysUser, ids, 'Delete selected user information')
  proTable.value?.clearSelection()
  proTable.value?.getTableList()
}
// Post list
const postList = ref([] as PostInterfacesRes[])
// Get all post list
const getPostList = async () => {
  try {
    const res = await getSysPostList()
    postList.value = res.data
  } catch (error) {
    console.log(error)
    ElMessage.error((error as any)?.message || 'Has Error')
  }
}
// *Table columns config
const columns: ColumnProps[] = [
  { type: 'index', label: 'No.' },
  {
    prop: 'name',
    label: 'Name',
    search: { el: 'input', props: { placeholder: 'Enter name' } },
  },
  {
    prop: 'phone',
    label: 'Phone',
    search: { el: 'input', props: { placeholder: 'Enter phone' } },
  },
  { prop: 'postName', label: 'Post' },
  // {
  //   prop: 'type',
  //   label: 'User Type',
  //   render: ({ row }) => {
  //     return (
  //       <el-tag className="flex-wrap m-r-10 m-t-5">
  //         {getLabelByValue(SystemUserTypeMap, row.type)}
  //       </el-tag>
  //     )
  //   },
  // },
  {
    prop: 'status',
    label: 'Status',
    width: 100,
    render: ({ row }) => {
      return (
        <el-switch
          active-value={SystemUserStatus.NORMAL}
          inactive-value={SystemUserStatus.DISABLED}
          v-model={row.status}
          onChange={() => updateSysUserStatus(row.id, row.status)}
        ></el-switch>
      )
    },
  },
  { prop: 'operation', label: 'Operation', fixed: 'right', width: 280 },
]
onMounted(() => {
  getPostList()
})
</script>
