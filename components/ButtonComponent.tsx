import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/Colors";

// Interface
interface ButtonProps {
  onPress: () => void;
  title?: string;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  containerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
}

export const ButtonComponent = ({
  onPress,
  iconName,
  title,
  containerStyle,
  iconSize,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: Colors.dark.background,
          borderRadius: title ? 6 : 40,
          alignSelf: "flex-start",
        },
        containerStyle,
      ]}
    >
      {iconName && (
        <Ionicons name={iconName} size={iconSize ?? 28} color={"white"} />
      )}
      {title ? (
        <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 7, 
        borderRadius: 40,
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    }
})