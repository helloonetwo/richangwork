# searchForm搜索框组件
## 封装搜索框组件 searchForm  

```vue
<template>
  <s-form
    class="operate-wrap"
    ref="conditionRef"
    v-bind="$attrs"
    :label-width="labelWidth"
    :form="queryState.form"
    @submit.prevent
  >
    <s-form-item
      v-for="(opt, i) in cOpts"
      :key="i"
      :label="opt.label"
      v-bind="$attrs"
      class="search-form-item"
      :class="[opt.className, { render_label: opt.labelRender }]"
    >
      <!-- 自定义输入框插槽 -->
      <template v-if="opt.slotName">
        <slot :name="opt.slotName" :param="queryState.form"></slot>
      </template>
      <component
        v-if="!opt.slotName && !opt.isSelfCom && opt.comp.includes('date')"
        :is="opt.comp"
        v-bind="
          typeof opt.bind == 'function'
            ? opt.bind(queryState.form)
            : { clearable: true, filterable: true, ...$attrs, ...opt.bind }
        "
        :placeholder="opt.placeholder || getPlaceholder(opt)"
        @change="handleEvent(opt.event, queryState.form[opt.dataIndex])"
        v-model:value="queryState.form[opt.dataIndex]"
        v-on="cEvent(opt)"
      />
      <component
        v-if="!opt.slotName && !opt.comp.includes('date')"
        :is="opt.comp"
        v-bind="
          typeof opt.bind == 'function'
            ? opt.bind(queryState.form)
            : { clearable: true, filterable: true, ...$attrs, ...opt.bind }
        "
        @change="handleEvent(opt.event, queryState.form[opt.dataIndex])"
        v-on="cEvent(opt)"
        v-model:value="queryState.form[opt.dataIndex]"
      >
        <component
          :is="compChildName(opt)"
          v-for="(value, key, index) in selectListType(opt)"
          :key="index"
          :disabled="value.disabled"
          :label="compChildLabel(opt, value)"
          :value="compChildValue(opt, value, key)"
          >{{ compChildShowLabel(opt, value) }}</component
        >
      </component>
    </s-form-item>
    <s-button
      @click="checkHandle"
      v-bind="queryAttrs"
      :loading="loading"
      class="m-l-60"
      type="primary"
      isSearch
      >{{ $t("common.search") }}</s-button
    >
    <s-button
      v-if="reset"
      isSearch
      isReset
      v-bind="resetAttrs"
      @click="resetHandle"
      >{{ $t("common.reset") }}</s-button
    >
  </s-form>
</template>

<script setup name="TQueryCondition">
import { computed, ref, watch,  reactive } from "vue";
const props = defineProps({
  opts: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  labelWidth: {
    type: String,
    default: "80px",
  },
  // 查询按钮配置
  btnCheckBind: {
    type: Object,
    default: () => ({}),
  },
  // 重置按钮配置
  btnResetBind: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  reset: {
    type: Boolean,
    default: true,
  },
  boolEnter: {
    type: Boolean,
    default: true,
  },
  // 是否显示收起和展开
  isShowOpen: {
    type: Boolean,
    default: false,
  },
  // 是否默认展开
  isExpansion: {
    type: Boolean,
    default: false,
  },
});
// 初始化表单数据
let queryState = reactive({
  form: Object.keys(props.opts).reduce((acc, field) => {
    acc[field] = props.opts[field].defaultVal || null;
    return acc;
  }, {}),
});
let colLength = ref(4);
let open = ref(false);
// 默认展开
if (props.isExpansion) {
  open.value = true;
} else {
  open.value = false;
}
// 查询按钮配置
const queryAttrs = computed(() => {
  return { type: "primary", size: "default", ...props.btnCheckBind };
});
// 重置按钮配置
const resetAttrs = computed(() => {
  return { size: "default", ...props.btnResetBind };
});
const cOpts = computed(() => {
  let renderSpan = 0;
  return Object.keys(props.opts).reduce((acc, field) => {
    let opt = {
      ...props.opts[field],
    };
    // 收起、展开操作
    if (props.isShowOpen) {
      renderSpan += opt.span ?? 1;
      if (!open.value && renderSpan - 1 >= colLength.value) return acc;
    }
    opt.dataIndex = field;
    acc[field] = opt;
    return acc;
  }, {});
});

// 引用第三方事件
const cEvent = computed(() => {
  return (opt) => {
    // console.log('opt--', opt)
    let event = { ...opt.eventHandle };
    let changeEvent = {};
    Object.keys(event).forEach((v) => {
      changeEvent[v] = (e) => {
        if (
          opt.comp.includes("select") ||
          opt.comp.includes("picker") ||
          opt.comp.includes("date")
        ) {
          event[v] && event[v](e, queryState.form);
        } else {
          if (e) {
            event[v] && event[v](e, queryState.form);
          } else {
            event[v] && event[v](queryState.form);
          }
        }
      };
    });
    return { ...changeEvent };
  };
});
// 初始化表单数据
const initForm = (opts, keepVal = false) => {
  return Object.keys(opts).reduce((acc, field) => {
    if (keepVal && queryState.form) {
      acc[field] = queryState.form[field];
    } else if (opts[field].defaultVal) {
      acc[field] = opts[field].defaultVal;
    } else {
      acc[field] = null;
    }
    return acc;
  }, {});
};
const emits = defineEmits(["handleEvent", "submit", "reset"]);
// 下拉选择表格组件 ref
const tselecttableref = ref({});
// 下拉选择表格组件 动态ref
const handleRef = (el, key) => {
  if (el) {
    tselecttableref.value[`tselecttableref-${key}`] = el;
  }
};
// 重置
const resetHandle = () => {
  queryState.form = initForm(props.opts);
  emits("reset", queryState.form);
  checkHandle("reset");
};
// 查询条件change事件
const handleEvent = (type, val) => {
  emits("handleEvent", type, val, queryState.form);
};
// 查询
const checkHandle = (flagText = false) => {
  emits("submit", queryState.form, flagText);
};
// 子组件名称
const compChildName = computed(() => {
  return (opt) => {
    switch (opt.type) {
      case "checkbox":
        return "el-checkbox";
      case "radio":
        return "el-radio";
      case "select-arr":
      case "select-obj":
        return "el-option";
    }
  };
});
// 下拉数据
const selectListType = computed(() => {
  return (opt) => {
    if (opt.listTypeInfo) {
      return opt.listTypeInfo[opt.list];
    } else {
      return [];
    }
  };
});
// 子子组件label
const compChildLabel = computed(() => {
  return (opt, value) => {
    switch (opt.type) {
      case "radio":
      case "checkbox":
        return value.value;
      case "el-select-multiple":
      case "select-arr":
        return value[opt.arrLabel || "dictLabel"];
      case "select-obj":
        return value;
    }
  };
});
// 子子组件value
const compChildValue = computed(() => {
  return (opt, value, key) => {
    switch (opt.type) {
      case "radio":
      case "checkbox":
        return value.value;
      case "el-select-multiple":
      case "select-arr":
        return value[opt.arrKey || "dictValue"];
      case "select-obj":
        return key;
    }
  };
});
// 子子组件文字展示
const compChildShowLabel = computed(() => {
  return (opt, value) => {
    switch (opt.type) {
      case "radio":
      case "checkbox":
        return value.label;
      case "el-select-multiple":
      case "select-arr":
        return value[opt.arrLabel || "dictLabel"];
      case "select-obj":
        return value;
    }
  };
});
watch(
  () => props.opts,
  (opts, oldValue) => {
    queryState.form = initForm(opts, true);
  }
);

// 暴露方法出去
defineExpose({ queryState, props, colLength });
</script>

<style lang="less">
.search-form-item {
  margin-right: 16px;
  margin-bottom: 5px !important;
}
.operate-wrap {
  flex-wrap: wrap;
}
.s-input {
    height: 32px;
    color: var(--s-text-color);
    border-color: var(--s-btn-bd-color);
    background: var(--s-input-bg-color);
    border-radius: 4px;
    width: 120px;
}
</style>
```

## 页面使用

```vue
<template>
      <searchForm
        :opts="opts"
        @submit="conditionEnter"
        @handleEvent="handleEvent"
        :btnResetBind="{ size: 'small' }"
      />
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
let state = reactive({
  queryData: {
    userName: null, // 登录名
    phonenumber: null, // 手机号码
    workshopNum: null,
    date: null,
    date1: null,
  },
  listTypeInfo: {
    sexList: [
      {
        dictLabel: '前纺一车间',
        dictValue: 'W1',
      },
      {
        dictLabel: '前纺二车间',
        dictValue: 'W2',
      },
    ],
  },
})
const opts = computed(() => {
  return {
    userName: {
      label: '登录名称',
      comp: 'el-input',
    },
    phonenumber: {
      label: '手机号码',
      comp: 'el-input',
    },
    workshopNum: {
      label: '车间',
      comp: 'el-select',
      changeEvent: 'change',
      type: 'select-arr',
      list: 'sexList',
      listTypeInfo: state.listTypeInfo,
    },
    date1: {
      label: '日期',
      comp: 'el-date-picker',
      bind: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
    date: {
      label: '装炉时间',
      comp: 'el-date-picker',
      span: 2,
      event: 'date',
      bind: {
        rangeSeparator: '-',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD',
        type: 'daterange',
      },
    },
  }
})
// 最终参数获取
const getQueryData = computed(() => {
  const { userName, phonenumber, workshopNum, date, date1 } = state.queryData
  console.log(444, userName, phonenumber, date1)
  return {
    userName,
    workshopNum,
    phonenumber,
    date1,
    beginDate: date && date[0] ? date[0] : null,
    endDate: date && date[1] ? date[1] : null,
  }
})
// 查询条件change事件
const handleEvent = (type, val) => {
  // console.log(111, type, val)
  switch (type) {
    case 'date':
      console.log('获取event==date的数据', val)
      break
  }
}
// 点击查询按钮
const conditionEnter = (data: any) => {
  console.log(1122, data)
  state.queryData = data
  console.log('最终参数', getQueryData.value)
}
</script>

```