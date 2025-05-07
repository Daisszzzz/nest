<template>
  <div class="login-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="14">
        <div style="color: transparent">Left Area Placeholder</div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10">
        <el-form class="login-form">
          <div class="form-header">
            <div class="title">Hello!</div>
            <div class="title-tips">
              Welcome to {{ getEnvByName('VITE_APP_TITLE') }}!
            </div>
          </div>
          <el-form-item>
            <el-input
              placeholder="Please enter username"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              type="password"
              show-password
              placeholder="Please enter password"
            />
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="15">
                <el-input
                  placeholder="Please enter captcha"
                />
              </el-col>
              <el-col :span="8" :offset="1">
                <el-image
                  fit="contain"
                  style="height: 100%; background: white"
                  class="pointer"
                  :src="''"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn"
              type="primary"
              size="large"
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
// Only keep getEnvByName and other static methods, no logic implemented here
import { getEnvByName } from '@/utils/getEnv'
</script>

<style scoped lang="scss">
@import './index';
</style>