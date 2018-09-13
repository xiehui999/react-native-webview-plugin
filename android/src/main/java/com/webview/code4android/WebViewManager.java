package com.webview.code4android;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import com.facebook.common.logging.FLog;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.common.build.ReactBuildConfig;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.webview.ReactWebViewManager;

import java.util.ArrayList;


/**
 * Created by Code4Android on 2018/7/30
 */
@ReactModule(name = WebViewManager.REACT_CLASS)
public class WebViewManager extends ReactWebViewManager {
    protected static final String REACT_CLASS = "CustomWebView";
    private WebViewPackage aPackage;

    @Override
    protected WebView createViewInstance(final ThemedReactContext reactContext) {
        ReactWebView webView = (ReactWebView) super.createViewInstance(reactContext);
        webView.setWebChromeClient(new WebChromeClient() {

            @Override
            public boolean onConsoleMessage(ConsoleMessage message) {
                if (ReactBuildConfig.DEBUG) {
                    return super.onConsoleMessage(message);
                }
                return true;
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
            public boolean onShowFileChooser(
                    WebView webView,
                    ValueCallback<Uri[]> filePathCallback,
                    FileChooserParams fileChooserParams
            ) {
                return getModule().startPhotoPickerIntent(filePathCallback, fileChooserParams);
            }
        });

        // force web content debugging on
        if (ReactBuildConfig.DEBUG && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        return webView;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected void addEventEmitters(ThemedReactContext reactContext, WebView view) {
        view.setWebViewClient(new CustomWebViewClient());
    }

    public WebViewPackage getPackage() {
        return this.aPackage;
    }

    public void setPackage(WebViewPackage aPackage) {
        this.aPackage = aPackage;
    }

    public WebViewModule getModule() {
        return this.aPackage.getModule();
    }

    @ReactProp(name = "isShowSelectButton")
    public void setMixedContentMode(WebView view, boolean isShowSelectButton) {
        Log.e("isShowSelectButton", String.valueOf(isShowSelectButton));
        if (this.aPackage != null) {
            this.aPackage.getModule().setShowSelectButton(isShowSelectButton);
        }
    }

    protected static class CustomWebViewClient extends ReactWebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            //            return super.shouldOverrideUrlLoading(view, url);
            boolean useDefaultIntent = false;
            if (mUrlPrefixesForDefaultIntent != null && mUrlPrefixesForDefaultIntent.size() > 0) {
                ArrayList<Object> urlPrefixesForDefaultIntent =
                        mUrlPrefixesForDefaultIntent.toArrayList();
                for (Object urlPrefix : urlPrefixesForDefaultIntent) {
                    if (url.startsWith((String) urlPrefix)) {
                        useDefaultIntent = true;
                        break;
                    }
                }
            }
            if (!useDefaultIntent &&
                    (url.startsWith("http://") || url.startsWith("https://") ||
                            url.startsWith("file://") || url.equals("about:blank"))) {
                return false;
            } else {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    view.getContext().startActivity(intent);
                } catch (Exception e) {
                    FLog.w(ReactConstants.TAG, "activity not found to handle uri scheme for: " + url, e);
                }
                return true;
            }

        }
    }
}
