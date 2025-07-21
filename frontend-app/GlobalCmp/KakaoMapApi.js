import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function KakaoMapApi({
  address,
  width = "100%",
  height = "100%",
  borderRadius = 8,
}) {
  const injectedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        #map {
          width: 100%;
          height: 100%;
        }
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
        }
      </style>
      <!-- 카카오 맵 api -->
      <script 
        type="text/javascript" 
        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=314da8cda816dbb5acde016c13e0f2f9&autoload=false&libraries=services"
      ></script>
      <!-- 카카오 맵 api -->
    </head>
    <body>
      <div id="map"></div>
      <script>
        kakao.maps.load(function () {
          var geocoder = new kakao.maps.services.Geocoder();
          geocoder.addressSearch("${address}", function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
              var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
              var mapContainer = document.getElementById('map');
              var mapOption = {
                center: coords,
                level: 3
              };
              var map = new kakao.maps.Map(mapContainer, mapOption);
              new kakao.maps.Marker({
                map: map,
                position: coords
              });
            }
          });
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View
      style={{
        width: typeof width === "number" ? width : 300,
        height: typeof height === "number" ? height : 200,
        borderRadius: borderRadius,
        borderWidth: 1,
        borderColor: "#e2e2e2",
        overflow: "hidden",
      }}
    >
      <WebView
        originWhitelist={["*"]}
        source={{ html: injectedHtml }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{ flex: 1 }}
      />
    </View>
  );
}
