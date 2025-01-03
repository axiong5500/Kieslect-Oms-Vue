<template>
  <AppPage show-footer>
    <div class="flex">
      <n-card class="w-50%" title="每日激活数据" segmented>
        <div class="flex justify-between items-center mb-4 ml-50">
          <n-radio-group v-model:value="selectedModel" @change="updateChartData">
            <n-radio value="Actor">Actor</n-radio>
            <n-radio value="KS3">KS3</n-radio>
            <n-radio value="Balancs">Balancs</n-radio>
            <n-radio value="Scykei Feel">Feel</n-radio>
            <n-radio value="Kieslect Pura">Pura</n-radio>
            <n-radio value="KS2">KS2</n-radio>
            <n-radio value="Scykei Movis">Movis</n-radio>
            <n-radio value="Scykei Civis">Civis</n-radio>
          </n-radio-group>
        </div>
        <div class="flex justify-between items-center mb-4 ml-50">
          <n-radio-group v-model:value="selectedTimeRange" @change="updateChartData">
            <n-radio value="last_7_days">近7天</n-radio>
            <n-radio value="last_30_days">近30天</n-radio>
            <n-radio value="last_month">上一个月</n-radio>
            <n-radio value="current_month">本月</n-radio>
            <n-radio value="last_year">去年</n-radio>
            <n-radio value="this_year">今年</n-radio>
            <n-radio value="current_quarter">本季度</n-radio>
            <n-radio value="last_quarter">上一季度</n-radio>
          </n-radio-group>
        </div>
        <VChart :option="trendOption" :init-options="{ height: 300 }" autoresize />
      </n-card>

      <!-- 添加第二个柱状图 -->
      <n-card class="w-50%" title="月度激活数据" segmented>
        <!-- 年份选择 -->
        <div class="flex justify-between items-center mb-4 ml-50">
          <n-radio-group v-model:value="selectedYear" @change="updateMonthlyChartData">
            <n-radio value="2023">2023</n-radio>
            <n-radio value="2024">2024</n-radio>
            <n-radio value="2025">2025</n-radio>
          </n-radio-group>
        </div>
        <!-- 月份选择 -->
        <div class="flex justify-between items-center mb-4 ml-50">
          <n-radio-group v-model:value="selectedMonth" @change="updateMonthlyChartData">
            <n-radio value="1">1月</n-radio>
            <n-radio value="2">2月</n-radio>
            <n-radio value="3">3月</n-radio>
            <n-radio value="4">4月</n-radio>
            <n-radio value="5">5月</n-radio>
            <n-radio value="6">6月</n-radio>
            <n-radio value="7">7月</n-radio>
            <n-radio value="8">8月</n-radio>
            <n-radio value="9">9月</n-radio>
            <n-radio value="10">10月</n-radio>
            <n-radio value="11">11月</n-radio>
            <n-radio value="12">12月</n-radio>
          </n-radio-group>
        </div>
        <!-- 第二个柱状图 -->
        <VChart :option="barChartOption" :init-options="{ height: 300 }" autoresize />
      </n-card>
    </div>


    <div class="flex">

      <n-card  title="每日激活数据" segmented>
        <div class="flex justify-between items-center mb-4 ml-50">
          <n-radio-group v-model:value="selectedModel" @change="updateChartData">
            <n-radio value="Actor">Actor</n-radio>
            <n-radio value="KS3">KS3</n-radio>
            <n-radio value="Balancs">Balancs</n-radio>
            <n-radio value="Scykei Feel">Feel</n-radio>
            <n-radio value="Kieslect Pura">Pura</n-radio>
            <n-radio value="KS2">KS2</n-radio>
            <n-radio value="Scykei Movis">Movis</n-radio>
            <n-radio value="Scykei Civis">Civis</n-radio>
          </n-radio-group>
        </div>
        <div class="flex justify-between items-center mb-4 ml-50">
          <n-radio-group v-model:value="selectedTimeRange" @change="updateChartData">
            <n-radio value="last_7_days">近7天</n-radio>
            <n-radio value="last_30_days">近30天</n-radio>
            <n-radio value="last_month">上一个月</n-radio>
            <n-radio value="current_month">本月</n-radio>
            <n-radio value="last_year">去年</n-radio>
            <n-radio value="this_year">今年</n-radio>
            <n-radio value="current_quarter">本季度</n-radio>
            <n-radio value="last_quarter">上一季度</n-radio>
          </n-radio-group>
        </div>
        <VChart :option="barChart2Option" :init-options="{ height: 300 }" autoresize />
      </n-card>

    </div>

  </AppPage>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { request } from '@/utils/index.js'; // 假设 request 是封装的接口请求工具
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { AppPage } from '@/components/index.js'

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  PieChart,
])

const selectedModel = ref('Actor'); // 默认选择的型号
const selectedTimeRange = ref('last_30_days'); // 默认选择的时间范围
// 获取当前日期
const today = new Date();
const currentYear = today.getFullYear(); // 当前年份
const currentMonth = today.getMonth() + 1; // 当前月份 (注意：月份从0开始，所以要加1)

// 定义响应式变量
const selectedYear = ref(currentYear.toString()); // 默认选择当前年份
const selectedMonth = ref(currentMonth.toString()); // 默认选择当前月份

const allData = ref([]); // 用于存储接口返回的全部数据
const monthlyData = ref([]); // 存储每月激活数据
const trendOption = ref({
  tooltip: { trigger: 'axis' },
  legend: { top: '5%', data: [] },
  xAxis: { type: 'category', data: [], },
  yAxis: { type: 'value', min: 0, splitLine: { show: true } },
  series: []
});
// 柱状图选项
const barChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow', // 设置阴影类型为'shadow'
    },
  },

  xAxis: [
    {
      type: 'category',
      data: [],
      axisPointer: {
        type: 'shadow',
      },
      axisLabel: {
        interval: 0, // 确保显示所有标签
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
      splitLine: {
        show: true, // 隐藏横向网格线
      },
    },
  ],
  series: [
    {
      yAxisIndex: 0, // 确保与 yAxis 数组中的索引匹配
      type: 'bar',
      data: [],
      itemStyle: {
        color: '#4165d7', // 柱子的颜色，可以根据需要调整
      },
      barWidth: '30%', // 调整柱子的宽度
      barGap: '10%', // 柱子之间的间距
      showBackground: false, //柱状背景
      backgroundStyle: {
        color: 'rgba(150, 150, 150, 0.05)', // 背景颜色和透明度
      },
      label: {
        show: true, // 显示标签
        position: 'top', // 标签位置在柱子顶部
        formatter: '{c}', // 显示数值
        color: '#6b6969', // 标签颜色设置为黑色
        fontWeight: 'bold', // 标签字体加粗
      },
    },
  ],
});

// 柱状图选项
const barChart2Option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow', // 设置阴影类型为'shadow'
    },
  },

  xAxis: [
    {
      type: 'category',
      data: [],
      axisPointer: {
        type: 'shadow',
      },
      axisLabel: {
        interval: 0, // 确保显示所有标签
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
      splitLine: {
        show: true, // 隐藏横向网格线
      },
    },
  ],
  series: [
    {
      yAxisIndex: 0, // 确保与 yAxis 数组中的索引匹配
      type: 'bar',
      data: [],
      itemStyle: {
        color: '#4165d7', // 柱子的颜色，可以根据需要调整
      },
      barWidth: '30%', // 调整柱子的宽度
      barGap: '10%', // 柱子之间的间距
      showBackground: false, //柱状背景
      backgroundStyle: {
        color: 'rgba(150, 150, 150, 0.05)', // 背景颜色和透明度
      },
      label: {
        show: true, // 显示标签
        position: 'top', // 标签位置在柱子顶部
        formatter: '{c}', // 显示数值
        color: '#6b6969', // 标签颜色设置为黑色
        fontWeight: 'bold', // 标签字体加粗
      },
    },
  ],
});


// 根据时间范围筛选数据
const filterDataByTimeRange = (data, timeRange) => {
  const currentNow = new Date();
  const now = new Date(currentNow);
  now.setDate(currentNow.getDate()); // 昨天
  now.setHours(0, 0, 0, 0); // 设置为0:00:00
  let filteredData = [];

  switch (timeRange) {
    case 'last_7_days':
      filteredData = data.filter(item => {
        const itemDate = new Date(item.activationDate);
        return (now - itemDate) / (1000 * 60 * 60 * 24) <= 7;
      });
      break;
    case 'last_30_days':
      filteredData = data.filter(item => {
        const itemDate = new Date(item.activationDate);
        return (now - itemDate) / (1000 * 60 * 60 * 24) <= 30;
      });
      break;
    case 'last_month':
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredData = data.filter(item => {
        const itemDate = new Date(item.activationDate);
        return itemDate >= lastMonth && itemDate < thisMonth;
      });
      break;
    case 'current_month':
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredData = data.filter(item => new Date(item.activationDate) >= currentMonthStart);
      break;
    case 'last_year':
      const lastYear = now.getFullYear() - 1;
      filteredData = data.filter(item => new Date(item.activationDate).getFullYear() === lastYear);
      break;
    case 'this_year':
      const thisYear = now.getFullYear();
      filteredData = data.filter(item => new Date(item.activationDate).getFullYear() === thisYear);
      break;
    case 'current_quarter':
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      filteredData = data.filter(item => new Date(item.activationDate) >= quarterStart);
      break;
    case 'last_quarter':
      const lastQuarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const lastQuarterStart = new Date(lastQuarterEnd.getFullYear(), lastQuarterEnd.getMonth() - 3, 1);
      filteredData = data.filter(item => {
        const itemDate = new Date(item.activationDate);
        return itemDate >= lastQuarterStart && itemDate < lastQuarterEnd;
      });
      break;
    default:
      filteredData = data;
  }

  return filteredData;
};

// 获取每日激活数据
const fetchDailyData = async () => {
  try {
    const response = await request.get('/oms/analysis/device/daily/getList'); // 获取每日数据
    allData.value = response.data; // 存储全部每日数据
    updateChartData(); // 更新图表数据
  } catch (error) {
    console.error('Failed to fetch country data:', error);
  }
};

// 获取每月激活数据
const fetchMonthlyData = async () => {
  try {
    const response = await request.get('/oms/analysis/device/month/getList'); // 获取每月数据
    monthlyData.value = response.data; // 存储全部每月数据
    updateMonthlyChartData(); // 更新每月图表数据
  } catch (error) {
    console.error('Failed to fetch monthly data:', error);
  }
};

// 调用获取数据的函数
const loadData = async () => {
  await fetchDailyData(); // 获取每日激活数据
  await fetchMonthlyData(); // 获取每月激活数据
};

// 更新图表数据
const updateChartData = () => {
  const filteredData = filterDataByTimeRange(allData.value, selectedTimeRange.value); // 筛选数据
  const dates = filteredData.map(item => item.activationDate).reverse(); // 获取日期并反转
  const modelData = filteredData.map(item => item[selectedModel.value]).reverse(); // 获取选中型号的数据并反转

  // 计算日均值，并四舍五入为整数
  const total = modelData.reduce((sum, value) => sum + value, 0);
  const average = Math.round(total / modelData.length); // 四舍五入

  const averageLine = new Array(modelData.length).fill(average); // 创建一个全是平均值的数组

  // 更新图表的配置
  trendOption.value.xAxis.data = dates; // 设置反转后的日期
  trendOption.value.series = [
    {
      name: selectedModel.value,
      type: 'line',
      data: modelData, // 设置反转后的数据
      symbol: 'none',
    },
    {
      name: '平均线',
      type: 'line',
      data: averageLine, // 添加平均线数据
      symbol: 'none',
      itemStyle: {
        color: '#FF0000', // 自定义平均线点的颜色
      },
      lineStyle: {
        type: 'dashed', // 设为虚线样式
        color: '#FF0000' // 设置平均线颜色为红色
      }
    }
  ];
  trendOption.value.legend.data = [selectedModel.value, '平均线']; // 更新图例


  // 更新x轴的类别数据
  barChart2Option.value.xAxis[0].data = dates;
  barChart2Option.value.xAxis[0].axisLabel = {
    interval: 0, // 显示所有标签
    rotate: 45,  // 旋转标签，使其以45度角显示
  };

  // 更新柱状图数据
  barChart2Option.value.series[0].data = modelData;
};

// 更新每月图表数据
const updateMonthlyChartData = () => {
  const filteredMonthlyData = monthlyData.value.filter(item => {
    const itemDate = new Date(item.month);
    // 筛选出选中的年份和月份的数据
    return (
      itemDate.getFullYear() === parseInt(selectedYear.value) &&
      itemDate.getMonth() + 1 === parseInt(selectedMonth.value)
    );
  });

  // 型号名称与别名映射关系
  const modelNameAliasMap = {
    'Actor': 'Actor',
    'KS3': 'KS3',
    'Balancs': 'Balancs',
    'Kieslect Pura': 'Pura',
    'KS2': 'KS2',
    'Scykei Movis': 'Movis',
    'Scykei Civis': 'Civis',
    'Scykei Feel': 'Feel',
  };

  // 获取不同型号的数据并映射到图表数据中
  const modelNames = ['Actor', 'KS3', 'Balancs', 'Kieslect Pura', 'KS2', 'Scykei Movis', 'Scykei Civis', 'Scykei Feel'];
  const modelData = modelNames.map(model => {
    return filteredMonthlyData.reduce((sum, item) => sum + (item[model] || 0), 0);
  });

  // 更新柱状图的配置
  barChartOption.value.series[0].data = modelData; // 更新柱状图数据
  barChartOption.value.xAxis[0].data = modelNames.map(name => modelNameAliasMap[name]);

  // 如果需要重新渲染图表，这里可以直接操作组件的响应式变量或刷新图表
};






// 页面加载时获取数据
onMounted(() => {
  loadData();
});
</script>


<style>
.n-card > .n-card-header {
  padding: 10px 0 0;
  text-align: center;
}
.n-card.n-card--content-segmented > .n-card__content:not(:first-child), .n-card.n-card--content-soft-segmented > .n-card__content:not(:first-child) {
  border-top: 0
}
</style>
