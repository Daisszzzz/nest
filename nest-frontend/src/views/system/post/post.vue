<template>
  <div>
    <ProTable
      ref="proTable"
      :dataCallback="dataCallback"
      :columns="columns"
      :requestApi="getSysPostListPaginate"
      :initParam="initParam"
    >
      <template #tableHeader>
        <el-button type="primary" icon="Plus" @click="openDialog(0)">
          Add
        </el-button>
      </template>
      <!-- Table Operations -->
      <template #operation="scope">
        <el-button
          type="primary"
          link
          icon="Edit"
          @click="openDialog(1, scope.row)"
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
    <PostDialog ref="DialogRef" />
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { ColumnProps } from '@/components/ProTable/src/types'
import PostDialog from './components/PostDialog.vue'
import { useHandleData } from '@/hooks/useHandleData'
import {
  addSysPost,
  deleteSysPostById,
  getSysPostListPaginate,
  updateSysPost,
  updateSysPostStatus,
} from '@/api/system'
import { PostInterfacesRes } from '@/api/system/types'

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

// Open Dialog
const DialogRef = ref()
const openDialog = (
  type: number, // 0 Add 1 Edit
  rowData: PostInterfacesRes = {} as PostInterfacesRes,
) => {
  let initRowData = {
    postCode: '',
    name: '',
    description: '',
    status: 1,
    id: '' as unknown as number,
  } as PostInterfacesRes
  const params = {
    rowData: type == 0 ? { ...rowData, ...initRowData } : { ...rowData },
    api: type == 0 ? addSysPost : updateSysPost,
    getTableList: proTable.value?.getTableList,
  }
  console.log('params', params)
  DialogRef.value.acceptParams(params)
}

// *Delete user by id
const handleDelete = async (row: PostInterfacesRes) => {
  await useHandleData(deleteSysPostById, row.id, `Delete ${row.name}`)
  proTable.value?.getTableList()
}

// *Table columns config
const columns: ColumnProps[] = [
  { type: 'index', label: 'No.', width: 80 },
  {
    prop: 'name',
    label: 'Post Name',
  },
  {
    prop: 'postCode',
    label: 'Post Code',
  },
  {
    prop: 'description',
    label: 'Description',
  },
  {
    prop: 'status',
    label: 'Status',
    width: 100,
    enum: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 },
    ],
    render: ({ row }) => {
      return (
        <el-switch
          active-value={1}
          inactive-value={0}
          v-model={row.status}
          onChange={() => updateSysPostStatus(row.id, row.status)}
        ></el-switch>
      )
    },
  },
  { prop: 'operation', label: 'Operation', fixed: 'right', width: 280 },
]
</script>
