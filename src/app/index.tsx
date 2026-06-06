import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated, Dimensions, KeyboardAvoidingView,
  Platform, Alert, Share, StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// GitHub Premium Dark Theme
const C = {
  bg:       '#0D1117',   // github main bg
  canvas:   '#010409',   // darkest bg
  card:     '#161B22',   // github card
  card2:    '#1C2128',   // slightly lighter
  card3:    '#21262D',   // border-level card
  border:   '#30363D',   // github border
  borderL:  '#21262D',
  green:    '#3FB950',   // github green
  greenD:   '#238636',   // github green dark
  greenBg:  'rgba(63,185,80,0.1)',
  blue:     '#58A6FF',   // github blue
  blueBg:   'rgba(88,166,255,0.1)',
  purple:   '#BC8CFF',   // github purple
  orange:   '#E3B341',   // github yellow/orange
  red:      '#F85149',
  white:    '#E6EDF3',   // github primary text
  text:     '#CDD9E5',   // secondary text
  muted:    '#768390',   // muted text
  subtle:   '#636E7B',
  glow:     'rgba(63,185,80,0.06)',
  glowB:    'rgba(88,166,255,0.06)',
};

const TRADES = [
  { id: 'electrician', name: 'Electrician', hindi: 'बिजली मिस्त्री', emoji: '⚡', color: C.orange, points: 50,
    steps: [
      { title: 'Main Switch Band Karo', hindi: 'मुख्य स्विच बंद करें', instruction: 'Safety ke liye sabse pehle main MCB switch OFF karo. Tester se check karo ki current nahi hai.', tip: '⚠️ Kabhi bhi live wire mat chhuao!' },
      { title: 'Wire Identify Karo', hindi: 'तार पहचानो', instruction: '🔴 Phase (Red/Brown)\n🔵 Neutral (Black/Blue)\n🟢 Earth (Green/Yellow)', tip: '💡 Phase wire pehle disconnect karo.' },
      { title: 'Wire Strip Karo', hindi: 'तार छीलो', instruction: 'Wire stripper se exactly 2cm insulation hatao. Zyada mat hatao warna short circuit!', tip: '✂️ Wire stripper use karo — knife se nahi.' },
      { title: 'Connection Lagao', hindi: 'कनेक्शन जोड़ो', instruction: 'Terminal mein wire daalo aur screw tight karo. Loose connection = fire hazard!', tip: '🔧 Screwdriver se tight karo.' },
      { title: 'Test Karo', hindi: 'जांच करें', instruction: 'MCB ON karo. Voltage tester se check karo. Agar MCB trip kare toh connection galat hai.', tip: '✅ Direct touch nahi — tester use karo!' },
    ],
  },
  { id: 'plumber', name: 'Plumber', hindi: 'नल मिस्त्री', emoji: '🔧', color: C.blue, points: 50,
    steps: [
      { title: 'Water Band Karo', hindi: 'पानी बंद करें', instruction: 'Main water valve clockwise ghuma ke band karo. Tap kholo taaki bacha paani nikal jaaye.', tip: '⚠️ Pehle water band — warna flood!' },
      { title: 'Purani Pipe Hatao', hindi: 'पुरानी पाइप हटाएं', instruction: 'Wrench se fitting loose karo. Purani pipe ke edges check karo.', tip: '💧 Towel rakho — thoda paani girega.' },
      { title: 'Nai Pipe Measure Karo', hindi: 'नई पाइप नापें', instruction: 'Tape measure se exactly napo. Thoda extra rakho — baad mein kaat sakte ho.', tip: '📏 Measure twice, cut once!' },
      { title: 'Thread Tape Lagao', hindi: 'थ्रेड टेप लगाएं', instruction: 'PTFE tape ko 3-4 rounds clockwise wrap karo pipe thread pe.', tip: '🔄 Hamesha clockwise wrap karo!' },
      { title: 'Fit karo aur Test Karo', hindi: 'लगाएं और जांचें', instruction: 'Haath se tight karo phir wrench se quarter turn. Water on karo — leak check karo.', tip: '✅ Zyada tight mat karo — pipe crack!' },
    ],
  },
  { id: 'welder', name: 'Welder', hindi: 'वेल्डर', emoji: '🔥', color: C.red, points: 60,
    steps: [
      { title: 'Safety Gear Pahno', hindi: 'सुरक्षा उपकरण पहनें', instruction: 'Welding helmet, leather gloves, leather apron aur safety shoes — sab mandatory hai!', tip: '🛡️ UV rays aankhon ko damage karti hain!' },
      { title: 'Metal Clean Karo', hindi: 'धातु साफ करें', instruction: 'Wire brush se rust aur dirt hatao. Clean surface pe hi achhi weld hoti hai.', tip: '🔧 Greasy surface pe weld weak hogi.' },
      { title: 'Machine Set Karo', hindi: 'मशीन सेट करें', instruction: '3mm MS plate ke liye:\n⚡ 90-120 Ampere\n🔌 Electrode: E6013 3.15mm', tip: '⚡ Zyada ampere = burn through!' },
      { title: 'Arc Strike Karo', hindi: 'चाप शुरू करें', instruction: 'Electrode ko metal pe tap karke arc shuru karo. 3mm distance rakho. Steady speed se chalo.', tip: '🔥 Consistent speed = uniform bead.' },
      { title: 'Quality Check Karo', hindi: 'गुणवत्ता जांचें', instruction: '5 min cool hone do. Chipping hammer se slag hatao. Holes ya cracks check karo.', tip: '✅ Good weld: uniform, shiny, no holes.' },
    ],
  },
  { id: 'hvac', name: 'HVAC Tech', hindi: 'AC तकनीशियन', emoji: '❄️', color: C.purple, points: 60,
    steps: [
      { title: 'AC Band Karo', hindi: 'AC बंद करें', instruction: 'Main power switch band karo aur plug nikalo. Capacitor discharge ke liye 5 min wait karo.', tip: '⚠️ Live AC mat chhuao kabhi!' },
      { title: 'Filter Saaf Karo', hindi: 'फ़िल्टर साफ करें', instruction: 'Indoor unit ka front panel kholo. Filter nikalo aur paani se saaf karo.', tip: '💧 Wet filter mat lagao wapas.' },
      { title: 'Coil Check Karo', hindi: 'कॉइल जांचें', instruction: 'Evaporator coil pe dust check karo. Coil cleaner spray karo. 10 min wait karo.', tip: '🌡️ Dirty coil = high electricity bill.' },
      { title: 'Gas Pressure Check', hindi: 'गैस प्रेशर जांचें', instruction: 'Manifold gauge se refrigerant pressure check karo. R32: 8-10 bar (cooling mode).', tip: '❄️ Low pressure = gas leak — specialist bulao.' },
      { title: 'Test Run Karo', hindi: 'परीक्षण चलाएं', instruction: 'AC on karo. 15 min baad outlet temperature check karo. 8-12°C difference normal hai.', tip: '✅ Agar cooling nahi = gas refill karo.' },
    ],
  },
];

const DEMO_REPLIES: Record<string, string> = {
  'wire': '⚡ Wire isliye jalti hai:\n\n1. Galat gauge — patli wire pe zyada current\n2. Loose connection — resistance → heat\n3. Overloading — bahut saare appliances\n\n✅ Solution: Sahi AWG wire, MCB lagao!',
  'earthing': '🌍 Earthing ek safety system hai!\n\n• Wire zameen mein gadi jaati hai\n• Fault aane pe current zameen mein jaati hai\n• Aapko shock nahi lagta\n\n⚠️ Bina earthing ke ghar dangerous!',
  'mcb': '🔌 MCB = Miniature Circuit Breaker\n\nYeh tumhara electric guardian hai:\n1. Overload pe automatic trip\n2. Short circuit pe instant off\n3. Reset kar sakte ho!\n\n✅ Har ghar mein MCB zaroori!',
  'short': '⚠️ Short circuit se bachne ke liye:\n\n1. MCB lagao\n2. Sahi gauge wire use karo\n3. Loose connections fix karo\n4. Purani wire replace karo\n\n🔴 Switch band karke kaam karo!',
  'ac': '🔋 AC vs DC:\n\nAC: Ghar ki bijli, 230V India\nDC: Battery, mobile charger\n\nCharger AC→DC convert karta hai!\n✅ Socket=AC, Battery=DC',
  'leak': '🔧 Pipe leak fix:\n\n1. Main valve band karo\n2. PTFE thread tape lagao\n3. 30 min set hone do\n4. Test karo\n\n💧 Badi leak = plumber bulao!',
  'weld': '🔥 3mm plate welding:\n\n• Ampere: 90-120A\n• Electrode: E6013\n• Gap: 3mm steady\n\n⚠️ Helmet zaroori!',
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

  const TABS = [
    { id: 'home', emoji: '⌂', label: 'Home' },
    { id: 'ar',   emoji: '◉', label: 'AR' },
    { id: 'ai',   emoji: '✦', label: 'AI' },
    { id: 'cert', emoji: '◈', label: 'Cert' },
    { id: 'profile', emoji: '◎', label: 'Me' },
  ];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.canvas} />
      <View style={s.content}>
        {screen === 'home'    && <HomeScreen points={points} streak={streak} completed={completed} userName={userName} onTrade={(t: any) => { setActiveTrade(t); setScreen('ar'); }} />}
        {screen === 'ar'      && <ARScreen trade={activeTrade} completed={completed} onComplete={addPoints} onChangeTrade={setActiveTrade} />}
        {screen === 'ai'      && <AIScreen />}
        {screen === 'cert'    && <CertScreen points={points} completed={completed} />}
        {screen === 'profile' && <ProfileScreen points={points} streak={streak} completed={completed} userName={userName} onSaveName={async (n: string) => { setUserName(n); await AsyncStorage.setItem('name', n); }} />}
      </View>
      <View style={s.tabBar}>
        {TABS.map(t => {
          const active = screen === t.id as Screen;
          return (
            <TouchableOpacity key={t.id} style={s.tab} onPress={() => setScreen(t.id as Screen)} activeOpacity={0.7}>
              <View style={[s.tabPill, active && s.tabPillActive]}>
                <Text style={[s.tabEmoji, active && s.tabEmojiActive]}>{t.emoji}</Text>
              </View>
              <Text style={[s.tabLbl, active && s.tabLblActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── HOME ────────────────────────────────────────────────────
function HomeScreen({ points, streak, completed, userName, onTrade }: any) {
  const getLevel = (p: number) => p < 100 ? { l: 'Beginner', e: '🌱', c: C.muted } : p < 300 ? { l: 'Intermediate', e: '⚒️', c: C.blue } : p < 600 ? { l: 'Advanced', e: '🎯', c: C.purple } : { l: 'Expert', e: '👑', c: C.green };
  const lv = getLevel(points);
  const lvProg = Math.min((points / 600) * 100, 100);

  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.homeHead}>
        <View style={s.homeHeadTop}>
          <View>
            <Text style={s.homeGreet}>Good day 👋</Text>
            <Text style={s.homeName}>{userName}</Text>
          </View>
          <View style={s.streakPill}>
            <Text style={s.streakFire}>🔥</Text>
            <Text style={s.streakN}>{streak}</Text>
            <Text style={s.streakL}>streak</Text>
          </View>
        </View>

        {/* Level card */}
        <View style={s.levelCard}>
          <View style={s.levelCardTop}>
            <Text style={[s.levelName, { color: lv.c }]}>{lv.e} {lv.l}</Text>
            <Text style={s.levelPts}>{points} pts</Text>
          </View>
          <View style={s.levelProgBg}>
            <Animated.View style={[s.levelProgFill, { width: `${lvProg}%` as any, backgroundColor: lv.c }]} />
          </View>
          <Text style={s.levelSub}>{600 - points > 0 ? `${600 - points} pts more to Expert` : '🏆 Expert level reached!'}</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={s.statsRow}>
        {[
          { n: points,            l: 'Total Points', i: '⭐', c: C.orange },
          { n: completed.length,  l: 'Completed',    i: '✓',  c: C.green  },
          { n: streak,            l: 'Day Streak',   i: '🔥', c: C.red    },
        ].map((st, i) => (
          <View key={i} style={s.statCard}>
            <Text style={[s.statIcon, { color: st.c }]}>{st.i}</Text>
            <Text style={[s.statN, { color: st.c }]}>{st.n}</Text>
            <Text style={s.statL}>{st.l}</Text>
          </View>
        ))}
      </View>

      {/* Trades */}
      <View style={s.sec}>
        <View style={s.secHead}>
          <Text style={s.secTitle}>Trades</Text>
          <Text style={s.secBadge}>{completed.length}/{TRADES.length} done</Text>
        </View>
        {TRADES.map(t => {
          const done = completed.includes(t.id);
          return (
            <TouchableOpacity key={t.id} style={[s.tradeRow, done && s.tradeRowDone]} onPress={() => onTrade(t)} activeOpacity={0.75}>
              <View style={[s.tradeRowIcon, { backgroundColor: t.color + '15' }]}>
                <Text style={{ fontSize: 22 }}>{t.emoji}</Text>
              </View>
              <View style={s.tradeRowInfo}>
                <Text style={s.tradeRowName}>{t.name}</Text>
                <Text style={s.tradeRowHindi}>{t.hindi}</Text>
                <View style={s.tradeRowMeta}>
                  <View style={[s.metaPill, { backgroundColor: t.color + '15' }]}>
                    <Text style={[s.metaPillTxt, { color: t.color }]}>{t.steps.length} steps</Text>
                  </View>
                  <View style={[s.metaPill, { backgroundColor: t.color + '15' }]}>
                    <Text style={[s.metaPillTxt, { color: t.color }]}>+{t.points} pts</Text>
                  </View>
                </View>
              </View>
              <View style={s.tradeRowRight}>
                {done
                  ? <View style={s.donePill}><Text style={s.donePillTxt}>✓ Done</Text></View>
                  : <Text style={[s.tradeArrow, { color: t.color }]}>›</Text>
                }
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tip */}
      <View style={s.sec}>
        <View style={s.tipBox}>
          <View style={s.tipBoxHead}>
            <View style={s.tipDot} />
            <Text style={s.tipBoxTitle}>Safety Tip</Text>
          </View>
          <Text style={s.tipBoxBody}>Bijli ka kaam karte waqt HAMESHA main switch band karo. Wet hands se switch kabhi mat chhuao. Jaan ki keemat sabse zyada hai.</Text>
        </View>
      </View>
      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

// ─── AR SCREEN ───────────────────────────────────────────────
function ARScreen({ trade, completed, onComplete, onChangeTrade }: any) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setStep(0); setDone(false);
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.4, duration: 1100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 1100, useNativeDriver: true }),
    ])).start();
  }, [trade]);

  const goNext = async () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.3, duration: 80, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    if (step < trade.steps.length - 1) { setStep(s => s + 1); }
    else { await onComplete(trade.points, trade.id); setDone(true); setCamActive(false); }
  };

  const openCam = async () => {
    if (!permission?.granted) {
      const r = await requestPermission();
      if (!r.granted) { Alert.alert('Camera Permission', 'Settings mein camera allow karo.'); return; }
    }
    setCamActive(true);
  };

  if (done) return (
    <View style={s.doneView}>
      <Text style={s.doneBigEmoji}>🎉</Text>
      <Text style={s.doneHeading}>Module Complete!</Text>
      <Text style={s.doneSub}>{trade.emoji} {trade.name} — well done!</Text>
      <View style={s.donePointsBox}>
        <Text style={s.donePointsN}>+{trade.points}</Text>
        <Text style={s.donePointsL}>points earned</Text>
      </View>
      <TouchableOpacity style={s.doneBackBtn} onPress={() => { setDone(false); setStep(0); }}>
        <Text style={s.doneBackTxt}>← Back to AR</Text>
      </TouchableOpacity>
    </View>
  );

  const st = trade.steps[step];
  const prog = ((step + 1) / trade.steps.length) * 100;

  if (camActive) return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView style={StyleSheet.absoluteFill} facing={facing} />
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Corner brackets */}
        {[s.cTL, s.cTR, s.cBL, s.cBR].map((cs, i) => <View key={i} style={[s.corner, cs, { borderColor: trade.color }]} />)}
        {/* Ring */}
        <View style={s.ringWrap}>
          <Animated.View style={[s.ringO, { borderColor: trade.color, transform: [{ scale: pulseAnim }] }]} />
          <View style={[s.ringD, { backgroundColor: trade.color }]} />
        </View>
        {/* Step card */}
        <View style={s.camCard}>
          <View style={s.camCardBar}>
            <View style={[s.camStepBadge, { backgroundColor: trade.color }]}>
              <Text style={s.camStepBadgeTxt}>{step + 1} / {trade.steps.length}</Text>
            </View>
            <View style={s.camProgBg}><View style={[s.camProgFill, { width: `${prog}%` as any, backgroundColor: trade.color }]} /></View>
          </View>
          <Text style={s.camTitle}>{st.title}</Text>
          <Text style={s.camHindi}>{st.hindi}</Text>
          <Text style={s.camInstr}>{st.instruction}</Text>
          <View style={[s.camTip, { borderLeftColor: trade.color }]}><Text style={s.camTipTxt}>{st.tip}</Text></View>
          <View style={s.camNav}>
            <TouchableOpacity style={s.camPrevBtn} onPress={() => step > 0 && setStep(s => s - 1)} disabled={step === 0}>
              <Text style={[s.camPrevTxt, step === 0 && { opacity: 0.25 }]}>← Pichla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.camNextBtn, { backgroundColor: trade.color }]} onPress={goNext}>
              <Text style={s.camNextTxt}>{step === trade.steps.length - 1 ? '✓ Complete' : 'Agla →'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Top controls */}
        <View style={s.camTop}>
          <TouchableOpacity style={s.camTopBtn} onPress={() => setCamActive(false)}>
            <Text style={s.camTopBtnTxt}>✕ Close</Text>
          </TouchableOpacity>
          <View style={[s.camLive, { borderColor: trade.color }]}>
            <View style={[s.camLiveDot, { backgroundColor: trade.color }]} />
            <Text style={[s.camLiveTxt, { color: trade.color }]}>AR LIVE</Text>
          </View>
          <TouchableOpacity style={s.camTopBtn} onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}>
            <Text style={s.camTopBtnTxt}>⟳ Flip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Trade tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tradeTabs} contentContainerStyle={{ paddingHorizontal: 14, gap: 8, alignItems: 'center' }}>
        {TRADES.map(t => (
          <TouchableOpacity key={t.id} style={[s.tradeTabChip, trade.id === t.id && { backgroundColor: t.color + '18', borderColor: t.color + '50' }]} onPress={() => { onChangeTrade(t); setStep(0); }}>
            <Text style={{ fontSize: 14 }}>{t.emoji}</Text>
            <Text style={[s.tradeTabTxt, trade.id === t.id && { color: t.color }]}>{t.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Camera button */}
      <TouchableOpacity style={s.camLaunchBtn} onPress={openCam} activeOpacity={0.8}>
        <View style={s.camLaunchLeft}>
          <View style={s.camLaunchIcon}><Text style={{ fontSize: 20 }}>📷</Text></View>
          <View>
            <Text style={s.camLaunchTitle}>Open AR Camera</Text>
            <Text style={s.camLaunchSub}>Live camera pe steps dekhne ke liye tap karo</Text>
          </View>
        </View>
        <Text style={{ color: C.muted, fontSize: 18 }}>›</Text>
      </TouchableOpacity>

      {/* Progress */}
      <View style={s.progWrap}>
        <View style={s.progBg}><View style={[s.progFill, { width: `${prog}%` as any, backgroundColor: trade.color }]} /></View>
        <Text style={[s.progTxt, { color: trade.color }]}>Step {step + 1}/{trade.steps.length}</Text>
      </View>

      {/* Step card */}
      <Animated.View style={[s.stepCard, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.stepTopRow}>
            <View style={[s.stepBadge, { backgroundColor: trade.color + '15', borderColor: trade.color + '40' }]}>
              <Text style={[s.stepBadgeTxt, { color: trade.color }]}>Step {step + 1}</Text>
            </View>
            <Text style={{ fontSize: 22 }}>{trade.emoji}</Text>
          </View>
          <Text style={s.stepTitle}>{st.title}</Text>
          <Text style={s.stepHindi}>{st.hindi}</Text>
          <Text style={s.stepInstr}>{st.instruction}</Text>
          <View style={[s.stepTip, { borderLeftColor: trade.color }]}>
            <Text style={s.stepTipTxt}>{st.tip}</Text>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Nav */}
      <View style={s.navRow}>
        <TouchableOpacity style={[s.navBack, step === 0 && { opacity: 0.3 }]} onPress={() => step > 0 && setStep(s => s - 1)} disabled={step === 0}>
          <Text style={s.navBackTxt}>← Pichla</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.navNext, { backgroundColor: trade.color }]} onPress={goNext}>
          <Text style={s.navNextTxt}>{step === trade.steps.length - 1 ? '✓ Complete' : 'Agla Step →'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── AI MENTOR ───────────────────────────────────────────────
function AIScreen() {
  const [msgs, setMsgs] = useState([{ role: 'ai', text: 'Namaste! Main hoon KaushalAR AI Mentor.\n\nElectrician, Plumber, Welder — kisi bhi trade ke baare mein Hindi mein poochho. Main hoon na! 🤖' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const QUICK = ['Wire kyon jalti hai?', 'Earthing kya hai?', 'MCB kya hai?', 'Short circuit?', 'AC vs DC?', 'Pipe leak fix?'];

  const send = async (text = input) => {
    if (!text.trim() || loading) return;
    setMsgs(m => [...m, { role: 'user', text: text.trim() }]);
    setInput(''); setLoading(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    if (apiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: 'Tu KaushalAR ka Hindi AI Mentor hai. ITI students ko Hindi mein practical skill training de. Short clear jawab. Safety warnings zaroor. 150 words max.' }] },
            contents: [{ role: 'user', parts: [{ text: text.trim() }] }],
            generationConfig: { maxOutputTokens: 250 },
          }),
        });
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Maafi — dobara poochho.';
        setMsgs(m => [...m, { role: 'ai', text: reply }]);
      } catch { setMsgs(m => [...m, { role: 'ai', text: '⚠️ Network error. Internet check karo.' }]); }
    } else {
      await new Promise(r => setTimeout(r, 700));
      const key = Object.keys(DEMO_REPLIES).find(k => text.toLowerCase().includes(k));
      setMsgs(m => [...m, { role: 'ai', text: key ? DEMO_REPLIES[key] : '💡 Demo mode mein hoon. ⚙️ se Gemini API key lagao real AI ke liye!' }]);
    }
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.aiHead}>
        <View style={s.aiAvatarBox}><Text style={{ fontSize: 18 }}>✦</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.aiHeadName}>KaushalAR AI</Text>
          <View style={s.aiStatusRow}>
            <View style={[s.aiDot, { backgroundColor: apiKey ? C.green : C.muted }]} />
            <Text style={s.aiStatusTxt}>{apiKey ? 'Live · Gemini connected' : 'Demo mode'}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.aiSettBtn} onPress={() => setShowKey(v => !v)}>
          <Text style={{ color: C.muted, fontSize: 14 }}>⚙</Text>
        </TouchableOpacity>
      </View>

      {showKey && (
        <View style={s.keyPanel}>
          <Text style={s.keyPanelTitle}>API Key · aistudio.google.com</Text>
          <View style={s.keyRow}>
            <TextInput style={s.keyInput} placeholder="AIza..." placeholderTextColor={C.subtle} value={apiKey} onChangeText={setApiKey} secureTextEntry />
            <TouchableOpacity style={s.keySaveBtn} onPress={() => setShowKey(false)}><Text style={s.keySaveTxt}>Save</Text></TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.quickBar} contentContainerStyle={{ paddingHorizontal: 14, gap: 8, alignItems: 'center' }}>
        {QUICK.map((q, i) => (
          <TouchableOpacity key={i} style={s.quickChip} onPress={() => send(q)}>
            <Text style={s.quickChipTxt}>{q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView ref={scrollRef} style={s.chatArea} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {msgs.map((m, i) => (
          <View key={i} style={m.role === 'user' ? s.msgWrapUser : s.msgWrapAI}>
            {m.role === 'ai' && (
              <View style={s.aiMsgMeta}>
                <View style={s.aiMsgAvatar}><Text style={{ fontSize: 10, color: C.green }}>✦</Text></View>
                <Text style={s.aiMsgName}>KaushalAR AI</Text>
              </View>
            )}
            <View style={m.role === 'user' ? s.bubbleUser : s.bubbleAI}>
              <Text style={s.bubbleTxt}>{m.text}</Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={s.msgWrapAI}>
            <View style={s.aiMsgMeta}>
              <View style={s.aiMsgAvatar}><Text style={{ fontSize: 10, color: C.green }}>✦</Text></View>
              <Text style={s.aiMsgName}>KaushalAR AI</Text>
            </View>
            <View style={s.bubbleAI}><Text style={s.bubbleTxt}>Thinking... ⏳</Text></View>
          </View>
        )}
      </ScrollView>

      <View style={s.inputBar}>
        <TextInput style={s.inputField} placeholder="Hindi mein poochho..." placeholderTextColor={C.subtle} value={input} onChangeText={setInput} onSubmitEditing={() => send()} returnKeyType="send" multiline />
        <TouchableOpacity style={[s.sendBtn, (!input.trim() || loading) && { opacity: 0.35 }]} onPress={() => send()} disabled={!input.trim() || loading}>
          <Text style={s.sendBtnTxt}>↑</Text>
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
    if (!name.trim()) { Alert.alert('Name required', 'Apna naam likho pehle.'); return; }
    await AsyncStorage.setItem('name', name.trim());
    const id = 'KAR-' + Math.floor(10000 + Math.random() * 90000);
    const date = new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    setCert({ name: name.trim(), trade, id, date });
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
  };

  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.certPage}>
        <Text style={s.certPageTitle}>Certificate</Text>

        <View style={s.certStatBox}>
          <Text style={[s.certStatN, { color: C.green }]}>{points}</Text>
          <Text style={s.certStatL}>points earned · {completed.length} trades done</Text>
        </View>

        <Text style={s.formLbl}>Your Name</Text>
        <TextInput style={s.formInput} placeholder="Enter full name" placeholderTextColor={C.subtle} value={name} onChangeText={setName} />

        <Text style={s.formLbl}>Select Trade</Text>
        {TRADES.map(t => (
          <TouchableOpacity key={t.id} style={[s.tradeOptBtn, trade.id === t.id && { borderColor: t.color, backgroundColor: t.color + '08' }]} onPress={() => setTrade(t)}>
            <Text style={{ fontSize: 20 }}>{t.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.tradeOptName, trade.id === t.id && { color: t.color }]}>{t.name}</Text>
              <Text style={s.tradeOptHindi}>{t.hindi}</Text>
            </View>
            {trade.id === t.id && <Text style={[s.tradeOptCheck, { color: t.color }]}>✓</Text>}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={s.genBtn} onPress={generate}>
          <Text style={s.genBtnTxt}>Generate Certificate</Text>
        </TouchableOpacity>

        {cert && (
          <Animated.View style={[s.certCard, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[s.certCardTop, { backgroundColor: cert.trade.color + '18', borderBottomColor: cert.trade.color + '30' }]}>
              <Text style={s.certCardLogo}>KaushalAR</Text>
              <Text style={[s.certCardBadge, { color: cert.trade.color, borderColor: cert.trade.color + '40', backgroundColor: cert.trade.color + '10' }]}>
                VERIFIED ✓
              </Text>
            </View>
            <View style={s.certCardBody}>
              <Text style={s.certCardPresents}>This certifies that</Text>
              <Text style={s.certCardName}>{cert.name}</Text>
              <Text style={s.certCardCompleted}>has successfully completed</Text>
              <Text style={[s.certCardTrade, { color: cert.trade.color }]}>{cert.trade.emoji}  {cert.trade.name}</Text>
              <View style={s.certCardDivider} />
              <View style={s.certCardFoot}>
                <View>
                  <Text style={s.certCardId}>{cert.id}</Text>
                  <Text style={s.certCardDate}>{cert.date}</Text>
                </View>
                <View style={[s.nsdc, { borderColor: C.border }]}>
                  <Text style={s.nsdcTxt}>NSDC</Text>
                  <Text style={s.nsdcSub}>Aligned</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={[s.shareBtn, { backgroundColor: cert.trade.color }]} onPress={async () => await Share.share({ message: `🏆 KaushalAR Certificate\n${cert.name} completed ${cert.trade.name}\nID: ${cert.id}\n#KaushalAR #SkillIndia` })}>
              <Text style={s.shareBtnTxt}>↑ Share Certificate</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────
function ProfileScreen({ points, streak, completed, userName, onSaveName }: any) {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const getLevel = (p: number) => p < 100 ? { n: 'Beginner', c: C.muted } : p < 300 ? { n: 'Intermediate', c: C.blue } : p < 600 ? { n: 'Advanced', c: C.purple } : { n: 'Expert', c: C.green };
  const lv = getLevel(points);
  const BADGES = [
    { emoji: '🌱', name: 'First Step',   earned: true },
    { emoji: '⚡', name: 'Bijliwala',     earned: completed.includes('electrician') },
    { emoji: '🔧', name: 'Nalwala',       earned: completed.includes('plumber') },
    { emoji: '🔥', name: 'Aagwala',       earned: completed.includes('welder') },
    { emoji: '❄️', name: 'Thandawala',    earned: completed.includes('hvac') },
    { emoji: '💯', name: 'Centurion',     earned: points >= 100 },
    { emoji: '🔥🔥', name: '3-Day Streak', earned: streak >= 3 },
    { emoji: '👑', name: 'Expert',        earned: completed.length >= 4 },
  ];

  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.profHead}>
        <View style={s.profAvatarWrap}>
          <Text style={s.profAvatarLetter}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
        {editing ? (
          <View style={s.editRow}>
            <TextInput style={s.editInput} value={tempName} onChangeText={setTempName} autoFocus placeholderTextColor={C.subtle} />
            <TouchableOpacity style={s.editSave} onPress={() => { onSaveName(tempName); setEditing(false); }}>
              <Text style={s.editSaveTxt}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Text style={s.profName}>{userName} <Text style={s.editIcon}>✎</Text></Text>
          </TouchableOpacity>
        )}
        <View style={[s.levelTag, { borderColor: lv.c + '50', backgroundColor: lv.c + '10' }]}>
          <Text style={[s.levelTagTxt, { color: lv.c }]}>{lv.n}</Text>
        </View>
      </View>

      <View style={s.profStats}>
        {[
          { n: points,            l: 'Points',  c: C.orange },
          { n: `${streak}`,       l: 'Streak',  c: C.red    },
          { n: completed.length,  l: 'Trades',  c: C.green  },
          { n: BADGES.filter(b => b.earned).length, l: 'Badges', c: C.purple },
        ].map((st, i) => (
          <View key={i} style={s.profStatBox}>
            <Text style={[s.profStatN, { color: st.c }]}>{st.n}</Text>
            <Text style={s.profStatL}>{st.l}</Text>
          </View>
        ))}
      </View>

      <View style={s.sec}>
        <Text style={s.secTitle}>Badges</Text>
        <View style={s.badgeGrid}>
          {BADGES.map((b, i) => (
            <View key={i} style={[s.badgeCard, !b.earned && s.badgeCardLocked]}>
              <Text style={s.badgeEmoji}>{b.emoji}</Text>
              <Text style={s.badgeName}>{b.name}</Text>
              {!b.earned && <View style={s.badgeLockWrap}><Text style={{ fontSize: 14 }}>🔒</Text></View>}
            </View>
          ))}
        </View>
      </View>
      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { flex: 1 },
  scroll: { flex: 1, backgroundColor: C.bg },

  // Tabs
  tabBar: { flexDirection: 'row', backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border, paddingBottom: Platform.OS === 'ios' ? 22 : 8, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  tabPill: { width: 40, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  tabPillActive: { backgroundColor: C.greenBg },
  tabEmoji: { fontSize: 16, color: C.subtle },
  tabEmojiActive: { color: C.green },
  tabLbl: { fontSize: 10, color: C.subtle, fontWeight: '500' },
  tabLblActive: { color: C.green, fontWeight: '700' },

  // Home
  homeHead: { backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border, padding: 20, paddingTop: 52 },
  homeHeadTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  homeGreet: { color: C.muted, fontSize: 12, marginBottom: 3 },
  homeName: { color: C.white, fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  streakPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.card3, borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7 },
  streakFire: { fontSize: 16 },
  streakN: { color: C.white, fontSize: 15, fontWeight: '700' },
  streakL: { color: C.muted, fontSize: 11 },
  levelCard: { backgroundColor: C.card3, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14 },
  levelCardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  levelName: { fontSize: 13, fontWeight: '700' },
  levelPts: { color: C.muted, fontSize: 12 },
  levelProgBg: { height: 4, backgroundColor: C.borderL, borderRadius: 2, marginBottom: 8 },
  levelProgFill: { height: 4, borderRadius: 2 },
  levelSub: { color: C.muted, fontSize: 11 },
  statsRow: { flexDirection: 'row', gap: 10, padding: 16 },
  statCard: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 18 },
  statN: { fontSize: 20, fontWeight: '700' },
  statL: { color: C.muted, fontSize: 10 },
  sec: { paddingHorizontal: 16, marginBottom: 8 },
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  secTitle: { color: C.white, fontSize: 16, fontWeight: '700' },
  secBadge: { color: C.muted, fontSize: 12, backgroundColor: C.card3, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  tradeRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, marginBottom: 8 },
  tradeRowDone: { borderColor: C.green + '40' },
  tradeRowIcon: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tradeRowInfo: { flex: 1 },
  tradeRowName: { color: C.white, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  tradeRowHindi: { color: C.muted, fontSize: 11, marginBottom: 8 },
  tradeRowMeta: { flexDirection: 'row', gap: 6 },
  metaPill: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  metaPillTxt: { fontSize: 10, fontWeight: '600' },
  tradeRowRight: { alignItems: 'center', justifyContent: 'center' },
  donePill: { backgroundColor: C.greenBg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  donePillTxt: { color: C.green, fontSize: 11, fontWeight: '700' },
  tradeArrow: { fontSize: 22, fontWeight: '700' },
  tipBox: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 16, marginBottom: 16 },
  tipBoxHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  tipDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.orange },
  tipBoxTitle: { color: C.orange, fontSize: 13, fontWeight: '700' },
  tipBoxBody: { color: C.muted, fontSize: 12, lineHeight: 19 },

  // AR
  tradeTabs: { maxHeight: 50, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  tradeTabChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'transparent' },
  tradeTabTxt: { color: C.muted, fontSize: 12, fontWeight: '600' },
  camLaunchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 16 },
  camLaunchLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  camLaunchIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: C.blueBg, borderWidth: 1, borderColor: C.blue + '30', alignItems: 'center', justifyContent: 'center' },
  camLaunchTitle: { color: C.white, fontSize: 14, fontWeight: '700' },
  camLaunchSub: { color: C.muted, fontSize: 11, marginTop: 2 },
  progWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 6 },
  progBg: { flex: 1, height: 3, backgroundColor: C.card3, borderRadius: 2 },
  progFill: { height: 3, borderRadius: 2 },
  progTxt: { fontSize: 11, fontWeight: '700', minWidth: 52, textAlign: 'right' },
  stepCard: { flex: 1, marginHorizontal: 14, marginBottom: 4, backgroundColor: C.card, borderRadius: 12, padding: 18, borderWidth: 1, borderColor: C.border },
  stepTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  stepBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  stepBadgeTxt: { fontSize: 12, fontWeight: '700' },
  stepTitle: { color: C.white, fontSize: 19, fontWeight: '700', marginBottom: 3, letterSpacing: -0.3 },
  stepHindi: { color: C.muted, fontSize: 12, marginBottom: 12 },
  stepInstr: { color: C.text, fontSize: 13, lineHeight: 22, marginBottom: 12 },
  stepTip: { borderLeftWidth: 3, borderRadius: 4, padding: 12, backgroundColor: C.card3 },
  stepTipTxt: { color: C.muted, fontSize: 12, lineHeight: 18 },
  navRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingBottom: 12, paddingTop: 4 },
  navBack: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, alignItems: 'center' },
  navBackTxt: { color: C.text, fontSize: 14, fontWeight: '600' },
  navNext: { flex: 2, borderRadius: 10, padding: 14, alignItems: 'center' },
  navNextTxt: { color: '#000', fontSize: 14, fontWeight: '700' },

  // Done
  doneView: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: C.bg },
  doneBigEmoji: { fontSize: 72 },
  doneHeading: { color: C.white, fontSize: 28, fontWeight: '700', marginTop: 12 },
  doneSub: { color: C.muted, fontSize: 14, marginTop: 6, marginBottom: 28 },
  donePointsBox: { backgroundColor: C.card, borderWidth: 1, borderColor: C.green + '40', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24, width: '60%' },
  donePointsN: { color: C.green, fontSize: 48, fontWeight: '700' },
  donePointsL: { color: C.muted, fontSize: 13 },
  doneBackBtn: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, width: '100%', alignItems: 'center' },
  doneBackTxt: { color: C.text, fontSize: 14, fontWeight: '600' },

  // Camera overlay
  corner: { position: 'absolute', width: 22, height: 22, borderWidth: 2 },
  cTL: { top: 44, left: 20, borderRightWidth: 0, borderBottomWidth: 0 },
  cTR: { top: 44, right: 20, borderLeftWidth: 0, borderBottomWidth: 0 },
  cBL: { bottom: 320, left: 20, borderRightWidth: 0, borderTopWidth: 0 },
  cBR: { bottom: 320, right: 20, borderLeftWidth: 0, borderTopWidth: 0 },
  ringWrap: { position: 'absolute', top: '20%', left: '50%', marginLeft: -40, marginTop: -40, width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  ringO: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 2 },
  ringD: { width: 14, height: 14, borderRadius: 7 },
  camCard: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(13,17,23,0.97)', borderTopWidth: 1, borderTopColor: C.border, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18 },
  camCardBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  camStepBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  camStepBadgeTxt: { color: '#000', fontSize: 11, fontWeight: '700' },
  camProgBg: { flex: 1, height: 3, backgroundColor: C.card3, borderRadius: 2 },
  camProgFill: { height: 3, borderRadius: 2 },
  camTitle: { color: C.white, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  camHindi: { color: C.muted, fontSize: 11, marginBottom: 8 },
  camInstr: { color: C.text, fontSize: 12, lineHeight: 19, marginBottom: 8 },
  camTip: { borderLeftWidth: 2, padding: 8, borderRadius: 4, backgroundColor: C.card3, marginBottom: 12 },
  camTipTxt: { color: C.muted, fontSize: 11 },
  camNav: { flexDirection: 'row', gap: 8 },
  camPrevBtn: { flex: 1, backgroundColor: C.card3, borderRadius: 8, padding: 11, alignItems: 'center' },
  camPrevTxt: { color: C.text, fontSize: 13, fontWeight: '600' },
  camNextBtn: { flex: 2, borderRadius: 8, padding: 11, alignItems: 'center' },
  camNextTxt: { color: '#000', fontSize: 13, fontWeight: '700' },
  camTop: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16 },
  camTopBtn: { backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.border },
  camTopBtnTxt: { color: C.white, fontSize: 12, fontWeight: '600' },
  camLive: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  camLiveDot: { width: 6, height: 6, borderRadius: 3 },
  camLiveTxt: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  // AI
  aiHead: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  aiAvatarBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.green + '30', alignItems: 'center', justifyContent: 'center' },
  aiHeadName: { color: C.white, fontSize: 14, fontWeight: '700' },
  aiStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  aiDot: { width: 6, height: 6, borderRadius: 3 },
  aiStatusTxt: { color: C.muted, fontSize: 11 },
  aiSettBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.card3, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  keyPanel: { backgroundColor: C.card2, padding: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  keyPanelTitle: { color: C.muted, fontSize: 11, fontWeight: '600', marginBottom: 8 },
  keyRow: { flexDirection: 'row', gap: 8 },
  keyInput: { flex: 1, backgroundColor: C.card3, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 10, color: C.text, fontSize: 12 },
  keySaveBtn: { backgroundColor: C.green, borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  keySaveTxt: { color: '#000', fontWeight: '700', fontSize: 13 },
  quickBar: { maxHeight: 46, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  quickChip: { backgroundColor: C.card3, borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  quickChipTxt: { color: C.text, fontSize: 11, fontWeight: '500' },
  chatArea: { flex: 1 },
  msgWrapAI: { gap: 6 },
  msgWrapUser: { alignItems: 'flex-end', gap: 4 },
  aiMsgMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiMsgAvatar: { width: 20, height: 20, borderRadius: 6, backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.green + '30', alignItems: 'center', justifyContent: 'center' },
  aiMsgName: { color: C.green, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  bubbleAI: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, borderTopLeftRadius: 4, padding: 12, maxWidth: '85%' },
  bubbleUser: { backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.green + '30', borderRadius: 12, borderTopRightRadius: 4, padding: 12, maxWidth: '85%' },
  bubbleTxt: { color: C.text, fontSize: 13, lineHeight: 20 },
  inputBar: { flexDirection: 'row', gap: 10, padding: 12, backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border },
  inputField: { flex: 1, backgroundColor: C.card3, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: C.text, fontSize: 13, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.greenD, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
  sendBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 20 },

  // Cert
  certPage: { padding: 20 },
  certPageTitle: { color: C.white, fontSize: 22, fontWeight: '700', marginBottom: 16 },
  certStatBox: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 20 },
  certStatN: { fontSize: 46, fontWeight: '700' },
  certStatL: { color: C.muted, fontSize: 12, marginTop: 4 },
  formLbl: { color: C.muted, fontSize: 12, fontWeight: '600', marginBottom: 8, marginTop: 16, letterSpacing: 0.5 },
  formInput: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, color: C.white, fontSize: 15 },
  tradeOptBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, marginBottom: 8 },
  tradeOptName: { color: C.text, fontSize: 13, fontWeight: '700' },
  tradeOptHindi: { color: C.muted, fontSize: 11, marginTop: 1 },
  tradeOptCheck: { fontSize: 16, fontWeight: '700' },
  genBtn: { backgroundColor: C.greenD, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  genBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  certCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  certCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  certCardLogo: { color: C.white, fontSize: 18, fontWeight: '700' },
  certCardBadge: { fontSize: 11, fontWeight: '700', letterSpacing: 1, borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  certCardBody: { padding: 24, alignItems: 'center' },
  certCardPresents: { color: C.muted, fontSize: 12, marginBottom: 6 },
  certCardName: { color: C.white, fontSize: 26, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  certCardCompleted: { color: C.muted, fontSize: 12, marginBottom: 10 },
  certCardTrade: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  certCardDivider: { height: 1, width: '100%', backgroundColor: C.border, marginBottom: 16 },
  certCardFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  certCardId: { color: C.muted, fontSize: 11, fontWeight: '600' },
  certCardDate: { color: C.subtle, fontSize: 10, marginTop: 2 },
  nsdc: { borderWidth: 1, borderRadius: 8, padding: 8, alignItems: 'center' },
  nsdcTxt: { color: C.muted, fontSize: 11, fontWeight: '700' },
  nsdcSub: { color: C.subtle, fontSize: 9 },
  shareBtn: { margin: 16, marginTop: 0, borderRadius: 10, padding: 14, alignItems: 'center' },
  shareBtnTxt: { color: '#000', fontSize: 14, fontWeight: '700' },

  // Profile
  profHead: { alignItems: 'center', padding: 32, paddingTop: 52, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  profAvatarWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.card3, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  profAvatarLetter: { color: C.white, fontSize: 34, fontWeight: '700' },
  profName: { color: C.white, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  editIcon: { color: C.muted, fontSize: 14 },
  levelTag: { marginTop: 8, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  levelTagTxt: { fontSize: 12, fontWeight: '700' },
  profStats: { flexDirection: 'row', padding: 16, gap: 10 },
  profStatBox: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, alignItems: 'center' },
  profStatN: { fontSize: 20, fontWeight: '700' },
  profStatL: { color: C.muted, fontSize: 10, marginTop: 3 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  badgeCard: { width: (width - 52) / 2, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 16, alignItems: 'center', gap: 6, position: 'relative' },
  badgeCardLocked: { opacity: 0.3 },
  badgeEmoji: { fontSize: 30 },
  badgeName: { color: C.white, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  badgeLockWrap: { position: 'absolute', top: 8, right: 10 },
  editRow: { flexDirection: 'row', gap: 8, alignItems: 'center', width: '85%' },
  editInput: { flex: 1, backgroundColor: C.card3, borderWidth: 1, borderColor: C.green, borderRadius: 8, padding: 10, color: C.white, fontSize: 15 },
  editSave: { backgroundColor: C.greenD, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10 },
  editSaveTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
});