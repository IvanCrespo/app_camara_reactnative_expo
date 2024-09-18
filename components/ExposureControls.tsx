import {
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Animated, { BounceIn } from "react-native-reanimated";

const exposureOptionsAndroid = [10, 5, 0, -5, -10];
const exposureOptionsIOS = [2, 1, 0, -1, -2];
const exposureOptions =
  Platform.OS === "android" ? exposureOptionsAndroid : exposureOptionsIOS;

export const ExposureControls = ({
  setExposure,
  setShowExposureControls,
  exposure,
}: {
  setExposure: (exposure: number) => void;
  setShowExposureControls: (show: boolean) => void;
  exposure: number;
}) => {
  const { width, height } = useWindowDimensions();
  const radius = Math.min(width, height - 100) * 0.38; // Ajusta el valor para cambiar el tamaño del circulo

  const handleExposurePress = (exposureValue: number) => {
    setExposure(exposureValue);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {exposureOptions.map((exp, index) => {
        const angle =
          (index / exposureOptions.length / 3) * 2 * Math.PI - Math.PI / 2; // Inicia en 12 de las manecillas del reloj
        const x = Math.cos(angle) * radius + 40;
        const y = Math.sin(angle) * radius + height / 5;
        console.log(exp)
        return (
          <Animated.View
            key={index}
            entering={BounceIn.delay(index * 100)}
            style={{ position: "absolute", left: x, top: y }}
          >
            <TouchableHighlight
              onPress={() => handleExposurePress(exp)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: exposure === exp ? "#ffffff" : "#ffffff30",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: exposure === exp ? "black" : "white",
                  fontWeight: "600",
                }}
              >
                {exp > 0 ? `+${exp}` : exp}
              </Text>
            </TouchableHighlight>
          </Animated.View>
        );
      })}
      <TouchableOpacity
        onPress={() => setShowExposureControls(false)}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#ffffff30",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          left: 30,
          top: height / 5,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>X</Text>
      </TouchableOpacity>
    </View>
  );
};
