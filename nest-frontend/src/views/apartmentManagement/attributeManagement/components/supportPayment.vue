<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Payment Method Management</span>
      </div>
    </template>
    <el-row class="container">
      <el-col :span="2" class="text-center">Payment Method</el-col>
      <el-col :span="22" class="item-container">
        <el-popconfirm
          v-for="item in paymentTypeList"
          :key="item.id"
          width="220"
          confirm-button-text="Delete"
          cancel-button-text="Edit"
          cancel-button-type="warning"
          @confirm="deleteHandle(item)"
          @cancel="editHandle(item)"
          :title="`Edit or Delete ${item.name} (${item.additionalInfo})`"
        >
          <template #reference>
            <div class="item m-r-10 pointer">
              <el-tag style="padding: 13px">
                {{ `${item.name} (${item.additionalInfo})` }}
              </el-tag>
            </div>
          </template>
        </el-popconfirm>
        <el-icon
          class="item m-r-10 m-t-5 pointer"
          :size="35"
          color="#567722"
          @click="addHandle()"
        >
          <CirclePlus />
        </el-icon>
      </el-col>
    </el-row>
    <!--    Payment Method Dialog Management-->
    <SupportPaymentDialog
      ref="supportPaymentDialog"
      :update="getPaymentInfoListHandle"
    ></SupportPaymentDialog>
  </el-card>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PaymentInfoInterface } from '@/api/apartmentManagement/types'
import { deletePaymentById, getPaymentList } from '@/api/apartmentManagement'
import { ButtonPermission } from '@/enums/constEnums'
import SupportPaymentDialog from '@/views/apartmentManagement/attributeManagement/components/SupportPaymentDialog.vue'
import { ElMessage } from 'element-plus'
const supportPaymentDialog = ref<InstanceType<typeof SupportPaymentDialog>>()
// Payment method types
const paymentTypeList = ref<PaymentInfoInterface[]>([])
// Get payment method info
async function getPaymentInfoListHandle() {
  try {
    const { data } = await getPaymentList()
    paymentTypeList.value = data
  } catch (error) {
    console.log(error)
  }
}
// Delete payment method
const deleteHandle = async (item: PaymentInfoInterface) => {
  console.log('Delete payment method', item)
  try {
    await deletePaymentById(item.id)
    await getPaymentInfoListHandle()
    ElMessage.success('Operation successful')
  } catch (error) {
    console.log(error)
  }
}
// Edit payment method
const editHandle = (item: PaymentInfoInterface) => {
  console.log('Edit payment method', item)
  supportPaymentDialog.value?.show(item)
}
// Add payment method
const addHandle = () => {
  console.log('Add payment method')
  supportPaymentDialog.value?.show()
}
onMounted(() => {
  getPaymentInfoListHandle()
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
