import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBooks } from "../app/booksSlice";
import { StatusBar } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ToastContainer, toast } from "react-toastify"; // Importer react-toastify
import "react-toastify/dist/ReactToastify.css"; // Importer les styles de react-toastify

export default function BooksList() {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [image, setImage] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const refreshBooks = async () => {
    const response = await fetch("http://localhost:3000/books");
    const data = await response.json();
    dispatch(setBooks(data));
  };

  const handlePress = (id) => {
    router.push(`/books/${id}`);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddBook = async () => {
    // Vérifier que tous les champs sont remplis
    if (!title) {
      toast.error("Veuillez saisir un titre pour le livre.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (!description) {
      toast.error("Veuillez saisir une description pour le livre.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (!prix) {
      toast.error("Veuillez saisir un prix pour le livre.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (!image) {
      toast.error("Veuillez sélectionner une image pour le livre.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Si tous les champs sont remplis, ajouter le livre
    const newBook = { title, description, image, price: parseFloat(prix) };
    await fetch("http://localhost:3000/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    });
    setModalVisible(false);
    setTitle("");
    setDescription("");
    setPrix("");
    setImage(null);
    refreshBooks();

    // Afficher une notification de succès sur la page principale
    toast.success("Livre ajouté avec succès !", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const handleEditBook = async (id) => {
    // Vérifier que tous les champs sont remplis
    if (!title || !description || !prix || !image) {
      toast.error("Veuillez remplir tous les champs !", {
        position: "top-center",
        autoClose: 3000,
      });
      return; // Arrêter l'exécution si un champ est vide
    }

    const updatedBook = { title, description, image, price: parseFloat(prix) };
    await fetch(`http://localhost:3000/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBook),
    });
    setModalVisible(false);
    refreshBooks();

    // Afficher une notification de succès sur la page principale
    toast.success("Livre modifié avec succès !", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const handleDeleteBook = async (id) => {
    await fetch(`http://localhost:3000/books/${id}`, { method: "DELETE" });
    refreshBooks();

    // Afficher une notification de succès sur la page principale
    toast.success("Livre supprimé avec succès !", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  // Filtrer les livres en fonction de la recherche
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Pressable
        onPress={() => handlePress(item.id)}
        style={styles.bookContent}
      >
        <Image source={{ uri: item.image }} style={styles.bookImage} />
        <View style={styles.textContainer}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookDescription}>{item.description}</Text>
          <Text style={styles.bookPrice}>{item.price} TND</Text>
        </View>
      </Pressable>
      <View style={styles.buttonContainer}>
        <Button
          title="✏️"
          onPress={() => {
            setEditBook(item);
            setTitle(item.title);
            setDescription(item.description);
            setPrix(item.price.toString());
            setImage(item.image);
            setModalVisible(true);
          }}
        />
        <Button
          title="🗑"
          color="red"
          onPress={() => handleDeleteBook(item.id)}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ToastContainer pour afficher les notifications sur la page principale */}
      <ToastContainer position="top-center" />

      {/* Titre "Mes Livres" */}
      <Text style={styles.pageTitle}>Mes Livres</Text>

      {/* Champ de recherche */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un livre..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Liste des livres filtrés */}
      <FlatList
        data={filteredBooks}
        renderItem={renderItem}
        keyExtractor={(book) => String(book.id)}
        contentContainerStyle={{ flexGrow: 1 }}
      />

      {/* Bouton flottant pour ajouter un livre */}
      <Pressable
        style={styles.fab}
        onPress={() => {
          setEditBook(null);
          setTitle("");
          setDescription("");
          setImage(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {/* Modal pour ajouter/modifier un livre */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Titre"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <TextInput
            placeholder="Prix"
            value={prix}
            onChangeText={setPrix}
            style={styles.input}
            keyboardType="numeric"
          />
          <Pressable
            style={[styles.uploadButton, image && styles.imageSelected]}
            onPress={pickImage}
          >
            <Text style={styles.uploadText}>
              {image ? "Image sélectionnée ✅" : "Choisir une image"}
            </Text>
          </Pressable>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : null}
          <Button
            title={editBook ? "Modifier" : "Ajouter"}
            onPress={
              editBook ? () => handleEditBook(editBook.id) : handleAddBook
            }
          />
          <Button
            title="Annuler"
            color="red"
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 20,
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6200EE",
    marginBottom: 20,
    textAlign: "center",
  },
  searchInput: {
    width: "90%",
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  bookItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  bookImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  bookDescription: {
    fontSize: 14,
    color: "#666666",
  },
  bookPrice: {
    fontSize: 16,
    color: "#008000",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#6200EE",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: "#FFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  input: {
    width: "80%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  uploadButton: {
    backgroundColor: "#6200EE",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageSelected: {
    backgroundColor: "#4CAF50",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
});
