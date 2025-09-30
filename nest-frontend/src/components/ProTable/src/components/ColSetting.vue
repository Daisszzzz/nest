<template>
  <!-- Column Settings -->
  <el-drawer title="Column Settings" v-model="drawerVisible" size="450px">
    <div class="table">
      <el-table
        :data="colSetting"
        :border="true"
        row-key="prop"
        default-expand-all
        :tree-props="{ children: '_children' }"
      >
        <el-table-column prop="label" align="center" label="Column Name" />
        <el-table-column
          prop="isShow"
          align="center"
          label="Show"
          v-slot="scope"
        >
          <el-switch v-model="scope.row.isShow"></el-switch>
        </el-table-column>
        <el-table-column
          prop="sortable"
          align="center"
          label="Sortable"
          v-slot="scope"
        >
          <el-switch v-model="scope.row.sortable"></el-switch>
        </el-table-column>
        <template #empty>
          <div class="table-empty">
            <img src="../assets/images/notData.png" alt="notData" />
            <div>No configurable columns</div>
          </div>
        </template>
      </el-table>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="ColSetting">
import { ref } from 'vue'
import { ColumnProps } from '../types'

defineProps<{ colSetting: ColumnProps[] }>()

const drawerVisible = ref<boolean>(false)
// Open column settings
const openColSetting = () => {
  drawerVisible.value = true
}

defineExpose({
  openColSetting,
})
</script>

<style scoped lang="scss">
.cursor-move {
  cursor: move;
}
</style>
