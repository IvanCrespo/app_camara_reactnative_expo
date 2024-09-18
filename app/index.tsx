import { ButtonComponent } from "@/components/ButtonComponent";
import { ExposureControls } from "@/components/ExposureControls";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ZoomControls } from "@/components/ZoomControls";
import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Redirect, Stack, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  TakePhotoOptions,
} from "react-native-vision-camera";

export default function HomeScreen() {
  // Permnisos
  const { hasPermission } = useCameraPermission();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  const [showZoomControls, setShowZoomControls] = useState(false);
  const [showExposureControls, setShowExposureControls] = useState(false);

  const camera = useRef<Camera>(null);
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "back"
  );
  const device = useCameraDevice(cameraPosition);
  const [zoom, setZoom] = useState(device?.neutralZoom);
  const [exposure, setExposure] = useState(0);
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [torch, setTorch] = useState<"off" | "on">("off");
  const redirectToPermissions =
    !hasPermission || microphonePermission === "not-determined";

  const router = useRouter();
  const takePicture = async () => {
    try {
      if (camera.current == null) throw new Error("Camera ref is null!");
      console.log("Taking a picture...");
      const photo = await camera.current.takePhoto({
        flash: flash,
        enableShutterSound: false,
      });
      router.push({
        pathname: "/media",
        params: { media: photo.path, type: "photo" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const convertText = (text: string) => {
    return (
      <Text>
        {text.includes("front") ? "Cámara Frontal" : "Cámara Principal"}
      </Text>
    );
  };
  if (redirectToPermissions) return <Redirect href={"/permissions"} />;
  if (!device) return <></>;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 2, borderRadius: 10, overflow: "hidden" }}>
          <Camera
            ref={camera}
            style={{ flex: 1 }}
            device={device}
            isActive
            zoom={zoom}
            resizeMode="cover"
            exposure={exposure}
            torch={torch}
            video
            photo
          />
          <BlurView
            intensity={100}
            tint="systemThinMaterialDark"
            style={{
              flex: 1,
              position: "absolute",
              bottom: 0,
              right: 0,
              padding: 10,
            }}
            experimentalBlurMethod="dimezisBlurView"
          >
            <ThemedText>
              Exposure: {exposure} | Zoom: x{zoom}
            </ThemedText>
          </BlurView>
        </View>
        {showZoomControls ? (
          <ZoomControls
            setZoom={setZoom}
            setShowZoomControls={setShowZoomControls}
            zoom={zoom ?? 1}
          />
        ) : showExposureControls ? (
          <ExposureControls
            setExposure={setExposure}
            setShowExposureControls={setShowExposureControls}
            exposure={exposure}
          />
        ) : (
          <View style={{ flex: 1 }}>
            {/* Top Section */}
            <View style={{ flex: 0.8 }}>
              <ThemedText style={{ fontSize: 13 }}>
                Max FPS: {device.formats[0].maxFps}
              </ThemedText>
              <ThemedText style={{ fontSize: 13 }}>
                Width: {device.formats[0].photoWidth} Height:{" "}
                {device.formats[0].photoHeight}
              </ThemedText>
              <ThemedText style={{ fontSize: 13 }}>
                Camera: {convertText(device.name.toLowerCase())}
              </ThemedText>
            </View>
            {/* Middle Section */}
            <View
              style={{
                flex: 0.8,
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <ButtonComponent
                iconName={torch === "on" ? "flashlight" : "flashlight-outline"}
                onPress={() => setTorch((t) => (t === "off" ? "on" : "off"))}
                containerStyle={{ alignSelf: "center" }}
              />
              <ButtonComponent
                iconName={
                  flash === "on" ? "flash-outline" : "flash-off-outline"
                }
                onPress={() => setFlash((f) => (f === "off" ? "on" : "off"))}
                containerStyle={{ alignSelf: "center" }}
              />
              <ButtonComponent
                iconName="camera-reverse-outline"
                onPress={() =>
                  setCameraPosition((p) => (p === "back" ? "front" : "back"))
                }
                containerStyle={{ alignSelf: "center" }}
              />
              <ButtonComponent
                iconName="image-outline"
                onPress={() => {
                  const link = Platform.select({
                    ios: "photos-redirect://",
                    android: "content://media/external/images/media",
                  });
                  Linking.openURL(link!);
                }}
                containerStyle={{ alignSelf: "center" }}
              />
              <ButtonComponent
                iconName="settings-outline"
                onPress={() => router.push("/_sitemap")}
                containerStyle={{ alignSelf: "center" }}
              />
            </View>
            {/* Bottom Section */}
            <View
              style={{
                flex: 1.1,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <ButtonComponent
                iconSize={40}
                title="+/-"
                onPress={() => setShowExposureControls((s) => !s)}
                containerStyle={{ alignSelf: "center" }}
              />
              <TouchableHighlight onPress={takePicture}>
                <FontAwesome5 name="dot-circle" size={55} color={"white"} />
              </TouchableHighlight>
              <ButtonComponent
                iconSize={40}
                title="1x"
                onPress={() => setShowZoomControls((s) => !s)}
                containerStyle={{ alignSelf: "center" }}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    margin: 5,
  },
});
