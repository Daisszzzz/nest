<template>
  <el-card>
    <SupportFacility></SupportFacility>
    <SupportLabel class="m-t-20"></SupportLabel>
    <SupportRoomBase class="m-t-20"></SupportRoomBase>
    <SupportFee class="m-t-20"></SupportFee>
    <SupportTerm class="m-t-20"></SupportTerm>
    <SupportPayment class="m-t-20"></SupportPayment>
  </el-card>
</template>

<script setup lang="tsx">
import SupportFacility from '@/views/apartmentManagement/attributeManagement/components/supportFacility.vue'
import SupportLabel from '@/views/apartmentManagement/attributeManagement/components/supportLabel.vue'
import SupportRoomBase from '@/views/apartmentManagement/attributeManagement/components/supportRoomBase.vue'
import SupportFee from '@/views/apartmentManagement/attributeManagement/components/supportFee.vue'
import SupportTerm from '@/views/apartmentManagement/attributeManagement/components/supportTerm.vue'
import SupportPayment from '@/views/apartmentManagement/attributeManagement/components/supportPayment.vue'
</script>
