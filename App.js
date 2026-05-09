import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar, FlatList, Image, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'; 

const { width } = Dimensions.get('window');

let usersDB = {
  'joao': { 
    password: '1234', type: 'producer', name: 'João Silva', 
    question: 'Nome da fazenda', answer: 'sitio', code: 'ABC123',
    phone: '38999999999', address: 'Sítio Santa Rita, Zona Rural, Janaúba - MG' // <-- DADOS NOVOS AQUI
  },
  'maria': { 
    password: '5678', type: 'customer', name: 'Maria Oliveira', 
    question: 'Nome da mãe', answer: 'ana', code: 'DEF456' 
  },
  'admin': { password: 'admin', type: 'admin', name: 'Administrador Supremo', question: 'q', answer: 'a' },
};

const C = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center', padding: 30 },
  logo: { fontSize: 64, textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1B5E20', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25 },
  inputBox: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, fontSize: 16, color: '#333', borderWidth: 1, borderColor: '#E0E0E0' },
  hint: { fontSize: 11, color: '#999', marginTop: 4 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', borderRadius: 10, padding: 12, marginBottom: 15, gap: 8 },
  errorText: { fontSize: 13, color: '#F44336', flex: 1 },
  btn: { backgroundColor: '#4CAF50', borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 15 },
  btnText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  link: { fontSize: 14, fontWeight: '600', padding: 10 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 5 },
  backText: { fontSize: 16, color: '#333' },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0' },
  typeBtnActive: { borderColor: '#2196F3', backgroundColor: '#E3F2FD' },
  typeBtnActive2: { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
  typeEmoji: { fontSize: 36, marginBottom: 5 },
  typeLabel: { fontSize: 14, fontWeight: '600', color: '#666' },
  warningBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF8E1', borderRadius: 12, padding: 12, marginBottom: 15, gap: 8 },
  warningText: { fontSize: 12, color: '#E65100', flex: 1, lineHeight: 18 },
  header: { backgroundColor: '#1B5E20', padding: 20, paddingTop: 10, paddingBottom: 20, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  headerSub: { fontSize: 13, color: '#C8E6C9' },
  userBadge: { fontSize: 24 },
  card: { width: (width - 48) / 2, backgroundColor: '#FFF', borderRadius: 16, margin: 8, overflow: 'hidden', elevation: 3 },
  cardImg: { width: '100%', height: 130, resizeMode: 'cover' },
  cardInfo: { padding: 10 },
  cardName: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 4 },
  cardPrice: { fontSize: 17, fontWeight: 'bold', color: '#4CAF50' },
  cardUnit: { fontSize: 11, color: '#999', fontWeight: '400' },
  cardProducer: { fontSize: 11, color: '#888', marginTop: 2 },
  wppBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#25D366', padding: 10, gap: 6 },
  wppText: { fontSize: 12, fontWeight: 'bold', color: '#FFF' },
  profHeader: { height: 150, backgroundColor: '#1B5E20', justifyContent: 'center', alignItems: 'center' },
  profAvatar: { fontSize: 60 },
  profBody: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  profName: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  profType: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 5 },
  profId: { fontSize: 13, color: '#999', textAlign: 'center', marginBottom: 20 },
  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  metric: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 12, alignItems: 'center', elevation: 2 },
  metricVal: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50' },
  metricLbl: { fontSize: 11, color: '#888', marginTop: 2 },
  secTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  setting: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 8, gap: 12, elevation: 1 },
  settingText: { fontSize: 14, color: '#333', flex: 1 },
  logoutFull: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginTop: 20, borderWidth: 1, borderColor: '#F44336', gap: 8 },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#F44336' },
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 8 },
  rememberText: { fontSize: 14, color: '#666' },
  suggestion: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', borderRadius: 10, padding: 10, marginTop: 8, gap: 6 },
  suggestionText: { fontSize: 13, color: '#E65100' },
  passRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { padding: 10 },
  linkRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  disclaimer: { fontSize: 11, color: '#999', textAlign: 'center', marginTop: 15, lineHeight: 16 },
});

function LoginScreen({ onLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const login = async () => {
    if (!userId.trim()) { setError('Digite seu nome de usuário'); return; }
    if (!password.trim()) { setError('Digite sua senha'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 800));
    const user = usersDB[userId.toLowerCase().trim()];
    if (!user) { setError('Usuário não encontrado'); setLoading(false); return; }
    if (user.password !== password) { setError('Senha incorreta'); setLoading(false); return; }
    onLogin({ userId: userId.toLowerCase().trim(), type: user.type, name: user.name });
  };

  return (
    <SafeAreaView style={C.container}>
      <StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={C.scroll} keyboardShouldPersistTaps="handled">
          <View style={C.content}>
            <Text style={C.logo}>🌱</Text>
            <Text style={C.title}>AgroSocial Market</Text>
            <Text style={C.subtitle}>Janaúba - MG</Text>
            
            <View style={C.inputBox}>
              <Text style={C.label}>👤 Nome de usuário</Text>
              <TextInput style={C.input} value={userId} onChangeText={t => { setUserId(t); setError(''); }} placeholder="Ex: joao" placeholderTextColor="#CCC" autoCapitalize="none" />
            </View>
            
            <View style={C.inputBox}>
              <Text style={C.label}>🔒 Senha</Text>
              <View style={C.passRow}>
                <TextInput style={[C.input, { flex: 1 }]} value={password} onChangeText={t => { setPassword(t); setError(''); }} placeholder="Sua senha" placeholderTextColor="#CCC" secureTextEntry={!showPass} />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={C.eyeBtn}>
                  <MaterialCommunityIcons name={showPass ? 'eye-off' : 'eye'} size={24} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity style={C.rememberRow} onPress={() => setRemember(!remember)}>
              <MaterialCommunityIcons name={remember ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color={remember ? '#4CAF50' : '#999'} />
              <Text style={C.rememberText}>Manter conectado</Text>
            </TouchableOpacity>
            
            {error ? <View style={C.errorBox}><MaterialCommunityIcons name="alert-circle" size={18} color="#F44336" /><Text style={C.errorText}>{error}</Text></View> : null}
            
            <TouchableOpacity style={C.btn} onPress={login} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={C.btnText}>✅ Entrar</Text>}
            </TouchableOpacity>

            {/* --- NOVO BOTÃO DE VISITANTE AQUI --- */}
            <TouchableOpacity 
              style={[C.btn, { backgroundColor: '#E0E0E0', padding: 14 }]} 
              onPress={() => onLogin({ userId: 'visitante', type: 'guest', name: 'Visitante' })}>
              <Text style={[C.btnText, { color: '#333', fontSize: 16 }]}>👀 Entrar sem conta</Text>
            </TouchableOpacity>

            <View style={C.linkRow}>
              <TouchableOpacity onPress={() => onLogin({ action: 'register' })}><Text style={C.link}>➕ Criar conta</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => onLogin({ action: 'recover' })}><Text style={[C.link, { color: '#FF9800' }]}>🔑 Esqueci a senha</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RegisterScreen({ onBack, onRegister }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('customer'); 
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  
  // Dados do produtor
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressObs, setAddressObs] = useState(''); 
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);

  const handleGetLocation = async () => {
    setIsLoadingLoc(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Para usar o GPS, autorize o acesso à localização.');
        setIsLoadingLoc(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (geocode && geocode.length > 0) {
        const p = geocode[0];
        const formatted = `${p.street || p.name || 'Rua não identificada'}, ${p.streetNumber || 'S/N'} - ${p.subregion || p.city || 'Janaúba'}`;
        setAddress(formatted);
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível ler o GPS.');
    }
    setIsLoadingLoc(false);
  };

  const handleFinish = () => {
    if (!name || !userId || !password || !question || !answer) {
      Alert.alert('Erro', 'Preencha todos os campos!'); return;
    }
    const newUser = userId.toLowerCase().trim();
    usersDB[newUser] = {
      password, type, name, phone, address, addressObs,
      question, answer, favorites: [], profilePic: null
    };
    Alert.alert('Sucesso!', 'Conta criada!');
    onRegister({ userId: newUser, type, name });
  };

  return (
    <SafeAreaView style={C.container}>
      <ScrollView contentContainerStyle={C.scroll}>
        <View style={C.content}>
          <TouchableOpacity onPress={onBack} style={C.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
            <Text> Voltar</Text>
          </TouchableOpacity>
          
          <Text style={C.title}>{step === 1 ? 'Cadastro' : 'Mais Detalhes'}</Text>

          {step === 1 ? (
            <>
              <View style={C.typeContainer}>
                <TouchableOpacity style={[C.typeBtn, type === 'customer' && C.typeBtnActive]} onPress={() => setType('customer')}>
                  <Text>🛒 Cliente</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[C.typeBtn, type === 'producer' && C.typeBtnActive]} onPress={() => setType('producer')}>
                  <Text>👨‍🌾 Produtor</Text>
                </TouchableOpacity>
              </View>
              <View style={C.inputBox}><Text style={C.label}>Nome</Text><TextInput style={C.input} value={name} onChangeText={setName} /></View>
              <View style={C.inputBox}><Text style={C.label}>Usuário</Text><TextInput style={C.input} value={userId} onChangeText={setUserId} autoCapitalize="none" /></View>
              <View style={C.inputBox}><Text style={C.label}>Senha</Text><TextInput style={C.input} value={password} onChangeText={setPassword} secureTextEntry /></View>
              <TouchableOpacity style={C.btn} onPress={() => setStep(2)}><Text style={C.btnText}>Próximo</Text></TouchableOpacity>
            </>
          ) : (
            <>
              {type === 'producer' && (
                <>
                  <View style={C.inputBox}><Text style={C.label}>Telefone</Text><TextInput style={C.input} value={phone} onChangeText={setPhone} keyboardType="numeric" /></View>
                  
                  <Text style={C.label}>📍 Endereço (Clique no GPS ao lado)</Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
                    <TextInput style={[C.input, { flex: 1 }]} value={address} onChangeText={setAddress} placeholder="Rua, Número, Cidade" />
                    <TouchableOpacity 
                      style={{ backgroundColor: '#1B5E20', width: 50, height: 45, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}
                      onPress={handleGetLocation}
                    >
                      {isLoadingLoc ? <ActivityIndicator color="#FFF" /> : <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#FFF" />}
                    </TouchableOpacity>
                  </View>

                  <View style={C.inputBox}>
                    <Text style={C.label}>📝 Ponto de Referência</Text>
                    <TextInput style={[C.input, { height: 60 }]} value={addressObs} onChangeText={setAddressObs} placeholder="Perto de onde?" multiline />
                  </View>
                </>
              )}
              <View style={C.inputBox}><Text style={C.label}>Pergunta Secreta</Text><TextInput style={C.input} value={question} onChangeText={setQuestion} /></View>
              <View style={C.inputBox}><Text style={C.label}>Resposta</Text><TextInput style={C.input} value={answer} onChangeText={setAnswer} /></View>
              <TouchableOpacity style={C.btn} onPress={handleFinish}><Text style={C.btnText}>Finalizar</Text></TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MainScreen({ userData, products, onLogout }) {
  const [selectedProd, setSelectedProd] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRating, setIsRating] = useState(false);
  const [myRating, setMyRating] = useState(0);

  // --- BLINDAGEM DOS FAVORITOS ---
  const [favorites, setFavorites] = useState(() => {
    if (!userData || !userData.userId) return []; 
    return usersDB[userData.userId]?.favorites || []; 
  });

  const categories = ['Todas', '⭐ Favoritos', 'Fruta', 'Verdura', 'Legume', 'Processado', 'Animal', 'Outro'];

  const filteredProducts = products.filter(p => {
    const hasStock = p.stock === undefined || p.stock > 0;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = false;
    if (activeCategory === 'Todas') {
      matchesCategory = true;
    } else if (activeCategory === '⭐ Favoritos') {
      matchesCategory = (favorites || []).includes(p.id);
    } else {
      matchesCategory = p.category === activeCategory;
    }

    return hasStock && matchesCategory && matchesSearch;
  });

  const handleCategoryPress = (cat) => {
    if (cat === '⭐ Favoritos' && userData.type === 'guest') {
      Alert.alert('🕵️ Ops!', 'Você precisa criar uma conta para ver e salvar seus favoritos!');
      return;
    }
    setActiveCategory(cat);
  };

  const toggleFavorite = (prodId) => {
    if (userData.type === 'guest') {
      Alert.alert('🕵️ Ops!', 'Você precisa criar uma conta para favoritar produtos!');
      return;
    }
    let newFavs = [...(favorites || [])]; 
    if (newFavs.includes(prodId)) {
      newFavs = newFavs.filter(id => id !== prodId);
    } else {
      newFavs.push(prodId);
    }
    setFavorites(newFavs);
    if (usersDB[userData.userId]) {
      usersDB[userData.userId].favorites = newFavs; 
    }
  };

  const openWhatsApp = (produto) => {
    const donoDoProduto = usersDB[produto.producerId];
    const telefone = donoDoProduto?.phone || "38999999999"; 
    const numeroLimpo = telefone.replace(/\D/g, ''); 
    const mensagem = `Olá, ${produto.producer}! Vi o anúncio de *${produto.name}* no AgroSocial e tenho interesse.`;
    Linking.openURL(`whatsapp://send?phone=55${numeroLimpo}&text=${mensagem}`).catch(() => {
      Alert.alert('Erro', 'WhatsApp não encontrado no dispositivo.');
    });
  };

  // --- NOVA FUNÇÃO: ABRIR GPS ---
  const openMaps = (endereco) => {
    if (!endereco) return;
    
    // Tenta abrir o app nativo do celular (Google Maps no Android, Apple Maps no iOS)
    const url = Platform.select({
      ios: `maps:0,0?q=${endereco}`,
      android: `geo:0,0?q=${endereco}`
    });
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Se falhar, abre pelo navegador de internet (funciona em 100% dos casos)
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`);
      }
    }).catch(() => {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`);
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) - fullStars >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push(<MaterialCommunityIcons key={i} name="star" size={16} color="#FFD700" />);
      else if (i === fullStars && hasHalfStar) stars.push(<MaterialCommunityIcons key={i} name="star-half-full" size={16} color="#FFD700" />);
      else stars.push(<MaterialCommunityIcons key={i} name="star-outline" size={16} color="#FFD700" />);
    }
    return stars;
  };

  const submitRating = () => {
    if (myRating === 0) { Alert.alert('⚠️ Atenção', 'Escolha pelo menos 1 estrela!'); return; }
    Alert.alert('⭐ Muito Obrigado!', `Sua avaliação de ${myRating} estrelas foi registrada.`);
    setIsRating(false); setMyRating(0);
  };

  const closeModal = () => { setSelectedProd(null); setIsRating(false); setMyRating(0); };

  return (
    <SafeAreaView style={C.container}>
      <StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      
      <View style={C.header}>
        <View>
          <Text style={C.headerTitle}>🛍️ Vitrine</Text>
          <Text style={C.headerSub}>Janaúba-MG</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Text style={C.userBadge}>{userData.type === 'producer' ? '👨‍🌾' : '🛒'}</Text>
          <TouchableOpacity onPress={onLogout}>
            <MaterialCommunityIcons name={userData.type === 'guest' ? 'login' : 'logout'} size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 15, paddingTop: 10, backgroundColor: '#FFF' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: '#E0E0E0' }}>
          <MaterialCommunityIcons name="magnify" size={24} color="#999" />
          <TextInput style={{ flex: 1, marginLeft: 10, fontSize: 16, color: '#333' }} placeholder="Buscar produtos..." placeholderTextColor="#999" value={searchQuery} onChangeText={setSearchQuery} />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}><MaterialCommunityIcons name="close-circle" size={20} color="#999" /></TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ paddingVertical: 10, paddingHorizontal: 5, backgroundColor: '#FFF', elevation: 2 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(cat => (
            <TouchableOpacity key={cat} onPress={() => handleCategoryPress(cat)}
              style={{ backgroundColor: activeCategory === cat ? '#4CAF50' : '#F5F5F5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginHorizontal: 5, borderWidth: 1, borderColor: activeCategory === cat ? '#4CAF50' : '#E0E0E0' }}>
              <Text style={{ color: activeCategory === cat ? '#FFF' : '#666', fontWeight: 'bold' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList 
        data={filteredProducts} 
        renderItem={({ item }) => (
          <TouchableOpacity style={C.card} activeOpacity={0.8} onPress={() => setSelectedProd(item)}>
            <Image source={{ uri: item.image }} style={C.cardImg} />
            <View style={C.cardInfo}>
              <Text style={C.cardName} numberOfLines={2}>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                {renderStars(item.rating)}
                <Text style={{ fontSize: 12, color: '#666', marginLeft: 4 }}>({item.reviews || 0})</Text>
              </View>
              <Text style={C.cardPrice}>R$ {item.price}<Text style={C.cardUnit}>/{item.unit}</Text></Text>
              <Text style={{ fontSize: 12, color: item.stock > 0 ? '#1976D2' : '#F44336', marginTop: 2, fontWeight: 'bold' }}>
                {item.stock > 0 ? `📦 Estoque: ${item.stock}` : '⚠️ Esgotado'}
              </Text>
              <Text style={[C.cardProducer, { marginTop: 4 }]}>👨‍🌾 {item.producer}</Text>
            </View>
            <View style={C.wppBtn}>
              <MaterialCommunityIcons name="magnify" size={16} color="#FFF" />
              <Text style={C.wppText}>Ver Detalhes</Text>
            </View>
          </TouchableOpacity>
        )} 
        keyExtractor={i => i.id} numColumns={2} contentContainerStyle={{ padding: 8, paddingBottom: 20 }} showsVerticalScrollIndicator={false}
      />

      <Modal visible={selectedProd !== null} animationType="slide" transparent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
          {selectedProd && (
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
              <Image source={{ uri: selectedProd.image }} style={{ width: '100%', height: 300, resizeMode: 'cover' }} />
              <TouchableOpacity style={{ position: 'absolute', top: 20, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50 }} onPress={closeModal}>
                <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
              </TouchableOpacity>

              <View style={{ padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 }}>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
                  {selectedProd.category && (
                    <View style={{ backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                      <Text style={{ color: '#4CAF50', fontSize: 12, fontWeight: 'bold' }}>{selectedProd.category}</Text>
                    </View>
                  )}
                  <View style={{ backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                    <Text style={{ color: '#F57C00', fontSize: 12, fontWeight: 'bold' }}>📦 Estoque: {selectedProd.stock || 0}</Text>
                  </View>
                </View>

                {/* Título e Botão de Favorito Lado a Lado */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#333', flex: 1 }}>{selectedProd.name}</Text>
                  <TouchableOpacity onPress={() => toggleFavorite(selectedProd.id)} style={{ padding: 5 }}>
                    <MaterialCommunityIcons 
                      name={(favorites || []).includes(selectedProd.id) ? "heart" : "heart-outline"} 
                      size={32} 
                      color={(favorites || []).includes(selectedProd.id) ? "#F44336" : "#CCC"} 
                    />
                  </TouchableOpacity>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginRight: 5 }}>{selectedProd.rating || 'Sem nota'}</Text>
                  {renderStars(selectedProd.rating)}
                  <Text style={{ fontSize: 14, color: '#666', marginLeft: 8 }}>({selectedProd.reviews || 0} avaliações)</Text>
                </View>

                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#4CAF50', marginTop: 15 }}>
                  R$ {selectedProd.price} <Text style={{ fontSize: 14, color: '#999' }}>por {selectedProd.unit}</Text>
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#EEE' }}>
                  <Text style={{ fontSize: 40, marginRight: 15 }}>👨‍🌾</Text>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{selectedProd.producer}</Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>Produtor Local</Text>
                  </View>
                </View>

                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 }}>Descrição</Text>
                <Text style={{ fontSize: 15, color: '#666', lineHeight: 22 }}>{selectedProd.description || 'Produto fresco e de excelente qualidade direto da roça.'}</Text>

                {/* --- BOTÃO DE MAPA ATUALIZADO --- */}
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 }}>Localização (Clique para abrir o Mapa)</Text>
                <TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 12, borderRadius: 10, borderLeftWidth: 5, borderColor: '#4CAF50' }}
                  onPress={() => openMaps(usersDB[selectedProd.producerId]?.address)}
                >
                  <MaterialCommunityIcons name="map-marker-radius" size={24} color="#4CAF50" />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={{ fontSize: 14, color: '#333', fontWeight: 'bold' }}>
                      {usersDB[selectedProd.producerId]?.address || 'Clique para ver no mapa'}
                    </Text>
                    {usersDB[selectedProd.producerId]?.addressObs && (
                      <Text style={{ fontSize: 12, color: '#666', fontStyle: 'italic', marginTop: 2 }}>
                        Ref: {usersDB[selectedProd.producerId].addressObs}
                      </Text>
                    )}
                  </View>
                  <MaterialCommunityIcons name="open-in-new" size={18} color="#4CAF50" />
                </TouchableOpacity>

                {userData.type === 'customer' && (
                  !isRating ? (
                    <TouchableOpacity style={{ marginTop: 20, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#FFD700', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} onPress={() => setIsRating(true)}>
                      <MaterialCommunityIcons name="star-outline" size={24} color="#FBC02D" />
                      <Text style={{ marginLeft: 10, color: '#FBC02D', fontWeight: 'bold', fontSize: 16 }}>Avaliar este produto</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ marginTop: 20, padding: 15, borderRadius: 10, backgroundColor: '#FFFDE7', alignItems: 'center', borderWidth: 1, borderColor: '#FFF59D' }}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F57F17', marginBottom: 10 }}>Que nota você dá?</Text>
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <TouchableOpacity key={star} onPress={() => setMyRating(star)}>
                            <MaterialCommunityIcons name={myRating >= star ? "star" : "star-outline"} size={36} color="#FBC02D" />
                          </TouchableOpacity>
                        ))}
                      </View>
                      <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: '#E0E0E0', padding: 12, borderRadius: 8, alignItems: 'center' }} onPress={() => setIsRating(false)}><Text style={{ color: '#555', fontWeight: 'bold' }}>Cancelar</Text></TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: '#FBC02D', padding: 12, borderRadius: 8, alignItems: 'center' }} onPress={submitRating}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>Enviar Nota</Text></TouchableOpacity>
                      </View>
                    </View>
                  )
                )}

                <TouchableOpacity style={[C.btn, { backgroundColor: '#25D366', marginTop: 20, flexDirection: 'row', justifyContent: 'center', gap: 10 }]} onPress={() => openWhatsApp(selectedProd)}>
                  <MaterialCommunityIcons name="whatsapp" size={24} color="#FFF" />
                  <Text style={C.btnText}>Comprar no WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function ProfileScreen({ userData, products, onLogout }) {
  const userRecord = userData.userId ? usersDB[userData.userId] : {};

  const [name, setName] = useState(userData.name || '');
  const [phone, setPhone] = useState(userRecord?.phone || '');
  const [address, setAddress] = useState(userRecord?.address || '');
  const [addressObs, setAddressObs] = useState(userRecord?.addressObs || '');
  const [password, setPassword] = useState(userRecord?.password || '');
  const [profilePic, setProfilePic] = useState(userRecord?.profilePic || null);
  
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);

  const handleGetLocation = async () => {
    setIsLoadingLoc(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Aviso', 'Precisamos da permissão de localização para preencher o endereço.');
        setIsLoadingLoc(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        const formatted = `${place.street || place.name || 'Endereço não identificado'}, ${place.streetNumber || 'S/N'} - ${place.subregion || place.city || 'Cidade'}`;
        setAddress(formatted);
      } else {
        Alert.alert('Ops', 'Não conseguimos traduzir sua localização em um endereço de rua.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar a localização do GPS. Verifique se ele está ligado.');
    }
    setIsLoadingLoc(false);
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) setProfilePic(result.assets[0].uri);
  };

  const pickGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) setProfilePic(result.assets[0].uri);
  };

  const handleImageOptions = () => {
    Alert.alert("Foto de Perfil", "De onde você quer pegar a foto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "📷 Tirar Foto", onPress: takePhoto },
      { text: "🖼️ Escolher da Galeria", onPress: pickGallery }
    ]);
  };

  if (userData.type === 'guest') {
    return (
      <SafeAreaView style={C.container}>
        <StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
        <View style={[C.header, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={C.headerTitle}>👤 Meu Perfil</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 60, marginBottom: 20 }}>🕵️</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10 }}>Você é um Visitante</Text>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24, marginBottom: 30 }}>
            Crie uma conta para poder avaliar os produtos, favoritar os melhores produtores e gerenciar seus dados!
          </Text>
          <TouchableOpacity style={[C.btn, { width: '100%' }]} onPress={onLogout}>
            <Text style={C.btnText}>🚪 Fazer Login ou Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const myProducts = products ? products.filter(p => p.producerId === userData.userId) : [];
  const totalProducts = myProducts.length;
  const totalClicks = totalProducts > 0 ? totalProducts * 142 : 0; 
  const totalRating = myProducts.reduce((acc, p) => acc + (p.rating || 0), 0);
  const avgRating = totalProducts > 0 ? (totalRating / totalProducts).toFixed(1) : '0.0';

  const handleSave = () => {
    usersDB[userData.userId].name = name;
    usersDB[userData.userId].phone = phone;
    usersDB[userData.userId].address = address;
    usersDB[userData.userId].addressObs = addressObs;
    usersDB[userData.userId].profilePic = profilePic;
    if (password) usersDB[userData.userId].password = password;

    Alert.alert('✅ Sucesso!', 'Seus dados foram atualizados com sucesso.');
  };

  const handleDelete = () => {
    Alert.alert(
      '⚠️ Excluir Conta', 'Tem certeza que deseja apagar sua conta? Você perderá todos os seus dados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim, Excluir', style: 'destructive', onPress: () => {
            delete usersDB[userData.userId]; 
            Alert.alert('Conta Excluída', 'Sentiremos sua falta!');
            onLogout(); 
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={C.container}>
      <StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      
      <View style={[C.header, { justifyContent: 'center', alignItems: 'center', paddingBottom: 30 }]}>
        <Text style={C.headerTitle}>👤 Meu Perfil</Text>
        <Text style={{ color: '#E8F5E9', fontSize: 14 }}>{userData.type === 'producer' ? 'Painel do Produtor' : 'Painel do Cliente'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        
        <View style={{ alignItems: 'center', marginTop: -60, marginBottom: 20 }}>
          <TouchableOpacity onPress={handleImageOptions} activeOpacity={0.8} style={{ position: 'relative' }}>
            <Image 
              source={{ uri: profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} 
              style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FFF', backgroundColor: '#E0E0E0' }} 
            />
            <View style={{ position: 'absolute', bottom: 0, right: 5, backgroundColor: '#1B5E20', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', elevation: 3 }}>
              <MaterialCommunityIcons name="camera-plus" size={18} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        {userData.type === 'producer' && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 }}>
            <View style={{ flex: 1, backgroundColor: '#E8F5E9', padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, elevation: 2, borderWidth: 1, borderColor: '#C8E6C9' }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1B5E20' }}>{totalProducts}</Text>
              <Text style={{ fontSize: 12, color: '#4CAF50', fontWeight: 'bold', marginTop: 4 }}>PRODUTOS</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#E3F2FD', padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, elevation: 2, borderWidth: 1, borderColor: '#BBDEFB' }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1565C0' }}>{totalClicks}</Text>
              <Text style={{ fontSize: 12, color: '#1976D2', fontWeight: 'bold', marginTop: 4 }}>CLIQUES</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#FFF8E1', padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, elevation: 2, borderWidth: 1, borderColor: '#FFECB3' }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#F57F17' }}>⭐ {avgRating}</Text>
              <Text style={{ fontSize: 12, color: '#FBC02D', fontWeight: 'bold', marginTop: 4 }}>MÉDIA</Text>
            </View>
          </View>
        )}

        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 }}>Dados Pessoais</Text>

        <View style={C.inputBox}>
          <Text style={C.label}>👤 Nome de Exibição</Text>
          <TextInput style={C.input} value={name} onChangeText={setName} />
        </View>

        {userData.type === 'producer' && (
          <>
            <View style={C.inputBox}>
              <Text style={C.label}>📱 Telefone / WhatsApp</Text>
              <TextInput style={C.input} value={phone} onChangeText={setPhone} keyboardType="numeric" />
            </View>
            
            <View style={C.inputBox}>
              <Text style={C.label}>📍 Endereço da Propriedade</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TextInput 
                  style={[C.input, { flex: 1, marginBottom: 0 }]} 
                  value={address} 
                  onChangeText={setAddress} 
                  placeholder="Ex: Fazenda Sol Nascente" 
                />
                <TouchableOpacity 
                  style={{ backgroundColor: '#1B5E20', padding: 12, borderRadius: 10, justifyContent: 'center', alignItems: 'center', height: 50, width: 50 }}
                  onPress={handleGetLocation}
                  disabled={isLoadingLoc}
                >
                  {isLoadingLoc ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#FFF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={C.inputBox}>
              <Text style={C.label}>📝 Ponto de Referência / Observação</Text>
              <TextInput 
                style={[C.input, { height: 80, textAlignVertical: 'top' }]} 
                value={addressObs} 
                onChangeText={setAddressObs} 
                placeholder="Ex: Porteira azul..."
                multiline={true}
              />
            </View>
          </>
        )}

        <View style={C.inputBox}>
          <Text style={C.label}>🔒 Alterar Senha</Text>
          <TextInput style={C.input} value={password} onChangeText={setPassword} secureTextEntry={true} placeholder="Deixe em branco para não alterar" />
        </View>

        <TouchableOpacity style={[C.btn, { marginTop: 10 }]} onPress={handleSave}>
          <Text style={C.btnText}>💾 Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[C.btn, { backgroundColor: '#FFF', borderWidth: 2, borderColor: '#F44336', marginTop: 15 }]} onPress={handleDelete}>
          <Text style={[C.btnText, { color: '#F44336' }]}>🗑️ Excluir Minha Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function ProducerScreen({ userData, products, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null); // <-- NOVO: Guarda o ID do produto que está sendo editado
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');

  const categoriasOptions = ['Fruta', 'Verdura', 'Legume', 'Processado', 'Animal', 'Outro'];
  const myProducts = products.filter(p => p.producerId === userData.userId);

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.5 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const pickGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.5 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleImageOptions = () => {
    Alert.alert("Foto do Produto", "De onde você quer pegar a foto?", [
      { text: "Cancelar", style: "cancel" },
      { text: "📷 Tirar Foto", onPress: takePhoto },
      { text: "🖼️ Escolher da Galeria", onPress: pickGallery }
    ]);
  };

  // --- FUNÇÃO PARA LIMPAR O FORMULÁRIO ---
  const resetForm = () => {
    setEditingId(null);
    setName(''); setPrice(''); setUnit('kg'); setImageUri(null); 
    setDescription(''); setCategory(''); setStock('');
    setModalVisible(false);
  };

  // --- FUNÇÃO PARA ABRIR O MODAL NO MODO "EDIÇÃO" ---
  const openEditModal = (produto) => {
    setEditingId(produto.id);
    setName(produto.name);
    setPrice(produto.price);
    setUnit(produto.unit);
    setCategory(produto.category || '');
    setDescription(produto.description || '');
    setStock(produto.stock !== undefined ? produto.stock.toString() : '0');
    setImageUri(produto.image);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!name || !price || !category || !stock) { 
      Alert.alert('⚠️', 'Preencha o nome, preço, estoque e escolha uma categoria!'); return; 
    }
    
    // Procura o produto original para não perder a nota de avaliação na hora de salvar
    const originalProduct = editingId ? products.find(p => p.id === editingId) : null;

    const productData = {
      id: editingId || Date.now().toString(), // Se estiver editando, mantém o ID antigo
      name, price, unit, category,
      description: description || 'Sem descrição.',
      stock: parseInt(stock, 10) || 0,
      producer: userData.name,
      producerId: userData.userId,
      image: imageUri || 'https://images.unsplash.com/photo-1595858540838-518ce9fb96aa?w=400',
      rating: originalProduct?.rating || 0,   // Mantém a nota
      reviews: originalProduct?.reviews || 0  // Mantém a qtde de avaliações
    };

    if (editingId) {
      onUpdateProduct(productData);
      Alert.alert('✅ Sucesso!', 'Produto atualizado com sucesso!');
    } else {
      onAddProduct(productData);
      Alert.alert('✅ Sucesso!', 'Produto adicionado à sua vitrine!');
    }
    resetForm();
  };

  // --- FUNÇÃO PARA EXCLUIR ---
  const handleDelete = () => {
    Alert.alert('🗑️ Excluir Produto', `Tem certeza que deseja apagar "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sim, Excluir', style: 'destructive', onPress: () => {
          onDeleteProduct(editingId);
          Alert.alert('Excluído', 'O produto foi removido da sua vitrine.');
          resetForm();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={C.container}>
      <View style={[C.header, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={C.headerTitle}>📦 Meus Produtos</Text>
      </View>
      
      <FlatList 
        data={myProducts}
        renderItem={({item}) => (
          <View style={{ flexDirection: 'row', backgroundColor: '#FFF', padding: 15, marginHorizontal: 15, marginTop: 15, borderRadius: 12, alignItems: 'center', elevation: 2 }}>
            <Image source={{ uri: item.image }} style={{ width: 50, height: 50, borderRadius: 8 }} />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{item.name}</Text>
              <Text style={{ fontSize: 14, color: '#4CAF50', fontWeight: 'bold' }}>R$ {item.price}/{item.unit}</Text>
              <Text style={{ fontSize: 12, color: item.stock > 0 ? '#666' : '#F44336', marginTop: 4 }}>
                {item.stock > 0 ? `📦 Estoque: ${item.stock}` : '⚠️ Esgotado'}
              </Text>
            </View>
            
            {/* --- BOTÃO DE EDITAR AGORA CHAMA A FUNÇÃO --- */}
            <TouchableOpacity onPress={() => openEditModal(item)} style={{ padding: 10 }}>
              <MaterialCommunityIcons name="pencil-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={i => i.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }}>Você ainda não cadastrou produtos.</Text>}
      />

      <TouchableOpacity 
        style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#1B5E20', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 }}
        onPress={() => { resetForm(); setModalVisible(true); }}>
        <MaterialCommunityIcons name="plus" size={32} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={C.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#EEE' }}>
            <TouchableOpacity onPress={resetForm}>
              <MaterialCommunityIcons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>
              {editingId ? 'Editar Produto' : 'Novo Produto'}
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            
            <TouchableOpacity 
              style={{ backgroundColor: '#E0E0E0', height: 180, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#CCC', borderStyle: 'dashed', overflow: 'hidden' }}
              onPress={handleImageOptions}>
              {imageUri && !imageUri.includes('unsplash') ? (
                <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <>
                  <MaterialCommunityIcons name="camera-plus" size={48} color="#777" />
                  <Text style={{ color: '#555', marginTop: 10, fontSize: 16, fontWeight: 'bold' }}>Tocar para alterar foto</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={C.inputBox}><Text style={C.label}>🏷️ Nome do Produto</Text><TextInput style={C.input} value={name} onChangeText={setName} placeholder="Ex: Queijo" /></View>
            
            <Text style={C.label}>📑 Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
              {categoriasOptions.map(cat => (
                <TouchableOpacity 
                  key={cat} onPress={() => setCategory(cat)}
                  style={{
                    backgroundColor: category === cat ? '#4CAF50' : '#E0E0E0',
                    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10,
                  }}>
                  <Text style={{ color: category === cat ? '#FFF' : '#333', fontWeight: 'bold' }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={[C.inputBox, { flex: 2 }]}><Text style={C.label}>💲 Preço</Text><TextInput style={C.input} value={price} onChangeText={setPrice} placeholder="25,00" keyboardType="numeric" /></View>
              <View style={[C.inputBox, { flex: 1.2 }]}><Text style={C.label}>📏 Unid.</Text><TextInput style={C.input} value={unit} onChangeText={setUnit} placeholder="kg, un" /></View>
              <View style={[C.inputBox, { flex: 1.5 }]}><Text style={C.label}>📦 Estoq.</Text><TextInput style={C.input} value={stock} onChangeText={setStock} placeholder="Qtd" keyboardType="numeric" /></View>
            </View>

            <View style={C.inputBox}>
              <Text style={C.label}>📝 Descrição</Text>
              <TextInput style={[C.input, { height: 100, textAlignVertical: 'top' }]} value={description} onChangeText={setDescription} placeholder="Detalhes sobre o produto..." multiline={true} numberOfLines={4} />
            </View>

            <TouchableOpacity style={[C.btn, { marginTop: 10 }]} onPress={handleSave}>
              <Text style={C.btnText}>{editingId ? '💾 Atualizar Produto' : '💾 Salvar Produto'}</Text>
            </TouchableOpacity>

            {/* --- MOSTRA O BOTÃO DE EXCLUIR APENAS SE ESTIVER EDITANDO --- */}
            {editingId && (
              <TouchableOpacity style={[C.btn, { backgroundColor: '#FFF', borderWidth: 2, borderColor: '#F44336', marginTop: 15, marginBottom: 40 }]} onPress={handleDelete}>
                <Text style={[C.btnText, { color: '#F44336' }]}>🗑️ Excluir Produto</Text>
              </TouchableOpacity>
            )}

          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function FeedScreen() {
  const [activeTab, setActiveTab] = useState('Tudo');
  const tabs = ['Tudo', 'Notícias', 'Receitas'];

  // Banco de dados expandido com links específicos simulando matérias reais
  const feedData = [
    { id: '1', type: 'Notícia', source: 'Globo Rural', title: 'Preço do bezerro tem alta histórica e anima pecuaristas em Minas Gerais', image: 'https://images.unsplash.com/photo-1596733430284-f74370603053?w=400', url: 'https://globorural.globo.com/pecuaria/noticia/2026/05/preco-do-bezerro-tem-alta.html' },
    { id: '2', type: 'Notícia', source: 'Senar', title: 'Senar abre novas vagas para cursos gratuitos de capacitação rural', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400', url: 'https://cnabrasil.org.br/noticias' },
    { id: '3', type: 'Receita', source: 'Receitas (Globo)', title: 'Bolo de Milho Cremoso: a verdadeira receita tradicional da roça', image: 'https://images.unsplash.com/photo-1588673550882-7f28ed061214?w=400', url: 'https://receitas.globo.com/bolos/bolo-de-milho-cremoso.html' },
    { id: '4', type: 'Notícia', source: 'Embrapa', title: 'Novas tecnologias no plantio ajudam agricultores a economizar água', image: 'https://images.unsplash.com/photo-1628186105307-de747c3e55c7?w=400', url: 'https://www.embrapa.br/busca-de-noticias' },
    { id: '5', type: 'Receita', source: 'Emater', title: 'Passo a passo: Como fazer o autêntico Doce de Leite Artesanal', image: 'https://images.unsplash.com/photo-1620291307137-0ea87e6cc522?w=400', url: 'https://www.emater.mg.gov.br/' },
    { id: '6', type: 'Notícia', source: 'Canal Rural', title: 'Plantio da soja atinge 80% da área estimada no Brasil, diz consultoria', image: 'https://images.unsplash.com/photo-1595858540838-518ce9fb96aa?w=400', url: 'https://www.canalrural.com.br/agricultura/soja/' },
    { id: '7', type: 'Receita', source: 'TudoGostoso', title: 'Pão de Queijo Mineiro tradicional: crocante por fora e macio por dentro', image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400', url: 'https://www.tudogostoso.com.br/receita/pao-de-queijo' },
    { id: '8', type: 'Notícia', source: 'Globo Rural', title: 'Cultivo de hortaliças orgânicas ganha espaço entre pequenos produtores', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', url: 'https://globorural.globo.com/agricultura/hortalicas.html' },
    { id: '9', type: 'Receita', source: 'Panelinha', title: 'Frango Caipira com Quiabo: o segredo para não babar', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', url: 'https://www.panelinha.com.br/receita/frango-com-quiabo' },
    { id: '10', type: 'Notícia', source: 'Embrapa', title: 'Estudo comprova que rotação de culturas aumenta a fertilidade do solo', image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400', url: 'https://www.embrapa.br/rotacao-de-culturas' },
  ];

  const filteredFeed = feedData.filter(item => 
    activeTab === 'Tudo' || 
    (activeTab === 'Notícias' && item.type === 'Notícia') || 
    (activeTab === 'Receitas' && item.type === 'Receita')
  );

  const openLink = (url) => {
    Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o link.'));
  };

  return (
    <SafeAreaView style={C.container}>
      <StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      
      {/* NOVO CABEÇALHO: Desvinculado do C.header para não espremer o texto */}
      <View style={{ backgroundColor: '#1B5E20', paddingTop: Platform.OS === 'ios' ? 50 : 40, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, alignItems: 'center', elevation: 4 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF', textAlign: 'center' }}>📰 Campo e Cozinha</Text>
        <Text style={{ color: '#E8F5E9', fontSize: 14, textAlign: 'center', marginTop: 5 }}>Notícias do agro e receitas rurais</Text>
      </View>

      {/* Filtros */}
      <View style={{ flexDirection: 'row', padding: 15, backgroundColor: '#FFF', elevation: 2, gap: 10, marginTop: -10 }}>
        {tabs.map(tab => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={{
              flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 20,
              backgroundColor: activeTab === tab ? '#1B5E20' : '#F5F5F5',
              borderWidth: 1, borderColor: activeTab === tab ? '#1B5E20' : '#E0E0E0'
            }}>
            <Text style={{ color: activeTab === tab ? '#FFF' : '#666', fontWeight: 'bold' }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList 
        data={filteredFeed}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 15, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={{ backgroundColor: '#FFF', borderRadius: 12, marginBottom: 15, elevation: 3, overflow: 'hidden' }}
            activeOpacity={0.8}
            onPress={() => openLink(item.url)}
          >
            <Image source={{ uri: item.image }} style={{ width: '100%', height: 160 }} />
            
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: item.type === 'Notícia' ? '#1976D2' : '#E64A19', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {item.type}
                </Text>
                <Text style={{ color: '#999', fontSize: 12, fontWeight: 'bold' }}>
                  Fonte: {item.source}
                </Text>
              </View>

              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', lineHeight: 22 }}>
                {item.title}
              </Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: '#4CAF50', fontSize: 14, fontWeight: 'bold', marginRight: 5 }}>Ler matéria completa</Text>
                <MaterialCommunityIcons name="open-in-new" size={16} color="#4CAF50" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function RecoverScreen({ onBack }) {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [recoveredPass, setRecoveredPass] = useState('');

  const checkUser = () => {
    const user = usersDB[userId.toLowerCase().trim()];
    if (!user) { setError('Usuário não encontrado!'); return; }
    setQuestion(user.question);
    setError('');
    setStep(2);
  };

  const checkAnswer = () => {
    const user = usersDB[userId.toLowerCase().trim()];
    if (answer.toLowerCase().trim() !== user.answer) { setError('Resposta incorreta!'); return; }
    setRecoveredPass(user.password);
    setStep(3);
  };

  return (
    <SafeAreaView style={C.container}>
      <StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      <ScrollView contentContainerStyle={C.scroll}>
        <View style={C.content}>
          <TouchableOpacity onPress={onBack} style={C.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#333" />
            <Text style={C.backText}>Voltar</Text>
          </TouchableOpacity>
          
          <Text style={C.title}>Recuperar Senha</Text>

          {step === 1 && (
            <>
              <Text style={C.subtitle}>Qual é o seu usuário?</Text>
              <View style={C.inputBox}>
                <TextInput style={C.input} value={userId} onChangeText={t => { setUserId(t); setError(''); }} placeholder="Ex: joao_silva" autoCapitalize="none" />
              </View>
              {error ? <Text style={C.errorText}>{error}</Text> : null}
              <TouchableOpacity style={C.btn} onPress={checkUser}><Text style={C.btnText}>Avançar →</Text></TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={C.subtitle}>Responda sua pergunta de segurança:</Text>
              <View style={[C.inputBox, { backgroundColor: '#E8F5E9', padding: 15, borderRadius: 10, borderWidth: 0 }]}>
                <Text style={{ fontSize: 16, color: '#1B5E20', fontWeight: 'bold' }}>{question}</Text>
              </View>
              <View style={C.inputBox}>
                <TextInput style={C.input} value={answer} onChangeText={t => { setAnswer(t); setError(''); }} placeholder="Sua resposta secreta" autoCapitalize="none" />
              </View>
              {error ? <Text style={C.errorText}>{error}</Text> : null}
              <TouchableOpacity style={C.btn} onPress={checkAnswer}><Text style={C.btnText}>Verificar Resposta</Text></TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <MaterialCommunityIcons name="lock-open-check" size={60} color="#4CAF50" />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 15 }}>Sua senha é:</Text>
              <View style={{ backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#CCC' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1B5E20', letterSpacing: 2 }}>{recoveredPass}</Text>
              </View>
              <Text style={{ color: '#666', textAlign: 'center', marginTop: 15 }}>Anote sua senha em um local seguro e faça login.</Text>
              <TouchableOpacity style={[C.btn, { marginTop: 30, width: '100%' }]} onPress={onBack}><Text style={C.btnText}>Ir para Login</Text></TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AdminScreen({ products, onDeleteProduct, onLogout }) {
  const [activeTab, setActiveTab] = useState('usuarios'); // 'usuarios' ou 'produtos'
  
  // Transforma o nosso objeto usersDB em uma lista (Array) para podermos desenhar na tela
  const [usersList, setUsersList] = useState(Object.keys(usersDB).map(k => ({ id: k, ...usersDB[k] })));

  const handleDeleteUser = (userId) => {
    if (userId === 'admin') { Alert.alert('Erro', 'Você não pode apagar o administrador supremo.'); return; }
    Alert.alert('⚠️ Excluir Usuário', `Deseja banir o usuário "${userId}" do sistema?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sim, Banir', style: 'destructive', onPress: () => {
          delete usersDB[userId]; // Apaga do banco
          setUsersList(Object.keys(usersDB).map(k => ({ id: k, ...usersDB[k] }))); // Atualiza a tela
        }
      }
    ]);
  };

  const handleResetPassword = (userId) => {
    Alert.alert('🔄 Resetar Senha', `A senha de "${userId}" será alterada para "1234".`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: () => {
          usersDB[userId].password = '1234';
          Alert.alert('Sucesso', 'Senha resetada com sucesso.');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={C.container}>
      <StatusBar backgroundColor="#B71C1C" barStyle="light-content" />
      <View style={[C.header, { backgroundColor: '#B71C1C', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }]}>
        <View>
          <Text style={C.headerTitle}>🛡️ Painel Admin</Text>
          <Text style={{ color: '#FFCDD2', fontSize: 14 }}>Acesso Restrito</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={{ padding: 5 }}>
          <MaterialCommunityIcons name="logout" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 }}>
        <TouchableOpacity style={{ flex: 1, padding: 15, alignItems: 'center', borderBottomWidth: 3, borderColor: activeTab === 'usuarios' ? '#B71C1C' : 'transparent' }} onPress={() => setActiveTab('usuarios')}>
          <Text style={{ fontWeight: 'bold', color: activeTab === 'usuarios' ? '#B71C1C' : '#666' }}>👥 Usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, padding: 15, alignItems: 'center', borderBottomWidth: 3, borderColor: activeTab === 'produtos' ? '#B71C1C' : 'transparent' }} onPress={() => setActiveTab('produtos')}>
          <Text style={{ fontWeight: 'bold', color: activeTab === 'produtos' ? '#B71C1C' : '#666' }}>📦 Produtos</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'usuarios' ? (
        <FlatList 
          data={usersList}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 15 }}
          renderItem={({item}) => (
            <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.id} <Text style={{ fontSize: 12, color: '#999', fontWeight: 'normal' }}>({item.type})</Text></Text>
                <Text style={{ color: '#666' }}>{item.name}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 15 }}>
                <TouchableOpacity onPress={() => handleResetPassword(item.id)}><MaterialCommunityIcons name="key-variant" size={24} color="#FF9800" /></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteUser(item.id)}><MaterialCommunityIcons name="delete" size={24} color="#F44336" /></TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <FlatList 
          data={products}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 15 }}
          renderItem={({item}) => (
            <View style={{ backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ color: '#666' }}>Dono: {item.producerId}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                Alert.alert('Apagar', 'Excluir este produto?', [
                  {text: 'Cancelar'}, {text: 'Sim', style: 'destructive', onPress: () => onDeleteProduct(item.id)}
                ])
              }}>
                <MaterialCommunityIcons name="delete" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  // 1. TODAS as variáveis e estados ficam no topo da função!
  const [screen, setScreen] = useState('login');
  const [userData, setUserData] = useState(null);
  const Tab = createBottomTabNavigator();
  
  // Lista de produtos viva movida para o topo
  const [productsList, setProductsList] = useState([
    { id: '1', name: 'Tomate Orgânico', price: '8,90', unit: 'kg', producerId: 'joao', category: 'Verdura', stock: 15, rating: 4.8, reviews: 12, description: 'Tomate fresquinho, sem agrotóxicos.', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', producer: 'João Silva' },
    { id: '2', name: 'Banana Prata', price: '5,50', unit: 'kg', producerId: 'joao', category: 'Fruta', stock: 20, rating: 5.0, reviews: 8, description: 'Banana docinha da roça.', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400', producer: 'João Silva' },
    { id: '3', name: 'Alface', price: '3,50', unit: 'un', producerId: 'joao', category: 'Verdura', stock: 10, rating: 4.5, reviews: 5, description: 'Alface crocante colhida hoje.', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400', producer: 'João Silva' },
    { id: '4', name: 'Queijo Minas', price: '28,00', unit: 'un', producerId: 'joao', category: 'Processado', stock: 5, rating: 4.9, reviews: 34, description: 'Queijo curado padrão da serra.', image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400', producer: 'Ana Paula' },
  ]);

  // 2. Lógica de telas soltas (Login, Registro, etc)
  if (screen === 'register') return <RegisterScreen onBack={() => setScreen('login')} onRegister={(d) => { setUserData(d); setScreen('main'); }} />;
  if (screen === 'recover') return <RecoverScreen onBack={() => setScreen('login')} />;
  if (screen === 'login') return <LoginScreen onLogin={(d) => { if (d.action === 'register') setScreen('register'); else if (d.action === 'recover') setScreen('recover'); else { setUserData(d); setScreen('main'); } }} />;

  // 3. O Retorno Principal (O app em si)
  // 3. O Retorno Principal (O app em si)
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === 'Vitrine') icon = focused ? 'shopping' : 'shopping-outline';
          else if (route.name === 'Feed') icon = focused ? 'newspaper-variant' : 'newspaper-variant-outline';
          else if (route.name === 'Meus Produtos') icon = focused ? 'package-variant' : 'package-variant-closed';
          else if (route.name === 'Painel Admin') icon = focused ? 'shield-account' : 'shield-account-outline';
          else icon = focused ? 'account-circle' : 'account-circle-outline'; 
          
          return <MaterialCommunityIcons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50', tabBarInactiveTintColor: '#999', headerShown: false,
        tabBarStyle: { backgroundColor: '#FFF', borderTopWidth: 0, elevation: 8, height: 60, paddingBottom: 8 }
      })}>
        
        {/* --- LÓGICA DE ABAS: ADMIN vs USUÁRIOS COMUNS --- */}
        {userData?.type === 'admin' ? (
          
          <Tab.Screen name="Painel Admin" options={{ tabBarStyle: { display: 'none' } }}>
            {() => <AdminScreen 
                     products={productsList} 
                     onDeleteProduct={(id) => setProductsList(productsList.filter(p => p.id !== id))}
                     onLogout={() => { setUserData(null); setScreen('login'); }}
                   />}
          </Tab.Screen>
          
        ) : (
          
          /* --- FRAGMENTO ABRAÇANDO AS ABAS DOS USUÁRIOS COMUNS --- */
          <>
            <Tab.Screen name="Vitrine">
              {() => <MainScreen userData={userData} products={productsList} onLogout={() => { setUserData(null); setScreen('login'); }} />}
            </Tab.Screen>
            
            {userData?.type === 'producer' ? (
              <Tab.Screen name="Meus Produtos">
                {() => <ProducerScreen 
                         userData={userData} 
                         products={productsList} 
                         onAddProduct={(novoProduto) => setProductsList([novoProduto, ...productsList])} 
                         onUpdateProduct={(produtoAtualizado) => 
                           setProductsList(productsList.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p))
                         }
                         onDeleteProduct={(idParaApagar) => 
                           setProductsList(productsList.filter(p => p.id !== idParaApagar))
                         }
                       />}
              </Tab.Screen>
            ) : (
              <Tab.Screen name="Feed">
                {() => <FeedScreen/>}
              </Tab.Screen>
            )}

            <Tab.Screen name="Perfil">
              {() => <ProfileScreen 
                       userData={userData} 
                       products={productsList} 
                       onLogout={() => { setUserData(null); setScreen('login'); }} 
                     />}
            </Tab.Screen>
          </>
          
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
// Repare que não há NADA de código aqui embaixo depois de fechar a chave da função!