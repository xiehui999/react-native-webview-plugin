/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import WebView from 'react-native-webview-plugin'
import {
    StyleSheet,
    View,
    Platform,
    ScrollView,
    TouchableOpacity,
    Text,
    Alert
} from 'react-native';

const html = Platform.select({
    android: require('./index.html'),
    ios: require('./index.html'),
})
export default class App extends Component {
    //接收HTML发出的数据
    _onMessage = (e) => {
        // this.setState({
        //   messagesReceivedFromWebView: this.state.messagesReceivedFromWebView + 1,
        //   message: e.nativeEvent.data,
        // })
        Alert.alert(e.nativeEvent.data)
    }
    //脚本注入
    injectJS = () => {
        const script = 'window.postMessage(\'我是脚本注入信息，通过rn注入脚本向rn发送消息（仅仅测试注入）\');';  // eslint-disable-line quotes
        if (this.webviewInject) {
            this.webviewInject.injectJavaScript(script);
        }
    }

    render() {
        console.log("--------------------,", html)
        const autoHeight = true;
        let source = html;
        source = {uri: 'https://www.ishangzu.com/app/article/586'};
        return <ScrollView>
            <View>
                <TouchableOpacity onPress={() => {
                    if (!this.webview.goBackWithState()) {
                        console.log("11111111返回页面");
                    }
                }}>
                    <Text>返回</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.injectJS()
                }>
                    <Text>脚本注入</Text>
                </TouchableOpacity>
            </View>
            <WebView
                style={{height: 100}}
                injectedJavaScript={"document.write(\"我是一个注入脚本webview \")"}
                isShowSelectButton={false}
                mixedContentMode='always'
                source={html}/>
            <WebView
                webviewRef={(ref) => {
                    this.webviewInject = ref;
                }}
                style={{height: 500}}
                autoHeight={autoHeight}
                isShowSelectButton={false}
                mixedContentMode='always'
                onMessage={this._onMessage}
                source={html}/>
            <WebView
                ref={(ref) => {
                    this.webview = ref;
                }}
                webviewRef={(ref) => {
                    this.webview1 = ref;
                }}
                style={{height: 500}}
                autoHeight={autoHeight}
                mixedContentMode='always'
                source={source}/>
        </ScrollView>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});
