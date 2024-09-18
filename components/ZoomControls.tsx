import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Animated, { BounceIn } from "react-native-reanimated";

const MIN_ZOOM = 1;
const MAX_ZOOM = 128;
const NEUTRAL_ZOOM = 1;
const zoomOptions = [5, 4, 3, 2, 1];

export const ZoomControls = ({
  setZoom,
  setShowZoomControls,
  zoom,
}: {
  setZoom: (zoom: number) => void;
  setShowZoomControls: (show: boolean) => void;
  zoom: number;
}) => {
  const { width, height } = useWindowDimensions();
  const radius = Math.min(width, height - 100) * 0.38; // Ajusta el valor para cambiar el tamaño del circulo

  const handleZoomPress = (zoomFactor: number) => {
    if (zoomFactor === -1) {
      // Reset al Zoom neutral
    } else {
      // Calcula el nuevo valor del Zoom
      const newZoom = Math.min(Math.max(zoomFactor, MIN_ZOOM), MAX_ZOOM);
      setZoom(newZoom);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {zoomOptions.map((z, index) => {
        const angle =
          (index / zoomOptions.length / 3) * 2 * Math.PI - Math.PI / 2; // Inicia en 12 de las manecillas del reloj
        const x = width - Math.cos(angle) * radius - 90;
        const y = Math.sin(angle) * radius + height / 5;
        return (
          <Animated.View
            key={index}
            entering={BounceIn.delay(index * 100)}
            style={{ position: "absolute", left: x, top: y }}
          >
            <TouchableHighlight
              onPress={() => handleZoomPress(z)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: zoom === z ? "#ffffff" : "#ffffff30",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: zoom === z ? "black" : "white",
                  fontWeight: "600",
                }}
              >
                {z}X
              </Text>
            </TouchableHighlight>
          </Animated.View>
        );
      })}
      <TouchableOpacity
        onPress={() => setShowZoomControls(false)}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#ffffff30",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          right: 30,
          top: height / 5,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>X</Text>
      </TouchableOpacity>
    </View>
  );
};
