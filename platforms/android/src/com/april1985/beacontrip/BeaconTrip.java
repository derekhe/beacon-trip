/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.april1985.beacontrip;

import android.os.Build;
import android.os.Bundle;
import android.webkit.WebView;
import com.radiusnetworks.ibeacon.IBeaconConsumer;
import com.radiusnetworks.ibeacon.IBeaconManager;
import org.apache.cordova.Config;
import org.apache.cordova.CordovaActivity;

public class BeaconTrip extends CordovaActivity implements IBeaconConsumer {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        enableWebViewDebug();
    }

    private void enableWebViewDebug() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
    }

    private IBeaconManager iBeaconManager = IBeaconManager.getInstanceForApplication(this);

    @Override
    public void onDestroy() {
        super.onDestroy();
        iBeaconManager.unBind(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (iBeaconManager.isBound(this)) iBeaconManager.setBackgroundMode(this, true);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (iBeaconManager.isBound(this)) iBeaconManager.setBackgroundMode(this, false);
    }

    @Override
    public void onIBeaconServiceConnect() {
        postMessage(BeaconPlugin.ON_BEACON_SERVICE_CONNECT, iBeaconManager);
    }

    @Override
    public Object onMessage(String id, Object data) {
        if (BeaconPlugin.START_SERVICE.equals(id)) {
            iBeaconManager.bind(this);
            return iBeaconManager;
        }

        return super.onMessage(id, data);
    }
}

