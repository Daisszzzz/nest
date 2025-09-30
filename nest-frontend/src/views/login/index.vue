<template>
  <div class="login-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="14">
        <div style="color: transparent">Left Area Placeholder</div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            status-icon
            :rules="rules"
            class="login-form"
        >
          <div class="form-header">
            <div class="title">Hello!</div>
            <div class="title-tips">
              Welcome to {{ getEnvByName('VITE_APP_TITLE') }}!
            </div>
          </div>
          <el-form-item>
            <el-input
              v-model="ruleForm.username"
              placeholder="Please enter username"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="ruleForm.password"
              type="password"
              show-password
              placeholder="Please enter password"
            />
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="15">
                <el-input
                  v-model="ruleForm.captchaCode"
                  placeholder="Please enter captcha"
                />
              </el-col>
              <el-col :span="8" :offset="1">
                <el-image
                  fit="contain"
                  style="height: 100%; background: white"
                  class="pointer"
                  :src="captcha.image"
                  @click="getCaptcha"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn"
              type="primary"
              size="large"
              :loading="loading"
              @click="submitForm(ruleFormRef)"
            >
              Login
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import type { FormInstance } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { HOME_URL } from '@/config/config'
import { timeFix } from '@/utils/index'
import { getCode, getUserInfo, login } from '@/api/user'
import { getEnvByName } from '@/utils/getEnv'
const router = useRouter()
const route = useRoute()
const ruleFormRef = ref<FormInstance>()
const userStore = useUserStore()
const ruleForm = reactive({
  username: 'admin',
  password: '123456',
  captchaKey: '',
  captchaCode: '',
})
const loading = ref(false)
const validateUsername = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Username cannot be empty'))
  } else if (value.length < 4) {
    callback(new Error('Username cannot be less than 4 characters'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Password cannot be empty'))
  } else if (value.length < 6) {
    callback(new Error('Password cannot be less than 6 characters'))
  } else {
    callback()
  }
}
const validateCaptchaCode = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Captcha code cannot be empty'))
  } else {
    callback()
  }
}
const rules = reactive({
  username: [{ required: true, validator: validateUsername }],
  password: [{ required: true, validator: validatePassword }],
  captchaCode: [{ required: true, validator: validateCaptchaCode }],
})
// Captcha data
const captcha = ref({
  image: '',
  key: '',
})
// Get Captcha
const getCaptcha = async () => {
  try {
    const { data } = await getCode()
    captcha.value = data
    ruleForm.captchaKey = data.key
  } catch (error) {
    console.log(error)
  }
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) return
    try {
      loading.value = true
      const { data } = await login(ruleForm)
      userStore.setToken(data)
      router.replace((route.query.redirect as string) || HOME_URL)

      const userInfo = await getUserInfo()
      userStore.setUserInfo(userInfo.data)

      ElNotification({
        title: `hi,${timeFix()}!`,
        message: `Welcome back`,
        type: 'success',
      })
    } finally {
      loading.value = false
    }
  })
}
onMounted(() => {
  getCaptcha()
})
</script>

<style scoped lang="scss">
@import './index';
</style>