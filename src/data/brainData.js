/**
 * Brain anatomy data — all positions in MODEL coordinates.
 *
 * Model coordinate system (from GLB vertex analysis):
 *   X: left(-102) → right(+112), midline ≈ 5
 *   Y: bottom(0) → top(180),     center ≈ 90
 *   Z: back(-54) → front(+118),  center ≈ 32
 *
 * This matches Three.js convention: Y-up, Z-forward.
 * No axis swapping needed.
 *
 * modelToScene: scene = (model - center) * brainScale
 *   center = [5.3, 90.1, 32.2], brainScale = 2.0 / 214 ≈ 0.00935
 */

const MID_X = 5;   // sagittal midline

// ─────────────────────────────────────────────────────
// Surface dyeing regions — painted directly on brain vertices
// ─────────────────────────────────────────────────────

export const SURFACE_DYEING_REGIONS = [
  // ── Lobes ──
  {
    id: 'frontal_lobe',
    name: '额叶',
    name_en: 'Frontal Lobe',
    color: '#FF6B6B',
    description: '高级认知、决策与运动控制',
    category: 'lobes',
    // Anterior to central sulcus (Z > 45), above lateral sulcus (Y > 55)
    test: (x, y, z) => z > 45 && y > 55,
    anchor: [MID_X, 150, 90],
  },
  {
    id: 'parietal_lobe',
    name: '顶叶',
    name_en: 'Parietal Lobe',
    color: '#FFD93D',
    description: '感觉整合、空间意识',
    category: 'lobes',
    // Between central and parieto-occipital sulcus, superior
    test: (x, y, z) => z <= 45 && z > -15 && y > 105,
    anchor: [MID_X, 165, 15],
  },
  {
    id: 'temporal_lobe',
    name: '颞叶',
    name_en: 'Temporal Lobe',
    color: '#6BCB77',
    description: '听觉处理、语言理解、记忆',
    category: 'lobes',
    // Lateral, inferior to lateral sulcus
    test: (x, y, z) => Math.abs(x - MID_X) > 28 && y < 88 && z > -15 && z < 80,
    anchor: [-75, 60, 35],
  },
  {
    id: 'occipital_lobe',
    name: '枕叶',
    name_en: 'Occipital Lobe',
    color: '#4D96FF',
    description: '视觉处理中心',
    category: 'lobes',
    // Posterior to parieto-occipital sulcus
    test: (x, y, z) => z <= -15,
    anchor: [MID_X, 115, -45],
  },
  {
    id: 'insula',
    name: '岛叶',
    name_en: 'Insula',
    color: '#9B59B6',
    description: '情感、内脏感觉、意识',
    category: 'lobes',
    // Deep in lateral sulcus
    test: (x, y, z) => {
      const dx = Math.abs(x - MID_X);
      return dx > 22 && dx < 42 && y > 72 && y < 115 && z > 15 && z < 58;
    },
    anchor: [-38, 93, 37],
  },

  // ── Cortical functional areas ──
  {
    id: 'motor_cortex',
    name: '运动皮层',
    name_en: 'Motor Cortex (M1)',
    color: '#E74C3C',
    description: '躯体运动控制 (M1)，中央前回',
    category: 'cortical',
    // Precentral gyrus — strip just anterior to central sulcus, superior
    test: (x, y, z) => y > 120 && z > 42 && z < 58,
    anchor: [-30, 165, 52],
  },
  {
    id: 'sensory_cortex',
    name: '感觉皮层',
    name_en: 'Somatosensory Cortex (S1)',
    color: '#F1C40F',
    description: '躯体感觉处理 (S1)，中央后回',
    category: 'cortical',
    // Postcentral gyrus — strip just posterior to central sulcus, superior
    test: (x, y, z) => y > 120 && z > 30 && z < 45,
    anchor: [40, 165, 38],
  },
  {
    id: 'visual_v1',
    name: '初级视觉区',
    name_en: 'Primary Visual Cortex (V1)',
    color: '#3498DB',
    description: '视觉信号首站 (V1)，距状沟两侧',
    category: 'cortical',
    // Calcarine sulcus region, medial occipital
    test: (x, y, z) => z < -28 && Math.abs(x - MID_X) < 30 && y > 68 && y < 112,
    anchor: [MID_X, 92, -48],
  },
  {
    id: 'auditory_cortex',
    name: '听觉皮层',
    name_en: 'Auditory Cortex (A1)',
    color: '#2ECC71',
    description: '听觉信号处理，颞上回 Heschl 回',
    category: 'cortical',
    // Superior temporal gyrus
    test: (x, y, z) => Math.abs(x - MID_X) > 38 && y > 82 && y < 105 && z > 8 && z < 32,
    anchor: [65, 95, 20],
  },
  {
    id: 'brocas_area',
    name: '布罗卡区',
    name_en: "Broca's Area",
    color: '#E67E22',
    description: '语言表达与产生，左额下回后部',
    category: 'cortical',
    // Left inferior frontal gyrus
    test: (x, y, z) => x < (MID_X - 32) && y > 85 && y < 118 && z > 55 && z < 78,
    anchor: [-55, 102, 67],
  },
  {
    id: 'wernickes_area',
    name: '韦尼克区',
    name_en: "Wernicke's Area",
    color: '#1ABC9C',
    description: '语言理解与逻辑，左颞上回后部',
    category: 'cortical',
    // Left posterior superior temporal gyrus
    test: (x, y, z) => x < (MID_X - 32) && y > 85 && y < 108 && z > -12 && z < 15,
    anchor: [-58, 95, 2],
  },
];

// ─────────────────────────────────────────────────────
// Independent geometry structures (deep / non-surface)
// ─────────────────────────────────────────────────────

export const INDEPENDENT_GEOMETRY_STRUCTURES = [
  // ── 深层核团 ──
  {
    id: 'thalamus',
    name: '丘脑',
    name_en: 'Thalamus',
    color: '#DDA0DD',
    description: '感觉信息中继站，几乎所有感觉通路的中继核',
    category: 'deep_nuclei',
    type: 'ellipsoid',
    instances: [
      { suffix: '(左)', position: [-8, 100, 30], scale: [0.08, 0.06, 0.07] },
      { suffix: '(右)', position: [18, 100, 30], scale: [0.08, 0.06, 0.07] },
    ],
  },
  {
    id: 'hippocampus',
    name: '海马体',
    name_en: 'Hippocampus',
    color: '#40E0D0',
    description: '记忆形成与空间导航的关键结构',
    category: 'deep_nuclei',
    type: 'tube',
    instances: [
      { suffix: '(左)', points: [[-18, 68, 52], [-20, 65, 40], [-22, 63, 28], [-25, 62, 18], [-27, 64, 10]] },
      { suffix: '(右)', points: [[28, 68, 52], [30, 65, 40], [32, 63, 28], [35, 62, 18], [37, 64, 10]] },
    ],
  },
  {
    id: 'amygdala',
    name: '杏仁核',
    name_en: 'Amygdala',
    color: '#FF4500',
    description: '情绪处理核心，尤其与恐惧和焦虑相关',
    category: 'deep_nuclei',
    type: 'ellipsoid',
    instances: [
      { suffix: '(左)', position: [-20, 65, 52], scale: [0.04, 0.04, 0.04] },
      { suffix: '(右)', position: [30, 65, 52], scale: [0.04, 0.04, 0.04] },
    ],
  },
  {
    id: 'basal_ganglia',
    name: '基底节',
    name_en: 'Basal Ganglia',
    color: '#DAA520',
    description: '运动调节、习惯形成与奖赏学习',
    category: 'deep_nuclei',
    type: 'ellipsoid',
    instances: [
      { suffix: '(左)', position: [-15, 97, 38], scale: [0.07, 0.06, 0.08] },
      { suffix: '(右)', position: [25, 97, 38], scale: [0.07, 0.06, 0.08] },
    ],
  },

  // ── 系统级结构 ──
  {
    id: 'ventricles',
    name: '脑室系统',
    name_en: 'Ventricular System',
    color: '#87CEEB',
    description: '产生和循环脑脊液，维持颅内压平衡',
    category: 'system',
    type: 'tube',
    opacity: 0.35,
    instances: [
      { suffix: '', points: [[MID_X, 115, 55], [MID_X, 118, 40], [MID_X, 115, 25], [MID_X, 108, 15], [MID_X, 95, 10]] },
    ],
  },
  {
    id: 'corpus_callosum',
    name: '胼胝体',
    name_en: 'Corpus Callosum',
    color: '#F5F5F5',
    description: '连接左右大脑半球的最大白质纤维束',
    category: 'system',
    type: 'tube',
    instances: [
      { suffix: '', points: [[MID_X, 118, 68], [MID_X, 128, 52], [MID_X, 132, 35], [MID_X, 128, 18], [MID_X, 118, 5]] },
    ],
  },
  {
    id: 'brainstem',
    name: '脑干',
    name_en: 'Brainstem',
    color: '#BC8F8F',
    description: '中脑、脑桥和延髓，控制呼吸和心跳等生命功能',
    category: 'system',
    type: 'ellipsoid',
    instances: [
      { suffix: '', position: [MID_X, 48, 28], scale: [0.05, 0.15, 0.05] },
    ],
  },
  {
    id: 'cerebellum',
    name: '小脑',
    name_en: 'Cerebellum',
    color: '#A52A2A',
    description: '运动协调、平衡和精细运动学习',
    category: 'system',
    type: 'ellipsoid',
    instances: [
      { suffix: '', position: [MID_X, 42, -12], scale: [0.14, 0.09, 0.10] },
    ],
  },

  // ── 附属与保护 ──
  {
    id: 'optic_chiasm',
    name: '视交叉',
    name_en: 'Optic Chiasm',
    color: '#F0E68C',
    description: '视神经交叉处，部分纤维交叉至对侧',
    category: 'accessory',
    type: 'ellipsoid',
    instances: [
      { suffix: '', position: [MID_X, 60, 55], scale: [0.04, 0.015, 0.02] },
    ],
  },
  {
    id: 'olfactory_bulb',
    name: '嗅球',
    name_en: 'Olfactory Bulb',
    color: '#EEE8AA',
    description: '接收嗅觉神经传入的初级嗅觉中枢',
    category: 'accessory',
    type: 'ellipsoid',
    instances: [
      { suffix: '(左)', position: [-10, 55, 92], scale: [0.015, 0.015, 0.025] },
      { suffix: '(右)', position: [20, 55, 92], scale: [0.015, 0.015, 0.025] },
    ],
  },
  {
    id: 'meninges',
    name: '脑膜',
    name_en: 'Meninges',
    color: '#FFFFFF',
    description: '包裹脑和脊髓的三层保护膜',
    category: 'accessory',
    type: 'shell',
    opacity: 0.06,
    instances: [
      { suffix: '', position: [MID_X, 90, 32], scale: [0.52, 0.44, 0.42] },
    ],
  },
  {
    id: 'arteries',
    name: '主血管丛',
    name_en: 'Circle of Willis',
    color: '#FF0000',
    description: 'Willis 环，大脑主要动脉供血环路',
    category: 'accessory',
    type: 'tube',
    instances: [
      { suffix: '', points: [[-20, 58, 48], [-10, 55, 55], [MID_X, 54, 58], [20, 55, 55], [30, 58, 48], [20, 60, 42], [MID_X, 62, 40], [-10, 60, 42], [-20, 58, 48]] },
    ],
  },
];

// ─────────────────────────────────────────────────────
// Category groupings for the top-bar UI
// ─────────────────────────────────────────────────────

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
