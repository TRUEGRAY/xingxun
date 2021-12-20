<template>
  <div class="ed">
    <el-backtop target=".ed"></el-backtop> <!-- .el指的是父组件 -->
    <h2 class="page-component__scroll" style="margin-top: 0%;">编辑区：</h2>
    <div class="in">
      <div><span style="font-size:22px;margin-right:10px;color:rgb(78, 78, 78)">标题:</span><input v-model="title"></div>
      <div><span style="font-size:22px;margin-right:10px;color:rgb(78,78,78)">作者:</span><input  v-model="author"></div>
    </div>
    <div id="toolbar-container"></div>
    <!-- 编辑器容器 -->
    <div id="editor"></div>
    <el-button plain @click="play" icon="el-icon-view">预览</el-button>
    <!-- <el-button plain @click="play" v-show="!cilckPlay">关闭预览</el-button> -->
    <div class="button">
      <el-button plain @click="replay()">重置</el-button>
      <el-button plain @click="submit()">提交</el-button>
    </div>
     <el-dialog :visible.sync="isPlay" width="100%;" >
      <h1 style="text-align: center;padding:0px;margin:0px;font-size:30px;">新闻预览</h1>
      <div class="play" v-html="htmlD"></div>
    </el-dialog>
    <!-- <div id="P" v-show="isPlay" class="play" v-html="htmlD"></div> -->
  </div>
</template>

<script>

import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
import UploadImageAdapter from '../static/uploadImageAdapter'
import { postRequest } from '../util/api'

export default {
  name: 'ClassicEditor',
  data () {
    return {
      id: '',
      isupdated: false,
      isPlay: false,
      // cilckPlay: true,
      title: '',
      author: '',
      data: '',
      htmlD: '',
      editor: null
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.isupdated = true
      this.id = this.$route.query.id
      this.title = this.$route.query.title
      this.author = this.$route.query.author
      this.Detailtask(this.id)
    } else {
      this.initEditor('')
    }
    // document.getElementsByClassName('ed')[0].addEventListener('scroll', this.handleScrollx, true)
  },

  methods: {
    // handleScrollx () {
    //   const roll = document.getElementsByClassName('ed')[0].scrollTop
    //   if (roll === 100) {
    //     document.getElementsByClassName('.ck-toolbar')[0].style = 'position:fixed'
    //   }
    // },
    mess (mes, type) {
      this.$message({
        message: mes,
        type: type
      })
    },
    submit () {
      if (this.title === '') {
        this.mess('标题不能是空哦', 'error')
      } else {
        const formData = new FormData()
        let url = 'http://127.0.0.1:7001/add'
        if (this.isupdated) {
          formData.append('id', this.id)
          url = 'http://127.0.0.1:7001/update'
          formData.append('containerUP', this.data)
        }
        formData.append('title', this.title)
        formData.append('author', this.author)
        formData.append('containers', this.data)
        postRequest(
          url,
          formData
        ).then(res => {
          if (res) {
            this.mess('提交成功', 'success')
            this.replay()
            if (this.isupdated) {
              this.$router.push('manage')
            }
          }
        })
      }
    },
    replay () {
      this.setContent('')
      this.title = ''
      this.author = ''
      this.data = ''
      this.htmlD = ''
    },
    Detailtask (id) {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('id', id)
        postRequest(
          'http://127.0.0.1:7001/detail',
          formData
        ).then(res => {
          if (res) {
            const h = res.data.result
            this.initEditor(h)
            this.data = h
          }
        })
      })
    },
    play () {
      this.htmlD = `<h2 style="text-align:center;">${this.title}</h2><p style="text-align:center;color:rgb(153,153,153);font-size:12px;">作者：${this.author}</p>` + this.data
      this.isPlay = true
    },
    initEditor (htmlData) {
      ClassicEditor.builtinPlugins.map(plugin => plugin.pluginName)
      ClassicEditor.create(document.querySelector('#editor'), {
        language: 'zh-cn',
        toolbar: [
          'heading',
          '|',
          'bold',
          'alignment',
          'italic',
          'Link',
          'bulletedList',
          'numberedList',
          '|',
          'imageUpload',
          '|',
          'undo', // 撤销
          'redo'// 重做
        ]
      }).then(editor => {
        const toolbarContainer = document.querySelector('#toolbar-container')
        toolbarContainer.appendChild(editor.ui.view.toolbar.element)
        // 正式初始化编辑器
        this.editor = editor
        editor.setData(htmlData)
        // 使用图片上传适配器
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
          if (this.isupdated) return new UploadImageAdapter(loader, this.id)
          else return new UploadImageAdapter(loader)
        }

        // 监听数据变化
        editor.model.document.on('change:data', () => {
          const Data = editor.getData()
          this.data = Data
        })
      }).catch(e => {
      })
    },

    setContent (val) {
      this.editor.setData(val)
    }
  }

}
</script>

<style>
  body {
    height: 100% !important;
    margin: 20px auto;
    overflow-y:hidden;
  }
  .ed{
    height: 100% !important;
    max-width: 75%;
    margin: auto;
    overflow-y:auto;
  }
  .ck-rounded-corners{
    min-height: calc(54vh);
    margin-bottom: 10px;
  }
  .ck.ck-editor__editable_inline {
    padding: 15px;
    border-radius: 0px 0px 5px 5px !important;
    border: 1px solid transparent;
  }
  .ck-content .image-inline img, .ck-content .image-inline picture {
    flex-grow: 1;
    flex-shrink: 1;
    margin: auto !important;
  }
  .ck.ck-toolbar {
    background: var(--ck-color-toolbar-background);
    padding: 0 var(--ck-spacing-small);
    border: 1px solid var(--ck-color-toolbar-border);
    border-radius: 5px 5px 0px 0px !important;
  }
  .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused{
    outline: none;
    border: 1px solid var(--ck-color-toolbar-border) !important;
  }
  .ck-content .image-inline {
    display: block !important;
  }
  .in{
    display:-webkit-flex;
    display: flex;
    justify-content: space-around;
  }
   .table{
    margin: 0% !important;
    padding: 0% !important;
  }
  table {
    display: table;
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    height: 100%;
  }
  .table table th {
    font-weight: 700;
    background: rgba(172, 172, 172, 0.05);
  }
  .table table td,.table table th {
    min-width: 2em;
    padding: 0.4em;
    border: .4px solid #eeeeee;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  input{
    max-width: 75%;
    height: 30px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid var(--ck-color-toolbar-border)
  }
  input:focus{
    outline: none;
    border-style:solid;
    border-color: #aebfc4;
    box-shadow: 0 0 10px #d1e0e7;
  }
  div.play{
    background-color: white;
    padding: 35px;
    padding-top: 0px;
    margin: auto;
    overflow: auto;
    margin-top: 40px;
    border: 1px solid var(--ck-color-toolbar-border);
    border-radius: 5px;
  }
  div.button{
    float: right;
  }
  .image{
    display: table;
    clear: both;
    text-align: center;
    margin: 0.9em auto;
    width: 50%;
  }
  img{
    margin: auto;
    width: 100%;
    margin-bottom: -1%;
    padding: 0%;
    border:3px solid;
    border-color: var(--ck-color-widget-blurred-border);
  }
  .image>figcaption {
    display: table-caption;
    caption-side: bottom;
    word-break: break-word;
    color:rgb(153,153,153) !important;
    background-color: var(--ck-color-image-caption-background);
    padding: 0.6em;
    font-size: .75em;
    outline-offset: -1px;
  }
  .image-style-side {
    position: relative;
    left: -2%;
    float: right;
    margin-left: var(--ck-image-style-spacing);
  }
</style>
