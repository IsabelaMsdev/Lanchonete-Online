// cspell:disable
import React, { useState, useMemo, useEffect } from "react";
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
  Modal,
  ActivityIndicator,
} from "react-native";

import { menuItems, categories, MenuItem } from './menuData';

interface CartItem {
  item: MenuItem;
  quantity: number;
  note: string; 
}

const backgroundImage = require("./marmorizadacinza.jpg");
const logoImage = require("./logo.png");

export default function App(): JSX.Element {
  const { width } = useWindowDimensions();
  const [cart, setCart] = useState<CartItem[]>([]); 
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  
  // Estados de Fluxo
  const [isLoading, setIsLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState<'browsing' | 'preparing'>('browsing');
  const [prepStep, setPrepStep] = useState(0); // 0: Recebido, 1: Cozinha, 2: Entrega

  // Estados de Feedback
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [isCartBouncing, setIsCartBouncing] = useState(false);

  const DELIVERY_FEE = 5.00;
  const { styles, scale, fontScale } = useMemo(() => createStyles(width), [width]); 

  // Splash Screen
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2500);
  }, []);

  // Simulação de Progresso do Pedido (Passo 3)
  useEffect(() => {
    if (orderStatus === 'preparing') {
      const interval = setInterval(() => {
        setPrepStep((prev) => (prev < 2 ? prev + 1 : prev));
      }, 5000); // Muda o status a cada 5 segundos para demonstração
      return () => clearInterval(interval);
    }
  }, [orderStatus]);

  const addToCart = (item: MenuItem) => {
    setLastAddedId(item.id);
    setTimeout(() => setLastAddedId(null), 1500);
    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 300);

    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1, note: "" }];
    });
  };

  const handleFinishOrder = () => {
    if (!paymentMethod) {
      Alert.alert("Quase lá!", "Selecione uma forma de pagamento.");
      return;
    }
    setIsCartModalVisible(false);
    setOrderStatus('preparing');
  };

  const subtotal = cart.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);
  const totalWithDelivery = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Sugestões do Chef (Passo 1): Filtra itens com preço > 30 ou categoria específica
  const chefSuggestions = useMemo(() => {
    return menuItems.filter(item => item.price > 25).slice(0, 3);
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // TELA DE SPLASH
  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Image source={logoImage} style={styles.splashLogo} />
        <Text style={styles.splashTitle}>Lanchonete Online</Text>
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      </View>
    );
  }

  // TELA DE STATUS DO PEDIDO (Passo 3)
  if (orderStatus === 'preparing') {
    return (
      <SafeAreaView style={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>Pedido em Andamento</Text>
          <Text style={styles.statusSubtitle}>Acompanhe o seu lanche</Text>
        </View>

        <View style={styles.progressTracker}>
          {[
            { label: 'Confirmado', icon: '✅' },
            { label: 'Na Cozinha', icon: '👨‍🍳' },
            { label: 'Saiu para Entrega', icon: '🛵' }
          ].map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={[styles.stepCircle, prepStep >= index && styles.stepCircleActive]}>
                <Text>{step.icon}</Text>
              </View>
              <Text style={[styles.stepLabel, prepStep >= index && styles.stepLabelActive]}>{step.label}</Text>
              {index < 2 && <View style={[styles.stepLine, prepStep > index && styles.stepLineActive]} />}
            </View>
          ))}
        </View>

        <View style={styles.orderSummaryCard}>
          <Text style={styles.cardTitle}>Resumo do seu Pedido</Text>
          {cart.map(item => (
            <Text key={item.item.id} style={styles.orderSummaryText}>• {item.quantity}x {item.item.name}</Text>
          ))}
          <Text style={styles.orderSummaryTotal}>Total Pago: R$ {totalWithDelivery.toFixed(2)}</Text>
        </View>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {setOrderStatus('browsing'); setCart([]); setPrepStep(0);}}
        >
          <Text style={styles.backButtonText}>Fazer Novo Pedido</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.containerTransparent}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <TouchableOpacity 
              style={[styles.cartHeaderBtn, isCartBouncing && { transform: [{ scale: 1.3 }] }]} 
              onPress={() => setIsCartModalVisible(true)}
            >
              <Text style={{ fontSize: 22 * scale }}>🛒</Text>
              {cartCount > 0 && (
                <View style={styles.cartHeaderBadge}>
                  <Text style={styles.cartHeaderBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <Image source={logoImage} style={styles.logo} />
            <Text style={styles.title}>Lanchonete Online</Text>
          </View>

          {/* SUGESTÕES DO CHEF (Passo 1) */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.sectionTitle}>⭐ Sugestões do Chef</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
              {chefSuggestions.map((item) => (
                <TouchableOpacity key={item.id} style={styles.suggestionCard} onPress={() => addToCart(item)}>
                  <Image source={{ uri: item.image }} style={styles.suggestionImage} />
                  <View style={styles.suggestionInfo}>
                    <Text style={styles.suggestionName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.suggestionPrice}>R$ {item.price.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Encontre seu lanche preferido..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => setSelectedCategory(cat)}
                style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.menuGrid}>
            {filteredItems.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
                <TouchableOpacity 
                  style={[styles.addBtn, lastAddedId === item.id && { backgroundColor: '#28A745' }]} 
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.addBtnText}>{lastAddedId === item.id ? "✓ Pronto" : "Adicionar"}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {cart.length > 0 && (
          <TouchableOpacity style={styles.floatingCartBtn} onPress={() => setIsCartModalVisible(true)}>
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>
            <Text style={styles.floatingCartText}>Finalizar Agora</Text>
            <Text style={styles.floatingCartTotal}>R$ {totalWithDelivery.toFixed(2)}</Text>
          </TouchableOpacity>
        )}

        {/* MODAL CARRINHO (Mantido conforme anterior) */}
        <Modal animationType="slide" transparent={true} visible={isCartModalVisible}>
           <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Meu Carrinho</Text>
                <TouchableOpacity onPress={() => setIsCartModalVisible(false)}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {cart.map((cartItem) => (
                  <View key={cartItem.item.id} style={styles.cartItemContainer}>
                    <View style={styles.cartItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cartItemName}>{cartItem.item.name}</Text>
                        <Text style={styles.cartItemPrice}>R$ {cartItem.item.price.toFixed(2)}</Text>
                      </View>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => {/* logic */}}><Text>-</Text></TouchableOpacity>
                        <Text style={styles.qtyText}>{cartItem.quantity}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(cartItem.item)}><Text>+</Text></TouchableOpacity>
                      </View>
                    </View>
                    <TextInput style={styles.noteInput} placeholder="Observações..." value={cartItem.note} onChangeText={(text) => {}} />
                  </View>
                ))}
                <View style={styles.paymentContainer}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Forma de Pagamento:</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {['Pix', 'Cartão', 'Dinheiro'].map(m => (
                      <TouchableOpacity key={m} onPress={() => setPaymentMethod(m)} style={[styles.paymentOption, paymentMethod === m && styles.paymentOptionActive]}>
                        <Text style={{color: paymentMethod === m ? '#28A745' : '#333'}}>{m}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <Text style={styles.totalValueModal}>Total: R$ {totalWithDelivery.toFixed(2)}</Text>
                <TouchableOpacity style={styles.checkoutBtn} onPress={handleFinishOrder}>
                  <Text style={styles.checkoutBtnText}>Confirmar Pedido</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

function createStyles(width: number) {
  const scale = width / 375;
  const itemsPerRow = width > 600 ? 3 : 2;
  const gap = 15;
  const cardWidth = (width - 40 - (gap * (itemsPerRow - 1))) / itemsPerRow;

  return {
    scale,
    styles: StyleSheet.create({
      splashContainer: { flex: 1, backgroundColor: '#0A2342', justifyContent: 'center', alignItems: 'center' },
      splashLogo: { width: 120, height: 120, borderRadius: 60 },
      splashTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
      
      backgroundImage: { flex: 1 },
      containerTransparent: { flex: 1, backgroundColor: 'rgba(255,255,255,0.92)' },
      scrollContent: { paddingBottom: 100 },
      header: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#0A2342', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
      cartHeaderBtn: { position: 'absolute', right: 25, top: 25 },
      cartHeaderBadge: { position: 'absolute', right: -5, top: -5, backgroundColor: '#28A745', borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
      cartHeaderBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
      logo: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#fff' },
      title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 10 },

      // Sugestões (Passo 1)
      suggestionsSection: { marginVertical: 20 },
      sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 15, color: '#0A2342' },
      suggestionCard: { width: 160, backgroundColor: '#fff', borderRadius: 15, marginRight: 15, elevation: 4, overflow: 'hidden' },
      suggestionImage: { width: '100%', height: 100 },
      suggestionInfo: { padding: 10 },
      suggestionName: { fontWeight: 'bold', fontSize: 14 },
      suggestionPrice: { color: '#28A745', fontWeight: 'bold' },

      searchContainer: { paddingHorizontal: 20, marginTop: -20 },
      searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 15, elevation: 5 },
      categoriesList: { marginVertical: 20, paddingLeft: 20 },
      categoryBtn: { padding: 10, marginRight: 10, borderRadius: 20, backgroundColor: '#eee' },
      categoryBtnActive: { backgroundColor: '#0A2342' },
      categoryTextActive: { color: '#fff' },

      menuGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20 },
      productCard: { width: cardWidth, backgroundColor: '#fff', borderRadius: 15, padding: 10, marginBottom: gap, marginRight: gap/2, elevation: 3 },
      productImage: { width: '100%', height: cardWidth * 0.8, borderRadius: 10 },
      productName: { fontWeight: 'bold', marginTop: 5, height: 35 },
      productPrice: { color: '#28A745', fontWeight: 'bold' },
      addBtn: { backgroundColor: '#0A2342', padding: 8, borderRadius: 10, marginTop: 5, alignItems: 'center' },
      addBtnText: { color: '#fff', fontWeight: 'bold' },

      // Tela de Status (Passo 3)
      statusContainer: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
      statusHeader: { alignItems: 'center', marginVertical: 30 },
      statusTitle: { fontSize: 24, fontWeight: 'bold', color: '#0A2342' },
      statusSubtitle: { color: '#666' },
      progressTracker: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 40, paddingHorizontal: 20 },
      stepContainer: { alignItems: 'center', flex: 1 },
      stepCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
      stepCircleActive: { backgroundColor: '#D4EDDA', borderWidth: 2, borderColor: '#28A745' },
      stepLine: { position: 'absolute', top: 25, left: '50%', width: '100%', height: 4, backgroundColor: '#eee', zIndex: 1 },
      stepLineActive: { backgroundColor: '#28A745' },
      stepLabel: { fontSize: 10, marginTop: 10, textAlign: 'center', color: '#999' },
      stepLabelActive: { color: '#28A745', fontWeight: 'bold' },
      orderSummaryCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 5 },
      cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 15 },
      orderSummaryText: { color: '#555', marginBottom: 5 },
      orderSummaryTotal: { borderTopWidth: 1, borderColor: '#eee', marginTop: 15, paddingTop: 15, fontWeight: 'bold', color: '#28A745', fontSize: 18 },
      backButton: { backgroundColor: '#0A2342', padding: 18, borderRadius: 15, marginTop: 30, alignItems: 'center' },
      backButtonText: { color: '#fff', fontWeight: 'bold' },

      // Floating Cart
      floatingCartBtn: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#28A745', padding: 18, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 10 },
      floatingCartText: { color: '#fff', fontWeight: 'bold' },
      floatingCartTotal: { color: '#fff', fontWeight: 'bold' },
      cartBadge: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 8 },
      cartBadgeText: { color: '#28A745', fontWeight: 'bold' },

      // Modal (Simplified)
      modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
      modalContent: { backgroundColor: '#fff', height: '80%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
      modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
      modalTitle: { fontSize: 20, fontWeight: 'bold' },
      closeBtn: { fontSize: 24, color: '#999' },
      cartItemContainer: { borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 10 },
      cartItemRow: { flexDirection: 'row', justifyContent: 'space-between' },
      cartItemName: { fontWeight: 'bold' },
      quantityControls: { flexDirection: 'row', alignItems: 'center' },
      qtyBtn: { backgroundColor: '#eee', padding: 5, borderRadius: 5, width: 30, alignItems: 'center' },
      qtyText: { marginHorizontal: 10 },
      noteInput: { backgroundColor: '#f9f9f9', padding: 8, borderRadius: 10, marginTop: 10, fontSize: 12 },
      paymentContainer: { marginVertical: 20 },
      paymentOption: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 10, alignItems: 'center' },
      paymentOptionActive: { borderColor: '#28A745', backgroundColor: '#f0fff0' },
      modalFooter: { borderTopWidth: 1, borderColor: '#eee', paddingTop: 20 },
      totalValueModal: { fontSize: 24, fontWeight: 'bold', color: '#28A745', textAlign: 'right', marginBottom: 15 },
      checkoutBtn: { backgroundColor: '#0A2342', padding: 18, borderRadius: 15, alignItems: 'center' },
      checkoutBtnText: { color: '#fff', fontWeight: 'bold' }
    })
  };
}