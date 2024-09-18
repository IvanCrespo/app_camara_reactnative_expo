import { useState } from "react";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";
import * as ExpoMediaLibrary from "expo-media-library";
import { ThemedView } from "@/components/ThemedView";
import {
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ICON_SIZE = 26;

export default function permissions() {
  // Router
  const router = useRouter();

  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ExpoMediaLibrary.usePermissions();

  const requestMicrophonePermission = async () => {
    const permissions = await Camera.requestMicrophonePermission();
    setMicrophonePermissionStatus(permissions);
  };

  const requestCameraPermission = async () => {
    const permissions = await Camera.requestCameraPermission();
    setCameraPermissionStatus(permissions);
  };

  const changePermissionLibrary = async () => {
    await requestMediaLibraryPermission();
  };

  const handleContinue = () => {
    if (
      cameraPermissionStatus === "granted" &&
      microphonePermissionStatus === "granted" &&
      mediaLibraryPermission?.granted
    ) {
      router.replace("/");
    } else {
      Alert.alert("Porfavor vaya a configuración y habilite los permisos!.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Permisos" }} />
      <ThemedView style={styles.container}>
        <View style={styles.spacer} />
        <ThemedText type="subtitle" style={styles.subtitle}>
          La aplicación necesita acceso a algunos permisos para funcionar
          correctamente.
        </ThemedText>
        <View style={styles.row}>
          <Ionicons
            size={ICON_SIZE}
            name="lock-closed-outline"
            color={"orange"}
          />
          <ThemedText style={styles.footnote}>Permisos requeridos</ThemedText>
        </View>
        <View style={styles.spacer} />
        <View
          style={StyleSheet.compose(styles.row, styles.permissionContainer)}
        >
          <Ionicons size={ICON_SIZE} name="camera-outline" color={"gray"} />
          <View style={styles.permissionText}>
            <ThemedText type="subtitle">Cámara</ThemedText>
            <ThemedText>Se utiliza para tomar fotografías y vídeos.</ThemedText>
          </View>
          <Switch
            trackColor={{ true: "orange" }}
            value={cameraPermissionStatus === "granted"}
            onChange={requestCameraPermission}
          />
        </View>
        <View style={styles.spacer} />
        <View
          style={StyleSheet.compose(styles.row, styles.permissionContainer)}
        >
          <Ionicons size={ICON_SIZE} name="mic-circle-outline" color={"gray"} />
          <View style={styles.permissionText}>
            <ThemedText type="subtitle">Micrófono</ThemedText>
            <ThemedText>Se utiliza para grabar vídeos.</ThemedText>
          </View>
          <Switch
            trackColor={{ true: "orange" }}
            value={microphonePermissionStatus === "granted"}
            onChange={requestMicrophonePermission}
          />
        </View>
        <View style={styles.spacer} />
        <View
          style={StyleSheet.compose(styles.row, styles.permissionContainer)}
        >
          <Ionicons size={ICON_SIZE} name="library-outline" color={"gray"} />
          <View style={styles.permissionText}>
            <ThemedText type="subtitle">Biblioteca de Fotos</ThemedText>
            <ThemedText>Se utiliza para guardar fotos, ver y más..</ThemedText>
          </View>
          <Switch
            trackColor={{ true: "orange" }}
            value={mediaLibraryPermission?.granted}
            onChange={changePermissionLibrary}
          />
        </View>
        <View style={{ marginVertical: 30 }} />
        <TouchableOpacity
          style={StyleSheet.compose(styles.row, styles.continueButton)}
          onPress={handleContinue}
        >
          <Ionicons
            name="arrow-forward-outline"
            color={"white"}
            size={ICON_SIZE}
          />
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
  },
  footnote: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  spacer: {
    marginVertical: 8,
  },
  permissionContainer: {
    backgroundColor: "#ffffff20",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  permissionText: {
    marginLeft: 10,
    flexShrink: 1,
  },
  continueButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 50,
    alignSelf: "center",
  },
});
