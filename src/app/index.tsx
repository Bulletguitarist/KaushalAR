import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated, Dimensions, KeyboardAvoidingView,
  Platform, Alert, Share,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const C = {
  saffron: '#E8650A', saffronL: '#F59340', deep: '#080C18',
  card: '#0F1825', card2: '#17243A', green: '#00C98A',
  blue: '#3B82F6', text: '#E4E8F2', muted: '#7A8699',
  border: 'rgba(232,101,10,0.18)', white: '#FFFFFF',
};

const TRADES = [
  {
    id: 'electrician', name: 'Electrician', hindi: 'बिजली मिस्त्री',
    emoji: '⚡', color: '#F59340', points: 50,
    steps: [
      { title: 'Main Switch Band Karo', hindi: 'मुख्य स्विच बंद करें', instruction: 'Safety ke liye sabse pehle main MCB switch OFF karo. Tester se check karo ki current nahi hai.', tip: '⚠️ Kabhi bhi live wire mat chhuao!' },
      { title: 'Wire Identify Karo', hindi: 'तार पहचानो', instruction: '🔴 Phase (Red/Brown)\n🔵 Neutral (Black/Blue)\n🟢 Earth (Green/Yellow)', tip: '💡 Phase wire pehle disconnect karo.' },
      { title: 'Wire Strip Karo', hindi: 'तार छीलो', instruction: 'Wire stripper se exactly 2cm insulation hatao. Zyada mat hatao warna short circuit!', tip: '✂️ Wire stripper use karo — knife se nahi.' },
      { title: 'Connection Lagao', hindi: 'कनेक्शन जोड़ो', instruction: 'Terminal mein wire daalo aur screw tight karo. Loose connection = fire hazard!', tip: '🔧 Screwdriver se tight karo.' },
      { title: 'Test Karo', hindi: 'जांच करें', instruction: 'MCB ON karo. Voltage tester se check karo. Agar MCB trip kare toh connection galat hai.', tip: '✅ Direct touch nahi — tester use karo!' },
    ],
  },
  {
    id: 'plumber', name: 'Plumber', hindi: 'नल मिस्त्री',
    emoji: '🔧', color: '#3B82F6', points: 50,
    steps: [
      { title: 'Water Band Karo', hindi: 'पानी बंद करें', instruction: 'Main water valve clockwise ghuma ke band karo. Tap kholo taaki bacha paani nikal jaaye.', tip: '⚠️ Pehle water band — warna flood!' },
      { title: 'Purani Pipe Hatao', hindi: 'पुरानी पाइप हटाएं', instruction: 'Wrench se fitting loose karo. Purani pipe ke edges check karo.', tip: '💧 Towel rakho — thoda paani girega.' },
      { title: 'Nai Pipe Measure Karo', hindi: 'नई पाइप नापें', instruction: 'Tape measure se exactly napo. Thoda extra rakho — baad mein kaat sakte ho.', tip: '📏 Measure twice, cut once!' },
      { title: 'Thread Tape Lagao', hindi: 'थ्रेड टेप लगाएं', instruction: 'PTFE tape ko 3-4 rounds clockwise wrap karo pipe thread pe.', tip: '🔄 Hamesha clockwise wrap karo!' },
      { title: 'Fit karo aur Test Karo', hindi: 'लगाएं और जांचें', instruction: 'Haath se tight karo phir wrench se quarter turn. Water on karo — leak check karo.', tip: '✅ Zyada tight mat karo — pipe crack!' },
    ],
  },
  {
    id: 'welder', name: 'Welder', hindi: 'वेल्डर',
    emoji: '🔥', color: '#EF4444', points: 60,
    steps: [
      { title: 'Safety Gear Pahno', hindi: 'सुरक्षा उपकरण पहनें', instruction: 'Welding helmet, leather gloves, leather apron aur safety shoes — sab mandatory hai!', tip: '🛡️ UV rays aankhon ko damage karti hain!' },
      { title: 'Metal Clean Karo', hindi: 'धातु साफ करें', instruction: 'Wire brush se rust aur dirt hatao. Clean surface pe hi achhi weld hoti hai.', tip: '🔧 Greasy surface pe weld weak hogi.' },
      { title: 'Machine Set Karo', hindi: 'मशीन सेट करें', instruction: '3mm MS plate ke liye:\n⚡ 90-120 Ampere\n🔌 Electrode: E6013 3.15mm', tip: '⚡ Zyada ampere = burn through!' },
      { title: 'Arc Strike Karo', hindi: 'चाप शुरू करें', instruction: 'Electrode ko metal pe tap karke arc shuru karo. 3mm distance rakho. Steady speed se chalo.', tip: '🔥 Consistent speed = uniform bead.' },
      { title: 'Quality Check Karo', hindi: 'गुणवत्ता जांचें', instruction: '5 min cool hone do. Chipping hammer se slag hatao. Holes ya cracks check karo.', tip: '✅ Good weld: uniform, shiny, no holes.' },
    ],
  },
  {
    id: 'hvac', name: 'HVAC Tech', hindi: 'AC तकनीशियन',
    emoji: '❄️', color: '#06B6D4', points: 60,
    steps: [
      { title: 'AC Band Karo', hindi: 'AC बंद करें', instruction: 'Main power switch band karo aur plug nikalo. Capacitor discharge ke liye 5 min wait karo.', tip: '⚠️ Live AC mat chhuao kabhi!' },
      { title: 'Filter Saaf Karo', hindi: 'फ़िल्टर साफ करें', instruction: 'Indoor unit ka front panel kholo. Filter nikalo aur paani se saaf karo.', tip: '💧 Wet filter mat lagao wapas.' },
      { title: 'Coil Check Karo', hindi: 'कॉइल जांचें', instruction: 'Evaporator coil pe dust check karo. Coil cleaner spray karo. 10 min wait karo.', tip: '🌡️ Dirty coil = high electricity bill.' },
      { title: 'Gas Pressure Check Karo', hindi: 'गैस प्रेशर जांचें', instruction: 'Manifold gauge se refrigerant pressure check karo. R32: 8-10 bar (cooling mode).', tip: '❄️ Low pressure = gas leak — specialist bulao.' },
      { title: 'Test Run Karo', hindi: 'परीक्षण चलाएं', instruction: 'AC on karo. 15 min baad outlet temperature check karo. 8-12°C difference normal hai.', tip: '✅ Agar cooling nahi = gas refill karo.' },
    ],
  },
];

const DEMO_REPLIES: Record<string, string> = {
  'wire': '⚡ Wire isliye jalti hai:\n\n1. Galat gauge — patli wire pe zyada current\n2. Loose connection — resistance → heat\n3. Overloading — bahut saare appliances\n\n✅ Solution: Sahi AWG wire, MCB lagao!',
  'earthing': '🌍 Earthing ek safety system hai!\n\n• Wire zameen mein gadi jaati hai\n• Fault aane pe current zameen mein jaati hai\n• Aapko shock nahi lagta\n\n⚠️ Bina earthing ke ghar dangerous!',
  'mcb': '🔌 MCB = Miniature Circuit Breaker\n\nYeh tumhara electric guardian hai:\n1. Overload pe automatic trip\n2. Short circuit pe instant off\n3. Reset kar sakte ho!\n\n✅ Har ghar mein MCB zaroori!',
  'short': '⚠️ Short circuit se bachne ke liye:\n\n1. MCB lagao\n2. Sahi gauge wire use karo\n3. Loose connections fix karo\n4. Purani damaged wire replace karo\n\n🔴 Switch band karke kaam karo!',
  'ac': '🔋 AC vs DC:\n\nAC: Ghar ki bijli, 230V India\nDC: Battery, mobile charger\n\nCharger AC→DC convert karta hai!\n✅ Socket=AC, Battery=DC',
  'leak': '🔧 Pipe leak band karne ke steps:\n\n1. Main water valve band karo\n2. PTFE thread tape lagao\n3. Plumber epoxy use karo\n4. 30 min set hone do\n5. Test karo\n\n💧 Badi leak = plumber bulao!',
  'weld': '🔥 3mm plate welding settings:\n\n• Ampere: 90-120A\n• Electrode: E6013, 3.15mm\n• Speed: Steady\n• Gap: 3mm\n\n⚠️ Helmet zaroori!',
};

type Screen = 'home' | 'ar' | 'ai' | 'cert' | 'profile';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeTrade, setActiveTrade] = useState(TRADES[0]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [userName, setUserName] = useState('Student');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const p = await AsyncStorage.getItem('pts') || '0';
    const s = await AsyncStorage.getItem('str') || '0';
    const c = await AsyncStorage.getItem('comp') || '[]';
    const n = await AsyncStorage.getItem('name') || 'Student';
    setPoints(parseInt(p)); setStreak(parseInt(s));
    setCompleted(JSON.parse(c)); setUserName(n);
  };

  const addPoints = async (pts: number, tradeId: string) => {
    const comp = [...completed];
    if (!comp.includes(tradeId)) {
      comp.push(tradeId);
      const newPts = points + pts;
      setPoints(newPts); setCompleted(comp);
      await AsyncStorage.setItem('pts', String(newPts));
      await AsyncStorage.setItem('comp', JSON.stringify(comp));
    }
  };

  const tab = (s: Screen) => (
    <TouchableOpacity key={s} style={[st.tab, screen === s && st.tabActive]} onPress={() => setScreen(s)}>
      <Text style={st.tabEmoji}>{{ home:'🏠', ar:'📱', ai:'🎙️', cert:'🏆', profile:'👤' }[s]}</Text>
      <Text style={[st.tabLbl, screen === s && { color: C.saffron }]}>{{ home:'Home', ar:'AR', ai:'AI', cert:'Cert', profile:'Me' }[s]}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={st.root}>
      <View style={st.content}>
        {screen === 'home' && <HomeScreen points={points} streak={streak} completed={completed} userName={userName} onTrade={(t: any) => { setActiveTrade(t); setScreen('ar'); }} />}
        {screen === 'ar' && <ARScreen trade={activeTrade} completed={completed} onComplete={addPoints} onChangeTrade={setActiveTrade} />}
        {screen === 'ai' && <AIScreen />}
        {screen === 'cert' && <CertScreen points={points} completed={completed} />}
        {screen === 'profile' && <ProfileScreen points={points} streak={streak} completed={completed} userName={userName} onSaveName={async (n: string) => { setUserName(n); await AsyncStorage.setItem('name', n); }} />}
      </View>
      <View style={st.tabBar}>{(['home','ar','ai','cert','profile'] as Screen[]).map(tab)}</View>
    </View>
  );
}

// ─── HOME ───────────────────────────────────────────────────
function HomeScreen({ points, streak, completed, userName, onTrade }: any) {
  const getLevel = (p: number) => p < 100 ? 'शागिर्द' : p < 300 ? 'कारीगर' : p < 600 ? 'उस्ताद' : 'महारथी';
  return (
    <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
      <View style={st.homeHeader}>
        <View>
          <Text style={st.greeting}>Namaste 🙏</Text>
          <Text style={st.userName}>{userName}</Text>
          <Text style={[st.level, { color: C.saffron }]}>{getLevel(points)}</Text>
        </View>
        <View style={st.streakBox}>
          <Text style={{ fontSize: 28 }}>🔥</Text>
          <Text style={st.streakNum}>{streak}</Text>
          <Text style={st.streakLbl}>din</Text>
        </View>
      </View>
      <View style={st.statsRow}>
        {[{ n: points, l: 'Points' }, { n: completed.length, l: 'Done' }, { n: `${Math.round((points / 600) * 100)}%`, l: 'Progress' }].map((s, i) => (
          <View key={i} style={st.statBox}>
            <Text style={st.statNum}>{s.n}</Text>
            <Text style={st.statLbl2}>{s.l}</Text>
          </View>
        ))}
      </View>
      <Text style={st.sectionTitle}>Trades Seekho 📚</Text>
      <View style={st.tradeGrid}>
        {TRADES.map(t => (
          <TouchableOpacity key={t.id} style={[st.tradeCard, completed.includes(t.id) && { borderColor: C.green }]} onPress={() => onTrade(t)}>
            <Text style={st.tradeEmoji}>{t.emoji}</Text>
            <Text style={st.tradeName}>{t.name}</Text>
            <Text style={st.tradeHindi}>{t.hindi}</Text>
            <Text style={[st.tradeSteps, { color: t.color }]}>{t.steps.length} steps • {t.points}pts</Text>
            {completed.includes(t.id) && <Text style={st.doneBadge}>✓ Done</Text>}
          </TouchableOpacity>
        ))}
      </View>
      <View style={st.tipBox}>
        <Text style={st.tipTitle}>💡 Aaj Ki Tip</Text>
        <Text style={st.tipText}>Bijli ka kaam karte waqt HAMESHA main switch band karo. Kabhi bhi wet hands se switch mat chhuao. Safety pehle! 🔴</Text>
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// ─── AR SCREEN WITH REAL CAMERA ─────────────────────────────
function ARScreen({ trade, completed, onComplete, onChangeTrade }: any) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setStep(0); setDone(false);
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.3, duration: 900, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
    ])).start();
  }, [trade]);

  const goNext = async () => {
    if (step < trade.steps.length - 1) {
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: -20, duration: 120, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      ]).start();
      setStep(s => s + 1);
    } else {
      await onComplete(trade.points, trade.id);
      setDone(true);
      setCameraActive(false);
    }
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert('Camera Permission', 'Camera access chahiye AR ke liye. Settings mein allow karo.', [{ text: 'OK' }]);
        return;
      }
    }
    setCameraActive(true);
  };

  if (done) return (
    <View style={st.doneView}>
      <Text style={{ fontSize: 80 }}>🎉</Text>
      <Text style={st.doneTitle}>Shukriya! Badhai Ho!</Text>
      <Text style={st.doneSub}>{trade.name} complete kiya!</Text>
      <View style={st.donePoints}><Text style={st.doneNum}>+{trade.points}</Text><Text style={st.doneLbl}>Points Earned!</Text></View>
      <TouchableOpacity style={st.doneBtn} onPress={() => { setDone(false); setStep(0); }}><Text style={st.doneBtnT}>Wapas Jao</Text></TouchableOpacity>
    </View>
  );

  const s = trade.steps[step];
  const prog = ((step + 1) / trade.steps.length) * 100;

  // ── CAMERA AR MODE ──
  if (cameraActive) return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Real Camera */}
      <CameraView style={StyleSheet.absoluteFill} facing={facing} />

      {/* AR Overlay on top of camera */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Corner brackets */}
        <View style={st.arCornerTL} /><View style={st.arCornerTR} />
        <View style={st.arCornerBL} /><View style={st.arCornerBR} />

        {/* Pulsing AR ring in center */}
        <View style={st.arCenterWrap}>
          <Animated.View style={[st.arRingLarge, { borderColor: trade.color, transform: [{ scale: pulseAnim }] }]} />
          <View style={[st.arDotLarge, { backgroundColor: trade.color }]} />
        </View>

        {/* Step instruction card at bottom */}
        <View style={[st.arCard, { borderColor: trade.color + '80' }]}>
          <View style={[st.arCardBadge, { backgroundColor: trade.color }]}>
            <Text style={st.arCardBadgeTxt}>Step {step + 1}/{trade.steps.length}</Text>
          </View>
          <Text style={st.arCardTitle}>{s.title}</Text>
          <Text style={st.arCardHindi}>{s.hindi}</Text>
          <Text style={st.arCardInstr}>{s.instruction}</Text>
          <View style={st.arCardTip}><Text style={st.arCardTipTxt}>{s.tip}</Text></View>

          {/* Progress bar */}
          <View style={st.arProgBg}>
            <View style={[st.arProgFill, { width: `${prog}%` as any, backgroundColor: trade.color }]} />
          </View>

          {/* Nav buttons */}
          <View style={st.arNavRow}>
            <TouchableOpacity style={st.arNavBtn} onPress={() => step > 0 && setStep(s => s - 1)} disabled={step === 0}>
              <Text style={[st.arNavTxt, step === 0 && { opacity: 0.3 }]}>← Pichla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[st.arNextBtn, { backgroundColor: trade.color }]} onPress={goNext}>
              <Text style={st.arNextTxt}>{step === trade.steps.length - 1 ? '✓ Complete!' : 'Agla →'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top controls */}
        <View style={st.arTopRow}>
          <TouchableOpacity style={st.arTopBtn} onPress={() => setCameraActive(false)}>
            <Text style={st.arTopBtnTxt}>✕ Band Karo</Text>
          </TouchableOpacity>
          <View style={st.livePill}>
            <View style={[st.liveDot, { backgroundColor: trade.color }]} />
            <Text style={[st.liveTxt, { color: trade.color }]}>AR LIVE</Text>
          </View>
          <TouchableOpacity style={st.arTopBtn} onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}>
            <Text style={st.arTopBtnTxt}>🔄 Flip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // ── NORMAL MODE (no camera) ──
  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.tradeTabs}>
        {TRADES.map(t => (
          <TouchableOpacity key={t.id} style={[st.tradeTab, trade.id === t.id && st.tradeTabActive]} onPress={() => { onChangeTrade(t); setStep(0); }}>
            <Text style={{ color: trade.id === t.id ? C.saffron : C.muted, fontSize: 13, fontWeight: '600' }}>{t.emoji} {t.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Camera launch button */}
      <TouchableOpacity style={[st.cameraLaunchBtn, { borderColor: trade.color }]} onPress={openCamera}>
        <Text style={st.cameraLaunchEmoji}>📷</Text>
        <View>
          <Text style={[st.cameraLaunchTitle, { color: trade.color }]}>AR Camera Kholo</Text>
          <Text style={st.cameraLaunchSub}>Real camera pe AR overlay dekhne ke liye</Text>
        </View>
        <Text style={[{ color: trade.color, fontSize: 20 }]}>→</Text>
      </TouchableOpacity>

      {/* Progress */}
      <View style={st.progRow}>
        <View style={st.progBg}><View style={[st.progFill, { width: `${prog}%` as any, backgroundColor: trade.color }]} /></View>
        <Text style={st.progTxt}>Step {step + 1}/{trade.steps.length}</Text>
      </View>

      {/* Step card */}
      <Animated.View style={[st.stepCard, { transform: [{ translateY: slideAnim }] }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[st.stepBadge, { backgroundColor: trade.color }]}><Text style={st.stepBadgeTxt}>Step {step + 1}</Text></View>
          <Text style={st.stepTitle}>{s.title}</Text>
          <Text style={st.stepHindi}>{s.hindi}</Text>
          <Text style={st.stepInstr}>{s.instruction}</Text>
          <View style={st.tipCard}><Text style={st.tipCardTxt}>{s.tip}</Text></View>
        </ScrollView>
      </Animated.View>

      <View style={st.navRow}>
        <TouchableOpacity style={[st.navBtn, step === 0 && { opacity: 0.3 }]} onPress={() => step > 0 && setStep(s => s - 1)} disabled={step === 0}>
          <Text style={st.navBtnTxt}>← Pichla</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[st.nextBtn, { backgroundColor: trade.color }]} onPress={goNext}>
          <Text style={st.nextBtnTxt}>{step === trade.steps.length - 1 ? '✓ Complete!' : 'Agla →'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── AI MENTOR ──────────────────────────────────────────────
function AIScreen() {
  const [msgs, setMsgs] = useState([{ role: 'ai', text: '🙏 Namaste! Main hoon KaushalAR AI Mentor.\n\nElectrician, Plumber, Welder — kisi bhi trade ke baare mein Hindi mein poochho!' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const QUICK = ['Wire kyon jalti hai?', 'Earthing kya hai?', 'MCB kya hota hai?', 'Short circuit se bachein?', 'AC vs DC?', 'Pipe leak fix karo'];

  const send = async (text = input) => {
    if (!text.trim() || loading) return;
    setMsgs(m => [...m, { role: 'user', text: text.trim() }]);
    setInput(''); setLoading(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    if (apiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: 'Tu KaushalAR ka Hindi AI Mentor hai. ITI students ko Hindi mein practical skill training de. Short, clear jawab do. Safety warnings zaroori hain. 150 words se zyada nahi.' }] },
            contents: [{ role: 'user', parts: [{ text: text.trim() }] }],
            generationConfig: { maxOutputTokens: 250 },
          }),
        });
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Maafi — dobara poochho.';
        setMsgs(m => [...m, { role: 'ai', text: reply }]);
      } catch {
        setMsgs(m => [...m, { role: 'ai', text: '⚠️ Network error. Internet check karo.' }]);
      }
    } else {
      await new Promise(r => setTimeout(r, 900));
      const key = Object.keys(DEMO_REPLIES).find(k => text.toLowerCase().includes(k));
      const reply = key ? DEMO_REPLIES[key] : '💡 Demo mode mein hoon. ⚙️ se Gemini API key lagao real AI ke liye!\n\nAbhi quick buttons try karo ⬆️';
      setMsgs(m => [...m, { role: 'ai', text: reply }]);
    }
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={st.aiHeader}>
        <View style={st.aiDot} />
        <View style={{ flex: 1 }}>
          <Text style={st.aiTitle}>KaushalAR Hindi AI</Text>
          <Text style={st.aiSub}>{apiKey ? '✓ Live Mode' : 'Demo Mode — ⚙️ se key lagao'}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowKey(v => !v)}><Text style={{ fontSize: 22 }}>⚙️</Text></TouchableOpacity>
      </View>

      {showKey && (
        <View style={st.keyBox}>
          <Text style={st.keyTitle}>🔑 Gemini API Key — aistudio.google.com se free lo</Text>
          <View style={st.keyRow}>
            <TextInput style={st.keyInput} placeholder="AIza... paste karo" placeholderTextColor={C.muted} value={apiKey} onChangeText={setApiKey} secureTextEntry />
            <TouchableOpacity style={st.keySave} onPress={() => setShowKey(false)}><Text style={{ color: '#000', fontWeight: '700' }}>Save</Text></TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.quickScroll} contentContainerStyle={{ gap: 8, paddingHorizontal: 12, alignItems: 'center' }}>
        {QUICK.map((q, i) => <TouchableOpacity key={i} style={st.quickBtn} onPress={() => send(q)}><Text style={st.quickBtnTxt}>{q}</Text></TouchableOpacity>)}
      </ScrollView>

      <ScrollView ref={scrollRef} style={st.chatArea} contentContainerStyle={{ padding: 14, gap: 12 }}>
        {msgs.map((m, i) => (
          <View key={i} style={[st.msgRow, m.role === 'user' && { justifyContent: 'flex-end' }]}>
            {m.role === 'ai' && <Text style={{ fontSize: 20 }}>🤖</Text>}
            <View style={[st.bubble, m.role === 'user' ? st.bubbleUser : st.bubbleAI]}>
              {m.role === 'ai' && <Text style={st.bubbleLbl}>KAUSHAL AI</Text>}
              <Text style={st.bubbleTxt}>{m.text}</Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={st.msgRow}>
            <Text style={{ fontSize: 20 }}>🤖</Text>
            <View style={[st.bubble, st.bubbleAI]}><Text style={st.bubbleLbl}>KAUSHAL AI</Text><Text style={st.bubbleTxt}>Soch raha hoon... ⏳</Text></View>
          </View>
        )}
      </ScrollView>

      <View style={st.inputRow}>
        <TextInput style={st.chatInput} placeholder="Hindi ya English mein poochho..." placeholderTextColor={C.muted} value={input} onChangeText={setInput} onSubmitEditing={() => send()} returnKeyType="send" />
        <TouchableOpacity style={[st.sendBtn, (!input.trim() || loading) && { opacity: 0.4 }]} onPress={() => send()} disabled={!input.trim() || loading}>
          <Text style={st.sendBtnTxt}>भेजो</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── CERTIFICATE ─────────────────────────────────────────────
function CertScreen({ points, completed }: any) {
  const [name, setName] = useState('');
  const [trade, setTrade] = useState(TRADES[0]);
  const [cert, setCert] = useState<any>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const generate = async () => {
    if (!name.trim()) { Alert.alert('Naam chahiye!', 'Apna naam likho pehle.'); return; }
    await AsyncStorage.setItem('name', name.trim());
    const id = 'CERT/KAR/2025/' + Math.floor(10000 + Math.random() * 90000);
    const date = new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    setCert({ name: name.trim(), trade, id, date });
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  };

  const share = async () => {
    if (!cert) return;
    await Share.share({ message: `🏆 KaushalAR Certificate\n\n${cert.name} ne ${cert.trade.name} mein qualification haasil ki!\nID: ${cert.id}\n#KaushalAR #SkillIndia` });
  };

  return (
    <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 20 }}>
        <Text style={st.sectionTitle}>🏆 Certificate Generator</Text>
        <View style={st.pointsBox}>
          <Text style={st.pointsNum}>{points}</Text>
          <Text style={st.pointsLbl}>Total Points • {completed.length} Trades Done</Text>
        </View>
        <Text style={st.label}>Tumhara Naam *</Text>
        <TextInput style={st.textInput} placeholder="Apna poora naam likho" placeholderTextColor={C.muted} value={name} onChangeText={setName} />
        <Text style={st.label}>Trade Select Karo</Text>
        {TRADES.map(t => (
          <TouchableOpacity key={t.id} style={[st.tradeOpt, trade.id === t.id && st.tradeOptActive]} onPress={() => setTrade(t)}>
            <Text style={{ fontSize: 20 }}>{t.emoji}</Text>
            <Text style={[st.tradeOptTxt, trade.id === t.id && { color: C.saffron }]}>{t.name}</Text>
            {trade.id === t.id && <Text style={{ color: C.saffron, fontWeight: '700' }}>✓</Text>}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={st.genBtn} onPress={generate}>
          <Text style={st.genBtnTxt}>✓ Certificate Generate Karo</Text>
        </TouchableOpacity>

        {cert && (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={st.cert}>
              <View style={st.certBar} />
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={st.certLogo}>Kaushal<Text style={{ color: C.saffron }}>AR</Text></Text>
                <Text style={st.certAuth}>SKILL CERTIFICATION AUTHORITY</Text>
                <Text style={st.certDiv}>— ✦ —</Text>
                <Text style={st.certPresents}>यह प्रमाणित करता है कि</Text>
                <Text style={st.certName}>{cert.name}</Text>
                <Text style={st.certBody}>ने सफलतापूर्वक पूरा किया है</Text>
                <Text style={st.certTrade}>{cert.trade.emoji} {cert.trade.name}</Text>
                <Text style={st.certSmall}>NSDC standards ke anusaar verified</Text>
                <View style={st.certLine} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                  <View><Text style={st.certId}>{cert.id}</Text><Text style={st.certId}>{cert.date}</Text></View>
                  <View style={st.verBadge}><Text style={st.verTxt}>✓ VERIFIED</Text></View>
                </View>
              </View>
              <View style={[st.certBar, { backgroundColor: C.green }]} />
            </View>
            <TouchableOpacity style={st.shareBtn} onPress={share}>
              <Text style={st.shareBtnTxt}>📤 Share Certificate</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────
function ProfileScreen({ points, streak, completed, userName, onSaveName }: any) {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const getLevel = (p: number) => p < 100 ? { n: 'Shagird', h: 'शागिर्द', c: C.muted } : p < 300 ? { n: 'Kaarigar', h: 'कारीगर', c: C.blue } : p < 600 ? { n: 'Ustaad', h: 'उस्ताद', c: C.saffron } : { n: 'Master', h: 'महारथी', c: C.green };
  const lv = getLevel(points);
  const BADGES = [
    { emoji: '🌱', name: 'Pehla Kadam', earned: true },
    { emoji: '⚡', name: 'Bijliwala', earned: completed.includes('electrician') },
    { emoji: '🔧', name: 'Nalwala', earned: completed.includes('plumber') },
    { emoji: '🔥', name: 'Aagwala', earned: completed.includes('welder') },
    { emoji: '❄️', name: 'Thandawala', earned: completed.includes('hvac') },
    { emoji: '💯', name: 'Centurion', earned: points >= 100 },
    { emoji: '🔥🔥🔥', name: '3 Din Streak', earned: streak >= 3 },
    { emoji: '👑', name: 'Ustaad', earned: completed.length >= 4 },
  ];
  return (
    <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
      <View style={st.profHead}>
        <View style={st.profAvatar}><Text style={st.profAvatarTxt}>{userName.charAt(0).toUpperCase()}</Text></View>
        {editing ? (
          <View style={st.editRow}>
            <TextInput style={st.editInput} value={tempName} onChangeText={setTempName} autoFocus />
            <TouchableOpacity style={st.editSave} onPress={() => { onSaveName(tempName); setEditing(false); }}><Text style={{ color: '#000', fontWeight: '700' }}>Save</Text></TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setEditing(true)}><Text style={st.profName}>{userName} ✏️</Text></TouchableOpacity>
        )}
        <Text style={[st.profLevel, { color: lv.c }]}>{lv.h} ({lv.n})</Text>
      </View>
      <View style={st.statsRow}>
        {[{ n: points, l: 'Points' }, { n: `${streak}🔥`, l: 'Streak' }, { n: completed.length, l: 'Trades' }, { n: BADGES.filter(b => b.earned).length, l: 'Badges' }].map((s, i) => (
          <View key={i} style={st.statBox}><Text style={[st.statNum, { color: C.saffron }]}>{s.n}</Text><Text style={st.statLbl2}>{s.l}</Text></View>
        ))}
      </View>
      <View style={{ padding: 20 }}>
        <Text style={st.sectionTitle}>Badges 🏅</Text>
        <View style={st.badgeGrid}>
          {BADGES.map((b, i) => (
            <View key={i} style={[st.badge, !b.earned && { opacity: 0.35 }]}>
              <Text style={{ fontSize: 28 }}>{b.emoji}</Text>
              <Text style={st.badgeName}>{b.name}</Text>
              {!b.earned && <Text style={st.badgeLock}>🔒</Text>}
            </View>
          ))}
        </View>
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.deep },
  content: { flex: 1 },
  scroll: { flex: 1 },
  tabBar: { flexDirection: 'row', backgroundColor: '#0A0F1E', borderTopWidth: 1, borderTopColor: 'rgba(232,101,10,0.2)', paddingBottom: Platform.OS === 'ios' ? 20 : 8, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center' },
  tabActive: {},
  tabEmoji: { fontSize: 20 },
  tabLbl: { fontSize: 10, color: C.muted, fontWeight: '600', marginTop: 2 },

  homeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  greeting: { color: C.muted, fontSize: 13 },
  userName: { color: C.white, fontSize: 24, fontWeight: '700' },
  level: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  streakBox: { backgroundColor: 'rgba(232,101,10,0.12)', borderWidth: 1, borderColor: C.saffron, borderRadius: 12, padding: 12, alignItems: 'center', minWidth: 64 },
  streakNum: { color: C.saffron, fontSize: 20, fontWeight: '700' },
  streakLbl: { color: C.muted, fontSize: 10 },
  statsRow: { flexDirection: 'row', margin: 16, backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statNum: { color: C.saffron, fontSize: 22, fontWeight: '700' },
  statLbl2: { color: C.muted, fontSize: 10, marginTop: 2 },
  sectionTitle: { color: C.white, fontSize: 18, fontWeight: '700', paddingHorizontal: 16, marginBottom: 14 },
  tradeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, marginBottom: 20 },
  tradeCard: { width: (width - 44) / 2, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14 },
  tradeEmoji: { fontSize: 28, marginBottom: 6 },
  tradeName: { color: C.white, fontSize: 15, fontWeight: '700' },
  tradeHindi: { color: C.muted, fontSize: 11, marginBottom: 6 },
  tradeSteps: { fontSize: 10, fontWeight: '600' },
  doneBadge: { color: C.green, fontSize: 11, fontWeight: '700', marginTop: 6 },
  tipBox: { margin: 16, backgroundColor: 'rgba(232,101,10,0.07)', borderWidth: 1, borderColor: 'rgba(232,101,10,0.25)', borderRadius: 10, padding: 16 },
  tipTitle: { color: C.saffron, fontSize: 14, fontWeight: '700', marginBottom: 6 },
  tipText: { color: C.muted, fontSize: 12, lineHeight: 18 },

  // AR Camera styles
  cameraLaunchBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, margin: 14, backgroundColor: C.card, borderWidth: 1.5, borderRadius: 14, padding: 18 },
  cameraLaunchEmoji: { fontSize: 36 },
  cameraLaunchTitle: { fontSize: 16, fontWeight: '700' },
  cameraLaunchSub: { color: C.muted, fontSize: 11, marginTop: 2 },
  arCornerTL: { position: 'absolute', top: 40, left: 20, width: 28, height: 28, borderTopWidth: 3, borderLeftWidth: 3, borderColor: C.saffron },
  arCornerTR: { position: 'absolute', top: 40, right: 20, width: 28, height: 28, borderTopWidth: 3, borderRightWidth: 3, borderColor: C.saffron },
  arCornerBL: { position: 'absolute', bottom: 300, left: 20, width: 28, height: 28, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: C.saffron },
  arCornerBR: { position: 'absolute', bottom: 300, right: 20, width: 28, height: 28, borderBottomWidth: 3, borderRightWidth: 3, borderColor: C.saffron },
  arCenterWrap: { position: 'absolute', top: '25%', left: '50%', marginLeft: -40, marginTop: -40, width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  arRingLarge: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 3 },
  arDotLarge: { width: 16, height: 16, borderRadius: 8 },
  arCard: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(8,12,24,0.94)', borderTopWidth: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  arCardBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, marginBottom: 8 },
  arCardBadgeTxt: { color: '#000', fontSize: 11, fontWeight: '700' },
  arCardTitle: { color: C.white, fontSize: 18, fontWeight: '700', marginBottom: 2 },
  arCardHindi: { color: C.muted, fontSize: 12, marginBottom: 8 },
  arCardInstr: { color: C.text, fontSize: 13, lineHeight: 20, marginBottom: 8 },
  arCardTip: { backgroundColor: 'rgba(232,101,10,0.08)', borderLeftWidth: 3, borderLeftColor: C.saffron, padding: 8, borderRadius: 4, marginBottom: 12 },
  arCardTipTxt: { color: C.muted, fontSize: 12 },
  arProgBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 12 },
  arProgFill: { height: 4, borderRadius: 2 },
  arNavRow: { flexDirection: 'row', gap: 10 },
  arNavBtn: { flex: 1, backgroundColor: C.card2, borderRadius: 10, padding: 12, alignItems: 'center' },
  arNavTxt: { color: C.text, fontSize: 14, fontWeight: '600' },
  arNextBtn: { flex: 2, borderRadius: 10, padding: 12, alignItems: 'center' },
  arNextTxt: { color: '#000', fontSize: 14, fontWeight: '700' },
  arTopRow: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
  arTopBtn: { backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  arTopBtnTxt: { color: C.white, fontSize: 13, fontWeight: '600' },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  liveTxt: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },

  tradeTabs: { maxHeight: 50, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  tradeTab: { paddingHorizontal: 14, paddingVertical: 14 },
  tradeTabActive: { borderBottomWidth: 2, borderBottomColor: C.saffron },
  progRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 8 },
  progBg: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2 },
  progFill: { height: 4, borderRadius: 2 },
  progTxt: { color: C.muted, fontSize: 11 },
  stepCard: { flex: 1, margin: 12, marginTop: 0, backgroundColor: C.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border },
  stepBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, marginBottom: 10 },
  stepBadgeTxt: { color: '#000', fontSize: 11, fontWeight: '700' },
  stepTitle: { color: C.white, fontSize: 18, fontWeight: '700', marginBottom: 2 },
  stepHindi: { color: C.muted, fontSize: 12, marginBottom: 10 },
  stepInstr: { color: C.text, fontSize: 13, lineHeight: 21, marginBottom: 10 },
  tipCard: { backgroundColor: 'rgba(232,101,10,0.07)', borderLeftWidth: 3, borderLeftColor: C.saffron, borderRadius: 4, padding: 10 },
  tipCardTxt: { color: C.muted, fontSize: 12, lineHeight: 18 },
  navRow: { flexDirection: 'row', gap: 10, padding: 12, paddingTop: 0 },
  navBtn: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, alignItems: 'center' },
  navBtnTxt: { color: C.text, fontSize: 14, fontWeight: '600' },
  nextBtn: { flex: 2, borderRadius: 10, padding: 14, alignItems: 'center' },
  nextBtnTxt: { color: '#000', fontSize: 14, fontWeight: '700' },
  doneView: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  doneTitle: { color: C.white, fontSize: 28, fontWeight: '700', marginTop: 12 },
  doneSub: { color: C.muted, fontSize: 14, marginTop: 4, marginBottom: 24 },
  donePoints: { backgroundColor: 'rgba(0,201,138,0.1)', borderWidth: 1, borderColor: C.green, borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 24 },
  doneNum: { color: C.green, fontSize: 44, fontWeight: '700' },
  doneLbl: { color: C.muted, fontSize: 13 },
  doneBtn: { backgroundColor: C.saffron, borderRadius: 12, padding: 16, width: '100%', alignItems: 'center' },
  doneBtnT: { color: '#000', fontSize: 16, fontWeight: '700' },

  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  aiDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.green },
  aiTitle: { color: C.green, fontSize: 15, fontWeight: '700' },
  aiSub: { color: C.muted, fontSize: 11 },
  keyBox: { backgroundColor: C.card2, padding: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  keyTitle: { color: C.saffron, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  keyRow: { flexDirection: 'row', gap: 8 },
  keyInput: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 10, color: C.text, fontSize: 12 },
  keySave: { backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  quickScroll: { maxHeight: 46, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  quickBtn: { backgroundColor: 'rgba(232,101,10,0.08)', borderWidth: 1, borderColor: 'rgba(232,101,10,0.22)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  quickBtnTxt: { color: C.saffron, fontSize: 11, fontWeight: '600' },
  chatArea: { flex: 1 },
  msgRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  bubble: { maxWidth: '78%', borderRadius: 14, padding: 12 },
  bubbleAI: { backgroundColor: C.card, borderWidth: 1, borderColor: 'rgba(0,201,138,0.18)', borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: 'rgba(232,101,10,0.15)', borderWidth: 1, borderColor: 'rgba(232,101,10,0.25)', borderBottomRightRadius: 4 },
  bubbleLbl: { color: C.green, fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  bubbleTxt: { color: C.text, fontSize: 13, lineHeight: 20 },
  inputRow: { flexDirection: 'row', gap: 10, padding: 12, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border },
  chatInput: { flex: 1, backgroundColor: C.card2, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 12, color: C.text, fontSize: 13 },
  sendBtn: { backgroundColor: C.saffron, borderRadius: 12, paddingHorizontal: 18, justifyContent: 'center' },
  sendBtnTxt: { color: '#000', fontWeight: '700', fontSize: 14 },

  pointsBox: { backgroundColor: 'rgba(0,201,138,0.08)', borderWidth: 1, borderColor: 'rgba(0,201,138,0.25)', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 16 },
  pointsNum: { color: C.green, fontSize: 44, fontWeight: '700' },
  pointsLbl: { color: C.green, fontSize: 13, fontWeight: '600' },
  label: { color: C.text, fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  textInput: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, color: C.white, fontSize: 15, marginBottom: 4 },
  tradeOpt: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, marginBottom: 8 },
  tradeOptActive: { borderColor: C.saffron, backgroundColor: 'rgba(232,101,10,0.06)' },
  tradeOptTxt: { flex: 1, color: C.text, fontSize: 13, fontWeight: '600' },
  genBtn: { backgroundColor: C.saffron, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  genBtnTxt: { color: '#000', fontSize: 15, fontWeight: '700' },
  cert: { backgroundColor: C.card, borderWidth: 1.5, borderColor: C.saffron, borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  certBar: { height: 5, backgroundColor: C.saffron },
  certLogo: { fontSize: 24, fontWeight: '700', color: C.white, marginBottom: 2 },
  certAuth: { color: C.muted, fontSize: 10, letterSpacing: 2, marginBottom: 12 },
  certDiv: { color: C.saffron, fontSize: 14, marginBottom: 12 },
  certPresents: { color: C.muted, fontSize: 12, marginBottom: 4 },
  certName: { color: C.white, fontSize: 26, fontWeight: '700', marginBottom: 6 },
  certBody: { color: C.muted, fontSize: 12, marginBottom: 8 },
  certTrade: { color: C.green, fontSize: 17, fontWeight: '700', marginBottom: 8 },
  certSmall: { color: C.muted, fontSize: 10, textAlign: 'center', marginBottom: 16 },
  certLine: { height: 1, backgroundColor: C.border, width: '100%', marginBottom: 14 },
  certId: { color: C.muted, fontSize: 10, letterSpacing: 1 },
  verBadge: { backgroundColor: 'rgba(0,201,138,0.1)', borderWidth: 1, borderColor: 'rgba(0,201,138,0.3)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, justifyContent: 'center' },
  verTxt: { color: C.green, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  shareBtn: { backgroundColor: C.saffron, borderRadius: 12, padding: 14, alignItems: 'center' },
  shareBtnTxt: { color: '#000', fontSize: 14, fontWeight: '700' },

  profHead: { alignItems: 'center', padding: 28, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  profAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(232,101,10,0.15)', borderWidth: 2, borderColor: C.saffron, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profAvatarTxt: { color: C.saffron, fontSize: 36, fontWeight: '700' },
  profName: { color: C.white, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  profLevel: { fontSize: 13, fontWeight: '600', marginTop: 6 },
  editRow: { flexDirection: 'row', gap: 8, alignItems: 'center', width: '80%' },
  editInput: { flex: 1, backgroundColor: C.card2, borderWidth: 1, borderColor: C.saffron, borderRadius: 8, padding: 10, color: C.white, fontSize: 15 },
  editSave: { backgroundColor: C.saffron, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badge: { width: (width - 52) / 2, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, alignItems: 'center', position: 'relative' },
  badgeName: { color: C.white, fontSize: 12, fontWeight: '700', marginTop: 6, textAlign: 'center' },
  badgeLock: { position: 'absolute', top: 8, right: 8, fontSize: 12 },
});
