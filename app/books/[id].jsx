import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../context/ThemeContext";
import { StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { addToCart } from "../cartSlice";
import { data } from "../../data/books";

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const router = useRouter();
  const { colorScheme, theme } = useContext(ThemeContext) || {};
  const dispatch = useDispatch();

  useEffect(() => {
    const selectedBook = data.find((item) => item.id.toString() === id);
    setBook(selectedBook);
  }, [id]);

  const handleAddToCart = async () => {
    if (book) {
      dispatch(addToCart(book));
      router.push("/books/panier");
    }
  };

  if (!book) return <Text>Chargement...</Text>;

  const styles = createStyles(theme, colorScheme);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={book.image} style={styles.bookImage} />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.description}>{book.description}</Text>
      <Text style={styles.price}>{book.price} TND</Text>
      <Pressable style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Ajouter au panier</Text>
      </Pressable>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: colorScheme === "dark" ? "#1C1C1C" : "#FFFFFF",
      padding: 20,
      paddingTop: 40,
    },
    bookImage: {
      width: 220,
      height: 330,
      resizeMode: "cover",
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 2,
      borderColor: "#DDD",
    },
    title: {
      fontSize: 28,
      fontWeight: "600",
      color: colorScheme === "dark" ? "#FFFFFF" : "#333333",
      textAlign: "center",
      marginVertical: 10,
    },
    description: {
      fontSize: 16,
      color: colorScheme === "dark" ? "#CCCCCC" : "#555555",
      textAlign: "center",
      marginVertical: 10,
      lineHeight: 24,
    },
    price: {
      fontSize: 20,
      fontWeight: "600",
      color: "#FF6347",
      marginBottom: 20,
      marginTop: 15,
    },
    button: {
      backgroundColor: "#FF6347",
      paddingVertical: 14,
      paddingHorizontal: 25,
      borderRadius: 30,
      width: "70%",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    buttonText: {
      fontSize: 18,
      color: "white",
      fontWeight: "bold",
      textTransform: "uppercase",
    },
  });
}