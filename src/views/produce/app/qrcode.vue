<template>
  <div class="download-page">
    <div v-if="isIOS">
      <p>{{ iosAppDescription }}</p>
      <a :href="iosDownloadLink" target="_blank">下载 iOS 版</a>
    </div>
    <div v-else-if="isAndroid">
      <p>{{ androidAppDescription }}</p>
      <a :href="androidDownloadLink" target="_blank">下载 Android 版</a>
    </div>
    <div v-else>
      <p>您可以前往我们的官网下载。</p>
      <a href="https://www.kieslect.com/app-download/" target="_blank">前往官网</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isIOS: false,
      isAndroid: false,
      iosDownloadLink: 'https://apps.apple.com/us/app/ks-os/id6451134361?platform=iphone',
      androidDownloadLink: 'https://play.google.com/store/apps/details?id=com.kieslect.ksos&pcampaignid=web_share',
      iosAppDescription: '这是 iOS 版本的应用介绍。',
      androidAppDescription: '这是 Android 版本的应用介绍。'
    };
  },
  mounted() {
    // 检测用户的系统类型
    const userAgent = window.navigator.userAgent.toLowerCase();
    this.isIOS = /iphone|ipad|ipod/.test(userAgent);
    this.isAndroid = /android/.test(userAgent);

    // 获取系统语言
    const userLanguage = window.navigator.language || window.navigator.userLanguage;
    const languageCode = userLanguage.substr(0, 2).toLowerCase();

    // 根据系统语言设置对应的应用介绍
    if (languageCode === 'zh') {
      this.iosAppDescription = '这是中文版的 iOS 应用介绍。';
      this.androidAppDescription = '这是中文版的 Android 应用介绍。';
    } else {
      this.iosAppDescription = 'This is the English version of the iOS app description.';
      this.androidAppDescription = 'This is the English version of the Android app description.';
    }

    // 如果是 iOS 设备，则跳转到 App Store
    if (this.isIOS) {
      window.location.href = 'https://apps.apple.com/us/app/ks-os/id6451134361?platform=iphone';
    }

    // 如果是 Android 设备，则跳转到 Google Play Store
    if (this.isAndroid) {
      window.location.href = 'https://play.google.com/store/apps/details?id=com.kieslect.ksos&pcampaignid=web_share';
    }
  }
};
</script>

<style scoped>
.download-page {
  text-align: center;
  margin-top: 50px;
}
</style>
