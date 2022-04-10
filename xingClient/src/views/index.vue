<template>
  <el-container class="home-container">
    <el-header></el-header>
    <el-container>
      <el-aside :width="asideWidth">
        <el-menu :default-active="active" :collapse="isCollapse" style="border-right: none"  @select="handleSelect">
          <el-menu-item @click="isCol()" index="#">
            <i v-if="isCollapse" class="el-icon-s-unfold"></i>
            <span slot="title" v-if="!isCollapse" style="padding-right:30px"><i class="el-icon-s-fold"></i></span>
          </el-menu-item>

          <el-submenu index="#">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span slot="title">管理员</span>
            </template>
            <el-menu-item @click="quit()">
              登出
            </el-menu-item>
          </el-submenu>

          <el-menu-item index="index/write">
            <i class="el-icon-edit"></i>
            <span slot="title">新闻编写</span>
          </el-menu-item>

          <el-menu-item index="index/manage">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">新闻管理</span>
          </el-menu-item>

        </el-menu>
      </el-aside>

      <el-main style="background-color:WhiteSmoke;height:100%">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'index',
  mounted () {
    const href = window.location.href
    const index = href.split('/index/')[1]
    const index1 = index.split('?')[0]
    this.active = 'index/' + index1
    // console.log(this.active)
  },
  updated () {
    const href = window.location.href
    const index = href.split('/index/')[1]
    const index1 = index.split('?')[0]
    this.active = 'index/' + index1
    // console.log(this.active)
  },
  methods: {
    quit () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    isCol () {
      if (this.isCollapse) {
        this.isCollapse = false
        this.asideWidth = '200px'
      } else {
        this.isCollapse = true
        this.asideWidth = '64px'
      }
    },
    handleSelect (key, keyPath) {
      // console.log(key, keyPath)
      const href = keyPath[0].split('index/')[1]
      if (key !== '#') {
        this.$router.push(href)
        this.active = keyPath[0]
      }
    }
  },
  data () {
    return {
      active: 'index/write',
      asideWidth: '200px',
      isCollapse: false
    }
  }
}
</script>

<style scoped>
.el-container{
  overflow-y: auto;
}
.el-header{
  /* background: url(../../public/附件3：logo2.png) no-repeat; */
  background-size: 20%;
  background-position: 0% 50%;
  border-bottom: .8px solid rgba(231, 231, 231, 0.897);
}
.home-container{
  height: 100% !important;
}
.el-aside{
  background-color: white;
}
.el-tooltip__popper.is-dark {
  background: #FFF !important;
  color: #FFF;
}
</style>
