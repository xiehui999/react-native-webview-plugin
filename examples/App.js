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
  Text
} from 'react-native';

const html = Platform.select({
  android: require('./index.html'),
  ios: require('./index.html'),
})
export default class App extends Component {
  render() {
    console.log("--------------------,", html)
    const autoHeight = true;
    let source = html;
    source = {uri:'https://www.ishangzu.com/app/article/586'};
    return <ScrollView>
      <TouchableOpacity onPress={()=>{
        console.log("webview1",this.webview,this.webview1)
        if(!this.webview.goBackWithState()){
          console.log("11111111返回页面");
        }
      }}>
        <Text>返回</Text>
      </TouchableOpacity>
      <WebView
        style={{height: 500}}
        autoHeight={autoHeight}
        isShowSelectButton={false}
        mixedContentMode='always'
        source={html}/>
      <WebView
        ref={(ref)=>{
          this.webview=ref;
        }}
        webviewRef={(ref)=>{
          this.webview1=ref;
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
