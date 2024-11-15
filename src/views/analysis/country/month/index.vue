<template>

  <CommonPage>
    <template #action>
      <div>
        <n-button type="primary" @click="exportData">导出数据</n-button>
      </div>
    </template>


    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
      :max-height="250"
      :tableMaxHeight="550"
    >

      <MeQueryItem label="型号" :label-width="70">
        <n-select v-model:value="queryItems.category" clearable :options="categoryOptions" />
      </MeQueryItem>
      <MeQueryItem label="国家" :label-width="70">
        <n-select v-model:value="queryItems.countryCode" clearable :options="countryCodeOptions" :filterable="true" />
      </MeQueryItem>
    </MeCrud>

  </CommonPage>
</template>

<script setup>
import { MeCrud, MeQueryItem } from '@/components/index.js'
import { useCrud } from '@/composables/index.js'
import api from './api.js'
import { NIcon } from 'naive-ui'
import { ArrowDownOutline, ArrowUpOutline } from '@vicons/ionicons5'
import { utils, writeFile } from 'xlsx'


defineOptions({ name: '' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  initializeData()
  $table.value?.handleSearch()
})



const columns = ref([])
async function initializeData() {
  try {
    // Fetch dictionary data first
    const { data } = await api.getAllDicData()
    if (Array.isArray(data)) {
      countryMonthColumns.value = data
        .filter(item => item.type === 'country_month_columns')
        .map(item => ({ label: `${item.name}`, value: `${item.value}` }))

      categoryOptions.value = data
        .filter(item => item.type === 'device_category_options')
        .map(item => ({ label: `${item.name}`, value: `${item.value}` }))

      countryCodeOptions.value = data
        .filter(item => item.type === 'countryCode_options')
        .map(item => ({ label: `${item.name}`, value: `${item.value}` }))


       fetchData()
    } else {
      countryMonthColumns.value = []
      categoryOptions.value = []
      countryCodeOptions.value = []
    }
  } catch (error) {
    console.error('字典数据请求失败:', error)
  }
}
// 请求数据并生成列配置的函数
async function fetchData(params) {
  try {
    const { data } = await api.read(params)

    // 确保 data 是数组
    if (!Array.isArray(data)) {
      return []
    }

    // 动态生成列配置
    if (data.length > 0) {
      const sample = data[0]
      columns.value = generateColumns(sample)
    } else {
      // 如果没有数据，设置一个默认的列配置（可选）
      columns.value = []
    }

    return data
  } catch (error) {
    console.error('数据请求失败:', error)
    return []
  }
}

// 动态生成列配置的函数
function generateColumns(sample) {
  const fixedColumn = [
    {
      title: '序号',
      key: 'index',
      align: 'center',
      width: 30,
      render(row, index) {
        return h('span', index + 1)
      }
    },
    {
    title: '国家',
    key: 'countryCn',
    align: 'center',
    width: 50, // 可以根据需要调整列宽
      render(row) {
        // 假设 `row.countryCn` 存储的是国家的中文名
        // 这里可以根据需要将中文名映射到国旗 emoji
        const flagSrc = getCountryFlag(row.countryCn);
        return h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center' } }, [
          h('img', { src: flagSrc, style: { width: '20px', marginRight: '5px' } }),
          h('span', row.countryCn)
        ]);
      }
  },
    {
      title: '总数',
      key: 'totalCount',
      align: 'center',
      width: 50, // 可以根据需要调整列宽
    }
  ]

  // 动态生成列配置
  const dynamicColumns = Object.keys(sample)
    .filter(key => key !== 'countryCn' && key !== 'totalCount' && !/^growth_rate/.test(key)) // 排除固定列
    .sort((a, b) => {
      // 处理月份列
      if (/^\d{2}$/.test(a) && /^\d{2}$/.test(b)) {
        return parseInt(b) - parseInt(a); // 按月份降序
      }

      // 处理月份列和增长率列的排序
      return (/^\d{2}$/.test(a) ? -1 : 1) - (/^\d{2}$/.test(b) ? -1 : 1);
    })
    .map(key => ({
      title: formatType(key,countryMonthColumns), // 转换增长率列标题
      key: key,
      align: 'center',
      width: 50, // 可以根据需要调整列宽
      render(row) {
        const totalCount = row[key] || 0;
        const growthRateKey = key > 10 ? `growth_rate_${key}_vs_${key-1}` : `growth_rate_${key}_vs_0${key-1}`;
        const growthRate = row[growthRateKey] || 0;

        // 根据增长率决定颜色和图标
        const color = growthRate > 0 ? 'green' : growthRate < 0 ? 'red' : 'black';
        const icon = growthRate > 0 ? h(NIcon, { style: { color: color } }, () => h(ArrowUpOutline)) :
          growthRate < 0 ? h(NIcon, { style: { color: color } }, () => h(ArrowDownOutline)) :
            null;

        return h('div', { style: { color: color } }, [
          h('span', { style: { display: 'block' } }, totalCount), // 独占一行
          h('span', { style: { display: 'inline-flex', alignItems: 'center' } }, [
            icon,
            h('span', ` (${growthRate}%)`)
          ]) // 同行显示
        ]);
      }
    }));


  return [...fixedColumn, ...dynamicColumns]
}

// 一个简单的函数，用来根据国家中文名返回国旗 emoji
function getCountryFlag(countryCn) {
  const flags = {
    'Global': 'https://vip.helloimg.com/i/2024/08/29/66d03e72d7661.png',
    '中国': 'https://flagcdn.com/w320/cn.png',
    '美国': 'https://flagcdn.com/w320/us.png',
    '英国': 'https://flagcdn.com/w320/gb.png',
    '法国': 'https://flagcdn.com/w320/fr.png',
    '德国': 'https://flagcdn.com/w320/de.png',
    '加拿大': 'https://flagcdn.com/w320/ca.png',
    '日本': 'https://flagcdn.com/w320/jp.png',
    '柬埔寨': 'https://flagcdn.com/w320/kh.png',
    '中国台湾': 'https://flagcdn.com/w320/tw.png',
    '中国香港': 'https://flagcdn.com/w320/hk.png',
    '伊朗': 'https://flagcdn.com/w320/ir.png',
    '埃及': 'https://flagcdn.com/w320/eg.png',
    '孟加拉国': 'https://flagcdn.com/w320/bd.png',
    '摩洛哥': 'https://flagcdn.com/w320/ma.png',
    '越南': 'https://flagcdn.com/w320/vn.png',
    '突尼斯': 'https://flagcdn.com/w320/tn.png',
    '阿塞拜疆': 'https://flagcdn.com/w320/az.png',
    '阿尔及利亚': 'https://flagcdn.com/w320/dz.png',
    '黎巴嫩': 'https://flagcdn.com/w320/lb.png',
    '沙特阿拉伯': 'https://flagcdn.com/w320/sa.png',
    '伊拉克': 'https://flagcdn.com/w320/iq.png',
    '马来西亚': 'https://flagcdn.com/w320/my.png',
    '智利': 'https://flagcdn.com/w320/cl.png',
    '厄瓜多尔': 'https://flagcdn.com/w320/ec.png',
    '摩尔多瓦': 'https://flagcdn.com/w320/md.png',
    '蒙古': 'https://flagcdn.com/w320/mn.png',
    '危地马拉': 'https://flagcdn.com/w320/gt.png',
    '阿根廷': 'https://flagcdn.com/w320/ar.png',
    '哥斯达黎加': 'https://flagcdn.com/w320/cr.png',
    '利比亚': 'https://flagcdn.com/w320/ly.png',
    '俄罗斯': 'https://flagcdn.com/w320/ru.png',
    '墨西哥': 'https://flagcdn.com/w320/mx.png',
    '巴基斯坦': 'https://flagcdn.com/w320/pk.png',
    '土耳其': 'https://flagcdn.com/w320/tr.png',
    '哥伦比亚': 'https://flagcdn.com/w320/co.png',
    '乌克兰': 'https://flagcdn.com/w320/ua.png',
    '阿尔巴尼亚': 'https://flagcdn.com/w320/al.png',
    '菲律宾': 'https://flagcdn.com/w320/ph.png',
    '泰国': 'https://flagcdn.com/w320/th.png',
    '委内瑞拉': 'https://flagcdn.com/w320/ve.png',
    '斯里兰卡': 'https://flagcdn.com/w320/lk.png',
    '乌干达': 'https://flagcdn.com/w320/ug.png',
    '阿联酋': 'https://flagcdn.com/w320/ae.png',
    '约旦': 'https://flagcdn.com/w320/jo.png',
    '斯洛文尼亚': 'https://flagcdn.com/w320/si.png',
    '缅甸': 'https://flagcdn.com/w320/mm.png',
    '波兰': 'https://flagcdn.com/w320/pl.png',
    '吉尔吉斯斯坦': 'https://flagcdn.com/w320/kg.png',
    '巴拿马': 'https://flagcdn.com/w320/pa.png',
    '澳大利亚': 'https://flagcdn.com/w320/au.png',
    '法属波利尼西亚': 'https://flagcdn.com/w320/pf.png',
    '意大利': 'https://flagcdn.com/w320/it.png',
    '马耳他': 'https://flagcdn.com/w320/mt.png',
    '巴西': 'https://flagcdn.com/w320/br.png',
    '莱索托': 'https://flagcdn.com/w320/ls.png',
    '西班牙': 'https://flagcdn.com/w320/es.png',
    '印度': 'https://flagcdn.com/w320/in.png',
    '尼泊尔': 'https://flagcdn.com/w320/np.png',
    '尼加拉瓜': 'https://flagcdn.com/w320/ni.png',
    '北马其顿': 'https://flagcdn.com/w320/mk.png',
    '巴拉圭': 'https://flagcdn.com/w320/py.png',
    '坦桑尼亚': 'https://flagcdn.com/w320/tz.png',
    '乌兹别克斯坦': 'https://flagcdn.com/w320/uz.png',
    '新加坡': 'https://flagcdn.com/w320/sg.png',
    '阿富汗': 'https://flagcdn.com/w320/af.png',
    '罗马尼亚': 'https://flagcdn.com/w320/ro.png',
    '瑞士': 'https://flagcdn.com/w320/ch.png',
    '塞尔维亚': 'https://flagcdn.com/w320/rs.png',
    '多米尼加共和国': 'https://flagcdn.com/w320/do.png',
    '以色列': 'https://flagcdn.com/w320/il.png',
    '卡塔尔': 'https://flagcdn.com/w320/qa.png',
    '荷兰': 'https://flagcdn.com/w320/nl.png',
    '土库曼斯坦': 'https://flagcdn.com/w320/tm.png',
    '也门': 'https://flagcdn.com/w320/ye.png',
    '瑞典': 'https://flagcdn.com/w320/se.png',
    '爱尔兰': 'https://flagcdn.com/w320/ie.png',
    '苏里南': 'https://flagcdn.com/w320/sr.png',
    '印度尼西亚': 'https://flagcdn.com/w320/id.png',
    '白俄罗斯': 'https://flagcdn.com/w320/by.png',
    '奥地利': 'https://flagcdn.com/w320/at.png',
    '阿曼': 'https://flagcdn.com/w320/om.png',
    '加蓬': 'https://flagcdn.com/w320/ga.png',
    '比利时': 'https://flagcdn.com/w320/be.png',
    '几内亚': 'https://flagcdn.com/w320/gn.png',
    '克罗地亚': 'https://flagcdn.com/w320/hr.png',
    '埃塞俄比亚': 'https://flagcdn.com/w320/et.png',
    '西撒哈拉': 'https://flagcdn.com/w320/eu.png',  // 西撒哈拉的旗帜有时难以找到，使用“欧洲”区域旗帜
    '希腊': 'https://flagcdn.com/w320/gr.png',
    '科威特': 'https://flagcdn.com/w320/kw.png',
    '芬兰': 'https://flagcdn.com/w320/fi.png',
    '安道尔': 'https://flagcdn.com/w320/ad.png',
    '中国澳门': 'https://flagcdn.com/w320/mo.png',
    '加纳': 'https://flagcdn.com/w320/gh.png',
    '美属维尔京群岛': 'https://flagcdn.com/w320/vi.png',
    '塞内加尔': 'https://flagcdn.com/w320/sn.png',
    '马尔代夫': 'https://flagcdn.com/w320/mv.png',
    '秘鲁': 'https://flagcdn.com/w320/pe.png',
    '瓜德罗普': 'https://flagcdn.com/w320/gp.png',
    '安提瓜和巴布达': 'https://flagcdn.com/w320/ag.png',
    '肯尼亚': 'https://flagcdn.com/w320/ke.png',
    '格鲁吉亚': 'https://flagcdn.com/w320/ge.png',
    '苏丹': 'https://flagcdn.com/w320/sd.png',
    '巴勒斯坦国': 'https://flagcdn.com/w320/ps.png',
    '布基纳法索': 'https://flagcdn.com/w320/bf.png',
    '尼日尔': 'https://flagcdn.com/w320/ne.png',
    '玻利维亚': 'https://flagcdn.com/w320/bo.png',
    '保加利亚': 'https://flagcdn.com/w320/bg.png',
    '莫桑比克': 'https://flagcdn.com/w320/mz.png',
    '新西兰': 'https://flagcdn.com/w320/nz.png',
    '塞浦路斯': 'https://flagcdn.com/w320/cy.png',
    '老挝': 'https://flagcdn.com/w320/la.png',
    '安哥拉': 'https://flagcdn.com/w320/ao.png',
    '海地': 'https://flagcdn.com/w320/ht.png',
    '南非': 'https://flagcdn.com/w320/za.png',
    '叙利亚': 'https://flagcdn.com/w320/sy.png',
    '伯利兹': 'https://flagcdn.com/w320/bz.png',
    '乌拉圭': 'https://flagcdn.com/w320/uy.png',
    '韩国': 'https://flagcdn.com/w320/kr.png',
    '马拉维': 'https://flagcdn.com/w320/mw.png',
    '巴巴多斯': 'https://flagcdn.com/w320/bb.png',
    '巴林': 'https://flagcdn.com/w320/bh.png',
    '黑山': 'https://flagcdn.com/w320/me.png',
    '阿鲁巴': 'https://flagcdn.com/w320/aw.png',
    '吉布提': 'https://flagcdn.com/w320/dj.png',
    '波斯尼亚和黑塞哥维那': 'https://flagcdn.com/w320/ba.png',
    '毛里塔尼亚': 'https://flagcdn.com/w320/mr.png',
    '尼日利亚': 'https://flagcdn.com/w320/ng.png',
    '百慕大': 'https://flagcdn.com/w320/bm.png',
    '葡萄牙': 'https://flagcdn.com/w320/pt.png',
    '荷属安的列斯': 'https://vip.helloimg.com/i/2024/08/29/66d03fb8f3413.png',
    '古巴': 'https://flagcdn.com/w320/cu.png',
  };


  return flags[countryCn] || '🏳️'; // 如果没有匹配，返回一个默认的旗帜
}

// 导出数据
function exportData() {
  if ($table.value) {
    const data = $table.value?.tableData;
    if (!data.length) {
      return $message.warning('没有数据');
    }

    // 生成包含序号列的列数据
    const columnsData = Array.from(columns.value).filter((item) => !!item.title && !item.hideInExcel);
    if (!columnsData.length) {
      return $message.warning('没有有效的列数据');
    }

    // 提取列标题和键
    const thKeys = columnsData.map((item) => item.key || '');

    const thData = columnsData.map((item) => item.title || '');



    // 生成数据行，如果没有序号标题，则在开头添加序号
    const trData = data.map((item, index) => {
        const row = thKeys.map((key) => {
          // 检查 key 是否为数字
          const numericKey = Number(key);
          console.log(key,numericKey)
          if (!isNaN(numericKey)) {
            // 如果是数字，拼接 growth_rate
            const growthRateKey = `growth_rate_${key}_vs_0${key-1}`;
            const growthRate = item[growthRateKey] || 0;
            console.log(growthRate);
            return item[key] + ` (${growthRate}%)`;
          } else {
            // 否则直接返回 item[key]
            return item[key];
          }
        });

        return [index + 1, ...row.slice(1)];

    });

    // 生成工作表
    const sheet = utils.aoa_to_sheet([thData, ...trData]);
    const workBook = utils.book_new();
    utils.book_append_sheet(workBook, sheet, '数据报表');

    // 获取当前日期并格式化
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 格式
    const title = '数据报表'; // 替换为实际标题或动态标题

    // 动态生成文件名
    const fileName = `${title}_${formattedDate}.xlsx`;

    // 导出 Excel 文件
    writeFile(workBook, fileName);
  }
}

const formatType = (id, type) => {
  const foundType = type.value.find(item => item.value === id);
  return foundType ? foundType.label : '';
}

const countryMonthColumns = ref([])
const categoryOptions = ref([])
const countryCodeOptions = ref([])
Promise.all([
  api.getAllDicData().then(({ data = [] }) => {
    if (Array.isArray(data)) {
      countryMonthColumns.value = data
        .filter(item => item.type === 'country_month_columns')
        .map(item => ({
          label: `${item.name}`,
          value: `${item.value}`
        }))

      categoryOptions.value = data
        .filter(item => item.type === 'device_category_options')
        .map(item => ({
          label: `${item.name}`,
          value: `${item.value}`
        }))

      countryCodeOptions.value = data
        .filter(item => item.type === 'countryCode_options')
        .map(item => ({
          label: `${item.name}`,
          value: `${item.value}`
        }))

    } else {
      countryMonthColumns.value = []
      categoryOptions.value = []
      countryCodeOptions.value = []
    }
  })
])

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleOpen,
  handleEdit,
  handleSave,
} = useCrud({
  name: '',
  initForm: { enable: true },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

</script>


