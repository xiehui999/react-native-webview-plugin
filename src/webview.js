import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  WebView,
  requireNativeComponent,
  NativeModules,
  Platform,
  BackHandler
} from "react-native";

const BaseScript =
    `
    (function () {
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            if (window.postMessage) {
               window.postMessage(JSON.stringify({
                type: 'setHeight',
                height: height,
              }))
            }
          }
        }
        setTimeout(changeHeight, 150);
    } ())
    `;

export default class CustomWebView extends Component {
  static propTypes = {
    ...WebView.propTypes,
    autoHeight: PropTypes.bool,
    hardwareBack: PropTypes.bool,
    webviewRef: PropTypes.func,
    isShowSelectButton: PropTypes.bool,
    mixedContentMode: PropTypes.oneOf(['never', 'always', 'compatibility']),
  };
  //mixedContentMode本来默认never
  static defaultProps = {
    autoHeight: false,
    hardwareBack: true,
    mixedContentMode: 'always',
    isShowSelectButton: true,
  };
  state = {
    contentHeight: null,
  };

  componentDidMount() {
    if (Platform.OS === 'android' && this.props.hardwareBack) {
      this.backHandle = BackHandler.addEventListener('hardwareBackPress', () => {
        if (this.canGoBack && this.webview) {
          this.webview.goBack();
          return true;
        }
        return false;
      });
    }
  }

  componentWillUnmount() {
    if (this.backHandle) {
      this.backHandle.remove();
    }
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    const {webviewRef, style, autoHeight, injectedJavaScript, javaScriptEnabled, ...props} = this.props;
    const Props = {};
    let heightStyle = {};
    if (autoHeight) {
      Props.injectedJavaScript = (injectedJavaScript ? `\n ${injectedJavaScript}` : "") + BaseScript;
      Props.javaScriptEnabled = true;
      heightStyle = this.state.contentHeight ? {height: this.state.contentHeight} : {};
    } else {
      if (javaScriptEnabled != undefined) Props.javaScriptEnabled = javaScriptEnabled;
      if (injectedJavaScript) {
        Props.injectedJavaScript = (injectedJavaScript ? `\n ${injectedJavaScript}` : "") + BaseScript;
        Props.javaScriptEnabled = true
      }
    }
    return (
        <WebView
            ref={(ref) => {
              this.webview = ref;
              if (webviewRef) {
                webviewRef(ref);
              }
            }}
            {...props}
            style={[style, heightStyle]}
            {...Props}
            onNavigationStateChange={this._onNavigationStateChange}
            onMessage={this._onMessage}
            nativeConfig={this.getNativeConfig()}
        />
    );
  }

  goForward = () => {
    if (this.webview) {
      this.webview.goForward();
    }
  };
  /**
   * 获取当前canGoBack状态，当可以返回时并执行自动执行goBack
   * @returns {boolean}
   */
  goBackWithState = () => {
    let canGoBackTem = !!this.canGoBack;
    if (canGoBackTem) {
      this.goBack();
    }
    return canGoBackTem;
  };
  goBack = () => {
    if (this.webview) {
      this.webview.goBack();
    }
  };
  reload = () => {
    if (this.webview) {
      this.webview.reload();
    }
  };
  stopLoading = () => {
    if (this.webview) {
      this.webview.stopLoading();
    }
  };
  _onNavigationStateChange = (navState) => {
    console.log(navState);
    this.canGoBack = navState.canGoBack;
    if (this.props.onNavigationStateChange) {
      this.props.onNavigationStateChange(navState)
    }
  };
  /**
   * html发送过来的交互消息
   */
  _onMessage = (event) => {
    try {
      const action = JSON.parse(event.nativeEvent.data);
      if (action.type === 'setHeight' && action.height > 0) {
        this.setState({contentHeight: action.height});
        return;
      }
      if (action.type !== 'setHeight' && this.props.onMessage) {
        this.props.onMessage(event);
      }
    } catch (error) {
      if (this.props.onMessage) {
        this.props.onMessage(event);
      }
    }
  }

  getNativeConfig() {
    if (Platform.OS !== "android") {
      return null;
    }
    return {
      component: RCTCustomWebView,
      props: {
        isShowSelectButton: this.props.isShowSelectButton
      }
    };
  }
}

const RCTCustomWebView = requireNativeComponent(
    "CustomWebView",
    CustomWebView,
    WebView.extraNativeComponentConfig
);

