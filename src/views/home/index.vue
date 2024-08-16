<template>
  <AppPage show-footer>



    <div class="flex">
    <n-card class="w-50%" title="⚡️ 趋势" segmented>
      <VChart :option="trendOption" :init-options="{ height: 400 }" autoresize />
    </n-card>
      <n-card class="w-50%" title="⚡️ 趋势" segmented>
        <VChart :option="trendOption" :init-options="{ height: 400 }" autoresize />
      </n-card>
    </div>

  </AppPage>
</template>

<script setup>
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

const trendOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow', // 设置阴影类型为'shadow'
    },
  },
  legend: {
    top: '5%',
    data: ['star', 'fork'],
  },
  xAxis: [
    {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisPointer: {
        type: 'shadow',
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      min: 0,
      max: 3000,
      interval: 500,
      axisLabel: {
        formatter: '{value}',
      },
    },
    {
      type: 'value',
      min: 0,
      max: 500,
      interval: 100,
      axisLabel: {
        formatter: '{value}',
      },
    },
  ],
  series: [
    {
      name: 'star',
      type: 'line',
      data: [200, 320, 520, 550, 600, 805, 888, 950, 1300, 2503, 2702, 2712],
    },
    {
      name: 'fork',
      yAxisIndex: 1,
      type: 'bar',
      data: [40, 72, 110, 115, 121, 175, 180, 201, 260, 398, 423, 455],
      itemStyle: {
        color: '#4165d7', // 柱子的颜色，可以根据需要调整
      },
      barWidth: '30%', // 调整柱子的宽度
      barGap: '10%', // 柱子之间的间距
      showBackground: true, //柱状背景
      backgroundStyle: {
          color: 'rgba(150, 150, 150, 0.05)', // 背景颜色和透明度
      },

    },
  ],
}


const message = $message
</script>
