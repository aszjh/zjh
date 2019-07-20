<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userlist" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStat(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showusermod(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleUserfa(scope.row.id)"></el-button>
            <!-- 分配角色-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog title="添加新用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
      <!-- 表单 -->
      <el-form :model="addForm" label-width="70px" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="usermod" width="50%" @close="ieduserRefas">
      <el-form ref="ieduserRef" :model="ieduserdata" label-width="70px" :rules="ieduserRules">
        <el-form-item label="用户名">
          <el-input v-model="ieduserdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ieduserdata.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ieduserdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="usermod = false">取 消</el-button>
        <el-button type="primary" @click="ieddefine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 用户数据集合
      userlist: [],
      // 记录总数
      total: 0,
      // 添加用户
      dialogVisible: false,
      // 修改用户
      usermod: false,
      ieduserdata: {},
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改表单校验规则
      ieduserRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created () {
    this.getUsers()
  },
  mounted () {},
  watch: {},
  methods: {
    // 获取用户数据
    async getUsers () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getUsers()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getUsers()
    },
    // 向后台传递开关状态
    async userStat (val) {
      // console.log(val)
      const { data: res } = await this.$http.put(
        `users/${val.id}/state/${val.mg_state}`
      )
      if (res.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.dialogVisible = false
        // 重新获取用户列表数据
        this.getUsers()
      })
    },
    // 获取要修改的用户数据
    async showusermod (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑用户失败!')
      }
      this.$message.success('编辑用户成功！')
      this.ieduserdata = res.data
      // console.log(this.ieduserdata)
      this.usermod = true
    },
    // 重置
    ieduserRefas () {
      this.$refs.ieduserRef.resetFields()
    },
    // 确定修改
    ieddefine () {
      // 提交前的预验证
      this.$refs.ieduserRef.validate(async valid => {
        if (!valid) return
        // 发起请求
        const { data: res } = await this.$http.put(
          'users/' + this.ieduserdata.id,
          {
            email: this.ieduserdata.email,
            mobile: this.ieduserdata.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败!')
        }
        this.$message.success('修改用户成功！')
      })
      // 隐藏对话框
      this.usermod = false
      // 重新获取用户列表数据
      this.getUsers()
    },
    // 确定删除
    async deleUserfa (id) {
      // 点击删除弹框
      const deleResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除返回字符串confirm取消删除返回cancel
      console.log(deleResult)
      if (deleResult === 'cancel') {
        return this.$message.info('已取消')
      }
      // 发送删除请求
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getUsers()
    }
  },
  components: {}
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 10px;
}
</style>
