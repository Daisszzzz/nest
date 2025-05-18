<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Miscellaneous Fee Information Management</span>
      </div>
    </template>
    <el-row class="container" v-for="item in attrTypeList" :key="item">
      <el-col :span="2" class="text-center">
        <el-popconfirm
          width="220"
          confirm-button-text="delete"
          cancel-button-text="modify"
          cancel-button-type="warning"
          @confirm="deleteFeeKeyHandle(item)"
          @cancel="editFeeKeyHandle(item)"
          :title="`modify or delete${item.name}`"
        >
          <template #reference>
            <div class="item m-r-10 pointer">
              <span>{{ item.name }}</span>
              <el-tooltip
                effect="dark"
                content="Click the attribute name to modify or delete."
                placement="top-start"
              >
                <el-icon class="m-l-5"><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-popconfirm>
      </el-col>
      <el-col :span="22" class="item-container">
        <el-popconfirm
          v-for="item2 in item.feeValueList || []"
          :key="item2.id"
          width="220"
          confirm-button-text="delete"
          cancel-button-text="modify"
          cancel-button-type="warning"
          @confirm="deleteFeeValueHandle(item2)"
          @cancel="editFeeValueHandle(item2)"
          :title="`delete or modify${item2.name}`"
        >
          <template #reference>
            <div class="item m-r-10 pointer">
              <el-tag style="padding: 13px">
                {{ item2.name + item2.unit }}
              </el-tag>
            </div>
          </template>
        </el-popconfirm>
        <el-icon
          class="item m-r-10 m-t-5 pointer"
          :size="35"
          color="#567722"
          @click="addFeeValueHandle(item)"
        >
          <CirclePlus />
        </el-icon>
      </el-col>
    </el-row>
    <el-button type="primary" class="m-t-20" @click="addFeeKeyHandle">
      add new attributes
    </el-button>
    <SupportFeeDialog
      ref="supportFeeDialog"
      :updateFee="getFeeInfoListHandle"
    ></SupportFeeDialog>
    <supportFeeAddOrEditAttrDialog
      ref="supportFeeAddOrEditFeeDialog"
      :updateFeeAddOrEditFee="getFeeInfoListHandle"
    ></supportFeeAddOrEditAttrDialog>
  </el-card>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  FeeValueInfoInterface,
  FeeInfoInterface,
} from '@/api/apartmentManagement/types'
import {
  deleteFeeKeyById,
  deleteFeeValueById,
  getFeeInfoList,
} from '@/api/apartmentManagement'
import SupportFeeDialog from '@/views/apartmentManagement/attributeManagement/components/supportFeeDialog.vue'
import { ElMessage } from 'element-plus'
import SupportFeeAddOrEditAttrDialog from '@/views/apartmentManagement/attributeManagement/components/supportFeeAddOrEditAttrDialog.vue'
const supportFeeDialog = ref<InstanceType<typeof SupportFeeDialog>>()
const supportFeeAddOrEditFeeDialog =
  ref<InstanceType<typeof SupportFeeAddOrEditAttrDialog>>()

const attrTypeList = ref<FeeInfoInterface[]>([])
async function getFeeInfoListHandle() {
  try {
    const { data } = await getFeeInfoList()
    data.forEach((item) => {
      item.feeValueList?.forEach((item2) => {
        item2.feeKeyName = item.name
      })
    })
    attrTypeList.value = data
  } catch (error) {
    console.log(error)
  }
}
const deleteFeeValueHandle = async (item: FeeValueInfoInterface) => {
  console.log('delete', item)
  try {
    await deleteFeeValueById(item.id)
    await getFeeInfoListHandle()
    ElMessage.success('operate successfully')
  } catch (error) {
    console.log(error)
  }
}
const editFeeValueHandle = (item: FeeValueInfoInterface) => {
  console.log('edit', item)
  supportFeeDialog.value?.show(item)
}
const addFeeValueHandle = (item: FeeInfoInterface) => {
  console.log('add attribute', item)
  supportFeeDialog.value?.show({
    feeKeyId: item.id,
    feeKeyName: item.name,
  })
}
const addFeeKeyHandle = () => {
  supportFeeAddOrEditFeeDialog.value?.show()
}
const deleteFeeKeyHandle = async (item: FeeInfoInterface) => {
  console.log('delete', item)
  try {
    await deleteFeeKeyById(item.id)
    await getFeeInfoListHandle()
    ElMessage.success('operate successfully')
  } catch (error) {
    console.log(error)
  }
}
const editFeeKeyHandle = (item: FeeInfoInterface) => {
  console.log('edit', item)
  supportFeeAddOrEditFeeDialog.value?.show(item)
}
onMounted(() => {
  getFeeInfoListHandle()
})
</script>

<style scoped lang="scss">
.card-header {
  font-size: 18px;
  font-weight: bold;
}

.text-center {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
}

.container:not(:first-child) {
  margin-top: 20px;
}

.item-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 15px;
  background-color: #efefef;
  border-radius: 20px;

  .item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
