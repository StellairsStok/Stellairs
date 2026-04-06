/**
 * Brain anatomy data with corrected positions.
 * Coordinate system: positions are in MNI-like space [x, y, z]
 *   x: left(-) / right(+)
 *   y: posterior(-) / anterior(+)
 *   z: inferior(-) / superior(+)
 * These get converted by SceneManager.mniToScene() to Three.js coords.
 */

export const brainData = {
  categories: [
    {
      id: "lobes",
      label_cn: "脑叶",
      label_en: "Lobes",
      default_visible: true,
      render_type: "surface_region",
      structures: [
        { name_cn: "额叶", name_en: "Frontal Lobe", color: "#4A90D9", position: [0, 45, 30], scale: [0.40, 0.30, 0.30], description: "负责高级认知功能，包括计划、决策、工作记忆、语言表达和运动控制。" },
        { name_cn: "顶叶", name_en: "Parietal Lobe", color: "#50B86C", position: [0, -10, 50], scale: [0.35, 0.25, 0.20], description: "负责处理躯体感觉信息，包括触觉、温度、疼痛和空间定位。" },
        { name_cn: "颞叶(左)", name_en: "Temporal Lobe (L)", color: "#F5C242", position: [-50, 0, -10], scale: [0.12, 0.28, 0.15], description: "负责听觉处理、语言理解(左侧)、记忆形成和情绪调节。" },
        { name_cn: "颞叶(右)", name_en: "Temporal Lobe (R)", color: "#F5C242", position: [50, 0, -10], scale: [0.12, 0.28, 0.15], description: "负责听觉处理、面部识别(右侧)、记忆形成和情绪调节。" },
        { name_cn: "枕叶", name_en: "Occipital Lobe", color: "#E05555", position: [0, -70, 15], scale: [0.25, 0.18, 0.22], description: "视觉皮层所在地，负责处理和解读视觉信息。" },
        { name_cn: "岛叶(左)", name_en: "Insula (L)", color: "#9B59B6", position: [-35, 5, 5], scale: [0.04, 0.12, 0.12], description: "隐藏在外侧沟深处，参与意识、情绪和内感觉。" },
        { name_cn: "岛叶(右)", name_en: "Insula (R)", color: "#9B59B6", position: [35, 5, 5], scale: [0.04, 0.12, 0.12], description: "隐藏在外侧沟深处，参与意识、情绪和内感觉。" },
      ]
    },
    {
      id: "cortical_areas",
      label_cn: "皮层功能区",
      label_en: "Cortical Areas",
      default_visible: false,
      render_type: "surface_marker",
      structures: [
        { name_cn: "初级运动皮层 M1", name_en: "Primary Motor Cortex", color: "#2E86C1", position: [0, -8, 58], description: "Brodmann 4区，中央前回，控制对侧随意运动。" },
        { name_cn: "初级感觉皮层 S1", name_en: "Primary Somatosensory", color: "#28B463", position: [0, -18, 58], description: "Brodmann 3/1/2区，中央后回，接收触觉痛觉。" },
        { name_cn: "初级视觉皮层 V1", name_en: "Primary Visual Cortex", color: "#E74C3C", position: [0, -85, 5], description: "Brodmann 17区(V1)，枕叶距状沟两侧。" },
        { name_cn: "初级听觉皮层 A1", name_en: "Primary Auditory Cortex", color: "#F39C12", position: [-52, -20, 8], description: "Brodmann 41/42区，颞上回(Heschl回)。" },
        { name_cn: "Broca区", name_en: "Broca's Area", color: "#1ABC9C", position: [-48, 18, 12], description: "Brodmann 44/45区，左额下回后部，语言产生。" },
        { name_cn: "Wernicke区", name_en: "Wernicke's Area", color: "#16A085", position: [-55, -40, 15], description: "Brodmann 22区后部，左颞上回后部，语言理解。" },
        { name_cn: "前额叶皮层", name_en: "Prefrontal Cortex", color: "#5DADE2", position: [0, 60, 10], description: "额叶最前方，执行功能、决策和社会行为。" },
        { name_cn: "前扣带皮层", name_en: "Anterior Cingulate", color: "#EB984E", position: [0, 30, 25], description: "参与错误监测、决策冲突和情绪调控。" },
        { name_cn: "角回", name_en: "Angular Gyrus", color: "#82E0AA", position: [-45, -60, 30], description: "参与阅读、语义理解和数学运算。" },
        { name_cn: "梭状回", name_en: "Fusiform Gyrus", color: "#F1948A", position: [38, -50, -18], description: "面部识别关键区域(梭状回面孔区FFA)。" },
      ]
    },
    {
      id: "basal_ganglia",
      label_cn: "基底核",
      label_en: "Basal Ganglia",
      default_visible: false,
      render_type: "deep_structure",
      structures: [
        { name_cn: "尾状核(左)", name_en: "Caudate (L)", color: "#FF6B6B", position: [-10, 12, 12], scale: [0.03, 0.08, 0.04], description: "C形结构，参与运动控制和学习记忆。" },
        { name_cn: "尾状核(右)", name_en: "Caudate (R)", color: "#FF6B6B", position: [10, 12, 12], scale: [0.03, 0.08, 0.04], description: "C形结构，参与运动控制和学习记忆。" },
        { name_cn: "壳核(左)", name_en: "Putamen (L)", color: "#EE5A24", position: [-24, 2, 4], scale: [0.05, 0.07, 0.05], description: "参与运动调节和运动学习，帕金森病中受损。" },
        { name_cn: "壳核(右)", name_en: "Putamen (R)", color: "#EE5A24", position: [24, 2, 4], scale: [0.05, 0.07, 0.05], description: "参与运动调节和运动学习，帕金森病中受损。" },
        { name_cn: "苍白球(左)", name_en: "Globus Pallidus (L)", color: "#F8B739", position: [-18, -2, 2], scale: [0.03, 0.04, 0.04], description: "调节运动抑制与启动。" },
        { name_cn: "苍白球(右)", name_en: "Globus Pallidus (R)", color: "#F8B739", position: [18, -2, 2], scale: [0.03, 0.04, 0.04], description: "调节运动抑制与启动。" },
        { name_cn: "伏隔核", name_en: "Nucleus Accumbens", color: "#FF4757", position: [0, 12, -4], scale: [0.04, 0.03, 0.02], description: "奖赏系统核心，参与动机和快感。" },
      ]
    },
    {
      id: "limbic",
      label_cn: "边缘系统",
      label_en: "Limbic System",
      default_visible: false,
      render_type: "deep_structure",
      structures: [
        { name_cn: "海马(左)", name_en: "Hippocampus (L)", color: "#2ECC71", position: [-25, -22, -12], scale: [0.04, 0.10, 0.03], description: "短期记忆转化为长期记忆，参与空间导航。" },
        { name_cn: "海马(右)", name_en: "Hippocampus (R)", color: "#2ECC71", position: [25, -22, -12], scale: [0.04, 0.10, 0.03], description: "短期记忆转化为长期记忆，参与空间导航。" },
        { name_cn: "杏仁核(左)", name_en: "Amygdala (L)", color: "#E74C3C", position: [-22, -4, -18], scale: [0.04, 0.04, 0.04], description: "情绪处理(尤其恐惧)和情绪记忆中枢。" },
        { name_cn: "杏仁核(右)", name_en: "Amygdala (R)", color: "#E74C3C", position: [22, -4, -18], scale: [0.04, 0.04, 0.04], description: "情绪处理(尤其恐惧)和情绪记忆中枢。" },
        { name_cn: "扣带回", name_en: "Cingulate Gyrus", color: "#E67E22", position: [0, 5, 30], scale: [0.04, 0.25, 0.03], description: "参与情绪调节、疼痛感知和认知控制。" },
        { name_cn: "乳头体", name_en: "Mammillary Bodies", color: "#F39C12", position: [0, -8, -16], scale: [0.03, 0.02, 0.02], description: "记忆回路(Papez回路)的重要组成。" },
        { name_cn: "穹窿", name_en: "Fornix", color: "#D4AC0D", position: [0, -5, 18], scale: [0.02, 0.12, 0.02], description: "连接海马和乳头体的白质纤维束。" },
      ]
    },
    {
      id: "diencephalon",
      label_cn: "间脑",
      label_en: "Diencephalon",
      default_visible: false,
      render_type: "deep_structure",
      structures: [
        { name_cn: "丘脑(左)", name_en: "Thalamus (L)", color: "#8E44AD", position: [-8, -15, 8], scale: [0.07, 0.08, 0.06], description: "感觉信息中继站(嗅觉除外)。" },
        { name_cn: "丘脑(右)", name_en: "Thalamus (R)", color: "#8E44AD", position: [8, -15, 8], scale: [0.07, 0.08, 0.06], description: "感觉信息中继站(嗅觉除外)。" },
        { name_cn: "下丘脑", name_en: "Hypothalamus", color: "#E74C3C", position: [0, -2, -8], scale: [0.05, 0.04, 0.04], description: "调节体温、饥饿、昼夜节律和内分泌。" },
        { name_cn: "外侧膝状体", name_en: "LGN", color: "#A569BD", position: [-22, -28, 0], scale: [0.02, 0.02, 0.02], description: "视觉信息中继站。" },
        { name_cn: "内侧膝状体", name_en: "MGN", color: "#BB8FCE", position: [-18, -28, -2], scale: [0.02, 0.02, 0.02], description: "听觉信息中继站。" },
        { name_cn: "松果体", name_en: "Pineal Gland", color: "#1E90FF", position: [0, -30, 6], scale: [0.015, 0.015, 0.015], description: "分泌褪黑素，调节昼夜节律。" },
        { name_cn: "底丘脑核", name_en: "Subthalamic Nucleus", color: "#D35400", position: [-10, -12, -4], scale: [0.02, 0.02, 0.02], description: "运动调控关键核团，DBS常见靶点。" },
      ]
    },
    {
      id: "brainstem",
      label_cn: "脑干",
      label_en: "Brainstem",
      default_visible: false,
      render_type: "deep_structure",
      structures: [
        { name_cn: "中脑", name_en: "Midbrain", color: "#A04000", position: [0, -28, -10], scale: [0.06, 0.04, 0.05], description: "连接前脑与后脑，含上下丘和多个核团。" },
        { name_cn: "上丘", name_en: "Superior Colliculus", color: "#F39C12", position: [0, -30, -2], scale: [0.04, 0.03, 0.02], description: "视觉反射中枢，参与眼球运动。" },
        { name_cn: "下丘", name_en: "Inferior Colliculus", color: "#E67E22", position: [0, -34, -4], scale: [0.04, 0.03, 0.02], description: "听觉中继站。" },
        { name_cn: "黑质", name_en: "Substantia Nigra", color: "#2C3E50", position: [0, -25, -12], scale: [0.05, 0.03, 0.02], description: "产生多巴胺，退化导致帕金森病。" },
        { name_cn: "红核", name_en: "Red Nucleus", color: "#C0392B", position: [0, -26, -6], scale: [0.03, 0.03, 0.03], description: "运动协调核团。" },
        { name_cn: "VTA", name_en: "Ventral Tegmental Area", color: "#1ABC9C", position: [0, -24, -14], scale: [0.03, 0.02, 0.02], description: "中脑多巴胺系统起源，参与奖赏。" },
        { name_cn: "脑桥", name_en: "Pons", color: "#5DADE2", position: [0, -35, -22], scale: [0.07, 0.05, 0.05], description: "大脑皮层和小脑之间的中继。" },
        { name_cn: "蓝斑", name_en: "Locus Coeruleus", color: "#2980B9", position: [0, -38, -18], scale: [0.015, 0.015, 0.015], description: "去甲肾上腺素主要来源，参与觉醒。" },
        { name_cn: "延髓", name_en: "Medulla Oblongata", color: "#73C6B6", position: [0, -40, -34], scale: [0.05, 0.04, 0.06], description: "控制心跳、呼吸等生命维持功能。" },
        { name_cn: "中缝核", name_en: "Raphe Nuclei", color: "#1F618D", position: [0, -36, -28], scale: [0.015, 0.015, 0.03], description: "血清素主要来源，参与情绪和睡眠。" },
      ]
    },
    {
      id: "cerebellum",
      label_cn: "小脑",
      label_en: "Cerebellum",
      default_visible: false,
      render_type: "deep_structure",
      structures: [
        { name_cn: "小脑蚓部", name_en: "Cerebellar Vermis", color: "#1E8449", position: [0, -60, -20], scale: [0.04, 0.06, 0.08], description: "连接左右半球，参与平衡和姿势控制。" },
        { name_cn: "小脑半球(左)", name_en: "Cerebellar Hemisphere (L)", color: "#27AE60", position: [-28, -58, -18], scale: [0.14, 0.10, 0.08], description: "肢体运动协调和运动学习。" },
        { name_cn: "小脑半球(右)", name_en: "Cerebellar Hemisphere (R)", color: "#27AE60", position: [28, -58, -18], scale: [0.14, 0.10, 0.08], description: "肢体运动协调和运动学习。" },
        { name_cn: "齿状核(左)", name_en: "Dentate Nucleus (L)", color: "#229954", position: [-18, -56, -18], scale: [0.03, 0.03, 0.03], description: "小脑最大深部核团。" },
        { name_cn: "齿状核(右)", name_en: "Dentate Nucleus (R)", color: "#229954", position: [18, -56, -18], scale: [0.03, 0.03, 0.03], description: "小脑最大深部核团。" },
      ]
    },
    {
      id: "ventricles",
      label_cn: "脑室系统",
      label_en: "Ventricles",
      default_visible: false,
      render_type: "transparent_volume",
      structures: [
        { name_cn: "侧脑室(左)", name_en: "Lateral Ventricle (L)", color: "#85C1E9", position: [-10, -5, 15], scale: [0.04, 0.15, 0.04], opacity: 0.35, description: "C形腔室，产生和循环脑脊液。" },
        { name_cn: "侧脑室(右)", name_en: "Lateral Ventricle (R)", color: "#85C1E9", position: [10, -5, 15], scale: [0.04, 0.15, 0.04], opacity: 0.35, description: "C形腔室，通过室间孔与第三脑室相通。" },
        { name_cn: "第三脑室", name_en: "Third Ventricle", color: "#7FB3D8", position: [0, -12, 8], scale: [0.008, 0.05, 0.06], opacity: 0.35, description: "位于两侧丘脑之间。" },
        { name_cn: "中脑导水管", name_en: "Cerebral Aqueduct", color: "#5499C7", position: [0, -30, -2], scale: [0.006, 0.06, 0.006], opacity: 0.35, description: "连接第三和第四脑室。" },
        { name_cn: "第四脑室", name_en: "Fourth Ventricle", color: "#2E86C1", position: [0, -42, -22], scale: [0.04, 0.04, 0.04], opacity: 0.35, description: "位于脑桥、延髓与小脑之间。" },
      ]
    },
    {
      id: "cranial_nerves",
      label_cn: "脑神经",
      label_en: "Cranial Nerves",
      default_visible: false,
      render_type: "nerve_marker",
      structures: [
        { name_cn: "I 嗅神经", name_en: "CN I Olfactory", color: "#F7DC6F", position: [8, 30, -20], description: "传导嗅觉，唯一不经过丘脑。" },
        { name_cn: "II 视神经", name_en: "CN II Optic", color: "#F0B27A", position: [12, 15, -18], description: "传导视觉信息。" },
        { name_cn: "III 动眼神经", name_en: "CN III Oculomotor", color: "#82E0AA", position: [4, -20, -18], description: "控制大部分眼外肌和瞳孔。" },
        { name_cn: "V 三叉神经", name_en: "CN V Trigeminal", color: "#C39BD3", position: [18, -32, -16], description: "最大脑神经，面部感觉和咀嚼。" },
        { name_cn: "VII 面神经", name_en: "CN VII Facial", color: "#AED6F1", position: [14, -36, -24], description: "面部表情肌和舌前味觉。" },
        { name_cn: "VIII 前庭蜗神经", name_en: "CN VIII Vestibulocochlear", color: "#D7BDE2", position: [16, -38, -22], description: "听觉和平衡觉。" },
        { name_cn: "X 迷走神经", name_en: "CN X Vagus", color: "#F9E79F", position: [12, -42, -30], description: "分布最广，调节心肺消化。" },
        { name_cn: "XII 舌下神经", name_en: "CN XII Hypoglossal", color: "#E8DAEF", position: [8, -44, -32], description: "控制舌肌运动。" },
      ]
    },
    {
      id: "vasculature",
      label_cn: "脑血管",
      label_en: "Vasculature",
      default_visible: false,
      render_type: "tube",
      structures: [
        {
          name_cn: "大脑前动脉 ACA", name_en: "Anterior Cerebral Artery", color: "#FF6B6B",
          points: [[0, 5, -12], [0, 20, -4], [0, 40, 15], [0, 30, 40], [0, 10, 50]]
        },
        {
          name_cn: "大脑中动脉(左)", name_en: "MCA (L)", color: "#E55039",
          points: [[0, 5, -12], [-15, 5, -8], [-30, 0, -2], [-42, 5, 5], [-50, 15, 10]]
        },
        {
          name_cn: "大脑中动脉(右)", name_en: "MCA (R)", color: "#E55039",
          points: [[0, 5, -12], [15, 5, -8], [30, 0, -2], [42, 5, 5], [50, 15, 10]]
        },
        {
          name_cn: "大脑后动脉(左)", name_en: "PCA (L)", color: "#C0392B",
          points: [[0, -15, -14], [-8, -22, -10], [-18, -35, -2], [-15, -55, 5]]
        },
        {
          name_cn: "大脑后动脉(右)", name_en: "PCA (R)", color: "#C0392B",
          points: [[0, -15, -14], [8, -22, -10], [18, -35, -2], [15, -55, 5]]
        },
        {
          name_cn: "基底动脉", name_en: "Basilar Artery", color: "#922B21",
          points: [[0, -48, -30], [0, -42, -25], [0, -35, -18], [0, -25, -14]]
        },
      ]
    },
  ]
};
