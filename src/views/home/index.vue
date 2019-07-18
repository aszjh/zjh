<template>
  <div class="home">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div>
          <img src="./heima.png" alt />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 主体 -->
      <el-container>
        <!-- 左边 -->
        <el-aside :width="fazjh">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :collapse="isCollapse" :collapse-transition="false" unique-opened>
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                  <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
                <span slot="title">{{item.authName}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item :index="item.id + ''" v-for="item in item.children" :key="item.id">
                <i class="el-icon-menu"></i>
                <span>{{item.authName}}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右边 -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {},
  data () {
    return {
      // 左侧菜单
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 折叠
      isCollapse: false
    }
  },
  computed: {
    fazjh: function () {
      if (this.isCollapse) {
        return '64px'
      } else {
        return '200px'
      }
    }
  },
  created () {
    this.getMenus()
  },
  mounted () {},
  watch: {},
  methods: {
    //   退出
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenus () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 折叠按钮
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  },
  components: {}
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }

  .el-container {
    height: 100%;
    .el-aside {
      background-color: #333744;
      .el-menu {
        border-right: none;
      }
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
</style>
