/**
 * Brain anatomy data — all positions in MODEL coordinates.
 *
 * Model coordinate system (from GLB vertex analysis):
 *   X: left(-102) → right(+112), midline ≈ 5
 *   Y: bottom(0)  → top(180),    center ≈ 90
 *   Z: back(-54)  → front(+118), center ≈ 32
 *
 * Anatomical sulcus reference lines (model space):
 *   Central sulcus          Z ≈ 40   (frontal / parietal boundary)
 *   Lateral (Sylvian) sulcus Y ≈ 88   (parietal+frontal / temporal boundary)
 *   Parieto-occipital sulcus Z ≈ -15  (parietal / occipital boundary)
 *
 * modelToScene: scene = (model − center) × brainScale
 *   center = [5.3, 90.1, 32.2],  brainScale = 2.0 / 214 ≈ 0.00935
 */

const MID_X = 5; // sagittal midline

// Sulcus reference constants
const CS_Z   = 40;   // central sulcus (Z)
const LS_Y   = 88;   // lateral (Sylvian) sulcus (Y)
const PO_Z   = -15;  // parieto-occipital sulcus (Z)

// ─────────────────────────────────────────────────────────────────────────────
// Surface dyeing regions — painted directly on brain vertices
//
// PAINT ORDER MATTERS: first matching region wins.
// Keep insula FIRST (most specific / hidden region) so it is not overwritten
// by the broader frontal / temporal tests.
// ─────────────────────────────────────────────────────────────────────────────

export const SURFACE_DYEING_REGIONS = [

  // ══════════════════════════  LOBES  ══════════════════════════

  // 1. Insula — listed first: hidden in lateral sulcus, must win over
  //    frontal & temporal whose volumes would otherwise cover it.
  {
    id: 'insula',
    name: '岛叶',
    name_en: 'Insula',
    color: '#C77DFF',
    description: '位于侧裂深处，参与痛觉、内脏感觉、情绪调节与意识整合',
    category: 'lobes',
    test: (x, y, z) => {
      const dx = Math.abs(x - MID_X);
      // Lateral band inside the Sylvian fissure — not too far (not cortical surface)
      return dx > 20 && dx < 52 && y > 65 && y < 122 && z > 8 && z < 62;
    },
    anchor: [-44, 96, 36],
  },

  // 2. Frontal — everything anterior to central sulcus
  {
    id: 'frontal_lobe',
    name: '额叶',
    name_en: 'Frontal Lobe',
    color: '#FF6B6B',
    description: '高级认知、执行功能、决策与运动控制，占大脑皮层约三分之一',
    category: 'lobes',
    test: (x, y, z) => z > CS_Z,
    anchor: [MID_X, 158, 88],
  },

  // 3. Temporal — lateral, below Sylvian fissure
  //    Checked after frontal so the inferior-frontal overlap resolves as frontal.
  {
    id: 'temporal_lobe',
    name: '颞叶',
    name_en: 'Temporal Lobe',
    color: '#6BCB77',
    description: '听觉处理、语言理解、陈述性记忆编码，位于外侧裂下方',
    category: 'lobes',
    test: (x, y, z) => {
      const dx = Math.abs(x - MID_X);
      return dx > 20 && y < LS_Y && z > -22 && z < 88;
    },
    anchor: [-74, 62, 30],
  },

  // 4. Parietal — superior, between central and PO sulci
  {
    id: 'parietal_lobe',
    name: '顶叶',
    name_en: 'Parietal Lobe',
    color: '#FFD93D',
    description: '躯体感觉整合、空间感知与多感觉联合处理',
    category: 'lobes',
    test: (x, y, z) => z >= PO_Z && z <= CS_Z && y > LS_Y,
    anchor: [MID_X, 168, 15],
  },

  // 5. Occipital — everything posterior to PO sulcus
  {
    id: 'occipital_lobe',
    name: '枕叶',
    name_en: 'Occipital Lobe',
    color: '#4D96FF',
    description: '视觉信息处理中心，包含初级视觉皮层 V1 及多级视觉联合区',
    category: 'lobes',
    test: (x, y, z) => z < PO_Z,
    anchor: [MID_X, 118, -48],
  },

  // ══════════════════════════  CORTICAL FUNCTIONAL AREAS  ══════════════════════════

  // Motor cortex M1 — precentral gyrus, strip just anterior to CS
  {
    id: 'motor_cortex',
    name: '运动皮层',
    name_en: 'Motor Cortex (M1)',
    color: '#E74C3C',
    description: '初级运动皮层 (M1)，中央前回，直接控制对侧肢体随意运动',
    category: 'cortical',
    test: (x, y, z) => y > 112 && z > CS_Z && z < CS_Z + 22,
    anchor: [-28, 168, 52],
  },

  // Somatosensory S1 — postcentral gyrus, strip just posterior to CS
  {
    id: 'sensory_cortex',
    name: '躯体感觉皮层',
    name_en: 'Somatosensory Cortex (S1)',
    color: '#F1C40F',
    description: '初级躯体感觉皮层 (S1)，中央后回，处理触觉、本体感觉与痛温觉',
    category: 'cortical',
    test: (x, y, z) => y > 112 && z >= CS_Z - 14 && z < CS_Z,
    anchor: [42, 168, 36],
  },

  // Primary visual V1 — calcarine sulcus, medial occipital
  {
    id: 'visual_v1',
    name: '初级视觉区',
    name_en: 'Primary Visual Cortex (V1)',
    color: '#3498DB',
    description: '初级视觉皮层 (V1)，距状沟两侧，接收来自外侧膝状体的视觉信号',
    category: 'cortical',
    test: (x, y, z) => z < -28 && Math.abs(x - MID_X) < 38 && y > 62 && y < 118,
    anchor: [MID_X, 95, -50],
  },

  // Auditory A1 — Heschl's gyrus, superior temporal plane
  {
    id: 'auditory_cortex',
    name: '听觉皮层',
    name_en: 'Auditory Cortex (A1)',
    color: '#2ECC71',
    description: '初级听觉皮层 (A1)，颞横回 (Heschl 回)，处理音调与声音基本属性',
    category: 'cortical',
    test: (x, y, z) => Math.abs(x - MID_X) > 38 && y > 80 && y < 108 && z > 5 && z < 35,
    anchor: [68, 95, 20],
  },

  // Broca's area — left inferior frontal (pars triangularis / opercularis)
  {
    id: 'brocas_area',
    name: '布罗卡区',
    name_en: "Broca's Area",
    color: '#E67E22',
    description: '语言产生与语法处理，左额下回后部（Brodmann 44/45 区）',
    category: 'cortical',
    test: (x, y, z) => x < (MID_X - 28) && y > 88 && y < 122 && z > 52 && z < 82,
    anchor: [-58, 105, 66],
  },

  // Wernicke's area — left posterior superior temporal gyrus
  {
    id: 'wernickes_area',
    name: '韦尼克区',
    name_en: "Wernicke's Area",
    color: '#1ABC9C',
    description: '语言理解与词汇检索，左颞上回后部（Brodmann 22 区）',
    category: 'cortical',
    test: (x, y, z) => x < (MID_X - 28) && y > 85 && y < 110 && z > -15 && z < 18,
    anchor: [-60, 96, 2],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Independent geometry structures (deep / subcortical / systemic)
//
// Each instance may carry a `labelPos` field (model coordinates) that
// LayerBuilder will use instead of the auto-computed offset — this prevents
// label pile-ups for midline and bilateral structures.
// ─────────────────────────────────────────────────────────────────────────────

export const INDEPENDENT_GEOMETRY_STRUCTURES = [

  // ─────────────────────────────  深层核团  ─────────────────────────────

  {
    id: 'thalamus',
    name: '丘脑',
    name_en: 'Thalamus',
    color: '#DDA0DD',
    description: '感觉信息中继枢纽，几乎所有感觉通路（嗅觉除外）均在此换元，并调控觉醒与注意',
    category: 'deep_nuclei',
    type: 'ellipsoid',
    instances: [
      {
        suffix: '(左)',
        position: [-12, 92, 22],
        scale:    [0.13, 0.09, 0.15],
        labelPos: [-72, 108, 22],
      },
      {
        suffix: '(右)',
        position: [22, 92, 22],
        scale:    [0.13, 0.09, 0.15],
        labelPos: [80, 108, 22],
      },
    ],
  },

  {
    id: 'hippocampus',
    name: '海马体',
    name_en: 'Hippocampus',
    color: '#40E0D0',
    description: '陈述性记忆编码与空间导航的关键结构，损伤后引起顺行性遗忘',
    category: 'deep_nuclei',
    type: 'tube',
    instances: [
      {
        suffix: '(左)',
        points: [[-22, 72, 56], [-24, 68, 44], [-26, 65, 31], [-28, 63, 19], [-30, 65, 9]],
        labelPos: [-82, 72, 32],
      },
      {
        suffix: '(右)',
        points: [[32, 72, 56], [34, 68, 44], [36, 65, 31], [38, 63, 19], [40, 65, 9]],
        labelPos: [90, 72, 32],
      },
    ],
  },

  {
    id: 'amygdala',
    name: '杏仁核',
    name_en: 'Amygdala',
    color: '#FF6347',
    description: '情绪处理核心（尤与恐惧、焦虑相关），调节情绪记忆巩固',
    category: 'deep_nuclei',
    type: 'ellipsoid',
    instances: [
      {
        suffix: '(左)',
        position: [-26, 72, 62],
        scale:    [0.08, 0.08, 0.08],
        labelPos: [-82, 58, 62],
      },
      {
        suffix: '(右)',
        position: [36, 72, 62],
        scale:    [0.08, 0.08, 0.08],
        labelPos: [90, 58, 62],
      },
    ],
  },

  {
    id: 'basal_ganglia',
    name: '基底节',
    name_en: 'Basal Ganglia',
    color: '#DAA520',
    description: '运动调节、习惯形成与奖赏学习的皮层-纹状体-丘脑环路核心',
    category: 'deep_nuclei',
    type: 'ellipsoid',
    instances: [
      {
        suffix: '(左)',
        position: [-18, 98, 42],
        scale:    [0.12, 0.10, 0.14],
        labelPos: [-80, 118, 42],
      },
      {
        suffix: '(右)',
        position: [28, 98, 42],
        scale:    [0.12, 0.10, 0.14],
        labelPos: [88, 118, 42],
      },
    ],
  },

  // ─────────────────────────────  系统级结构  ─────────────────────────────

  {
    id: 'ventricles',
    name: '脑室系统',
    name_en: 'Ventricular System',
    color: '#87CEEB',
    description: '产生并循环脑脊液的腔隙系统，维持颅内压平衡与代谢废物清除',
    category: 'system',
    type: 'tube',
    opacity: 0.40,
    instances: [
      {
        suffix: '',
        points: [[MID_X, 118, 58], [MID_X, 122, 42], [MID_X, 118, 26], [MID_X, 108, 14], [MID_X, 95, 8]],
        labelPos: [-68, 130, 38],
      },
    ],
  },

  {
    id: 'corpus_callosum',
    name: '胼胝体',
    name_en: 'Corpus Callosum',
    color: '#F0F0F0',
    description: '连接左右大脑半球的最大白质纤维束，协调双侧半球的信息整合',
    category: 'system',
    type: 'tube',
    instances: [
      {
        suffix: '',
        points: [[MID_X, 118, 68], [MID_X, 128, 52], [MID_X, 133, 35], [MID_X, 128, 18], [MID_X, 118, 5]],
        labelPos: [72, 148, 38],
      },
    ],
  },

  {
    id: 'brainstem',
    name: '脑干',
    name_en: 'Brainstem',
    color: '#BC8F8F',
    description: '由中脑、脑桥和延髓组成，控制呼吸、心跳等基本生命功能，并传导上下行纤维',
    category: 'system',
    type: 'ellipsoid',
    instances: [
      {
        suffix: '',
        position: [MID_X, 52, 22],
        scale:    [0.10, 0.30, 0.10],
        labelPos: [-72, 52, 22],
      },
    ],
  },

  {
    id: 'cerebellum',
    name: '小脑',
    name_en: 'Cerebellum',
    color: '#CD5C5C',
    description: '运动协调、姿势平衡与精细运动学习；包含大脑约一半数量的神经元',
    category: 'system',
    type: 'ellipsoid',
    instances: [
      {
        suffix: '',
        position: [MID_X, 38, -28],
        scale:    [0.30, 0.20, 0.24],
        labelPos: [78, 38, -28],
      },
    ],
  },

  // ─────────────────────────────  附属与保护结构  ─────────────────────────────

  {
    id: 'optic_chiasm',
    name: '视交叉',
    name_en: 'Optic Chiasm',
    color: '#F0E68C',
    description: '双侧视神经汇合处，鼻侧视网膜纤维交叉至对侧，实现双眼视野整合',
    category: 'accessory',
    type: 'ellipsoid',
    instances: [
      {
        suffix: '',
        position: [MID_X, 65, 55],
        scale:    [0.06, 0.02, 0.03],
        labelPos: [72, 52, 55],
      },
    ],
  },

  {
    id: 'olfactory_bulb',
    name: '嗅球',
    name_en: 'Olfactory Bulb',
    color: '#EEE8AA',
    description: '初级嗅觉中枢，接收嗅上皮轴突直接投射，是大脑中唯一不经丘脑中继的感觉通路',
    category: 'accessory',
    type: 'ellipsoid',
    instances: [
      {
        suffix: '(左)',
        position: [-12, 52, 96],
        scale:    [0.02, 0.016, 0.026],
        labelPos: [-72, 38, 96],
      },
      {
        suffix: '(右)',
        position: [22, 52, 96],
        scale:    [0.02, 0.016, 0.026],
        labelPos: [80, 38, 96],
      },
    ],
  },

  {
    id: 'meninges',
    name: '脑膜',
    name_en: 'Meninges',
    color: '#FFFFFF',
    description: '包裹脑与脊髓的三层保护膜（硬脑膜、蛛网膜、软脑膜），蛛网膜下腔充满脑脊液',
    category: 'accessory',
    type: 'shell',
    opacity: 0.07,
    instances: [
      {
        suffix: '',
        position: [MID_X, 90, 32],
        scale:    [0.54, 0.46, 0.44],
        labelPos: [82, 155, 32],
      },
    ],
  },

  {
    id: 'arteries',
    name: 'Willis 环',
    name_en: 'Circle of Willis',
    color: '#FF3333',
    description: '大脑底部主要动脉吻合环路，确保双侧大脑半球的侧支循环与血供安全',
    category: 'accessory',
    type: 'tube',
    instances: [
      {
        suffix: '',
        points: [
          [-22, 58, 48], [-12, 55, 56], [MID_X, 54, 59],
          [22, 55, 56],  [32, 58, 48],  [22, 61, 42],
          [MID_X, 62, 40], [-12, 61, 42], [-22, 58, 48],
        ],
        labelPos: [-72, 44, 48],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Category groupings for the top-bar UI
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  {
    id: 'lobes',
    label_cn: '脑叶',
    label_en: 'Lobes',
    type: 'surface',
    default_visible: true,
    regionIds: ['frontal_lobe', 'parietal_lobe', 'temporal_lobe', 'occipital_lobe', 'insula'],
  },
  {
    id: 'cortical',
    label_cn: '皮层功能区',
    label_en: 'Cortical Areas',
    type: 'surface',
    default_visible: false,
    regionIds: ['motor_cortex', 'sensory_cortex', 'visual_v1', 'auditory_cortex', 'brocas_area', 'wernickes_area'],
  },
  {
    id: 'deep_nuclei',
    label_cn: '深层核团',
    label_en: 'Deep Nuclei',
    type: 'deep',
    default_visible: false,
    structureIds: ['thalamus', 'hippocampus', 'amygdala', 'basal_ganglia'],
  },
  {
    id: 'system',
    label_cn: '系统结构',
    label_en: 'System Structures',
    type: 'deep',
    default_visible: false,
    structureIds: ['ventricles', 'corpus_callosum', 'brainstem', 'cerebellum'],
  },
  {
    id: 'accessory',
    label_cn: '附属结构',
    label_en: 'Accessory',
    type: 'deep',
    default_visible: false,
    structureIds: ['optic_chiasm', 'olfactory_bulb', 'meninges', 'arteries'],
  },
];
