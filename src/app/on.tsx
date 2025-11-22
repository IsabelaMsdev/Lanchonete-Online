// cspell:disable

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";

// Tipagem do item do cardápio
interface MenuItem {
  id: string;
  name: string;
  image: string;
  description?: string;
  price: number;
}

// Categorias de itens do cardápio
const categorizedMenuItems: Record<string, MenuItem[]> = {
  Comidas: [
    {
      id: "1",
      name: "Hambúrguer",
      image:
        "https://st4.depositphotos.com/1020618/23910/i/450/depositphotos_239107218-stock-photo-tasty-burger-with-french-fries.jpg",
      description: "Delicioso hambúrguer artesanal.",
      price: 35.0,
    },
    {
      id: "2",
      name: "Pizza de calabresa com mussarela",
      image:
        "https://www.estadao.com.br/resizer/v2/SGSA2RXZQRASROXQVI2STOP4UU.jpg?quality=80&width=1200&height=1200&smart=true",
      description: "Deliciosa pizza de calabresa com mussarela.",
      price: 55.5,
    },
    {
      id: "3",
      name: "Batata frita",
      image:
        "https://img.freepik.com/fotos-premium/batatas-fritas-crocantes-em-uma-tigela_960786-191.jpg",
      description: "Balde de deliciosas batatas fritas crocantes.",
      price: 17.9,
    },
    {
      id: "4",
      name: "Cachorro-quente",
      image:
        "https://www.cnnbrasil.com.br/viagemegastronomia/wp-content/uploads/sites/5/2022/09/dia-do-cachorro-quente.jpg?w=1200&h=1200&crop=1",
      description: "Diferentes especialidades da casa.",
      price: 11.0,
    },
  ],
  Sobremesas: [
    {
      id: "5",
      name: "Sobremesa",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOMP2cw8UH-5vGcFVWkoOgSYhhxHfnsmfb5g&s",
      description: "Sobremesa de chocolate com creme branco e uva.",
      price: 15.0,
    },
    {
      id: "6",
      name: "Pudim",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXx8P4TFhkkFXOo3P73PGJXcZS03sPX3dagg&s",
      description: "Pudim de leite ninho.",
      price: 3.5,
    },
    {
      id: "11",
      name: "Mousse de Maracujá",
      image:
        "https://static.itdg.com.br/images/360-240/8fed8f60d3c8e3990396e2478cbc7f2a/shutterstock-1905617575-1-.jpg",
      description: "Mousse de maracujá feito com a própria fruta.",
      price: 7.0,
    },
    {
      id: "12",
      name: "Brownie",
      image:
        "https://vovopalmirinha.com.br/wp-content/uploads/2020/01/vovo-palmirinha-brownie.jpg",
      description: "Gostoso brownie de chocolate com morango.",
      price: 8.0,
    },
  ],
  Bebidas: [
    {
      id: "13",
      name: "Água",
      image:
        "https://mir-s3-cdn-cf.behance.net/project_modules/fs/933b37104527701.5f6a377a3ad51.jpg",
      description: "Água com e Sem gás.",
      price: 6.0,
    },
    {
      id: "14",
      name: "Milk Shake",
      image:
        "https://t4.ftcdn.net/jpg/02/33/00/19/360_F_233001977_ylLHVj9o2HAoEab4zzM6Kirms6I0XBCM.jpg",
      description: "Sabores variados desses deliciosos milk shake.",
      price: 12.6,
    },
    {
      id: "15",
      name: "Refrigerante",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhJCK-niB8nDkIxQcSNv9B1FuvP0oAU51n4A&s",
      description: "Lata de refrigerante gelado.",
      price: 7.5,
    },
    {
      id: "16",
      name: "Sucos",
      image:
        "https://thumbs.dreamstime.com/b/vidros-com-sucos-org%C3%A2nicos-frescos-do-vegetal-e-de-fruto-60371647.jpg",
      description: "Sucos naturais.",
      price: 10.0,
    },
  ],
};

export default function App(): JSX.Element {
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Comidas",
  );
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isPaymentScreen, setIsPaymentScreen] = useState<boolean>(false);
  const [isConfirmationScreen, setIsConfirmationScreen] =
    useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = (): string => {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };

  const handleRegister = () => {
    if (name.trim() && phone.trim() && email.trim()) {
      setIsRegistered(true);
    } else {
      Alert.alert(
        "Atenção",
        "Por favor, preencha todos os campos para continuar.",
      );
    }
  };

  const handleFinalizeOrder = () => {
    if (cart.length === 0) {
      Alert.alert(
        "Carrinho Vazio",
        "Adicione itens ao carrinho antes de finalizar o pedido.",
      );
      return;
    }
    setIsPaymentScreen(true);
  };

  const handlePaymentSelection = (method: string) => {
    setPaymentMethod(method);
    setIsPaymentScreen(false);
    setIsConfirmationScreen(true);
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
  };

  const resetOrder = () => {
    setOrderPlaced(false);
    setIsConfirmationScreen(false);
    setIsPaymentScreen(false);
    setCart([]);
    setSelectedCategory("Comidas");
    setPaymentMethod("");
  };

  /* --- TELAS DO APP --- */

  if (orderPlaced) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>🎉 Pedido Realizado!</Text>
        <Text style={styles.text}>Seu pedido foi realizado com sucesso.</Text>
        <Text style={styles.text}>Aguarde o preparo e a entrega!</Text>
        <View style={styles.summaryContainer}>
          <Text style={styles.totalText}>
            Total Pago: R$ {calculateTotal()}
          </Text>
          <Text style={styles.paymentText}>Método: {paymentMethod}</Text>
        </View>
        <TouchableOpacity
          style={[styles.finalizeButton, { marginTop: 30 }]}
          onPress={resetOrder}
        >
          <Text style={styles.finalizeButtonText}>Voltar para o Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!isRegistered) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>🍔 Lanchonete On-line</Text>
        <Text style={styles.subtitle}>👋 Bem-vindo! Faça seu Cadastro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.finalizeButton}
          onPress={handleRegister}
        >
          <Text style={styles.finalizeButtonText}>Avançar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (isPaymentScreen) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>💳 Escolha o Método de Pagamento</Text>
        <View style={styles.paymentButtonContainer}>
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => handlePaymentSelection("Pix")}
          >
            <Text style={styles.paymentButtonText}>💰 Pix</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => handlePaymentSelection("Dinheiro")}
          >
            <Text style={styles.paymentButtonText}>💵 Dinheiro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => handlePaymentSelection("Cartão de Débito")}
          >
            <Text style={styles.paymentButtonText}>💳 Cartão de Débito</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => handlePaymentSelection("Cartão de Crédito")}
          >
            <Text style={styles.paymentButtonText}>💳 Cartão de Crédito</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => handlePaymentSelection("Pagar pelo Aplicativo")}
          >
            <Text style={styles.paymentButtonText}>📱 Pagar pelo App</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isConfirmationScreen) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>📝 Resumo e Confirmação</Text>
        <ScrollView style={{ width: "100%", flex: 1 }}>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <View
                key={`${item.id}-${index}`}
                style={styles.confirmationItemContainer}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.confirmationImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <Text style={styles.itemPrice}>
                    R$ {item.price.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromCart(index)}
                >
                  <Text style={styles.removeButtonText}>❌</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyCartText}>Carrinho vazio</Text>
          )}
        </ScrollView>
        <View style={styles.summaryContainer}>
          <Text style={styles.cartItemCount}>Itens: {cart.length}</Text>
          <Text style={styles.paymentText}>Pagamento: {paymentMethod}</Text>
          <Text style={styles.totalText}>Total: R$ {calculateTotal()}</Text>
        </View>
        <TouchableOpacity
          style={styles.finalizeButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.finalizeButtonText}>✅ Efetuar Pedido</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🍔 Cardápio</Text>
      <Text style={styles.cartBadge}>
        🛒 {cart.length} itens (Total: R$ {calculateTotal()})
      </Text>

      <View style={styles.buttonContainer}>
        {Object.keys(categorizedMenuItems).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category &&
                  styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ width: "100%", flex: 1 }}>
        {selectedCategory && (
          <View>
            <Text style={styles.categoryTitle}>{selectedCategory}</Text>

            <View style={styles.menuGridContainer}>
              {categorizedMenuItems[selectedCategory].map((item) => (
                <View key={item.id} style={styles.itemContainer}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <Text style={styles.itemPrice}>
                    R$ {item.price.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(item)}
                  >
                    <Text style={styles.addButtonText}>➕ Adicionar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.finalizeButton}
        onPress={handleFinalizeOrder}
      >
        <Text style={styles.finalizeButtonText}>🛍️ Finalizar Pedido</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#FFA500",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  cartBadge: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  categoryButton: {
    backgroundColor: "#fff",
    padding: 12,
    marginHorizontal: 5,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFA500",
  },
  categoryButtonActive: { backgroundColor: "#FFA500" },
  categoryButtonText: { color: "#FFA500", fontWeight: "bold", fontSize: 14 },
  categoryButtonTextActive: { color: "#fff" },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 15,
    textAlign: "left",
    color: "#333",
    paddingLeft: 5,
  },
  menuGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
    width: "48%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  confirmationItemContainer: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  image: { width: "100%", height: 100, borderRadius: 8 },
  confirmationImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: "bold", marginTop: 8, color: "#333" },
  itemDescription: { fontSize: 12, color: "#666", marginTop: 4 },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFA500",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#FFA500",
    padding: 8,
    marginTop: 8,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  removeButton: { padding: 8 },
  removeButtonText: { fontSize: 18 },
  finalizeButton: {
    backgroundColor: "#FFA500",
    padding: 15,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  finalizeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  paymentButtonContainer: { width: "90%", marginTop: 20 },
  paymentButton: {
    backgroundColor: "#FFA500",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  paymentButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  summaryContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#FFA500",
  },
  cartItemCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFA500",
    marginTop: 8,
  },
  paymentText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  emptyCartText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
    color: "#333",
  },
});
