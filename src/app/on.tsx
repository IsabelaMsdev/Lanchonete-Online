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

// Tipagem para Item do Carrinho com Quantidade
interface CartItem {
  item: MenuItem;
  quantity: number;
}

// Imagem de fundo local (marmorizada)
const backgroundImage = require("./marmorizadacinza.jpg");

// Logo local
const logoImage = require("./logo.png");

// Estrutura dos métodos de pagamento para facilitar a renderização e ícones
const paymentOptions = [
    { name: "Pix", icon: "🔑", description: "Pagamento instantâneo no checkout.", method: "Pix" },
    { name: "Cartão de Crédito", icon: "💳", description: "Pagar na entrega.", method: "Cartão de Crédito" },
    { name: "Cartão de Débito", icon: "💳", description: "Pagar na entrega.", method: "Cartão de Débito" },
    { name: "Dinheiro", icon: "💵", description: "Pagar na entrega (opção de troco).", method: "Dinheiro" },
    { name: "Pagar pelo Aplicativo", icon: "📱", description: "Débito automático no app.", method: "Pagar pelo Aplicativo" }
];


// Categorias de itens do cardápio
const categorizedMenuItems: Record<string, MenuItem[]> = {
  Lanches: [ // Substitui a categoria "Comidas"
    {
      id: "1",
      name: "Hambúrguer Clássico",
      image:
        "https://st4.depositphotos.com/1020618/23910/i/450/depositphotos_239107218-stock-photo-tasty-burger-with-french-fries.jpg",
      description: "Delicioso hambúrguer artesanal com queijo, alface e tomate.",
      price: 35.0,
    },
    {
      id: "4",
      name: "Cachorro-quente Gourmet",
      image:
        "https://www.cnnbrasil.com.br/viagemegastronomia/wp-content/uploads/sites/5/2022/09/dia-do-cachorro-quente.jpg?w=1200&h=1200&crop=1",
      description: "Salsicha artesanal, purê de batata, milho e batata palha.",
      price: 15.0,
    },
    {
      id: "21",
      name: "Sanduíche Natural de Frango",
      image:
        "https://st3.depositphotos.com/1000300/12530/i/450/depositphotos_125304602-stock-photo-chicken-breast-sandwich.jpg",
      description: "Pão integral, frango desfiado, ricota e vegetais frescos.",
      price: 22.0,
    },
    {
      id: "22",
      name: "Wrap de Carne Seca",
      image:
        "https://img.freepik.com/fotos-premium/wrap-mexicano-com-carne-e-salada-em-un-fundo-branco_662214-36.jpg",
      description: "Massa de wrap com carne seca desfiada e cream cheese.",
      price: 28.0,
    },
    {
      id: "23",
      name: "Porção de Batata Rústica",
      image:
        "https://img.freepik.com/fotos-premium/batatas-fritas-crocantes-em-uma-tigela_960786-191.jpg",
      description: "Batatas fritas rústicas com alho e alecrim.",
      price: 19.9,
    },
    // NOVOS ITENS DE LANCHES
    {
      id: "29",
      name: "Misto Quente",
      image:
        "https://static.itdg.com.br/images/360-240/misto-quente-na-chapa-1-8e7c15efd4d5e9.jpg",
      description: "Pão de forma na chapa, queijo mussarela e presunto.",
      price: 8.5,
    },
    {
      id: "30",
      name: "Pastel de Queijo",
      image:
        "https://st4.depositphotos.com/1000300/21575/i/450/depositphotos_215757752-stock-photo-pastel-frito-fried-brazilian-pastry.jpg",
      description: "Pastel crocante recheado com queijo minas.",
      price: 9.0,
    },
    {
      id: "31",
      name: "Coxinha de Frango com Catupiry",
      image:
        "https://static.itdg.com.br/images/360-240/coxinha-de-frango-com-catupiry-9f6b9c.jpg",
      description: "A tradicional coxinha de frango desfiado com catupiry.",
      price: 7.5,
    },
  ],
  Sobremesas: [
    {
      id: "5",
      name: "Torta Holandesa Cremosa", // Nome atualizado
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOMP2cw8UH-5vGcFVWkoOgSYhhxHfnsmfb5g&s",
      description: "Base de biscoito, creme holandês e cobertura de chocolate.",
      price: 15.0,
    },
    {
      id: "6",
      name: "Pudim de Leite Condensado", // Nome atualizado
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXx8P4TFhkkFXOo3P73PGJXcZS03sPX3dagg&s",
      description: "Pudim tradicional de leite condensado com calda de caramelo.",
      price: 13.5,
    },
    {
      id: "11",
      name: "Mousse de Maracujá Cremoso", // Nome atualizado
      image:
        "https://static.itdg.com.br/images/360-240/8fed8f60d3c8e3990396e2478cbc7f2a/shutterstock-1905617575-1-.jpg",
      description: "Mousse aerado de maracujá feito com a própria fruta.",
      price: 8.0,
    },
    {
      id: "12",
      name: "Brownie com Sorvete", // Nome atualizado
      image:
        "https://vovopalmirinha.com.br/wp-content/uploads/2020/01/vovo-palmirinha-brownie.jpg",
      description: "Brownie quente de chocolate com uma bola de sorvete de baunilha.",
      price: 16.0,
    },
    {
      id: "25",
      name: "Taça de Açaí Power", // Novo item
      image:
        "https://st2.depositphotos.com/1000300/11835/i/450/depositphotos_118356392-stock-photo-acai-bowl.jpg",
      description: "Açaí com granola, leite em pó, morangos e banana.",
      price: 19.0,
    },
    {
      id: "26",
      name: "Mini Churros com Doce de Leite", // Novo item
      image:
        "https://img.freepik.com/fotos-premium/churros-espanhois-com-molho-de-caramelo_662214-36.jpg",
      description: "Churros crocantes cobertos com açúcar e canela, servidos com doce de leite.",
      price: 14.0,
    },
    // NOVOS ITENS DE SOBREMESAS
    {
      id: "32",
      name: "Banoffe Pie",
      image:
        "https://st4.depositphotos.com/1000300/21575/i/450/depositphotos_215757752-stock-photo-pastel-frito-fried-brazilian-pastry.jpg", // Imagem placeholder
      description: "Torta inglesa de banana, toffee e chantilly.",
      price: 18.0,
    },
    {
      id: "33",
      name: "Salada de Frutas",
      image:
        "https://img.freepik.com/fotos-premium/salada-de-frutas-frescas-em-uma-tigela-de-vidro_12345-6789.jpg", // Imagem placeholder
      description: "Mix de frutas frescas da estação, leve e refrescante.",
      price: 12.0,
    },
    {
      id: "34",
      name: "Tiramisu Clássico",
      image:
        "https://st3.depositphotos.com/1000676/12839/i/450/depositphotos_128394464-stock-photo-carrot-cake-slice.jpg", // Imagem placeholder
      description: "Clássica sobremesa italiana com café, biscoito e mascarpone.",
      price: 21.0,
    },
  ],
  Bebidas: [
    {
      id: "13",
      name: "Água Mineral (500ml)", // Nome atualizado
      image:
        "https://mir-s3-cdn-cf.behance.net/project_modules/fs/933b37104527701.5f6a377a3ad51.jpg",
      description: "Água com gás ou sem gás.",
      price: 6.0,
    },
    {
      id: "14",
      name: "Milk Shake de Morango", // Nome atualizado
      image:
        "https://t4.ftcdn.net/jpg/02/33/00/19/360_F_233001977_ylLHVj9o2HAoEab4zzM6Kirms6I0XBCM.jpg",
      description: "Milk shake cremoso de morango.",
      price: 12.6,
    },
    {
      id: "15",
      name: "Refrigerante Lata", // Nome atualizado
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhJCK-niB8nDkIxQcSNv9B1FuvP0oAU51n4A&s",
      description: "Refrigerantes variados (Coca, Guaraná, Soda).",
      price: 7.5,
    },
    {
      id: "16",
      name: "Suco Natural de Laranja", // Nome atualizado
      image:
        "https://thumbs.dreamstime.com/b/vidros-com-sucos-org%C3%A2nicos-frescos-do-vegetal-e-de-fruto-60371647.jpg",
      description: "Sucos naturais de laranja ou abacaxi.",
      price: 10.0,
    },
    {
      id: "27",
      name: "Café Expresso", // Novo item
      image:
        "https://st3.depositphotos.com/1000676/12711/i/450/depositphotos_127112048-stock-photo-cup-of-hot-espresso-coffee.jpg",
      description: "Dose simples de café expresso, forte e quente.",
      price: 5.0,
    },
    {
      id: "28",
      name: "Limonada Suíça", // Novo item
      image:
        "https://img.freepik.com/fotos-premium/limonada-suica-refrescante-com-cubos-de-gelo-e-hortela_662214-36.jpg",
      description: "Refrescante limonada batida com casca e leite condensado.",
      price: 9.0,
    },
    // NOVOS ITENS DE BEBIDAS
    {
      id: "35",
      name: "Chá Gelado de Pêssego",
      image:
        "https://st4.depositphotos.com/1000300/21575/i/450/depositphotos_215757752-stock-photo-pastel-frito-fried-brazilian-pastry.jpg", // Imagem placeholder
      description: "Chá preto gelado com sabor natural de pêssego e gelo.",
      price: 8.0,
    },
    {
      id: "36",
      name: "Chocolate Quente Cremoso",
      image:
        "https://st3.depositphotos.com/1000676/12711/i/450/depositphotos_127112048-stock-photo-cup-of-hot-espresso-coffee.jpg", // Imagem placeholder
      description: "Chocolate cremoso e quente, perfeito para dias frios.",
      price: 11.0,
    },
    {
      id: "37",
      name: "Água de Coco Natural",
      image:
        "https://img.freepik.com/fotos-premium/agua-de-coco-fresca-em-copo_12345-6789.jpg", // Imagem placeholder
      description: "Água de coco natural gelada.",
      price: 9.5,
    },
  ],
};

// Função auxiliar para renderizar a logo, aceitando o estilo
const renderLogo = (logoStyle: any) => (
    <Image source={logoImage} style={logoStyle} />
);

export default function App(): JSX.Element {
  const { width } = useWindowDimensions();
  
  // Destructuring styles and scale from the memoized result
  const { styles, scale, primaryColor } = useMemo(() => createStyles(width), [width]); 

  const [cart, setCart] = useState<CartItem[]>([]); 
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Lanches",
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  // Estado para rastrear o campo de input focado (UX: feedback visual)
  const [focusedInput, setFocusedInput] = useState<string | null>(null); 
  
  const [isPaymentScreen, setIsPaymentScreen] = useState<boolean>(false);
  const [isConfirmationScreen, setIsConfirmationScreen] =
    useState<boolean>(false);
  
  // ESTADOS PARA PAGAMENTO
  const [paymentMethod, setPaymentMethod] = useState<string>(""); // Método final (ex: Dinheiro (Troco para R$ 50,00))
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(""); // Seleção temporária na tela de pagamento
  const [changeFor, setChangeFor] = useState<string>(""); // Valor para troco (se aplicável)
  const [isExactAmount, setIsExactAmount] = useState<boolean>(false); // NOVIDADE: Indica se é valor exato
  
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  // Funções de Navegação de Retorno (UX: Escapismo)
  const handleBackToMenu = () => {
    setIsPaymentScreen(false);
    // Limpar estados temporários ao voltar
    setSelectedPaymentMethod(""); 
    setChangeFor("");
    setIsExactAmount(false); // Limpar estado de troco
  };
  
  const handleBackToPayment = () => {
    setIsConfirmationScreen(false);
    setIsPaymentScreen(true);
  };
  

  // Lógica de filtragem de itens
  const filteredItems = useMemo(() => {
    if (!selectedCategory) return [];

    const items = categorizedMenuItems[selectedCategory] || [];
    
    // Se não houver termo de busca, retorna todos os itens da categoria
    if (!searchTerm.trim()) return items;

    const lowerCaseSearch = searchTerm.trim().toLowerCase();
    
    // Filtra itens cujo nome ou descrição contenha o termo de busca
    return items.filter(item => 
        item.name.toLowerCase().includes(lowerCaseSearch) ||
        item.description?.toLowerCase().includes(lowerCaseSearch)
    );
  }, [selectedCategory, searchTerm]); 
  

  // Adiciona ou Incrementa a Quantidade
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.item.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    
    // Adiciona feedback visual temporário
    setRecentlyAddedId(item.id);
    setTimeout(() => {
        setRecentlyAddedId(null);
    }, 300); 
  };

  // Funções de ajuste de quantidade
  const increaseQuantity = (itemId: string) => {
    setCart((prev) =>
      prev.map((cartItem) =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem,
      ),
    );
  };

  const decreaseQuantity = (itemId: string) => {
    setCart((prev) =>
      prev
        .map((cartItem) =>
          cartItem.item.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem,
        )
        .filter((cartItem) => cartItem.quantity > 0), 
    );
  };
  
  // Cálculo de totais
  const calculateTotalItems = (): number => {
    return cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  };

  const calculateTotal = (): string => {
    return cart.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0).toFixed(2);
  };

  const handleRegister = () => {
    // Validação básica para o telefone (ex: 8 dígitos mínimos)
    if (name.trim() && phone.trim().length >= 8 && email.trim()) {
      setIsRegistered(true);
    } else {
      Alert.alert(
        "Atenção",
        "Por favor, preencha seu Nome, Email e um Telefone válido (mínimo 8 dígitos) para continuar.",
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

  // Confirma a seleção de pagamento e lida com a lógica do Troco
  const handleProceedToConfirmation = () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Atenção", "Selecione um método de pagamento para continuar.");
      return;
    }

    let finalPaymentMethod = selectedPaymentMethod;
    
    // Lógica do Troco
    if (selectedPaymentMethod === "Dinheiro") {
      if (isExactAmount) {
          finalPaymentMethod = "Dinheiro (Valor exato)";
      } else if (!changeFor || changeFor.trim() === '') {
          // Se o usuário não marcou "Valor Exato" mas deixou o campo em branco, assumimos valor exato
          finalPaymentMethod = "Dinheiro (Valor exato)"; 
      } else {
          const total = parseFloat(calculateTotal());
          // Substitui vírgula por ponto para o parseFloat
          const changeAmount = parseFloat(changeFor.replace(',', '.'));
          
          if (isNaN(changeAmount) || changeAmount < total) {
             Alert.alert(
                "Valor Insuficiente",
                `O valor para troco (R$ ${changeFor}) deve ser igual ou maior que o total do pedido (R$ ${calculateTotal()}).`,
             );
             return;
          }
          // Troco para: R$ 50,00
          finalPaymentMethod = `Dinheiro (Troco para R$ ${changeFor})`;
      }
    }

    setPaymentMethod(finalPaymentMethod);
    setSelectedPaymentMethod(""); // Limpa seleção temporária
    setChangeFor(""); // Limpa valor do troco
    setIsExactAmount(false); // Limpa valor exato
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
    setSelectedCategory("Lanches");
    setPaymentMethod("");
    setSelectedPaymentMethod("");
  };
  
  // Função para formatar o troco no input (ex: 50,00)
  const formatCurrencyInput = (text: string) => {
    // Permite apenas dígitos e uma vírgula
    let cleaned = text.replace(/[^0-9,]/g, "");

    // Garante no máximo uma vírgula
    let parts = cleaned.split(',');
    if (parts.length > 2) {
        cleaned = parts[0] + ',' + parts.slice(1).join('');
    }
    
    // Limita a duas casas decimais após a vírgula
    if (parts.length === 2 && parts[1].length > 2) {
        cleaned = parts[0] + ',' + parts[1].substring(0, 2);
    }


    setChangeFor(cleaned);
  };

  // Função para renderizar o Botão Voltar
  const renderBackButton = (onPress: () => void) => (
      <TouchableOpacity onPress={onPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>⬅️ Voltar</Text>
      </TouchableOpacity>
  );


  // 1. Pedido Realizado (Fundo Marmorizado) - UX: Gestão de Expectativas
  if (orderPlaced) {
    // Extrai o troco se for dinheiro para exibição
    const isCash = paymentMethod.includes("Dinheiro");
    const displayPaymentMethod = isCash
        ? paymentMethod // Ex: Dinheiro (Troco para R$ 50,00)
        : paymentMethod;

    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.containerTransparent}> 
          <ScrollView contentContainerStyle={styles.scrollContentCenter}>
            {renderLogo(styles.logoFull)}
            <Text style={styles.title}>🎉 Pedido Realizado!</Text>
            <Text style={styles.text}>Seu pedido foi realizado com sucesso.</Text>
            
            {/* Mensagem de Próximos Passos */}
            <Text style={[styles.text, styles.nextStepsText]}>
                ⏳ Tempo de preparo e entrega estimado: 30 a 40 minutos.
            </Text>
            
            <View style={styles.summaryContainer}>
              <Text style={styles.totalText}>
                Total Pago: R$ {calculateTotal()}
              </Text>
              <Text style={styles.paymentText}>Método: {displayPaymentMethod}</Text>
              
              {isCash && paymentMethod.includes("Troco") && (
                  <Text style={styles.changeText}>
                      Aguarde seu troco na entrega!
                  </Text>
              )}
            </View>
            
            <TouchableOpacity
              style={[styles.finalizeButton, { marginTop: Math.round(30 * scale) }]}
              onPress={resetOrder}
            >
              <Text style={styles.finalizeButtonText}>Voltar para o Menu</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 2. Cadastro (Fundo Marmorizado) - UX: Feedback de Input
  if (!isRegistered) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.containerTransparent}>
          <View style={styles.centeredFormWrapper}> 
            {renderLogo(styles.logoFull)}
            <Text style={styles.title}>🍔 Lanchonete On-line</Text>
            <Text style={styles.subtitle}>👋 Bem-vindo! Faça seu Cadastro</Text>
            
            <TextInput
              style={[
                styles.input,
                focusedInput === 'name' && { borderColor: primaryColor }
              ]}
              placeholder="Nome Completo"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
            />
            <TextInput
              style={[
                styles.input,
                focusedInput === 'phone' && { borderColor: primaryColor }
              ]}
              placeholder="Telefone (mínimo 8 dígitos)"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor="#999"
              maxLength={15} // UX: Limite prático para números de telefone
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput(null)}
            />
            <TextInput
              style={[
                styles.input,
                focusedInput === 'email' && { borderColor: primaryColor }
              ]}
              placeholder="E-mail"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
              autoCapitalize="none"
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
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

  // 3. Seleção de Pagamento (Fundo Marmorizado) - UX: Botão Voltar + Troco + Total
  if (isPaymentScreen) {
    
    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.containerTransparent}>
          {/* Botão Voltar para o Cardápio */}
          {renderBackButton(handleBackToMenu)}
          
          <ScrollView contentContainerStyle={styles.scrollContentCenter}>
            {renderLogo(styles.logoFull)}
            <Text style={styles.title}>💳 Método de Pagamento</Text>
            
            {/* Destaque do Total */}
            <View style={[styles.summaryContainer, styles.totalBoxPayment]}>
                <Text style={styles.cartItemCount}>Total a Pagar:</Text>
                <Text style={styles.totalTextLarge}>R$ {calculateTotal()}</Text>
            </View>
            
            <Text style={styles.subtitleSmall}>Selecione uma opção:</Text>
            
            <View style={styles.paymentButtonContainer}>
              {paymentOptions.map(option => (
                <TouchableOpacity
                    key={option.method}
                    style={[
                        styles.paymentButton,
                        selectedPaymentMethod === option.method && styles.paymentButtonSelected,
                    ]}
                    onPress={() => {
                        setSelectedPaymentMethod(option.method);
                        setChangeFor(""); // Limpa troco ao mudar
                        setIsExactAmount(option.method !== "Dinheiro"); // Assume exato para não-dinheiro
                    }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.paymentIcon}>{option.icon}</Text>
                    <Text style={styles.paymentButtonText}>{option.name}</Text>
                  </View>
                  {selectedPaymentMethod === option.method && (
                      <Text style={styles.selectionCheck}>✔️</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Lógica do Troco para Dinheiro */}
            {selectedPaymentMethod === "Dinheiro" && (
                <View style={styles.changeInputContainer}>
                    <Text style={styles.changeInputLabel}>
                        Você precisa de troco?
                    </Text>
                    
                    {/* Botão de Valor Exato */}
                    <TouchableOpacity
                        style={[
                            styles.exactAmountButton,
                            isExactAmount && styles.exactAmountButtonSelected
                        ]}
                        onPress={() => {
                            setIsExactAmount(!isExactAmount);
                            setChangeFor(""); // Zera o input ao marcar/desmarcar
                        }}
                    >
                        <Text style={styles.exactAmountButtonText}>
                           {isExactAmount ? '✅ Valor Exato (Não preciso de troco)' : '⬜ Valor Exato (Não preciso de troco)'}
                        </Text>
                    </TouchableOpacity>

                    {/* Input de Troco Condicional */}
                    {!isExactAmount && (
                        <View style={{ marginTop: Math.round(15 * scale) }}>
                            <Text style={styles.changeSubLabel}>
                                Informe para qual valor deseja troco (R$):
                            </Text>
                            <TextInput
                                style={[
                                    styles.input, 
                                    { width: "100%", textAlign: 'center', fontWeight: 'bold' }
                                ]}
                                placeholder={`Ex: ${Math.max(10, Math.ceil(parseFloat(calculateTotal())/10)*10).toFixed(2).replace('.', ',')}`}
                                keyboardType="numeric"
                                value={changeFor}
                                onChangeText={(text) => {
                                    formatCurrencyInput(text);
                                }}
                                placeholderTextColor="#AAA"
                                onFocus={() => setFocusedInput('change')}
                                onBlur={() => setFocusedInput(null)}
                            />
                        </View>
                    )}
                </View>
            )}
            
            {/* Botão Avançar, aparece se um método estiver selecionado */}
            {selectedPaymentMethod && (
                <TouchableOpacity
                    style={styles.finalizeButton}
                    onPress={handleProceedToConfirmation}
                >
                    <Text style={styles.finalizeButtonText}>Avançar para Confirmação</Text>
                </TouchableOpacity>
            )}
            
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 4. Confirmação do Pedido (Fundo Marmorizado) - UX: Detalhes do Cliente + Botão Voltar
  if (isConfirmationScreen) {
    // Extrai o troco se for dinheiro para exibição
    const isCash = paymentMethod.includes("Dinheiro");
    const displayPaymentMethod = isCash
        ? paymentMethod // Ex: Dinheiro (Troco para R$ 50,00)
        : paymentMethod;

    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.containerTransparent}>
            {/* Botão Voltar para a Seleção de Pagamento */}
            {renderBackButton(handleBackToPayment)}
            
          <ScrollView contentContainerStyle={styles.scrollContentCenter}>
            {renderLogo(styles.logoFull)}
            <Text style={styles.title}>📝 Resumo e Confirmação</Text>
            
            {/* Container de Dados do Cliente */}
            <View style={[styles.summaryContainer, styles.customerDetailsContainer]}>
                <Text style={styles.customerDetailTitle}>Detalhes do Cliente:</Text>
                <Text style={styles.customerDetailText}>👤 {name}</Text>
                <Text style={styles.customerDetailText}>📞 {phone}</Text>
                <Text style={styles.customerDetailText}>📧 {email}</Text>
            </View>
            
            {/* Resumo do Pedido (Total, Pagamento, Itens) */}
            <View style={[styles.summaryContainer, { marginBottom: Math.round(15 * scale) }]}>
              <Text style={styles.cartItemCount}>Itens: {calculateTotalItems()}</Text>
              <Text style={styles.paymentText}>Pagamento: {displayPaymentMethod}</Text>
              <Text style={styles.totalText}>Total: R$ {calculateTotal()}</Text>
            </View>

            {/* Lista de Itens do Carrinho com Controle de Quantidade */}
            {cart.length > 0 ? (
                cart.map((cartItem) => (
                    <View
                        key={cartItem.item.id}
                        style={styles.confirmationItemContainer}
                    >
                        <Image
                            source={{ uri: cartItem.item.image }}
                            style={styles.confirmationImage}
                        />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemTitleConfirmation} numberOfLines={1}>
                                {cartItem.item.name}
                            </Text>
                            <Text style={styles.itemPriceText}>
                                R$ {(cartItem.item.price * cartItem.quantity).toFixed(2)}
                            </Text>
                        </View>
                        
                        <View style={styles.quantityControl}>
                            <TouchableOpacity 
                                style={styles.quantityButton}
                                onPress={() => decreaseQuantity(cartItem.item.id)}
                            >
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                            <TouchableOpacity 
                                style={styles.quantityButton}
                                onPress={() => increaseQuantity(cartItem.item.id)}
                            >
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.emptyCartText}>Carrinho vazio</Text>
            )}
            
            <TouchableOpacity
                style={styles.finalizeButton}
                onPress={handlePlaceOrder}
            >
                <Text style={styles.finalizeButtonText}>✅ Efetuar Pedido</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // 5. Tela Principal (Cardápio)
  return (
    <SafeAreaView style={styles.containerMenu}>
      {/* Container do Header e Categorias (Fixo na parte superior) */}
      <View style={styles.headerContainer}>
        <View style={styles.headerInfo}> 
            <View style={styles.headerTitleGroup}>
                {renderLogo(styles.logoHeader)}
                <View style={{marginLeft: Math.round(12 * scale)}}> 
                  <Text style={styles.titleMenu}>🍔 Cardápio</Text>
                  <Text style={styles.cartBadgeMenu}>
                    Sua Lanchonete Online
                  </Text>
                </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cartBadgeMenu}>
                    🛒 {calculateTotalItems()} itens
                </Text>
                <Text style={styles.totalTextHeader}> 
                    R$ {calculateTotal()}
                </Text>
            </View>
        </View>

        {/* Barra de pesquisa abaixo do header principal */}
        <View style={styles.searchBarContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="🔍 Buscar lanches, bebidas..."
                placeholderTextColor="#999"
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
        </View>

        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.categoryScrollContainer}
        >
          {Object.keys(categorizedMenuItems).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => {
                  setSelectedCategory(category);
                  setSearchTerm(""); // Limpa a busca ao mudar de categoria
              }}
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
        </ScrollView>
      </View>

      {/* Container Rolável dos Itens */}
      <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menuScrollContent}>
        
        {/* Usando filteredItems e ajustando o título */}
        {selectedCategory && (
          <View>
            <Text style={styles.categoryTitle}>
              {searchTerm.trim() ? `Resultados para "${searchTerm}"` : selectedCategory}
            </Text>

            <View style={styles.menuGridContainer}>
              {filteredItems.map((item) => (
                <View 
                    key={item.id} 
                    style={[
                        styles.itemContainer,
                        recentlyAddedId === item.id && styles.itemContainerAdded
                    ]}
                >
                  <Image source={{ uri: item.image }} style={styles.image} /> 
                  
                  <View style={styles.itemInfoGroup}>
                    <View style={styles.itemTextContainer}>
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
                    </View>
                  
                    <View style={styles.itemBottomRow}>
                        
                        <Text style={styles.itemPriceMain}>
                            R$ {item.price.toFixed(2)}
                        </Text>
                        
                        <TouchableOpacity
                            style={styles.addButton} 
                            onPress={() => addToCart(item)}
                        >
                            <Text style={styles.addButtonText}>➕</Text>
                        </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              
              {/* Feedback se a busca não encontrar resultados */}
              {filteredItems.length === 0 && searchTerm.trim() && (
                  <Text style={styles.emptySearchText}>
                      Nenhum resultado encontrado para "{searchTerm}".
                  </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botão de Finalizar Fixo na Base (Cor Verde Sucesso) */}
      {cart.length > 0 && (
          <TouchableOpacity
            style={styles.finalizeButtonFixed}
            onPress={handleFinalizeOrder}
          >
            <Text style={styles.finalizeButtonText}>🛍️ Finalizar Pedido (R$ {calculateTotal()})</Text>
          </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

/**
 * Cria styles responsivos baseado na largura, com cores e tamanhos ajustados.
 * Retorna um objeto contendo os estilos criados e o fator de escala.
 */
function createStyles(width: number) {
  // --- DEFINIÇÕES DE RESPONSIVIDADE ---
  const baseWidth = 375;
  const scale = Math.max(0.85, Math.min(1.2, width / baseWidth));
  const isExtraLargeScreen = width >= 1000; 
  const maxWidth = 900; 
  const contentMaxWidth = 500; 
  const horizontalPadding = Math.round(16 * scale); 

  const logoHeaderSize = width >= 900 ? 80 : width >= 600 ? 70 : 60; 
  const logoFullSize = width >= 900 ? 180 : width >= 600 ? 140 : 100; 

  const itemWidth = width >= 900 ? "32%" : width >= 600 ? "48%" : "100%";
  const marginVertical = itemWidth === '100%' ? Math.round(10 * scale) : Math.round(8 * scale);


  // --- CORES NOVAS E ATUALIZADAS (Mais profissionais/modernas) ---
  const primaryColor = "#FF6C00"; // Laranja Sólido (Marca)
  const successColor = "#4CAF50"; // Verde (Ação Principal/Finalizar)
  const textColor = "#111"; // Preto mais forte para melhor contraste
  const secondaryTextColor = "#666"; // Cinza para descrições
  const whiteColor = "#fff";
  const lightBackgroundColor = "#FFFFFF"; // Fundo branco puro
  const superLightGray = "#F0F2F5"; // Cinza muito sutil para backgrounds de elementos
  const baseTransparentBackground = "rgba(0,0,0,0.35)"; // Escurecido para melhor contraste do texto


  // --- FONTES ---
  const smallFont = Math.round(12 * scale);
  const normalFont = Math.round(14 * scale);
  const largeFont = Math.round(18 * scale);
  const titleFont = Math.round(24 * scale);
  
  // --- SOFT SHADOW (Sombra unificada e suave para modernidade) ---
  const softShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 * scale }, 
    shadowOpacity: 0.08, 
    shadowRadius: 8 * scale, 
    elevation: 4, 
  };


  const styles = StyleSheet.create({
    // --- ESTILOS GERAIS/BACKGROUNDS ---
    backgroundImage: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    containerTransparent: {
        flex: 1,
        paddingTop: Platform.OS === "ios" ? Math.round(24 * scale) : Math.round(18 * scale),
        backgroundColor: baseTransparentBackground, 
        alignItems: "center",
    },
    // Estilo do Botão Voltar
    backButton: {
        position: 'absolute',
        top: Platform.OS === "ios" ? Math.round(40 * scale) : Math.round(20 * scale), 
        left: horizontalPadding,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: Math.round(12 * scale),
        paddingVertical: Math.round(6 * scale),
        borderRadius: 50,
        ...softShadow,
    },
    backButtonText: {
        fontSize: normalFont,
        fontWeight: 'bold',
        color: textColor,
    },
    containerMenu: {
      flex: 1,
      backgroundColor: lightBackgroundColor, 
    },
    centeredFormWrapper: {
      width: "100%",
      maxWidth: contentMaxWidth, 
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Math.round(20 * scale),
      paddingHorizontal: horizontalPadding,
      flex: 1, 
    },
    scrollContentCenter: {
      minHeight: '100%', 
      width: '100%',
      maxWidth: contentMaxWidth + (horizontalPadding * 2), 
      alignItems: "center",
      paddingVertical: Math.round(20 * scale),
      paddingHorizontal: horizontalPadding,
    },
    
    // --- LOGO ---
    logoHeader: {
        width: logoHeaderSize,
        height: logoHeaderSize,
        resizeMode: "contain",
        borderRadius: Math.round(8 * scale), 
        marginBottom: 0, 
    },
    logoFull: {
        width: logoFullSize,
        height: logoFullSize,
        resizeMode: "contain",
        borderRadius: Math.round(12 * scale),
        marginBottom: Math.round(20 * scale), 
        ...softShadow, 
    },
    
    // --- CADASTRO/INPUTS ---
    input: {
        width: "100%", 
        padding: Math.round(12 * scale),
        borderWidth: 2, 
        borderColor: superLightGray, 
        borderRadius: 8,
        marginBottom: Math.round(12 * scale),
        fontSize: normalFont,
        backgroundColor: whiteColor,
        ...softShadow, 
    },
    
    // --- HEADER FIXO E CATEGORIAS (Menu) ---
    headerContainer: {
        paddingTop: Platform.OS === "ios" ? 0 : Math.round(10 * scale),
        backgroundColor: whiteColor, 
        width: "100%",
        ...softShadow, 
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        paddingVertical: Math.round(10 * scale),
        paddingHorizontal: horizontalPadding, 
        width: isExtraLargeScreen ? maxWidth : '100%', 
        alignSelf: 'center',
    },
    headerTitleGroup: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
    },
    
    searchBarContainer: {
        paddingHorizontal: horizontalPadding,
        paddingVertical: Math.round(8 * scale),
        backgroundColor: whiteColor,
        width: isExtraLargeScreen ? maxWidth : '100%',
        alignSelf: 'center',
        paddingTop: Math.round(4 * scale),
    },
    searchInput: {
        width: "100%",
        padding: Math.round(10 * scale),
        borderRadius: 8,
        backgroundColor: superLightGray, 
        fontSize: normalFont,
        color: textColor,
    },
    
    categoryScrollContainer: {
        paddingHorizontal: horizontalPadding, 
        paddingVertical: Math.round(10 * scale),
    },
    categoryButton: {
      backgroundColor: superLightGray, 
      paddingHorizontal: Math.round(12 * scale),
      paddingVertical: Math.round(8 * scale), 
      marginRight: Math.round(8 * scale), 
      borderRadius: 50, 
      borderWidth: 0, 
    },
    categoryButtonActive: { 
        backgroundColor: primaryColor,
        shadowColor: primaryColor,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 2,
    },
    categoryButtonText: { 
        color: secondaryTextColor, 
        fontWeight: "bold", 
        fontSize: smallFont,
    },
    categoryButtonTextActive: { 
        color: whiteColor,
        fontWeight: "800", 
    },
    
    // --- GRID DE ITENS DO CARDÁPIO ---
    menuScroll: {
        flex: 1,
        width: "100%",
    },
    menuScrollContent: {
        paddingBottom: Math.round(120 * scale),
        paddingHorizontal: horizontalPadding, 
        width: isExtraLargeScreen ? maxWidth : '100%', 
        alignSelf: 'center',
    },
    categoryTitle: {
      fontSize: Math.round(20 * scale),
      fontWeight: "800", 
      marginBottom: Math.round(12 * scale),
      marginTop: Math.round(12 * scale),
      textAlign: "left",
      color: textColor, 
    },
    menuGridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    itemContainer: {
      backgroundColor: whiteColor, 
      padding: Math.round(10 * scale), 
      borderRadius: 12, 
      marginVertical: marginVertical, 
      alignItems: 'flex-start',
      width: itemWidth, 
      ...softShadow, 
      borderWidth: 0,
      borderColor: 'transparent',
    },
    itemContainerAdded: {
      borderColor: primaryColor, 
      borderWidth: 2,
      transform: [{ scale: 1.02 }], 
    },

    image: { 
        width: "100%", 
        height: undefined, 
        aspectRatio: 16/9, 
        borderRadius: 8,
        marginBottom: Math.round(6 * scale), 
    },
    
    itemInfoGroup: {
        flex: 1,
        width: "100%",
    },
    itemTextContainer: {
        flex: 1, 
    },
    itemTitle: { 
        fontSize: normalFont + 3, 
        fontWeight: "800", 
        marginTop: Math.round(4 * scale), 
        color: textColor 
    },
    itemDescription: { 
        fontSize: smallFont, 
        color: secondaryTextColor, 
        marginTop: Math.round(4 * scale),
        marginBottom: Math.round(8 * scale), 
    },
    
    itemBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Math.round(10 * scale),
        width: '100%',
    },

    itemPriceMain: {
      fontSize: largeFont + 2, 
      fontWeight: "800", 
      color: primaryColor, 
    },
    
    addButton: {
      backgroundColor: primaryColor, 
      padding: Math.round(10 * scale),
      borderRadius: 8,
      width: itemWidth === '100%' ? Math.round(100 * scale) : Math.round(40 * scale),
      alignItems: "center",
      justifyContent: 'center',
      shadowColor: primaryColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
    },
    addButtonText: { 
        color: whiteColor, 
        fontWeight: "800", 
        fontSize: largeFont, 
    },
    
    emptySearchText: {
      fontSize: normalFont,
      color: secondaryTextColor,
      textAlign: "center",
      marginVertical: Math.round(20 * scale),
      width: '100%',
      paddingHorizontal: horizontalPadding,
    },
    
    // --- CHECKOUT E CONFIRMAÇÃO ---
    confirmationItemContainer: {
      width: "100%", 
      backgroundColor: whiteColor,
      padding: Math.round(12 * scale),
      borderRadius: 12, 
      marginBottom: Math.round(10 * scale),
      flexDirection: "row",
      alignItems: "center",
      ...softShadow, 
    },
    confirmationImage: {
      width: Math.round(60 * scale),
      height: Math.round(60 * scale),
      borderRadius: 8,
      marginRight: Math.round(10 * scale),
    },
    itemDetails: { flex: 1 },
    
    itemTitleConfirmation: { 
        fontSize: normalFont, 
        fontWeight: "bold", 
        color: textColor 
    },
    
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: superLightGray, 
        borderRadius: 8,
        marginLeft: Math.round(10 * scale),
        borderWidth: 0, 
    },
    quantityButton: {
        paddingHorizontal: Math.round(10 * scale),
        paddingVertical: Math.round(4 * scale),
    },
    quantityButtonText: {
        fontSize: largeFont,
        fontWeight: 'bold',
        color: primaryColor,
    },
    quantityText: {
        fontSize: normalFont,
        fontWeight: 'bold',
        paddingHorizontal: Math.round(8 * scale),
        color: textColor,
        minWidth: Math.round(25 * scale),
        textAlign: 'center',
        borderLeftWidth: 0,
        borderRightWidth: 0,
    },
    
    itemPriceText: {
        fontSize: normalFont,
        fontWeight: "bold",
        color: primaryColor, 
        marginTop: Math.round(4 * scale),
    },
    
    paymentButtonContainer: { 
      width: "100%", 
      maxWidth: contentMaxWidth, 
      marginTop: Math.round(10 * scale) 
    },
    paymentButton: {
      backgroundColor: whiteColor, // Mudado para branco para destacar a seleção
      borderWidth: 2,
      borderColor: superLightGray,
      padding: Math.round(14 * scale),
      marginVertical: Math.round(6 * scale),
      borderRadius: 10, 
      alignItems: "center",
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...softShadow,
    },
    paymentButtonSelected: {
        borderColor: primaryColor, // Borda laranja para a seleção
        backgroundColor: superLightGray,
    },
    paymentButtonText: { 
        color: textColor, 
        fontWeight: "bold", 
        fontSize: largeFont,
    },
    paymentIcon: {
        fontSize: largeFont + 2,
        marginRight: Math.round(10 * scale),
    },
    selectionCheck: {
        fontSize: largeFont,
        color: successColor,
    },
    
    finalizeButton: {
      width: "100%", 
      maxWidth: contentMaxWidth, 
      backgroundColor: successColor, 
      padding: Math.round(14 * scale),
      marginTop: Math.round(20 * scale),
      marginBottom: Math.round(14 * scale),
      borderRadius: 10, 
      alignItems: "center",
      shadowColor: successColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 5,
      elevation: 5,
    },
    finalizeButtonFixed: {
        backgroundColor: successColor, 
        padding: Math.round(14 * scale),
        width: "100%", 
        alignItems: "center",
        shadowColor: successColor,
        shadowOffset: { width: 0, height: -4 }, 
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 5,
        position: 'absolute',
        bottom: 0,
        paddingBottom: Platform.OS === 'ios' ? Math.round(24 * scale) : Math.round(14 * scale) + Math.round(4 * scale), 
    },
    finalizeButtonText: { 
        color: whiteColor, 
        fontWeight: "800", 
        fontSize: largeFont,
    },
    
    summaryContainer: {
      width: "100%",
      maxWidth: contentMaxWidth, 
      backgroundColor: whiteColor,
      padding: Math.round(16 * scale), 
      borderRadius: 12,
      marginTop: Math.round(14 * scale),
      borderLeftWidth: 5,
      borderLeftColor: primaryColor, 
      ...softShadow, 
    },
    // Estilo para o container de dados do cliente (para separação visual)
    customerDetailsContainer: {
        borderLeftColor: '#333', // Cor diferente para diferenciar
        marginBottom: Math.round(15 * scale),
    },
    customerDetailTitle: {
        fontSize: normalFont,
        fontWeight: '900',
        color: textColor,
        marginBottom: Math.round(8 * scale),
        textDecorationLine: 'underline',
    },
    customerDetailText: {
        fontSize: normalFont,
        color: secondaryTextColor,
        marginBottom: Math.round(4 * scale),
    },
    totalBoxPayment: {
        borderLeftColor: successColor,
        alignItems: 'center',
        paddingVertical: Math.round(20 * scale),
        marginBottom: Math.round(10 * scale),
    },
    totalTextLarge: {
        fontSize: titleFont + 4, 
        fontWeight: "900",
        color: successColor, 
        marginTop: Math.round(8 * scale),
    },
    changeText: {
        fontSize: normalFont,
        fontWeight: "bold",
        color: primaryColor,
        marginTop: Math.round(8 * scale),
    },
    
    // Controles de Troco
    changeInputContainer: {
        width: "100%",
        maxWidth: contentMaxWidth, 
        backgroundColor: whiteColor,
        padding: Math.round(16 * scale), 
        borderRadius: 12,
        marginTop: Math.round(10 * scale),
        borderLeftWidth: 5,
        borderLeftColor: primaryColor, 
        ...softShadow, 
    },
    changeInputLabel: {
        fontSize: largeFont,
        fontWeight: 'bold',
        color: textColor,
        marginBottom: Math.round(10 * scale),
        textAlign: 'center',
    },
    changeSubLabel: {
        fontSize: normalFont,
        fontWeight: 'normal',
        color: secondaryTextColor,
        marginBottom: Math.round(10 * scale),
        textAlign: 'center',
    },
    exactAmountButton: {
        padding: Math.round(10 * scale),
        borderRadius: 8,
        borderWidth: 2,
        borderColor: superLightGray,
        backgroundColor: superLightGray,
        alignItems: 'center',
    },
    exactAmountButtonSelected: {
        borderColor: successColor,
        backgroundColor: '#E8F5E9', // Verde bem clarinho
    },
    exactAmountButtonText: {
        fontSize: normalFont,
        fontWeight: 'bold',
        color: textColor,
    },
    
    cartItemCount: {
      fontSize: normalFont,
      fontWeight: "bold",
      color: secondaryTextColor,
      marginBottom: Math.round(8 * scale),
    },
    totalText: {
      fontSize: Math.round(22 * scale), 
      fontWeight: "800",
      color: successColor, 
      marginTop: Math.round(8 * scale),
    },
    totalTextHeader: {
        fontSize: largeFont, 
        fontWeight: "800",
        color: primaryColor, 
    },
    paymentText: { 
        fontSize: normalFont, 
        fontWeight: "bold", 
        color: textColor
    },
    emptyCartText: {
      fontSize: normalFont,
      color: secondaryTextColor,
      textAlign: "center",
      marginVertical: Math.round(20 * scale),
    },
    // --- TEXTOS GERAIS ---
    title: { 
      fontSize: titleFont,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: Math.round(10 * scale),
      color: primaryColor, 
    },
    subtitle: { 
      fontSize: Math.round(18 * scale),
      fontWeight: "800",
      marginBottom: Math.round(12 * scale),
      color: whiteColor, 
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 3,
    },
    subtitleSmall: { 
        fontSize: Math.round(16 * scale),
        fontWeight: "800",
        marginTop: Math.round(10 * scale),
        color: whiteColor, 
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3,
      },
    titleMenu: {
        fontSize: largeFont, 
        fontWeight: "800",
        textAlign: "left",
        color: textColor, 
    },
    cartBadgeMenu: {
        fontSize: smallFont,
        fontWeight: "bold",
        color: secondaryTextColor, 
    },
    text: { 
      fontSize: normalFont,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: Math.round(12 * scale),
      color: whiteColor,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 3,
    },
    // Estilo para a mensagem de próximos passos
    nextStepsText: {
        fontSize: largeFont,
        color: '#FFF',
        fontWeight: '900',
        paddingHorizontal: horizontalPadding,
        paddingVertical: Math.round(10 * scale),
        backgroundColor: 'rgba(76, 175, 80, 0.75)', // Verde do sucesso semi-transparente
        borderRadius: 8,
        marginVertical: Math.round(15 * scale),
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
    }
  });
  
  return { styles, scale, primaryColor }; 
}