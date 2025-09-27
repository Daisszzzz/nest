<template>
  <SearchForm
    v-show="isShowSearch"
    :columns="searchColumns"
    :searchParam="searchParam"
    :searchCol="searchCol"
    :search="search"
    :reset="reset"
  />
  <div class="card table" ref="tableCard">
    <!-- Table header operation buttons -->
    <div class="table-header">
      <div class="header-left">
        <slot
          name="tableHeader"
          :selectedListIds="selectedListIds"
          :selectedList="selectedList"
          :isSelected="isSelected"
        ></slot>
      </div>
      <div class="header-right" v-if="toolButton">
        <el-tooltip content="Refresh Table">
          <el-icon size="18" @click="getTableList">
            <Refresh />
          </el-icon>
        </el-tooltip>
        <el-tooltip
          v-if="false"
          effect="dark"
          :content="!isFullscreen ? 'Full Screen' : 'Exit Full Screen'"
          placement="bottom"
        >
          <SvgIcon
            size="18"
            name="full-screen"
            v-if="!isFullscreen"
            @click="toggle"
          />
          <SvgIcon size="18" name="exit-full" v-else @click="toggle" />
        </el-tooltip>
        <el-tooltip content="Column Settings">
          <el-icon size="18" v-if="columns.length" @click="openColSetting">
            <Setting />
          </el-icon>
        </el-tooltip>
      </div>
    </div>
    <!-- Table body -->
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      v-loading="loading"
      :data="tableData"
      :row-key="rowKey"
      :border="border"
      :stripe="stripe"
      @selection-change="selectionChange"
    >
      <!-- default slot -->
      <slot></slot>
      <!-- render columns -->
      <template v-for="item in tableColumns" :key="item">
        <!-- selection || index -->
        <el-table-column
          v-bind="item"
          :align="item.align ?? 'center'"
          :reserve-selection="item.type == 'selection'"
          v-if="item.type == 'selection' || item.type == 'index'"
        ></el-table-column>
        <!-- expand -->
        <el-table-column
          v-bind="item"
          :align="item.align ?? 'center'"
          v-if="item.type == 'expand'"
          v-slot="scope"
        >
          <component
            :is="item.render"
            :row="scope.row"
            v-if="item.render"
          ></component>
          <slot :name="item.type" :row="scope.row" v-else></slot>
        </el-table-column>
        <!-- other columns -->
        <TableColumn :column="item" v-if="!item.type && item.prop">
          <template
            v-for="slot in Object.keys($slots)"
            :key="slot"
            #[slot]="scope"
          >
            <slot :name="slot" :row="scope.row"></slot>
          </template>
        </TableColumn>
      </template>
      <!-- Slot after the last row of the table -->
      <template #append>
        <slot name="append"></slot>
      </template>
      <!-- noData -->
      <template #empty>
        <div class="table-empty">
          <slot name="empty">
            <img src="./assets/images/notData.png" alt="noData" />
            <div>No data yet</div>
          </slot>
        </div>
      </template>
    </el-table>
    <!-- Pagination component -->
    <slot name="pagination">
      <Pagination
        v-if="pagination"
        :pageable="pageable"
        :handleSizeChange="handleSizeChange"
        :handleCurrentChange="handleCurrentChange"
      />
    </slot>
  </div>
  <ColSetting v-if="toolButton" ref="colRef" v-model:colSetting="colSetting" />
</template>

<script lang="ts" setup name="ProTable">
import { ref, provide, watch } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useTable } from './hooks/useTable'
import { useSelection } from './hooks/useSelection'
import { ElTable, TableProps } from 'element-plus'
import type { ColumnProps, BreakPoint } from './types'
import SearchForm from '@/components/SearchForm'
import TableColumn from './components/TableColumn.vue'
import Pagination from './components/Pagination.vue'
import ColSetting from './components/ColSetting.vue'
/**
 * @description: Props type definition
 * @param columns       - Column configuration
 * @param requestApi    - API for requesting table data ==> required
 * @param dataCallback  - Callback function for returned data, can process data ==> optional
 * @param title         - Table title, currently only used for printing ==> optional
 * @param pagination    - Whether to use pagination component ==> optional (default: true)
 * @param initParam     - Initial request parameters ==> optional (default: {})
 * @param border        - Whether to show vertical borders ==> optional (default: true)
 * @param stripe        - Whether to show zebra stripes ==> optional (default: false)
 * @param toolButton    - Whether to show table tool buttons ==> optional (default: true)
 * @param rowKey?: string; // Row data key, used to optimize Table rendering, especially for multi-select ==> optional (default: id)
 * @param searchCol     - Search item column span config ==> optional { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
 * @param resetCallback      - Callback executed when reset is clicked ==> optional (default: ()=>{})
 */
interface ProTableProps extends Partial<Omit<TableProps<any>, 'data'>> {
  columns: ColumnProps[]
  requestApi: (params: any) => Promise<any>
  dataCallback?: (data: any) => any
  title?: string
  pagination?: boolean
  initParam?: any
  border?: boolean
  stripe?: boolean
  toolButton?: boolean
  rowKey?: string
  searchCol?: number | Record<BreakPoint, number>
  resetCallback?: () => void
}

// 🌟Component props TS definition must be declared in the component
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  pagination: true,
  initParam: {},
  border: true,
  stripe: false,
  toolButton: true,
  rowKey: 'id',
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
  resetCallback: () => ({}),
})
// --------------------Table-----------------------
const tableCard = ref()

// Table DOM element
const tableRef = ref<InstanceType<typeof ElTable>>()

// Table fullscreen
const { isFullscreen, toggle } = useFullscreen(tableCard)

// Receive columns and set as reactive
const tableColumns = ref<ColumnProps[]>(props.columns)

// Table operation hooks
const {
  tableData,
  pageable,
  searchParam,
  loading,
  search,
  reset: resetTable,
  getTableList,
  handleSizeChange,
  handleCurrentChange,
} = useTable(
  props.requestApi,
  props.initParam,
  props.pagination,
  props.dataCallback,
)
const reset = () => {
  resetTable()
  props.resetCallback()
}
// Watch for changes in initParam, re-fetch table data
watch(() => props.initParam, getTableList, { deep: true })
// Watch for changes in enum in columns, reset enum data (mainly for select)
watch(
  () => props.columns,
  () => {
    props.columns.forEach((item) => {
      if (
        item.search &&
        item.search.el &&
        (item.search.el === 'select' || item.search.el === 'tree-select') &&
        item.enum
      ) {
        // Reset data
        setEnumMap(item)
        // Reset corresponding search data
        item.prop && (searchParam.value[item.prop] = '')
      }
    })
  },
  { deep: true },
)
//* --------------------Table selection-----------------------

// Table selection hooks
const { selectionChange, selectedList, selectedListIds, isSelected } =
  useSelection(props.rowKey)

// Clear selected data list
const clearSelection = () => tableRef.value!.clearSelection()

// --------------------Search-----------------------
// Whether to show search module
const isShowSearch = ref(true)

// Define enumMap to store enum values (avoid async request issues with cell formatting or search dropdowns)
const enumMap = ref(new Map<string, { [key: string]: any }[]>())
provide('enumMap', enumMap)

const setEnumMap = async (col: ColumnProps) => {
  if (!col.enum) return
  if (typeof col.enum !== 'function')
    return enumMap.value.set(col.prop!, (col.enum as any)?.value || col.enum)
  const { data } = await col.enum()
  enumMap.value.set(col.prop!, data)
}

// Flatten columns
const flatColumnsFunc = (
  columns: ColumnProps[],
  flatArr: ColumnProps[] = [],
) => {
  columns.forEach(async (col) => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children))
    flatArr.push(col)

    // Add isShow && isFilterEnum default properties to each column
    col.isShow = col.isShow ?? true
    col.isFilterEnum = col.isFilterEnum ?? true

    setEnumMap(col)
  })
  return flatArr.filter((item) => !item._children?.length)
}
const flatColumns = ref<ColumnProps[]>()
flatColumns.value = flatColumnsFunc(tableColumns.value)

// Filter columns that need search
const searchColumns = flatColumns.value.filter((item) => item.search?.el)

// Column settings ==> filter out columns that do not need show/hide settings
const colRef = ref()
const colSetting = tableColumns.value!.filter((item) => {
  return (
    item.type !== 'selection' &&
    item.type !== 'index' &&
    item.type !== 'expand' &&
    item.prop !== 'operation'
  )
})
const openColSetting = () => colRef.value.openColSetting()

defineExpose({
  element: tableRef,
  tableData,
  searchParam,
  pageable,
  enumMap,
  isSelected,
  selectedList,
  selectedListIds,
  reset,
  getTableList,
  clearSelection,
})
</script>

<style lang="scss" scoped>
@import './style/index';
</style>
