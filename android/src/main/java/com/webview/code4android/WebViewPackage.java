package com.webview.code4android;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Code4Android on 2018/7/30
 */
public class WebViewPackage implements ReactPackage {
    private WebViewManager manager;
    private WebViewModule module;

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        module = new WebViewModule(reactContext);
        module.setPackage(this);
        modules.add(module);
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        ArrayList<ViewManager> list = new ArrayList<>();
        manager = new WebViewManager();
        manager.setPackage(this);
        list.add(manager);
        return list;
    }

    public WebViewManager getManager() {
        return manager;
    }

    public WebViewModule getModule() {
        return module;
    }
}
