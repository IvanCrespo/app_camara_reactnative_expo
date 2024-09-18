import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Image, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ButtonComponent } from "@/components/ButtonComponent";
import { saveToLibraryAsync } from "expo-media-library";

export default function MediaScreen() {
  const { media, type } = useLocalSearchParams();
  const router = useRouter();
  console.log(media, type);

  const saveToGallery = async () => {
    saveToLibraryAsync(media as string);
    Alert.alert("Se guardo correctamente en Galeria!");
    router.back();
  };
  return (
    <>
      <ThemedView style={styles.container}>
        {
          type === "photo" ? (
            <Image
              source={{ uri: `file://${media}` }}
              style={{ width: "100%", height: "80%", resizeMode: "contain" }}
            />
          ) : null
          // <Video source={{ uri: media }} style={{ width: "100%", height: "100%" }}/>
        }
        <ButtonComponent
          title="Guardar en Galeria"
          containerStyle={{ alignSelf: "center" }}
          onPress={saveToGallery}
        />
        <Link href={{ pathname: "/" }} style={styles.link}>
          <ThemedText type="link">Borrar y Regresar</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    alignSelf: "center",
  },
});
