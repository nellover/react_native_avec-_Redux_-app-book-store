import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBooks } from "../app/booksSlice";
import { StatusBar } from "react-native";
import { useRouter } from "expo-router";

export default function BooksList() {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:3000/books");
        const data = await response.json();
        dispatch(setBooks(data));
      } catch (error) {
        console.error("Erreur lors de la récupération des livres :", error);
      }
    };

    fetchBooks();
  }, [dispatch]);

  const handlePress = (id) => {
    router.push(`/books/${id}`);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Pressable onPress={() => handlePress(item.id)}>
        <Image source={{ uri: item.image }} style={styles.bookImage} />

        <View style={styles.textContainer}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookDescription}>
            {truncateText(item.description, 30)}
          </Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(book) => String(book.id)}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    alignItems: "center",
  },
  bookItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: "#FF4500",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#40E0D0",
    borderRadius: 10,
    marginVertical: 8,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  bookImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FF1493",
  },
  textContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8A2BE2",
    marginBottom: 5,
  },
  bookDescription: {
    fontSize: 14,
    color: "#000",
  },
});
