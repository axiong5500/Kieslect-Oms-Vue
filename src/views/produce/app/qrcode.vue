<template>
  <div class="download-page">
    <div v-if="loading">
      <p>加载中...</p>
    </div>
    <div v-else>
<!--      <div class="header">-->
<!--        <img src="@/assets/images/title.png" alt="标题" class="title-img">-->
<!--      </div>-->

      <div class="logo-center">
        <img :src=appLogo alt="logo" class="logo-img">
        <h2>{{ appName }}</h2>
      </div>


      <div v-if="isDarkMode">
        <div v-if="isAndroid">
          <div>
            <img src="@/assets/images/201.png" alt="下载 Android 版" @click="redirectTo(androidDownloadLink)"
                 style="cursor: pointer;" class="download-img">
          </div>
          <div>
            <img src="@/assets/images/203.png" alt="华为应用商城下载" @click="redirectTo(harmonyDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
          <div>
            <img src="@/assets/images/204.png" alt="KISLECT应用商城下载" @click="redirectTo(localDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
        </div>
        <div v-if="isIOS">
          <img src="@/assets/images/202.png" alt="下载 iOS 版" @click="redirectTo(iosDownloadLink)"
               style="cursor: pointer;" class="download-img">
        </div>
      </div>
      <div v-if="!isDarkMode">
        <div v-if="isAndroid">
          <div>
            <img src="@/assets/images/101.png" alt="下载 Android 版" @click="redirectTo(androidDownloadLink)"
                 style="cursor: pointer;" class="download-img">
          </div>
          <div>
            <img src="@/assets/images/103.png" alt="华为应用商城下载" @click="redirectTo(harmonyDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
          <div>
            <img src="@/assets/images/104.png" alt="KIESLECT应用商城下载" @click="redirectTo(localDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
        </div>
        <div v-if="isIOS">
          <img src="@/assets/images/102.png" alt="下载 iOS 版" @click="redirectTo(iosDownloadLink)"
               style="cursor: pointer;" class="download-img">
        </div>
      </div>
      <div v-if="!isAndroid && !isIOS">
        <div v-if="!isDarkMode">
          <div>
            <img src="@/assets/images/101.png" alt="下载 Android 版" @click="redirectTo(androidDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
          <div>
            <img src="@/assets/images/102.png" alt="下载 iOS 版" @click="redirectTo(iosDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
          <div>
            <img src="@/assets/images/103.png" alt="华为应用商城下载" @click="redirectTo(harmonyDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
          <div>
            <img src="@/assets/images/104.png" alt="KIESLECT应用商城下载" @click="redirectTo(localDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
        </div>
        <div v-if="isDarkMode">
          <div>
            <img src="@/assets/images/201.png" alt="下载 Android 版" @click="redirectTo(androidDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
          <div>
            <img src="@/assets/images/202.png" alt="下载 iOS 版" @click="redirectTo(iosDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
          <div>
            <img src="@/assets/images/203.png" alt="华为应用商城下载" @click="redirectTo(harmonyDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
          <div>
            <img src="@/assets/images/204.png" alt="KIESLECT应用商城下载" @click="redirectTo(localDownloadLink)"
                 style="cursor: pointer;" class="download-img ">
          </div>
        </div>
      </div>

<!--      <div class="foot">-->
<!--        <img src='@/assets/images/foot.png' alt="foot" class="foot-img">-->
<!--      </div>-->
    </div>

  </div>



</template>

<script>
import api from './api'

const domain_url = 'https://app.kieslect.top'

export default {
  data() {
    return {
      isIOS: false,
      isAndroid: false,
      isDarkMode: false,
      appMark: '',
      autoJump: false,
      iosDownloadLink: 'https://apps.apple.com/us/app/ks-os/id6451134361?platform=iphone',
      androidDownloadLink: 'https://play.google.com/store/apps/details?id=com.kieslect.ksos&pcampaignid=web_share',
      harmonyDownloadLink: 'https://www.pgyer.com/Kieslect',
      localDownloadLink: '',
      AppDescription: '这是应用介绍。',
      localDownDomain: 'https://app.kieslect.top',
      loading: true,
      appName: '',
      appLogo: ''
    }
  },
  methods: {
    redirectTo(url) {
      window.open(url, '_blank')
    }
  },

  mounted() {
    // 获取路由参数 appMark
    this.appMark = this.$route.params.appMark
    console.log(this.appMark)
    api.getAppDownload(this.appMark).then(response => {
      console.log(response)
      let responseData = response.data
      if (responseData.hasOwnProperty('iosUrl') && responseData.iosUrl !== null) {
        this.iosDownloadLink = responseData.iosUrl
      }

      if (responseData.hasOwnProperty('androidUrl') && responseData.androidUrl !== null) {
        this.androidDownloadLink = responseData.androidUrl
      }

      if (responseData.hasOwnProperty('harmonyUrl') && responseData.harmonyUrl !== null) {
        this.harmonyDownloadLink = responseData.harmonyUrl
      }

      if (responseData.hasOwnProperty('localUrl') && responseData.localUrl !== null) {
        this.localDownloadLink = this.localDownDomain + responseData.localUrl
      }

      if (responseData.hasOwnProperty('appName') && responseData.appName !== null) {
        this.appName = responseData.appName
      }

      if (responseData.hasOwnProperty('appLogo') && responseData.appLogo !== null) {
        this.appLogo = domain_url + responseData.appLogo
      }


      // 检测用户的系统类型
      const userAgent = window.navigator.userAgent.toLowerCase()
      this.isIOS = /iphone|ipad|ipod/.test(userAgent)
      this.isAndroid = /android/.test(userAgent)

      // 获取系统语言
      const userLanguage = window.navigator.language || window.navigator.userLanguage
      const languageCode = userLanguage.substr(0, 2).toLowerCase()

      // 根据系统语言设置对应的应用介绍
      if (languageCode === 'zh') {
        if (responseData.hasOwnProperty('appDescCh') && responseData.appDescCh !== null) {
          this.AppDescription = responseData.appDescCh
        }
      } else {
        if (responseData.hasOwnProperty('appDescEn') && responseData.appDescEn !== null) {
          this.AppDescription = responseData.appDescEn
        }
      }

      this.loading = false


      // 如果是 iOS 设备，则跳转到 App Store
      if (this.isIOS) {
        window.location.href = this.iosDownloadLink
      }
      //是否开启自动跳转
      if (this.autoJump) {
        // 如果是 Android 设备，则跳转到 Google Play Store
        if (this.isAndroid) {
          window.location.href = this.androidDownloadLink
        }
      }


    })

    // 判断当前时间，自动切换日夜模式
    const currentHour = new Date().getHours()
    if (currentHour >= 6 && currentHour < 18) {
      this.isDarkMode = false // 白天
    } else {
      this.isDarkMode = true // 晚上
    }

  }
}
</script>

<style scoped>


.download-page {
  text-align: center;
  font-family: Arial, sans-serif;
  height: 200vh; /* Set height to 100% of the viewport height */
  overflow-y: auto; /* Allow vertical scrolling when content exceeds height */
}


.header {
  text-align: right; /* Align the header content to the right */
  margin: 0 auto;
  width: 100%; /* Ensure the header takes up the full width */

}

.title-img {

  max-width: 100%; /* Max width for desktop */
  width: auto;
  margin-right: -10vh;
  margin-top: -5vh;
}

.logo-center {
  display: flex;
  flex-direction: column; /* Arrange items in a column */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Center items vertically */
  width: auto; /* Adjust the width as needed */
  margin: 0 auto; /* Center the container itself */
  text-align: center; /* Center the text inside the container */
}

.logo-img {
  max-width: 100px; /* Adjust as needed */
  margin-bottom: 10px; /* Space between the logo and the heading */
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

.foot {
  text-align: left; /* Align the header content to the right */
  margin: 0 auto;
  width: 100%; /* Ensure the header takes up the full width */
}

.foot-img {
  max-width: 100%; /* Max width for desktop */
  width: auto;
  margin-left: -10vh;
  margin-top: 5vh;
}
/* 响应式调整 - 平板设备 */
@media (max-width: 768px) {
  .title-img {
    max-width: 100%; /* Adjust as needed for tablets */
  }

  .logo-center {
    align-items: center; /* Ensure alignment to the center on tablets */
  }

  .download-img {
    max-width: 200px; /* Adjust as needed for tablets */
  }

  .download-img:hover {
    transform: scale(1.05);
  }

  .foot {
    position: fixed; /* 设置为固定定位 */
    left: 0;
    bottom: 0;
    text-align: left; /* Ensure right alignment on mobile as well */
  }

  .foot-img {
    max-width: 100%; /* Adjust as needed for tablets */
  }
}
/* 响应式调整 - 手机设备 */
@media (max-width: 480px) {
  .header {
    position: fixed; /* 设置为固定定位 */
    right: 0;
    top: 0;
    text-align: right; /* Ensure right alignment on mobile as well */
  }

  .title-img {
    max-width: 100%; /* Max width for mobile */
    width: auto;
    margin-top: -12vh;
    margin-right: -12vh;
  }

  .logo-center {
    align-items: center; /* Ensure alignment to the center on small mobile screens */
    margin-top: 16vh; /* Add margin top for spacing on mobile */
  }

  .download-img {
    max-width: 150px; /* Adjust as needed for mobile phones */
  }

  .download-img:hover {
    transform: scale(1.05);
  }

  .foot {
    position: fixed; /* 设置为固定定位 */
    left: 0;
    bottom: 0;
    text-align: left; /* Ensure right alignment on mobile as well */
  }

  .foot-img {
    max-width: 100%; /* Max width for mobile */
    width: auto;
    margin-bottom: -12vh;
    margin-left: -12vh;
  }
}
</style>
