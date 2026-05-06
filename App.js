import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar, FlatList, Image, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';

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
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [type, setType] = useState('customer');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  
  // --- NOVOS ESTADOS PARA O PRODUTOR ---
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const suggestions = ['joao_silva', 'maria_fazenda', 'pedro_horta'];

  const goStep2 = () => {
    if (!userId.trim()) { setError('Digite um nome de usuário'); return; }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(userId)) { setError('Use letras, números e underline (3-20)'); return; }
    if (usersDB[userId.toLowerCase().trim()]) { setError('Nome já está em uso'); return; }
    setError(''); setStep(2);
  };

  const register = async () => {
    if (!password || password.length < 4) { setError('Senha deve ter no mínimo 4 caracteres'); return; }
    if (password !== confirmPass) { setError('As senhas não conferem'); return; }
    if (!question.trim() || !answer.trim()) { setError('Preencha pergunta e resposta'); return; }
    
    // --- VALIDAÇÃO EXCLUSIVA DO PRODUTOR ---
    if (type === 'producer') {
      if (!phone.trim() || !address.trim()) { setError('Produtores precisam informar WhatsApp e Endereço'); return; }
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Salvando os dados no nosso banco falso
    usersDB[userId.toLowerCase().trim()] = { 
      password, type, name: userId, question, answer: answer.toLowerCase().trim(), code,
      phone: type === 'producer' ? phone : '',
      address: type === 'producer' ? address : ''
    };
    
    setLoading(false);
    Alert.alert('✅ Conta criada!', 'Código de recuperação: ' + code + '\n\n⚠️ GUARDE este código!', [
      { text: 'Anotei!', onPress: () => onRegister({ userId: userId.toLowerCase().trim(), type, name: userId }) }
    ]);
  };

  if (step === 1) {
    return (
      <SafeAreaView style={C.container}><StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
        <ScrollView contentContainerStyle={C.scroll}><View style={C.content}>
          <TouchableOpacity onPress={onBack} style={C.backBtn}><MaterialCommunityIcons name="arrow-left" size={28} color="#333" /><Text style={C.backText}>Voltar</Text></TouchableOpacity>
          <Text style={C.title}>Criar Conta</Text><Text style={C.subtitle}>Passo 1 de 2</Text>
          <Text style={C.label}>Tipo de conta:</Text>
          <View style={C.typeRow}>
            <TouchableOpacity style={[C.typeBtn, type === 'customer' && C.typeBtnActive]} onPress={() => setType('customer')}><Text style={C.typeEmoji}>🛒</Text><Text style={C.typeLabel}>Cliente</Text></TouchableOpacity>
            <TouchableOpacity style={[C.typeBtn, type === 'producer' && C.typeBtnActive2]} onPress={() => setType('producer')}><Text style={C.typeEmoji}>👨‍🌾</Text><Text style={C.typeLabel}>Produtor</Text></TouchableOpacity>
          </View>
          <View style={C.inputBox}><Text style={C.label}>👤 Nome de usuário (Login)</Text><TextInput style={C.input} value={userId} onChangeText={t => { setUserId(t); setError(''); }} placeholder="Ex: joao_silva" placeholderTextColor="#CCC" autoCapitalize="none" maxLength={20} /><Text style={C.hint}>Letras, números e underline</Text>
            <TouchableOpacity style={C.suggestion} onPress={() => setUserId(suggestions[Math.floor(Math.random()*suggestions.length)])}><MaterialCommunityIcons name="lightbulb-on" size={16} color="#FF9800" /><Text style={C.suggestionText}>Sugestão: {suggestions[0]}</Text></TouchableOpacity>
          </View>
          {error ? <View style={C.errorBox}><MaterialCommunityIcons name="alert-circle" size={18} color="#F44336" /><Text style={C.errorText}>{error}</Text></View> : null}
          <TouchableOpacity style={C.btn} onPress={goStep2}><Text style={C.btnText}>Próximo →</Text></TouchableOpacity>
        </View></ScrollView></SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={C.container}><StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      <ScrollView contentContainerStyle={C.scroll}><View style={C.content}>
        <TouchableOpacity onPress={() => setStep(1)} style={C.backBtn}><MaterialCommunityIcons name="arrow-left" size={28} color="#333" /><Text style={C.backText}>Voltar</Text></TouchableOpacity>
        <Text style={C.title}>Criar Conta</Text><Text style={C.subtitle}>Passo 2 de 2</Text>
        
        {/* --- CAMPOS EXTRAS SE FOR PRODUTOR --- */}
        {type === 'producer' && (
          <>
            <View style={C.inputBox}>
              <Text style={C.label}>📱 WhatsApp (com DDD)</Text>
              <TextInput style={C.input} value={phone} onChangeText={setPhone} placeholder="Ex: 38999999999" keyboardType="numeric" placeholderTextColor="#CCC" />
            </View>
            <View style={C.inputBox}>
              <Text style={C.label}>📍 Endereço / Fazenda</Text>
              <TextInput style={C.input} value={address} onChangeText={setAddress} placeholder="Ex: Sítio São José, Janaúba" placeholderTextColor="#CCC" />
            </View>
          </>
        )}

        <View style={C.inputBox}><Text style={C.label}>🔒 Senha (mínimo 4)</Text><View style={C.passRow}><TextInput style={[C.input, { flex: 1 }]} value={password} onChangeText={setPassword} placeholder="Mínimo 4 caracteres" placeholderTextColor="#CCC" secureTextEntry={!showPass} maxLength={20} /><TouchableOpacity onPress={() => setShowPass(!showPass)} style={C.eyeBtn}><MaterialCommunityIcons name={showPass ? 'eye-off' : 'eye'} size={24} color="#999" /></TouchableOpacity></View></View>
        <View style={C.inputBox}><Text style={C.label}>🔒 Repita a senha</Text><TextInput style={C.input} value={confirmPass} onChangeText={setConfirmPass} placeholder="Digite novamente" placeholderTextColor="#CCC" secureTextEntry={!showPass} maxLength={20} /></View>
        <View style={C.inputBox}><Text style={C.label}>🔐 Pergunta de segurança</Text><TextInput style={C.input} value={question} onChangeText={setQuestion} placeholder="Ex: Nome do meu cachorro" placeholderTextColor="#CCC" /></View>
        <View style={C.inputBox}><Text style={C.label}>💬 Resposta</Text><TextInput style={C.input} value={answer} onChangeText={setAnswer} placeholder="Sua resposta secreta" placeholderTextColor="#CCC" /></View>
        
        {error ? <View style={C.errorBox}><MaterialCommunityIcons name="alert-circle" size={18} color="#F44336" /><Text style={C.errorText}>{error}</Text></View> : null}
        
        <TouchableOpacity style={C.btn} onPress={register} disabled={loading}>{loading ? <ActivityIndicator color="#FFF" /> : <Text style={C.btnText}>✅ Finalizar Cadastro</Text>}</TouchableOpacity>
      </View></ScrollView></SafeAreaView>
  );
}

function RecoverScreen({ onBack }) {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [method, setMethod] = useState('question');
  const [answer, setAnswer] = useState('');
  const [code, setCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const find = async () => {
    if (!userId.trim()) { setError('Digite seu nome de usuário'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const u = usersDB[userId.toLowerCase().trim()];
    if (!u) { setError('Usuário não encontrado'); setLoading(false); return; }
    setUser(u); setError(''); setLoading(false); setStep(2);
  };

  const verify = () => {
    if (method === 'question') {
      if (answer.toLowerCase().trim() !== user.answer) { setError('Resposta incorreta'); return; }
    } else {
      if (code.toUpperCase() !== user.code) { setError('Código inválido'); return; }
    }
    setError(''); setStep(3);
  };

  const reset = async () => {
    if (!newPass || newPass.length < 4) { setError('Mínimo 4 caracteres'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    usersDB[userId.toLowerCase().trim()].password = newPass;
    setLoading(false);
    Alert.alert('✅ Senha alterada!', 'Faça login com sua nova senha.', [{ text: 'OK', onPress: onBack }]);
  };

  if (step === 1) return (
    <SafeAreaView style={C.container}><StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      <View style={C.content}>
        <TouchableOpacity onPress={onBack} style={C.backBtn}><MaterialCommunityIcons name="arrow-left" size={28} color="#333" /><Text style={C.backText}>Voltar</Text></TouchableOpacity>
        <Text style={C.title}>Recuperar Conta</Text>
        <View style={C.inputBox}><Text style={C.label}>👤 Nome de usuário</Text><TextInput style={C.input} value={userId} onChangeText={t => { setUserId(t); setError(''); }} placeholder="Seu nome de usuário" placeholderTextColor="#CCC" autoCapitalize="none" /></View>
        {error ? <Text style={C.errorText}>{error}</Text> : null}
        <TouchableOpacity style={C.btn} onPress={find} disabled={loading}>{loading ? <ActivityIndicator color="#FFF" /> : <Text style={C.btnText}>🔍 Buscar</Text>}</TouchableOpacity>
      </View></SafeAreaView>
  );

  if (step === 2) return (
    <SafeAreaView style={C.container}><StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      <View style={C.content}>
        <TouchableOpacity onPress={() => setStep(1)} style={C.backBtn}><MaterialCommunityIcons name="arrow-left" size={28} color="#333" /><Text style={C.backText}>Voltar</Text></TouchableOpacity>
        <Text style={C.title}>Verificação</Text>
        <View style={C.typeRow}>
          <TouchableOpacity style={[C.typeBtn, method === 'question' && C.typeBtnActive]} onPress={() => setMethod('question')}><Text style={C.typeEmoji}>❓</Text><Text style={C.typeLabel}>Pergunta</Text></TouchableOpacity>
          <TouchableOpacity style={[C.typeBtn, method === 'code' && C.typeBtnActive2]} onPress={() => setMethod('code')}><Text style={C.typeEmoji}>🔑</Text><Text style={C.typeLabel}>Código</Text></TouchableOpacity>
        </View>
        {method === 'question' ? <View style={C.inputBox}><Text style={C.label}>❓ {user.question}</Text><TextInput style={C.input} value={answer} onChangeText={t => { setAnswer(t); setError(''); }} placeholder="Sua resposta" placeholderTextColor="#CCC" /></View>
        : <View style={C.inputBox}><Text style={C.label}>🔑 Código de recuperação</Text><TextInput style={C.input} value={code} onChangeText={t => { setCode(t); setError(''); }} placeholder="Código do cadastro" placeholderTextColor="#CCC" autoCapitalize="characters" /><Text style={C.hint}>Código mostrado ao criar a conta</Text></View>}
        {error ? <Text style={C.errorText}>{error}</Text> : null}
        <TouchableOpacity style={C.btn} onPress={verify}><Text style={C.btnText}>Verificar</Text></TouchableOpacity>
      </View></SafeAreaView>
  );

  return (
    <SafeAreaView style={C.container}><StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      <View style={C.content}>
        <Text style={C.title}>Nova Senha</Text>
        <View style={C.inputBox}><Text style={C.label}>🔒 Nova senha</Text><TextInput style={C.input} value={newPass} onChangeText={t => { setNewPass(t); setError(''); }} placeholder="Mínimo 4 caracteres" placeholderTextColor="#CCC" secureTextEntry maxLength={20} /></View>
        {error ? <Text style={C.errorText}>{error}</Text> : null}
        <TouchableOpacity style={C.btn} onPress={reset} disabled={loading}>{loading ? <ActivityIndicator color="#FFF" /> : <Text style={C.btnText}>💾 Salvar nova senha</Text>}</TouchableOpacity>
      </View></SafeAreaView>
  );
}

function MainScreen({ userData, products, onLogout }) {
  const [selectedProd, setSelectedProd] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState(''); // <-- NOVO: Estado da busca

  const categories = ['Todas', 'Fruta', 'Verdura', 'Legume', 'Processado', 'Outro'];

  // LÓGICA DE FILTRAGEM TURBINADA (Estoque + Categoria + Busca de Texto)
  const filteredProducts = products.filter(p => {
    const hasStock = p.stock === undefined || p.stock > 0;
    const matchesCategory = activeCategory === 'Todas' || p.category === activeCategory;
    
    // Transforma tudo em minúsculo para a busca não dar erro com letras maiúsculas/minúsculas
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return hasStock && matchesCategory && matchesSearch;
  });

  const openWhatsApp = (produto) => {
    // Busca os dados do dono do produto lá no nosso "Banco de Dados"
    const donoDoProduto = usersDB[produto.producerId];
    
    // Se o dono tiver telefone, usa ele. Se não, usa um padrão (caso seja um produto antigo)
    const telefone = donoDoProduto?.phone || "38999999999"; 
    
    // Remove qualquer traço ou espaço do telefone para não dar erro no link
    const numeroLimpo = telefone.replace(/\D/g, ''); 
    
    const mensagem = `Olá, ${produto.producer}! Vi o anúncio de *${produto.name}* no AgroSocial e tenho interesse.`;
    
    Linking.openURL(`whatsapp://send?phone=55${numeroLimpo}&text=${mensagem}`).catch(() => {
      Alert.alert('Erro', 'WhatsApp não encontrado no dispositivo.');
    });
  };

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

      {/* --- NOVO: BARRA DE PESQUISA --- */}
      <View style={{ paddingHorizontal: 15, paddingTop: 10, backgroundColor: '#FFF' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: '#E0E0E0' }}>
          <MaterialCommunityIcons name="magnify" size={24} color="#999" />
          <TextInput 
            style={{ flex: 1, marginLeft: 10, fontSize: 16, color: '#333' }}
            placeholder="Buscar produtos..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {/* Só mostra o botão de limpar (X) se tiver algo digitado */}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ paddingVertical: 10, paddingHorizontal: 5, backgroundColor: '#FFF', elevation: 2 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveCategory(cat)}
              style={{
                backgroundColor: activeCategory === cat ? '#4CAF50' : '#F5F5F5',
                paddingHorizontal: 16, paddingVertical: 8,
                borderRadius: 20, marginHorizontal: 5,
                borderWidth: 1, borderColor: activeCategory === cat ? '#4CAF50' : '#E0E0E0'
              }}>
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
              <Text style={C.cardPrice}>R$ {item.price}<Text style={C.cardUnit}>/{item.unit}</Text></Text>
              <Text style={C.cardProducer}>👨‍🌾 {item.producer}</Text>
            </View>
            <View style={C.wppBtn}>
              <MaterialCommunityIcons name="magnify" size={16} color="#FFF" />
              <Text style={C.wppText}>Ver Detalhes</Text>
            </View>
          </TouchableOpacity>
        )} 
        keyExtractor={i => i.id} 
        numColumns={2} 
        contentContainerStyle={{ padding: 8, paddingBottom: 20 }} 
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🔍</Text>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', paddingHorizontal: 20 }}>
              Nenhum produto encontrado. Tente mudar o termo da busca ou a categoria.
            </Text>
          </View>
        }
      />

      <Modal visible={selectedProd !== null} animationType="slide" transparent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
          {selectedProd && (
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
              <Image source={{ uri: selectedProd.image }} style={{ width: '100%', height: 300, resizeMode: 'cover' }} />
              
              <TouchableOpacity 
                style={{ position: 'absolute', top: 20, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 50 }}
                onPress={() => setSelectedProd(null)}>
                <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
              </TouchableOpacity>

              <View style={{ padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 }}>
                {selectedProd.category && (
                  <View style={{ alignSelf: 'flex-start', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 8 }}>
                    <Text style={{ color: '#4CAF50', fontSize: 12, fontWeight: 'bold' }}>{selectedProd.category}</Text>
                  </View>
                )}

                <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#333' }}>{selectedProd.name}</Text>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#4CAF50', marginTop: 5 }}>
                  R$ {selectedProd.price} <Text style={{ fontSize: 14, color: '#999' }}>por {selectedProd.unit}</Text>
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#EEE' }}>
                  <Text style={{ fontSize: 40, marginRight: 15 }}>👨‍🌾</Text>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>{selectedProd.producer}</Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>Produtor Local - Janaúba</Text>
                  </View>
                </View>

                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 }}>Descrição</Text>
                <Text style={{ fontSize: 15, color: '#666', lineHeight: 22 }}>
                  {selectedProd.description || 'Produto fresco e de excelente qualidade direto da roça.'}
                </Text>

                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 }}>Retirada / Entrega</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 12, borderRadius: 10 }}>
                    <MaterialCommunityIcons name="map-marker" size={20} color="#4CAF50" />
                    <Text style={{ fontSize: 14, color: '#333', marginLeft: 8, flex: 1 }}>
                        {/* Faz o Join com usersDB para pegar o endereço real */}
                        {usersDB[selectedProd.producerId]?.address || 'Endereço não informado.'}
                    </Text>
                </View>

                <TouchableOpacity 
                  style={[C.btn, { backgroundColor: '#25D366', marginTop: 30, flexDirection: 'row', justifyContent: 'center', gap: 10 }]} 
                  onPress={() => openWhatsApp(selectedProd)}>
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

function ProfileScreen({ userData, onLogout }) {
  // Se for visitante, mostramos uma tela pedindo para criar conta
  if (userData.type === 'guest') {
    return (
      <SafeAreaView style={[C.container, { justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
        <Text style={{ fontSize: 60, marginBottom: 20 }}>👀</Text>
        <Text style={C.title}>Você é um Visitante</Text>
        <Text style={[C.subtitle, { marginBottom: 40 }]}>Para avaliar produtos e ter acesso completo, crie uma conta gratuitamente.</Text>
        <TouchableOpacity style={C.btn} onPress={onLogout}>
          <Text style={C.btnText}>Fazer Login ou Cadastro</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isProducer = userData.type === 'producer';
  return (
    <SafeAreaView style={C.container}><StatusBar backgroundColor="#1B5E20" barStyle="light-content" />
      <View style={C.profHeader}><Text style={C.profAvatar}>{isProducer ? '👨‍🌾' : '😊'}</Text></View>
      <ScrollView style={C.profBody}>
        <Text style={C.profName}>{userData.name}</Text><Text style={C.profType}>{isProducer ? 'Produtor' : 'Cliente'} • Janaúba-MG</Text><Text style={C.profId}>@{userData.userId}</Text>
        {isProducer && <View style={C.metricsRow}><View style={C.metric}><Text style={C.metricVal}>12</Text><Text style={C.metricLbl}>Produtos</Text></View><View style={C.metric}><Text style={C.metricVal}>45</Text><Text style={C.metricLbl}>Vendas</Text></View><View style={C.metric}><Text style={C.metricVal}>⭐4.8</Text><Text style={C.metricLbl}>Aval.</Text></View></View>}
        <Text style={C.secTitle}>⚙️ Configurações</Text>
        <View style={C.setting}><MaterialCommunityIcons name="account" size={22} color="#666" /><Text style={C.settingText}>Nome: {userData.name}</Text></View>
        <View style={C.setting}><MaterialCommunityIcons name="card-account-details" size={22} color="#666" /><Text style={C.settingText}>ID: @{userData.userId}</Text></View>
        <View style={C.setting}><MaterialCommunityIcons name="shield-account" size={22} color="#666" /><Text style={C.settingText}>Tipo: {isProducer ? 'Produtor' : 'Cliente'}</Text></View>
        <TouchableOpacity style={C.logoutFull} onPress={onLogout}><MaterialCommunityIcons name="logout" size={22} color="#F44336" /><Text style={C.logoutText}>Sair da conta</Text></TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProducerScreen({ userData, products, onAddProduct }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [imageUri, setImageUri] = useState(null);
  
  // --- NOVOS ESTADOS ---
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');

  // Lista de categorias pré-definidas
  const categoriasOptions = ['Fruta', 'Verdura', 'Legume', 'Processado', 'Outro'];

  const myProducts = products.filter(p => p.producer === userData.name);

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [4, 3], quality: 0.5,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const pickGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.5,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleImageOptions = () => {
    Alert.alert(
      "Foto do Produto", "De onde você quer pegar a foto?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "📷 Tirar Foto", onPress: takePhoto },
        { text: "🖼️ Escolher da Galeria", onPress: pickGallery }
      ]
    );
  };

  const handleSave = () => {
    if (!name || !price || !category || !stock) { 
      Alert.alert('⚠️', 'Preencha o nome, preço, estoque e escolha uma categoria!'); 
      return; 
    }
    
    const newProduct = {
      id: Date.now().toString(),
      name, 
      price, 
      unit, 
      category,
      description: description || 'Sem descrição.', // Se deixar em branco, põe texto padrão
      stock: parseInt(stock, 10), // Garante que o estoque seja um número inteiro
      producer: userData.name,
      producerId: userData.userId,
      image: imageUri || 'https://images.unsplash.com/photo-1595858540838-518ce9fb96aa?w=400', 
    };

    onAddProduct(newProduct);
    Alert.alert('✅ Sucesso!', 'Produto adicionado à sua vitrine!');
    
    // Limpando tudo
    setName(''); setPrice(''); setUnit('kg'); setImageUri(null); 
    setDescription(''); setCategory(''); setStock('');
    setModalVisible(false);
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
              {/* Exibe o estoque na lista do produtor. Se for 0, fica vermelho. */}
              <Text style={{ fontSize: 12, color: item.stock > 0 ? '#666' : '#F44336', marginTop: 4 }}>
                {item.stock > 0 ? `📦 Estoque: ${item.stock}` : '⚠️ Esgotado'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Aviso', 'A edição/exclusão será ligada ao banco de dados em breve!')} style={{ padding: 10 }}>
              <MaterialCommunityIcons name="pencil-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={i => i.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }}>Você ainda não cadastrou produtos.</Text>}
      />

      <TouchableOpacity 
        style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#1B5E20', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 }}
        onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="plus" size={32} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={C.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#EEE' }}>
            <TouchableOpacity onPress={() => { setModalVisible(false); setImageUri(null); }}>
              <MaterialCommunityIcons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Novo Produto</Text>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            
            <TouchableOpacity 
              style={{ backgroundColor: '#E0E0E0', height: 180, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#CCC', borderStyle: 'dashed', overflow: 'hidden' }}
              onPress={handleImageOptions}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <>
                  <MaterialCommunityIcons name="camera-plus" size={48} color="#777" />
                  <Text style={{ color: '#555', marginTop: 10, fontSize: 16, fontWeight: 'bold' }}>Tocar para adicionar foto</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={C.inputBox}><Text style={C.label}>🏷️ Nome do Produto</Text><TextInput style={C.input} value={name} onChangeText={setName} placeholder="Ex: Queijo" /></View>
            
            {/* Categoria em Formato de Chips Roláveis */}
            <Text style={C.label}>📑 Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
              {categoriasOptions.map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  onPress={() => setCategory(cat)}
                  style={{
                    backgroundColor: category === cat ? '#4CAF50' : '#E0E0E0',
                    paddingHorizontal: 16, paddingVertical: 10,
                    borderRadius: 20, marginRight: 10,
                  }}>
                  <Text style={{ color: category === cat ? '#FFF' : '#333', fontWeight: 'bold' }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Nova Linha: Preço, Unidade e Estoque dividindo o mesmo espaço */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={[C.inputBox, { flex: 2 }]}><Text style={C.label}>💲 Preço</Text><TextInput style={C.input} value={price} onChangeText={setPrice} placeholder="25,00" keyboardType="numeric" /></View>
              <View style={[C.inputBox, { flex: 1.2 }]}><Text style={C.label}>📏 Unid.</Text><TextInput style={C.input} value={unit} onChangeText={setUnit} placeholder="kg, un" /></View>
              <View style={[C.inputBox, { flex: 1.5 }]}><Text style={C.label}>📦 Estoq.</Text><TextInput style={C.input} value={stock} onChangeText={setStock} placeholder="Qtd" keyboardType="numeric" /></View>
            </View>

            {/* Descrição: Um campo maior que aceita várias linhas */}
            <View style={C.inputBox}>
              <Text style={C.label}>📝 Descrição</Text>
              <TextInput 
                style={[C.input, { height: 100, textAlignVertical: 'top' }]} 
                value={description} 
                onChangeText={setDescription} 
                placeholder="Detalhes sobre o produto, como foi cultivado, etc..." 
                multiline={true} 
                numberOfLines={4} 
              />
            </View>

            <TouchableOpacity style={[C.btn, { marginTop: 10, marginBottom: 40 }]} onPress={handleSave}>
              <Text style={C.btnText}>💾 Salvar Produto</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
   { id: '1', name: 'Tomate Orgânico', price: '8,90', unit: 'kg', producerId: 'joao', category: 'Verdura', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', producer: 'João Silva' },
    { id: '2', name: 'Banana Prata', price: '5,50', unit: 'kg', producerId: 'joao', category: 'Fruta', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400', producer: 'João Silva' },
    { id: '3', name: 'Alface', price: '3,50', unit: 'un', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400', producer: 'João Silva' },
    { id: '4', name: 'Queijo Minas', price: '28,00', unit: 'un', image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400', producer: 'Ana Paula' },
  ]);

  // 2. Lógica de telas soltas (Login, Registro, etc)
  if (screen === 'register') return <RegisterScreen onBack={() => setScreen('login')} onRegister={(d) => { setUserData(d); setScreen('main'); }} />;
  if (screen === 'recover') return <RecoverScreen onBack={() => setScreen('login')} />;
  if (screen === 'login') return <LoginScreen onLogin={(d) => { if (d.action === 'register') setScreen('register'); else if (d.action === 'recover') setScreen('recover'); else { setUserData(d); setScreen('main'); } }} />;

  // 3. O Retorno Principal (O app em si)
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === 'Vitrine') icon = focused ? 'shopping' : 'shopping-outline';
          else if (route.name === 'Feed') icon = focused ? 'newspaper-variant' : 'newspaper-variant-outline';
          else if (route.name === 'Meus Produtos') icon = focused ? 'package-variant' : 'package-variant-closed';
          else icon = focused ? 'account-circle' : 'account-circle-outline'; 
          
          return <MaterialCommunityIcons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50', tabBarInactiveTintColor: '#999', headerShown: false,
        tabBarStyle: { backgroundColor: '#FFF', borderTopWidth: 0, elevation: 8, height: 60, paddingBottom: 8 }
      })}>
        
        {/* Passando productsList para a Vitrine */}
        <Tab.Screen name="Vitrine">
          {() => <MainScreen userData={userData} products={productsList} onLogout={() => { setUserData(null); setScreen('login'); }} />}
        </Tab.Screen>
        
        {/* Lógica condicional: Produtor ou Feed */}
        {userData?.type === 'producer' ? (
          <Tab.Screen name="Meus Produtos">
            {() => <ProducerScreen 
                     userData={userData} 
                     products={productsList} 
                     onAddProduct={(novoProduto) => setProductsList([novoProduto, ...productsList])} 
                   />}
          </Tab.Screen>
        ) : (
          <Tab.Screen name="Feed">
            {() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#333' }}>📰 Feed de Notícias (Emater)</Text>
              </View>
            )}
          </Tab.Screen>
        )}

        <Tab.Screen name="Perfil">
          {() => <ProfileScreen userData={userData} onLogout={() => { setUserData(null); setScreen('login'); }} />}
        </Tab.Screen>
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}
// Repare que não há NADA de código aqui embaixo depois de fechar a chave da função!