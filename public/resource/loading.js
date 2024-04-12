/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:50:27
 * @Email: zclzone@outlook.com
 * Copyright © 2024 遥遥领先 | https://www.kieslect.com
 **********************************/

function addThemeColorCssVars() {
  const key = '__THEME_COLOR__'
  const defaultColor = '#316c72'
  const themeColor = localStorage.getItem(key) || defaultColor
  const cssVars = `--primary-color: ${themeColor}`
  document.documentElement.style.cssText = cssVars
}

addThemeColorCssVars()

