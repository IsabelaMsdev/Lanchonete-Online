// ...existing code...
// cspell:disable

import React, { useState, useMemo } from "react";
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
  ImageBackground,
  useWindowDimensions,
  Platform,
} from "react-native";

// Tipagem do item do cardápio
interface MenuItem {
  id: string;
  name: string;
  image: string;
  description?: string;
  price: number;
}

// Imagem de fundo local (marmorizada)
const backgroundImage = require("./marmorizadacinza.jpg");

// Logo local
const logoImage = require("./logo.png");

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
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(width), [width]);

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

  const renderLogo = () => <Image source={logoImage} style={styles.logo} />;

  if (orderPlaced) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          {renderLogo()}
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
      </ImageBackground>
    );
  }

  if (!isRegistered) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.centerWrapper}>
            {renderLogo()}
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
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (isPaymentScreen) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.centerWrapper}>
            {renderLogo()}
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
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (isConfirmationScreen) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.centerWrapper}>
            {renderLogo()}
            <Text style={styles.title}>📝 Resumo e Confirmação</Text>
          </View>
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
                    <Text style={styles.itemDescription}>
                      {item.description}
                    </Text>
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
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.centerWrapper}>
          {renderLogo()}
          <Text style={styles.title}>🍔 Cardápio</Text>
          <Text style={styles.cartBadge}>
            🛒 {cart.length} itens (Total: R$ {calculateTotal()})
          </Text>
        </View>

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
                    <Text style={styles.itemDescription}>
                      {item.description}
                    </Text>
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
    </ImageBackground>
  );
}

/**
 * Cria styles responsivos baseado na largura.
 */
function createStyles(width: number) {
  const baseWidth = 375;
  const scale = Math.max(0.85, Math.min(1.2, width / baseWidth));

  const logoSize = width >= 900 ? 180 : width >= 600 ? 140 : 100;
  const itemWidth = width >= 900 ? "30%" : width >= 600 ? "48%" : "100%";

  const smallFont = Math.round(12 * scale);
  const normalFont = Math.round(14 * scale);
  const largeFont = Math.round(18 * scale);
  const titleFont = Math.round(24 * scale);

  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    container: {
      flex: 1,
      padding: Math.round(16 * scale),
      paddingTop:
        Platform.OS === "ios"
          ? Math.round(24 * (width >= 600 ? 1.1 : 1))
          : Math.round(18 * scale),
      backgroundColor: "rgba(0,0,0,0.28)",
      alignItems: "center",
    },
    // wrapper usado para centralizar logo + formulários/headers
    centerWrapper: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Math.round(8 * scale),
    },
    logo: {
      width: logoSize,
      height: logoSize,
      resizeMode: "contain",
      // não usar absolute aqui para ficar no fluxo e centralizado
      marginBottom: Math.round(12 * scale),
      zIndex: 10,
      borderRadius: Math.round(12 * scale),
      padding: Math.round(4 * scale),
      backgroundColor: "rgba(255,255,255,0.0)",
      // sombra
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 5,
    },
    title: {
      fontSize: titleFont,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: Math.round(10 * scale),
      color: "#FFA500",
    },
    subtitle: {
      fontSize: Math.round(18 * scale),
      fontWeight: "bold",
      marginBottom: Math.round(12 * scale),
      color: "#fff",
    },
    input: {
      width: "90%",
      padding: Math.round(12 * scale),
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      marginBottom: Math.round(12 * scale),
      fontSize: normalFont,
      backgroundColor: "#fff",
    },
    cartBadge: {
      fontSize: normalFont,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: Math.round(12 * scale),
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: Math.round(12 * scale),
      flexWrap: "wrap",
    },
    categoryButton: {
      backgroundColor: "#fff",
      padding: Math.round(10 * scale),
      marginHorizontal: Math.round(6 * scale),
      marginBottom: Math.round(8 * scale),
      borderRadius: 8,
      borderWidth: 2,
      borderColor: "#FFA500",
    },
    categoryButtonActive: { backgroundColor: "#FFA500" },
    categoryButtonText: { color: "#FFA500", fontWeight: "bold", fontSize: normalFont },
    categoryButtonTextActive: { color: "#fff" },
    categoryTitle: {
      fontSize: Math.round(20 * scale),
      fontWeight: "bold",
      marginBottom: Math.round(12 * scale),
      marginTop: Math.round(12 * scale),
      textAlign: "left",
      color: "#fff",
      paddingLeft: 5,
    },
    menuGridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: 5,
    },
    itemContainer: {
      backgroundColor: "rgba(255,255,255,0.95)",
      padding: Math.round(10 * scale),
      borderRadius: 10,
      marginVertical: Math.round(8 * scale),
      alignItems: "center",
      width: itemWidth,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    confirmationItemContainer: {
      backgroundColor: "#ffffff",
      padding: Math.round(12 * scale),
      borderRadius: 10,
      marginBottom: Math.round(10 * scale),
      flexDirection: "row",
      alignItems: "center",
      elevation: 2,
    },
    image: { width: "100%", height: Math.round(100 * scale), borderRadius: 8 },
    confirmationImage: {
      width: Math.round(80 * scale),
      height: Math.round(80 * scale),
      borderRadius: 8,
      marginRight: Math.round(10 * scale),
    },
    itemDetails: { flex: 1 },
    itemTitle: { fontSize: normalFont + 2, fontWeight: "bold", marginTop: Math.round(8 * scale), color: "#333" },
    itemDescription: { fontSize: smallFont, color: "#666", marginTop: Math.round(4 * scale) },
    itemPrice: {
      fontSize: normalFont,
      fontWeight: "bold",
      color: "#FFA500",
      marginTop: Math.round(6 * scale),
    },
    addButton: {
      backgroundColor: "#FFA500",
      padding: Math.round(8 * scale),
      marginTop: Math.round(8 * scale),
      borderRadius: 6,
      width: "100%",
      alignItems: "center",
    },
    addButtonText: { color: "#fff", fontWeight: "bold", fontSize: smallFont },
    removeButton: { padding: Math.round(8 * scale) },
    removeButtonText: { fontSize: Math.round(18 * scale) },
    finalizeButton: {
      backgroundColor: "#FFA500",
      padding: Math.round(14 * scale),
      marginTop: Math.round(14 * scale),
      marginBottom: Math.round(14 * scale),
      borderRadius: 8,
      width: "90%",
      alignItems: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
    },
    finalizeButtonText: { color: "#fff", fontWeight: "bold", fontSize: largeFont },
    paymentButtonContainer: { width: "90%", marginTop: Math.round(16 * scale) },
    paymentButton: {
      backgroundColor: "#FFA500",
      padding: Math.round(14 * scale),
      marginVertical: Math.round(8 * scale),
      borderRadius: 8,
      alignItems: "center",
    },
    paymentButtonText: { color: "#fff", fontWeight: "bold", fontSize: normalFont },
    summaryContainer: {
      width: "90%",
      backgroundColor: "#fff",
      padding: Math.round(14 * scale),
      borderRadius: 10,
      marginBottom: Math.round(10 * scale),
      marginTop: Math.round(14 * scale),
      borderLeftWidth: 5,
      borderLeftColor: "#FFA500",
    },
    cartItemCount: {
      fontSize: normalFont,
      fontWeight: "bold",
      color: "#333",
      marginBottom: Math.round(8 * scale),
    },
    totalText: {
      fontSize: Math.round(20 * scale),
      fontWeight: "bold",
      color: "#FFA500",
      marginTop: Math.round(8 * scale),
    },
    paymentText: { fontSize: normalFont, fontWeight: "bold", color: "#333" },
    emptyCartText: {
      fontSize: normalFont,
      color: "#ddd",
      textAlign: "center",
      marginVertical: Math.round(20 * scale),
    },
    text: {
      fontSize: normalFont,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: Math.round(12 * scale),
      color: "#fff",
    },
  });
}
// ...existing code...