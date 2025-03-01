import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../context/ThemeContext";
import { StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { addToCart } from "../cartSlice";

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { colorScheme, theme } = useContext(ThemeContext) || {};
  const dispatch = useDispatch();

  // Styles dynamiques en fonction du thème
  const styles = createStyles(theme, colorScheme);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/books/${id}`);
        if (!response.ok) {
          throw new Error("Livre non trouvé");
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du livre :", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (book) {
      dispatch(addToCart(book));
      router.push("/books/panier");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FF6347" />
        <Text style={styles.loadingText}>Chargement en cours...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Erreur : {error}</Text>
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Livre non trouvé</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: book.image }} style={styles.bookImage} />
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

// Fonction pour créer des styles dynamiques
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
    loadingText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "#FFFFFF" : "#333333",
      marginTop: 20,
    },
    errorText: {
      fontSize: 18,
      color: "#FF6347",
      marginTop: 20,
    },
  });
}
