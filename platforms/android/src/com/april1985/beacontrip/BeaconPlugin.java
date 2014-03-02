package com.april1985.beacontrip;

import android.os.RemoteException;
import android.util.Log;
import com.google.gson.Gson;
import com.radiusnetworks.ibeacon.*;
import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Collection;

import static org.apache.cordova.PluginResult.Status.NO_RESULT;
import static org.apache.cordova.PluginResult.Status.OK;

public class BeaconPlugin extends CordovaPlugin {
    public static final String ON_BEACON_SERVICE_CONNECT = "onIBeaconServiceConnect";
    public static final String START_SERVICE = "startService";
    public String TAG = "BeaconPlugin";
    private CallbackContext monitorCallback;
    private CallbackContext rangingCallback;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        synchronized (this) {
            if (action.equals(START_SERVICE)) {
                webView.postMessage(START_SERVICE, null);
                callbackContext.sendPluginResult(new PluginResult(OK));
                return true;
            } else if (action.equals("startMonitoring")) {
                return startMonitoring(callbackContext, getRegion(args));
            } else if (action.equals("stopMonitoring")) {
                return stopMonitoring(callbackContext, getRegion(args));
            } else if (action.equals("startRanging")) {
                return startRanging(callbackContext, getRegion(args));
            } else if (action.equals("stopRanging")) {
                return stopRanging(callbackContext, getRegion(args));
            }

            return true;
        }
    }

    private boolean stopRanging(CallbackContext callbackContext, Region region) throws JSONException {
        try {
            iBeaconManager.stopRangingBeaconsInRegion(region);
        } catch (RemoteException e) {
            e.printStackTrace();
        }

        sendNoResult(callbackContext);
        this.rangingCallback = callbackContext;

        return true;
    }

    private boolean stopMonitoring(CallbackContext callbackContext, Region region) throws JSONException {
        try {
            iBeaconManager.stopMonitoringBeaconsInRegion(region);
        } catch (RemoteException e) {
            e.printStackTrace();
        }

        sendNoResult(callbackContext);
        return true;
    }

    private boolean startRanging(CallbackContext callbackContext, Region region) throws JSONException {
        this.rangingCallback = callbackContext;

        iBeaconManager.setRangeNotifier(new RangeNotifier() {
            @Override
            public void didRangeBeaconsInRegion(Collection<IBeacon> iBeacons, Region region) {
                Log.d(TAG, "ranging");

                JSONObject jsonObject = new JSONObject();
                try {
                    jsonObject.put("event", "didRangeBeaconsInRegion");
                    jsonObject.put("region", new Gson().toJson(region));
                    jsonObject.put("ibeacons", new Gson().toJson(iBeacons));
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                PluginResult pluginResult = new PluginResult(OK, jsonObject);
                pluginResult.setKeepCallback(true);
                rangingCallback.sendPluginResult(pluginResult);
            }
        });

        try {
            iBeaconManager.startRangingBeaconsInRegion(region);
        } catch (RemoteException e) {
            e.printStackTrace();
        }

        sendNoResult(callbackContext);
        return true;
    }

    private boolean startMonitoring(CallbackContext callbackContext, Region region) throws JSONException {
        this.monitorCallback = callbackContext;

        iBeaconManager.setMonitorNotifier(new MonitorNotifier() {
            @Override
            public void didEnterRegion(Region region) {
                Log.d(TAG, "enter");
                sendResult(getResultJson("enter", region));
            }

            @Override
            public void didExitRegion(Region region) {
                Log.d(TAG, "exit");
                sendResult(getResultJson("exit", region));
            }

            @Override
            public void didDetermineStateForRegion(int state, Region region) {
                Log.d(TAG, "determState");
                sendResult(getResultJson("determState", region, state));
            }

            private JSONObject getResultJson(String eventName, Region region) {
                JSONObject jsonObject = new JSONObject();
                try {
                    jsonObject.put("event", eventName);
                    jsonObject.put("region", new Gson().toJson(region));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                return jsonObject;
            }


            private JSONObject getResultJson(String eventName, Region region, int state) {
                JSONObject jsonObject = new JSONObject();
                try {
                    jsonObject.put("event", eventName);
                    jsonObject.put("region", new Gson().toJson(region));
                    jsonObject.put("state", state);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                return jsonObject;
            }

            private void sendResult(JSONObject jsonObject) {
                PluginResult pluginResult = new PluginResult(OK, jsonObject);
                pluginResult.setKeepCallback(true);
                monitorCallback.sendPluginResult(pluginResult);
            }
        });

        try {
            iBeaconManager.startMonitoringBeaconsInRegion(region);
        } catch (RemoteException e) {
            e.printStackTrace();
        }

        sendNoResult(callbackContext);
        return true;
    }

    private Region getRegion(JSONArray args) throws JSONException {
        String regionName = args.isNull(0) ? "DefaultRegion" : args.getString(0);
        String uuid = args.isNull(1) ? null : args.getString(1);
        Integer major = args.isNull(2) ? null : args.getInt(2);
        Integer minor = args.isNull(3) ? null : args.getInt(3);
        return new Region(regionName, uuid, major, minor);
    }

    private void sendNoResult(CallbackContext callbackContext) {
        PluginResult pluginResult = new PluginResult(NO_RESULT);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    private IBeaconManager iBeaconManager = null;


    @Override
    public Object onMessage(String id, Object data) {

        if (ON_BEACON_SERVICE_CONNECT.equals(id)) {
            Log.d(TAG, "Beacon connected");

            this.iBeaconManager = (IBeaconManager) data;
            iBeaconManager.setForegroundScanPeriod(500);
            return iBeaconManager;
        }

        return super.onMessage(id, data);
    }
}
