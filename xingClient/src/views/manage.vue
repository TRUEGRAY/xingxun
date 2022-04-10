<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      border
      style="width:80%;margin:auto"
      :max-height="maxHeight-80"
    >
      <el-table-column
        fixed="left"
        prop="id"
        label="新闻编号"
        width="100"
      >
      </el-table-column>
      <!-- 提交时间 -->
      <el-table-column
        prop="time"
        label="提交时间"
        width="200"
      >
        <template slot-scope="scope">
          {{scope.row.time}}
        </template>
      </el-table-column>

      <el-table-column
        prop="title"
        label="标题"
        width="200"
      >
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>

      <el-table-column
        prop="author"
        label="作者"
        width="200"
      >
        <template slot-scope="scope">
          {{scope.row.author}}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        fixed="right"
        label="操作"
        width="250"
      >
        <template slot-scope="scope">
          <el-button
            @click="deleteRow(scope.row.id)"
            size="small"
          >删除</el-button>
          <el-button
            @click="updateRow(scope.row.id,scope.row.title,scope.row.author)"
            size="small"
          >更新</el-button>
          <el-button
            @click="detailRow(scope.row.id,scope.row.title,scope.row.author)"
            size="small"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="width:80%;margin:auto"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10,20,30,50]"
      :page-size="postData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog
      :visible.sync="upDialogVisible"
      width="80%;"
    >
      <h1 style="text-align: center;padding:0px;margin:0px;font-size:30px;">新闻查看</h1>
      <div
        class="play"
        v-html="htmlData"
      ></div>
    </el-dialog>
  </div>
</template>

<script>
import { postRequest } from '../util/api'
// import router from 'vue-router'

export default {
  methods: {
    updateRow (id, title, author) {
      this.$router.push({
        path: 'write',
        query: { id: id, title: title, author: author }
      })
    },
    deleteRow (id) {
      this.$confirm('此操作将永久删除这行信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const formData = new FormData()
          formData.append('id', id)
          postRequest('http://127.0.0.1:7001/delete', formData).then((resp) => {
            if (resp) {
              this.initTableData()
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    detailRow (id, title, author) {
      const formData = new FormData()
      formData.append('id', id)
      postRequest('http://127.0.0.1:7001/detail', formData).then((resp) => {
        if (resp) {
          this.htmlData = resp.data.result
          this.htmlData =
            `<h2 style="text-align:center;">${title}</h2><p style="text-align:center;color:rgb(153,153,153);font-size:12px;">作者：${author}</p>` +
            this.htmlData
        }
      })
      console.log(this.htmlData)
      this.upDialogVisible = true
    },
    timestampToTime (timestamp) {
      const date = new Date(timestamp * 1000)
      const Y = date.getFullYear() + '-'
      const M = date.getMonth() + 1 + '-'
      const D = date.getDate()
      return Y + M + D
    },
    initTableData () {
      const formData = new FormData()
      formData.append('pageSize', this.postData.pageSize)
      formData.append('index', this.postData.page)
      postRequest('http://127.0.0.1:7001/index', formData).then((resp) => {
        if (resp) {
          const result = resp.data
          const len = result.length
          this.tableData = result.slice(0, len - 1)
          this.total = result[len - 1]
        }
      })
    },
    handleSizeChange (val) {
      this.postData.pageSize = val
      this.initTableData()
    },
    handleCurrentChange (val) {
      this.postData.page = (val - 1) * this.postData.pageSize
      this.initTableData()
    }
  },

  mounted () {
    this.initTableData()
    this.maxHeight = document.body.clientHeight
  },
  updated () {
    this.maxHeight = document.body.clientHeight
  },

  data () {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      postData: {
        pageSize: 10,
        page: 0
      },
      maxHeight: '',
      upDialogVisible: false,
      htmlData: ''
    }
  }
}
</script>
<style scoped>
.el-dialog {
  padding: 0px;
}
.download {
  text-decoration: none;
  color: #ffffff;
}
.button {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
div.play {
  padding: 35px;
  padding-top: 0px;
  margin: 40px;
  overflow: auto;
  border: 1px solid var(--ck-color-toolbar-border);
  border-radius: 5px;
}
div.button {
  float: right;
}
.table {
  margin: 0% !important;
  padding: 0% !important;
}
table {
  display: table;
  border-collapse: collapse;
  width: 100%;
  height: 100%;
}
.table table th {
  font-weight: 700;
  background: rgba(172, 172, 172, 0.05);
}
.table table td,
.table table th {
  min-width: 2em;
  padding: 0.4em;
  border: 0.4px solid #f7f7f7;
}
tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
.image {
  display: table;
  clear: both;
  text-align: center;
  margin: 0.9em auto;
  width: 50%;
}
p img {
  width: 55%;
}
img {
  width: 100%;
  margin-bottom: -1%;
  padding: 0%;
  border: 3px solid;
  border-color: var(--ck-color-widget-blurred-border);
}
.image > figcaption {
  display: table-caption;
  caption-side: bottom;
  word-break: break-word;
  color: rgb(153, 153, 153);
  background-color: var(--ck-color-image-caption-background);
  padding: 0.6em;
  font-size: 0.75em;
  outline-offset: -1px;
}
.image-style-side {
  position: relative;
  left: -2%;
  float: right;
  margin-left: var(--ck-image-style-spacing);
}
</style>
