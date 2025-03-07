import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../cartSlice";

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  const handleIncreaseQuantity = (id) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecreaseQuantity = (id) => {
    dispatch(decreaseQuantity(id));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleValidateOrder = () => {
    Alert.alert(
      "Commande validée",
      `Total: ${totalPrice.toFixed(2)} TND\nMerci pour votre achat !`
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemTitle}>{item.title}</Text>
        <Text style={styles.cartItemPrice}>{item.price} TND</Text>
        <View style={styles.quantityContainer}>
          <Pressable
            onPress={() => handleDecreaseQuantity(item.id)}
            style={[styles.quantityButton, styles.decreaseButton]}
          >
            <Text style={styles.quantityText}>-</Text>
          </Pressable>
          <Text style={styles.quantityText}>{item.quantity || 1}</Text>
          <Pressable
            onPress={() => handleIncreaseQuantity(item.id)}
            style={[styles.quantityButton, styles.increaseButton]}
          >
            <Text style={styles.quantityText}>+</Text>
          </Pressable>
        </View>
      </View>
      <Pressable
        onPress={() => handleRemoveFromCart(item.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>🗑</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Panier</Text>
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>
              Total: {totalPrice.toFixed(2)} TND
            </Text>
            <Pressable
              style={styles.validateButton}
              onPress={handleValidateOrder}
            >
              <Text style={styles.validateButtonText}>✅ Valider</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>Votre panier est vide 🛍</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF0", // Fond crème
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#FF4500", // Orange vif
  },
  cartItem: {
    flexDirection: "row",
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#FFDDC1", // Beige clair
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cartItemPrice: {
    fontSize: 16,
    color: "#008000", // Vert foncé
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  decreaseButton: {
    backgroundColor: "#FF6347", // Rouge vif
  },
  increaseButton: {
    backgroundColor: "#32CD32", // Vert lime
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  removeButton: {
    backgroundColor: "#DC143C", // Rouge carmin
    padding: 10,
    borderRadius: 50,
  },
  removeButtonText: {
    fontSize: 16,
    color: "white",
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  footer: {
    marginTop: 20,
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  totalText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  validateButton: {
    backgroundColor: "#FFD700", // Jaune doré
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  validateButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
