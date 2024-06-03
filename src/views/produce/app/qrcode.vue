<template>
  <div class="download-page">
    <!-- 你的模板代码 -->
    <p>App标识: {{ appMark }}</p>
    <div v-if="isAndroid">
      <div>
      <p>{{ AppDescription }}</p>
      <img src="@/assets/images/1.png"  alt="下载 Android 版" @click="redirectTo(androidDownloadLink)" style="cursor: pointer;" class="download-img">
      </div>
      <div>
        <img src="@/assets/images/3.png" alt="华为应用商城下载" @click="redirectTo(harmonyDownloadLink)"  style="cursor: pointer;" class="download-img ">
      </div>
    </div>
    <div v-if="isIOS">
      <p>{{ AppDescription }}</p>
      <img src="@/assets/images/2.png"  alt="下载 iOS 版" @click="redirectTo(iosDownloadLink)" style="cursor: pointer;" class="download-img">
    </div>


    <div v-if="!isAndroid && !isIOS">
      <div v-if="!isDarkMode">
        <p>您可以前往我们的官网下载。</p>
        <div>
          <img src="@/assets/images/4.jpg" alt="下载 Android 版" @click="redirectTo(androidDownloadLink)"
               style="cursor: pointer;" class="download-img ">
        </div>
        <div>
          <img src="@/assets/images/5.jpg" alt="下载 iOS 版" @click="redirectTo(iosDownloadLink)"
               style="cursor: pointer;" class="download-img ">
        </div>
        <div>
          <img src="@/assets/images/6.jpg" alt="华为应用商城下载" @click="redirectTo(harmonyDownloadLink)"
               style="cursor: pointer;" class="download-img ">
        </div>
      </div>
      <div v-if="isDarkMode">
        <p>您可以前往我们的官网下载。</p>
        <div>
          <img src="@/assets/images/1.png" alt="下载 Android 版" @click="redirectTo(androidDownloadLink)"
               style="cursor: pointer;" class="download-img ">
        </div>
        <div>
          <img src="@/assets/images/2.png" alt="下载 iOS 版" @click="redirectTo(iosDownloadLink)"
               style="cursor: pointer;" class="download-img ">
        </div>
        <div>
          <img src="@/assets/images/3.png" alt="华为应用商城下载" @click="redirectTo(harmonyDownloadLink)"
               style="cursor: pointer;" class="download-img ">
        </div>
      </div>
    </div>
  </div>


</template>

<script>
import api from './api'
export default {
  data() {
    return {
      isIOS: false,
      isAndroid: false,
      isDarkMode:false,
      appMark: '',
      autoJump:false,
      iosDownloadLink: 'https://apps.apple.com/us/app/ks-os/id6451134361?platform=iphone',
      androidDownloadLink: 'https://play.google.com/store/apps/details?id=com.kieslect.ksos&pcampaignid=web_share',
      harmonyDownloadLink:'https://www.pgyer.com/Kieslect',
      AppDescription: '这是应用介绍。',
    };
  },
  methods: {
    redirectTo(url) {
      window.open(url, '_blank');
    }
  },

  mounted() {
    // 获取路由参数 appMark
    this.appMark = this.$route.params.appMark;
    console.log(this.appMark);
    api.getAppDownload(this.appMark).then(response => {
      console.log(response)
      let responseData  = response.data;
      if (responseData.hasOwnProperty('iosUrl') && responseData.iosUrl !== null) {
        this.iosDownloadLink = responseData.iosUrl;
      }

      if (responseData.hasOwnProperty('androidUrl') && responseData.androidUrl !== null) {
        this.androidDownloadLink = responseData.androidUrl;
      }

      if (responseData.hasOwnProperty('harmonyUrl') && responseData.harmonyUrl !== null) {
        this.harmonyDownloadLink = responseData.harmonyUrl;
      }



      // 检测用户的系统类型
      const userAgent = window.navigator.userAgent.toLowerCase();
      this.isIOS = /iphone|ipad|ipod/.test(userAgent);
      this.isAndroid = /android/.test(userAgent);

      // 获取系统语言
      const userLanguage = window.navigator.language || window.navigator.userLanguage;
      const languageCode = userLanguage.substr(0, 2).toLowerCase();

      // 根据系统语言设置对应的应用介绍
      if (languageCode === 'zh') {
        if (responseData.hasOwnProperty('appDescCh') && responseData.appDescCh !== null) {
          this.AppDescription = responseData.appDescCh;
        }
      } else {
        if (responseData.hasOwnProperty('appDescEn') && responseData.appDescEn !== null) {
          this.AppDescription = responseData.appDescEn;
        }
      }

      //是否开启自动跳转
      if (this.autoJump) {
        // 如果是 iOS 设备，则跳转到 App Store
        if (this.isIOS) {
          window.location.href = this.iosDownloadLink
        }

        // 如果是 Android 设备，则跳转到 Google Play Store
        if (this.isAndroid) {
          window.location.href = this.androidDownloadLink
        }
      }
    })




    // 判断当前时间，自动切换日夜模式
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 18) {
      this.isDarkMode = false; // 白天
    } else {
      this.isDarkMode = true; // 晚上
    }
  }
};
</script>

<style scoped>

.download-page {
  text-align: center;
  margin-top: 50px;
}
.download-page {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.download-img {
  max-width: 200px; /* Adjust as needed */
  margin: 10px 0;
  cursor: pointer;
  transition: transform 0.3s;
}

.download-img:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .download-img {
    max-width: 200px; /* Adjust as needed for tablets */
  }
  .download-img:hover {
    transform: scale(1.05);
  }
}

@media (max-width: 480px) {
  .download-img {
    max-width: 150px; /* Adjust as needed for mobile phones */
  }
  .download-img:hover {
    transform: scale(1.05);
  }
}
</style>
