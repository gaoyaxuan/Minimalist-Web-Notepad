<script setup>
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import {ref, computed, watch, onBeforeUnmount} from 'vue'
import QuillCursors from 'quill-cursors'
import * as Y from 'yjs'
import {WebsocketProvider} from 'y-websocket'
import {QuillBinding} from 'y-quill'
import {QuillEditor} from '@vueup/vue-quill';
import {useRoute} from 'vue-router';
import randomName from "@/utils/random-name.js";

const content = ref("");
const onlineUser = ref(1);
const defaultTile = document.title;
const props = defineProps({
  /* 编辑器的内容 */
  modelValue: {
    type: String,
  },
  /* 高度 */
  height: {
    type: Number,
    default: null,
  },
  /* 最小高度 */
  minHeight: {
    type: Number,
    default: null,
  },
  /* 只读 */
  readOnly: {
    type: Boolean,
    default: false,
  }
});

const modules = ref({
  name: 'cursors',
  module: QuillCursors,
  options: {
    hideDelayMs: 2000,
  },
})

const styles = computed(() => {
  let style = {};
  if (props.minHeight) {
    style.minHeight = `${props.minHeight}px`;
  }
  if (props.height) {
    style.height = `${props.height}px`;
  }

  return style;
});

watch(() => props.modelValue, (v) => {
  if (v !== content.value) {
    content.value = v === undefined ? "<p></p>" : v;
  }
}, {immediate: true});


// 工具栏配置
const toolbar = ref([
  ["bold", "italic", "underline", "strike"],      // 加粗 斜体 下划线 删除线
  ["blockquote", "code-block"],                   // 引用  代码块
  [{list: "ordered"}, {list: "bullet"}],      // 有序、无序列表
  [{indent: "-1"}, {indent: "+1"}],           // 缩进
  [{size: ["small", false, "large", "huge"]}],  // 字体大小
  [{header: [1, 2, 3, 4, 5, 6, false]}],        // 标题
  [{color: []}, {background: []}],            // 字体颜色、字体背景颜色
  [{align: []}],                                // 对齐方式
  ["clean"],                                      // 清除文本格式
  ["link", "image",]                      // 链接、图片、视频
])

const options = ref({
  theme: "snow",
  bounds: document.body,
  debug: "warn",
  modules: {},
  placeholder: "请输入内容",
  readOnly: props.readOnly,
});

function editorReady(quill) {
  const ydoc = new Y.Doc()
  const route = useRoute();
  const randomPath = route.params.randomPath;
  const nickName = randomName.getNickName();
  let wsURL;
  if (import.meta.env.MODE === 'production') {
    console.log("当前环境是prod")
    if (window.location.protocol === "http:") {
      console.log("当前是HTTP");
      wsURL = "ws://" + window.location.host
    } else if (window.location.protocol === "https:") {
      console.log("当前是HTTPS");
      wsURL = "wss://" + window.location.host
    }
  } else {
    console.log("当前环境是是dev")
    wsURL = "ws://10.0.0.7:8874"
  }
  console.log("当前ws地址:" + wsURL)
  const provider = new WebsocketProvider(
      wsURL, // use the public ws server
      // `ws${location.protocol.slice(4)}//${location.host}/ws`, // alternatively: use the local ws server (run `npm start` in root directory)
      randomPath,
      ydoc
  )
  const ytext = ydoc.getText('quill')
  new QuillBinding(ytext, quill, provider.awareness)

  provider.awareness.setLocalStateField('user', {
    name: nickName,
    color: 'red'
  })

  provider.awareness.on('change', () => {
    const states = provider.awareness.getStates();
    if (states) {
      onlineUser.value = states.size
    }
  });

  watch(onlineUser, () => {
    document.title = defaultTile + "-  " + onlineUser.value + " 在线"

  }, {immediate: true})

}

</script>

<template>
  <!--  <div class="tool">-->
  <!--    <button class="my-button">更改昵称</button>-->
  <!--  </div >-->
  <div class="container">

    <quill-editor
        ref="quillEditorRef"
        v-model:content="content"
        contentType="html"
        @textChange="(e) => $emit('update:modelValue', content)"
        @ready="editorReady"
        :style="styles"
        :options="options"
        :modules="modules"
        :toolbar="toolbar"
    >
    </quill-editor>
  </div>
</template>


<style>
.ql-container {
  overflow: visible !important;
}

/*
.ql-cursors {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  z-index: -1;
}
*/

.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
