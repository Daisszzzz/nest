<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="450px"
    :title="`${drawerProps.title} User`"
  >
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :rules="rules"
      :model="drawerProps.rowData"
    >
      <el-form-item label="Username" prop="username">
        <el-input
          :disabled="drawerProps.title === 'Assign Role'"
          v-model.trim="drawerProps.rowData!.username"
          placeholder="Please enter username"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="drawerProps.title === 'Edit' ? 'Change Password' : 'Password'"
        prop="password"
        v-if="drawerProps.title === 'Add' || drawerProps.title === 'Edit'"
      >
        <el-input
          v-model.trim="drawerProps.rowData!.password"
          placeholder="Please enter password"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Confirm Password"
        prop="confirmPassword"
        v-if="drawerProps.title === 'Edit'"
      >
        <el-input
          v-model.trim="drawerProps.rowData!.confirmPassword"
          placeholder="Please confirm password"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Nickname"
        prop="name"
        v-if="drawerProps.title !== 'Assign Role'"
      >
        <el-input
          v-model.trim="drawerProps.rowData!.name"
          placeholder="Please enter nickname"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Phone"
        prop="phone"
        v-if="drawerProps.title !== 'Assign Role'"
      >
        <el-input
          v-model.trim="drawerProps.rowData!.phone"
          placeholder="Please enter phone"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Post"
        prop="postId"
        v-if="drawerProps.title !== 'Assign Role'"
      >
        <el-select
          v-model="drawerProps.rowData!.postId"
          placeholder="Please select post"
          clearable
          style="width: 95%"
        >
          <el-option
            v-for="item in drawerProps.postList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="User Type"
        prop="type"
        v-if="drawerProps.title === 'Assign Role'"
      >
        <el-radio-group v-model="drawerProps.rowData!.type">
          <el-radio
            :label="item.value"
            v-for="item in SystemUserTypeMap"
            :key="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!--      Assign Role-->
      <el-form-item
        label="Role List"
        prop="rolesId"
        v-if="drawerProps.title === 'Assign Role'"
      >
        <el-checkbox
          v-model="state.checkAll"
          :indeterminate="state.isIndeterminate"
          @change="handleCheckAllChange"
        >
          Check All
        </el-checkbox>
        <el-checkbox-group
          v-model="state.assginRoleList"
          @change="handleCheckedChange"
        >
          <el-checkbox
            v-for="item in state.allRolesList"
            :key="item.id"
            :label="item.id"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        Confirm
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import {
  CheckboxValueType,
  ElMessage,
  FormInstance,
  FormRules,
} from 'element-plus'
import { DeptInterfacesRes, PostInterfacesRes, Role } from '@/api/system/types'
import { SystemUserTypeMap } from '@/enums/constEnums'
import { checkUserNameAvailable } from '@/api/system'
// Initial data passed in
const origiinRowData = ref<any>({})

interface DrawerProps {
  title: string
  rowData?: any
  list?: any
  api?: (params: any) => Promise<any>
  getTableList?: () => Promise<any>
  postList?: PostInterfacesRes[]
  deptList?: DeptInterfacesRes[]
}

interface RolesState {
  allRolesList: Role[]
  assginRoleList: string[] | number[]
  checkAll: boolean
  isIndeterminate: boolean
}

// Drawer state
const drawerVisible = ref(false)
const drawerProps = ref<DrawerProps>({
  title: '',
})

const loading = ref<boolean>(false)
const checkUserName = async (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please enter username'))
  }
  if (value.length < 4) {
    return callback(new Error('Username must be at least 4 characters'))
  }
  if (value.length > 20) {
    return callback(new Error('Username must be no more than 20 characters'))
  }
  // No need to validate if new value is same as original
  if (value === origiinRowData.value.username) {
    return callback()
  }
  try {
    const { data } = await checkUserNameAvailable(value)
    if (!data) {
      return callback(new Error('Username already exists'))
    }
    callback()
  } catch (error) {
    console.error(error)
    callback(new Error('Username validation failed'))
  }
}
const checkConfirmPassword = async (rule: any, value: any, callback: any) => {
  // No need to validate if new value is same as original
  if (value === drawerProps.value.rowData?.password) {
    return callback()
  } else {
    return callback(new Error('Passwords do not match'))
  }
}
const rules = reactive<FormRules>({
  username: [
    {
      required: true,
      validator: checkUserName as unknown as () => void,
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please enter password',
      trigger: 'blur',
    },
    { min: 6, message: 'Password must be at least 6 characters' },
  ],
  confirmPassword: [
    {
      validator: checkConfirmPassword as unknown as () => void,
      trigger: 'blur',
    },
  ],
  name: [{ required: true, message: 'Please enter nickname', trigger: 'blur' }],
  phone: [{ required: true, message: 'Please enter phone', trigger: 'blur' }],
  postId: [{ required: true, message: 'Please select post', trigger: 'change' }],
  type: [{ required: true, message: 'Please select user type', trigger: 'change' }],
})
watch(
  drawerProps,
  (newVal) => {
    if (newVal) {
      ;(rules as any).password[0].required = newVal.title === 'Add'
    }
  },
  { immediate: true, deep: true },
)

// Role selection state management
const state: RolesState = reactive({
  allRolesList: [],
  assginRoleList: [],
  checkAll: false,
  isIndeterminate: false,
})

// Check all
const handleCheckAllChange = (val: CheckboxValueType) => {
  state.assginRoleList = val
    ? state.allRolesList.map((item: Role) => item.id)
    : []
  console.log(state.assginRoleList)

  state.isIndeterminate = false
}

// Single select
const handleCheckedChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  state.checkAll = checkedCount === state.allRolesList.length
  state.isIndeterminate =
    checkedCount > 0 && checkedCount < state.allRolesList.length
}

// Receive parameters from parent component
const acceptParams = (params: DrawerProps): void => {
  // Save initial value
  origiinRowData.value = JSON.parse(JSON.stringify(params.rowData))

  // If editing, clear password
  if (params.title === 'Edit') {
    params.rowData.password = ''
    params.rowData.confirmPassword = ''
  }

  // If not assigning role, fix user type to 0 and remove type validation
  if (params.title !== 'Assign Role') {
    params.rowData.type = 0
    rules.type = []
  }

  // If assigning role, handle role list...
  if (params.title === 'Assign Role') {
    const { list } = params
    state.allRolesList = list.data
    state.assginRoleList = list?.data
      .filter((item: Role) => item.selected)
      .map((item: Role) => item.id)
    state.isIndeterminate = state.assginRoleList.length > 0
  }

  drawerProps.value = params
  drawerVisible.value = true
}

const ruleFormRef = ref<FormInstance>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    console.log('valid', valid)
    if (!valid) return
    try {
      loading.value = true
      if (drawerProps.value.title === 'Assign Role') {
        const params = {
          userId: drawerProps.value.rowData.id,
          roleIdList: state.assginRoleList,
        }
        await drawerProps.value.api!(params)
      } else {
        await drawerProps.value.api!(drawerProps.value.rowData)
      }
      ElMessage.success({ message: `${drawerProps.value.title} user succeeded!` })
      drawerProps.value.getTableList!()
      drawerVisible.value = false
      loading.value = false
    } catch (error) {
      loading.value = false

      console.log(error)
    }
  })
}

defineExpose({
  acceptParams,
})
</script>
<style lang="scss" scoped></style>
