# react-native-webview-plugin

# 功能

ReactNative WebView实现Android端图片和视频的拍摄和选择，以及ios，android根据webView内容自动设置高度（WebView嵌套在ScrollView中问题），修复现在Android端WebView偶先的闪退bug

# 安装
```
npm install react-native-webview-plugin  
或者
yarn add react-native-webview-plugin 

```
## 自动link

```
react-native link react-native-webview-plugin
```
## 手动link
- Android

Application文件 getPackages增加new WebViewPackage()
```
 @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new WebViewPackage()
            );
        }
```
app下build.gradle添加依赖
```
compile project(':react-native-webview-plugin')
```

settings.gradle文件添加
```
include ':react-native-webview-plugin'
project(':react-native-webview-plugin').projectDir = new File(settingsDir, '../../android')
```

- IOS

不需要link


# API使用

## 引入
```
import { WebView } from 'react-native-webview-plugin'
```

该webview具备ReactNative中webview的所有功能，并新增如下属性和方法

# 获取webview引用

- ref

ref是rn默认获取引用方式，通过ref使用自定义webview所有方法，目前可以调用goForward，goBack，reload，stopLoading函数，新增函数goBackWithState，该方法可以具备goBack的功能，并同时返回canGoBack属性。

- webviewRef (func)

通过次函数方式获得的引用等同于使用RN原生webview ref

# autoHeight（bool 默认false）
使用autoHeigh会自动打开JavaScript，webview的高度在请求成功后会自动设置为webview加载内容的高度（主要用在webview嵌套scrollview中）

# mixedContentMode（String,默认always）（Android）
mixedContentMode是指定webview是否应该允许安全链接（https）页面中加载非安全链接，原生默认never，现在默认调整为always,(默认情况下webview预览图片时会失败，需要点击两次才成功)

# hardwareBack（bool 默认true）（Android）
改属性表示是否监听Android返回键，并自动执行goback，目的主要是为了优化用户体验，防止点击返回键盘关闭整个webview页面，若不使用可设置false

# isShowSelectButton(bool 默认true)(Android)
是否显示选择文件按钮


