export const brainData = {
  categories: [
    {
      id: "lobes", label_cn: "脑叶", label_en: "Lobes", default_visible: true, render_type: "surface_region",
      structures: [
        { name_cn: "额叶", name_en: "Frontal Lobe", color: "#4A90D9", position: [0, 20, 40], scale: [0.45, 0.35, 0.35], description: "负责高级认知功能，包括计划、决策、工作记忆、语言表达和运动控制。是大脑最大的脑叶。" },
        { name_cn: "顶叶", name_en: "Parietal Lobe", color: "#50B86C", position: [0, 30, -15], scale: [0.35, 0.25, 0.25], description: "负责处理躯体感觉信息，包括触觉、温度、疼痛和空间定位。" },
        { name_cn: "颞叶(左)", name_en: "Temporal Lobe (L)", color: "#F5C242", position: [-45, -5, 5], scale: [0.15, 0.2, 0.3], description: "负责听觉处理、语言理解(左侧)、记忆形成和情绪调节。" },
        { name_cn: "颞叶(右)", name_en: "Temporal Lobe (R)", color: "#F5C242", position: [45, -5, 5], scale: [0.15, 0.2, 0.3], description: "负责听觉处理、面部识别(右侧)、记忆形成和情绪调节。" },
        { name_cn: "枕叶", name_en: "Occipital Lobe", color: "#E05555", position: [0, 15, -50], scale: [0.3, 0.25, 0.2], description: "视觉皮层所在地，负责处理和解读视觉信息。" },
        { name_cn: "岛叶(左)", name_en: "Insula (L)", color: "#9B59B6", position: [-32, 5, 5], scale: [0.05, 0.12, 0.15], description: "隐藏在外侧沟深处，参与意识、情绪、内感觉和自主神经调节。" },
        { name_cn: "岛叶(右)", name_en: "Insula (R)", color: "#9B59B6", position: [32, 5, 5], scale: [0.05, 0.12, 0.15], description: "隐藏在外侧沟深处，参与意识、情绪、内感觉和自主神经调节。" },
      ]
    },
    {
      id: "cortical_areas", label_cn: "皮层功能区", label_en: "Cortical Areas", default_visible: false, render_type: "surface_marker",
      structures: [
        { name_cn: "初级运动皮层 M1", name_en: "Primary Motor Cortex", color: "#2E86C1", position: [0, 30, 15], description: "Brodmann 4区，位于中央前回，控制对侧肢体随意运动。" },
        { name_cn: "初级感觉皮层 S1", name_en: "Primary Somatosensory Cortex", color: "#28B463", position: [0, 32, 5], description: "Brodmann 3/1/2区，位于中央后回，接收对侧身体触觉、痛觉信息。" },
        { name_cn: "初级视觉皮层 V1", name_en: "Primary Visual Cortex", color: "#E74C3C", position: [0, 10, -55], description: "Brodmann 17区(V1)，位于枕叶距状沟两侧，视觉信息处理第一站。" },
        { name_cn: "初级听觉皮层 A1", name_en: "Primary Auditory Cortex", color: "#F39C12", position: [-42, 5, 0], description: "Brodmann 41/42区，位于颞上回(Heschl回)，处理声音信号。" },
        { name_cn: "Broca区", name_en: "Broca's Area", color: "#1ABC9C", position: [-42, 10, 25], description: "Brodmann 44/45区，左侧额下回后部，负责语言产生和语法处理。损伤导致运动性失语。" },
        { name_cn: "Wernicke区", name_en: "Wernicke's Area", color: "#16A085", position: [-45, 5, -15], description: "Brodmann 22区后部，左侧颞上回后部，负责语言理解。损伤导致感觉性失语。" },
        { name_cn: "前额叶皮层", name_en: "Prefrontal Cortex", color: "#5DADE2", position: [0, 10, 55], description: "额叶最前方区域，参与执行功能、决策、社会行为和计划。" },
        { name_cn: "前扣带皮层", name_en: "Anterior Cingulate Cortex", color: "#EB984E", position: [0, 20, 20], description: "参与错误监测、决策冲突、疼痛感知和情绪调控。" },
        { name_cn: "角回", name_en: "Angular Gyrus", color: "#82E0AA", position: [-42, 25, -25], description: "参与阅读、语义理解、数学运算和空间认知。" },
        { name_cn: "梭状回", name_en: "Fusiform Gyrus", color: "#F1948A", position: [35, -15, -20], description: "面部识别关键区域(梭状回面孔区FFA)。" },
      ]
    },
    {
      id: "basal_ganglia", label_cn: "基底核", label_en: "Basal Ganglia", default_visible: false, render_type: "deep_structure",
      structures: [
        { name_cn: "尾状核(左)", name_en: "Caudate Nucleus (L)", color: "#FF6B6B", position: [-12, 10, 15], scale: [0.04, 0.06, 0.1], description: "基底核C形结构，参与运动控制、学习和记忆。" },
        { name_cn: "尾状核(右)", name_en: "Caudate Nucleus (R)", color: "#FF6B6B", position: [12, 10, 15], scale: [0.04, 0.06, 0.1], description: "基底核C形结构，参与运动控制、学习和记忆。" },
        { name_cn: "壳核(左)", name_en: "Putamen (L)", color: "#EE5A24", position: [-22, 3, 5], scale: [0.06, 0.07, 0.08], description: "基底核重要组成，参与运动调节和运动学习。帕金森病中受损。" },
        { name_cn: "壳核(右)", name_en: "Putamen (R)", color: "#EE5A24", position: [22, 3, 5], scale: [0.06, 0.07, 0.08], description: "基底核重要组成，参与运动调节和运动学习。帕金森病中受损。" },
        { name_cn: "苍白球外侧段", name_en: "GPe", color: "#F8B739", position: [-16, 1, 2], scale: [0.04, 0.05, 0.06], description: "间接通路的关键核团，调节运动抑制。" },
        { name_cn: "苍白球内侧段", name_en: "GPi", color: "#F5A623", position: [-14, -1, 0], scale: [0.03, 0.04, 0.05], description: "直接通路输出核团，调控运动启动和抑制。" },
        { name_cn: "伏隔核", name_en: "Nucleus Accumbens", color: "#FF4757", position: [0, -5, 15], scale: [0.04, 0.03, 0.03], description: "奖赏系统核心，参与动机、快感和成瘾。" },
      ]
    },
    {
      id: "limbic", label_cn: "边缘系统", label_en: "Limbic System", default_visible: false, render_type: "deep_structure",
      structures: [
        { name_cn: "海马(左)", name_en: "Hippocampus (L)", color: "#2ECC71", position: [-22, -10, -10], scale: [0.05, 0.04, 0.1], description: "短期记忆转化为长期记忆的关键结构，也参与空间导航。" },
        { name_cn: "海马(右)", name_en: "Hippocampus (R)", color: "#2ECC71", position: [22, -10, -10], scale: [0.05, 0.04, 0.1], description: "短期记忆转化为长期记忆的关键结构，也参与空间导航。" },
        { name_cn: "杏仁核(左)", name_en: "Amygdala (L)", color: "#E74C3C", position: [-20, -5, -5], scale: [0.04, 0.04, 0.04], description: "情绪处理(尤其恐惧)和情绪记忆的关键中枢。" },
        { name_cn: "杏仁核(右)", name_en: "Amygdala (R)", color: "#E74C3C", position: [20, -5, -5], scale: [0.04, 0.04, 0.04], description: "情绪处理(尤其恐惧)和情绪记忆的关键中枢。" },
        { name_cn: "扣带回", name_en: "Cingulate Gyrus", color: "#E67E22", position: [0, 25, 10], scale: [0.05, 0.03, 0.25], description: "边缘系统重要组成，参与情绪调节、疼痛感知和认知控制。" },
        { name_cn: "乳头体", name_en: "Mammillary Bodies", color: "#F39C12", position: [0, -15, -5], scale: [0.03, 0.03, 0.03], description: "记忆回路(Papez回路)的重要组成部分。" },
      ]
    },
    {
      id: "diencephalon", label_cn: "间脑", label_en: "Diencephalon", default_visible: false, render_type: "deep_structure",
      structures: [
        { name_cn: "丘脑(左)", name_en: "Thalamus (L)", color: "#8E44AD", position: [-8, 0, 0], scale: [0.08, 0.07, 0.08], description: "几乎所有感觉信息的中继站(嗅觉除外)，将信息传递到大脑皮层。" },
        { name_cn: "丘脑(右)", name_en: "Thalamus (R)", color: "#8E44AD", position: [8, 0, 0], scale: [0.08, 0.07, 0.08], description: "几乎所有感觉信息的中继站(嗅觉除外)，将信息传递到大脑皮层。" },
        { name_cn: "下丘脑", name_en: "Hypothalamus", color: "#E74C3C", position: [0, -10, 2], scale: [0.06, 0.05, 0.05], description: "调节体温、饥饿、口渴、昼夜节律、内分泌和自主神经功能。" },
        { name_cn: "外侧膝状体", name_en: "LGN", color: "#A569BD", position: [-15, -8, -8], scale: [0.02, 0.02, 0.02], description: "视觉信息从视网膜到V1的中继站。" },
        { name_cn: "内侧膝状体", name_en: "MGN", color: "#BB8FCE", position: [-12, -10, -10], scale: [0.02, 0.02, 0.02], description: "听觉信息从耳蜗核到A1的中继站。" },
        { name_cn: "松果体", name_en: "Pineal Gland", color: "#1E90FF", position: [0, 5, -15], scale: [0.015, 0.015, 0.015], description: "分泌褪黑素，调节昼夜节律和睡眠-觉醒周期。" },
        { name_cn: "底丘脑核", name_en: "Subthalamic Nucleus", color: "#D35400", position: [-10, -8, -2], scale: [0.02, 0.02, 0.03], description: "间接通路关键核团，损伤导致投掷症。DBS常见靶点。" },
      ]
    },
    {
      id: "brainstem", label_cn: "脑干", label_en: "Brainstem", default_visible: false, render_type: "deep_structure",
      structures: [
        { name_cn: "上丘", name_en: "Superior Colliculus", color: "#F39C12", position: [0, 2, -22], scale: [0.04, 0.03, 0.03], description: "视觉反射中枢，参与眼球运动和视觉注意。" },
        { name_cn: "下丘", name_en: "Inferior Colliculus", color: "#E67E22", position: [0, 0, -26], scale: [0.04, 0.03, 0.03], description: "听觉传导通路的重要中继站。" },
        { name_cn: "红核", name_en: "Red Nucleus", color: "#C0392B", position: [0, -8, -22], scale: [0.03, 0.03, 0.03], description: "运动协调相关核团，参与红核脊髓束。" },
        { name_cn: "黑质", name_en: "Substantia Nigra", color: "#2C3E50", position: [0, -12, -22], scale: [0.05, 0.02, 0.04], description: "致密部(SNc)产生多巴胺，退化导致帕金森病。" },
        { name_cn: "VTA", name_en: "Ventral Tegmental Area", color: "#1ABC9C", position: [0, -14, -20], scale: [0.03, 0.02, 0.03], description: "中脑边缘多巴胺系统起源，参与奖赏和动机。" },
        { name_cn: "蓝斑", name_en: "Locus Coeruleus", color: "#2980B9", position: [0, -2, -35], scale: [0.015, 0.015, 0.02], description: "大脑去甲肾上腺素的主要来源，参与觉醒和注意。" },
        { name_cn: "中缝核", name_en: "Raphe Nuclei", color: "#1F618D", position: [0, -8, -35], scale: [0.015, 0.015, 0.04], description: "大脑5-HT(血清素)的主要来源，参与情绪、睡眠。" },
        { name_cn: "脑桥核", name_en: "Pontine Nuclei", color: "#5DADE2", position: [0, -15, -32], scale: [0.08, 0.05, 0.05], description: "大脑皮层和小脑之间的中继站。" },
        { name_cn: "下橄榄核", name_en: "Inferior Olive", color: "#73C6B6", position: [0, -15, -45], scale: [0.04, 0.03, 0.03], description: "小脑运动学习的关键输入来源。" },
      ]
    },
    {
      id: "cerebellum", label_cn: "小脑", label_en: "Cerebellum", default_visible: false, render_type: "deep_structure",
      structures: [
        { name_cn: "小脑蚓部", name_en: "Cerebellar Vermis", color: "#1E8449", position: [0, -10, -45], scale: [0.05, 0.08, 0.1], description: "连接左右小脑半球，参与躯干平衡和姿势控制。" },
        { name_cn: "小脑半球(左)", name_en: "Cerebellar Hemisphere (L)", color: "#27AE60", position: [-25, -15, -45], scale: [0.15, 0.08, 0.12], description: "参与肢体运动协调、运动学习和认知功能。" },
        { name_cn: "小脑半球(右)", name_en: "Cerebellar Hemisphere (R)", color: "#27AE60", position: [25, -15, -45], scale: [0.15, 0.08, 0.12], description: "参与肢体运动协调、运动学习和认知功能。" },
        { name_cn: "齿状核", name_en: "Dentate Nucleus", color: "#229954", position: [-15, -12, -42], scale: [0.03, 0.03, 0.03], description: "小脑最大深部核团，是小脑皮层输出的主要中继站。" },
      ]
    },
    {
      id: "ventricles", label_cn: "脑室系统", label_en: "Ventricles", default_visible: false, render_type: "transparent_volume",
      structures: [
        { name_cn: "侧脑室(左)", name_en: "Lateral Ventricle (L)", color: "#85C1E9", position: [-12, 10, 0], scale: [0.05, 0.04, 0.15], opacity: 0.35, description: "C形腔室，产生和循环脑脊液。" },
        { name_cn: "侧脑室(右)", name_en: "Lateral Ventricle (R)", color: "#85C1E9", position: [12, 10, 0], scale: [0.05, 0.04, 0.15], opacity: 0.35, description: "C形腔室，与左侧对称，通过室间孔与第三脑室相通。" },
        { name_cn: "第三脑室", name_en: "Third Ventricle", color: "#7FB3D8", position: [0, 0, 0], scale: [0.01, 0.06, 0.06], opacity: 0.35, description: "位于两侧丘脑之间的狭窄腔室。" },
        { name_cn: "中脑导水管", name_en: "Cerebral Aqueduct", color: "#5499C7", position: [0, -5, -20], scale: [0.008, 0.008, 0.05], opacity: 0.35, description: "连接第三和第四脑室的狭窄通道，阻塞可导致脑积水。" },
        { name_cn: "第四脑室", name_en: "Fourth Ventricle", color: "#2E86C1", position: [0, -10, -38], scale: [0.04, 0.04, 0.04], opacity: 0.35, description: "位于脑桥、延髓与小脑之间的菱形腔室。" },
      ]
    },
    {
      id: "cranial_nerves", label_cn: "脑神经", label_en: "Cranial Nerves", default_visible: false, render_type: "nerve_marker",
      structures: [
        { name_cn: "I 嗅神经", name_en: "CN I Olfactory", color: "#F7DC6F", position: [8, -15, 40], description: "传导嗅觉，唯一不经过丘脑的感觉神经。" },
        { name_cn: "II 视神经", name_en: "CN II Optic", color: "#F0B27A", position: [12, -15, 25], description: "传导视觉信息，严格来说是CNS的延伸。" },
        { name_cn: "III 动眼神经", name_en: "CN III Oculomotor", color: "#82E0AA", position: [5, -15, -18], description: "控制大部分眼外肌、上睑提肌和瞳孔括约肌。" },
        { name_cn: "IV 滑车神经", name_en: "CN IV Trochlear", color: "#85C1E9", position: [5, 0, -22], description: "最细的脑神经，唯一从脑干背侧出脑。" },
        { name_cn: "V 三叉神经", name_en: "CN V Trigeminal", color: "#C39BD3", position: [18, -10, -30], description: "最大脑神经，传导面部感觉，控制咀嚼肌。" },
        { name_cn: "VI 展神经", name_en: "CN VI Abducens", color: "#F1948A", position: [5, -18, -32], description: "支配外直肌，使眼球外展。" },
        { name_cn: "VII 面神经", name_en: "CN VII Facial", color: "#AED6F1", position: [12, -18, -33], description: "控制面部表情肌，传导舌前2/3味觉。" },
        { name_cn: "VIII 前庭蜗神经", name_en: "CN VIII Vestibulocochlear", color: "#D7BDE2", position: [15, -15, -35], description: "传导听觉和平衡觉信息。" },
        { name_cn: "IX 舌咽神经", name_en: "CN IX Glossopharyngeal", color: "#A3E4D7", position: [10, -18, -42], description: "传导舌后1/3味觉，参与吞咽反射。" },
        { name_cn: "X 迷走神经", name_en: "CN X Vagus", color: "#F9E79F", position: [12, -20, -44], description: "分布最广，支配心肺胃肠等内脏。调节心率、消化。" },
        { name_cn: "XI 副神经", name_en: "CN XI Accessory", color: "#FADBD8", position: [10, -22, -48], description: "支配胸锁乳突肌和斜方肌。" },
        { name_cn: "XII 舌下神经", name_en: "CN XII Hypoglossal", color: "#E8DAEF", position: [8, -20, -46], description: "支配舌肌运动，对言语和吞咽至关重要。" },
      ]
    },
    {
      id: "vasculature", label_cn: "脑血管", label_en: "Vasculature", default_visible: false, render_type: "tube",
      structures: [
        { name_cn: "大脑前动脉 ACA", name_en: "Anterior Cerebral Artery", color: "#FF6B6B", points: [[0,-15,15],[0,5,35],[0,25,40],[0,35,30],[0,40,10]] },
        { name_cn: "大脑中动脉 MCA(左)", name_en: "Middle Cerebral Artery (L)", color: "#E55039", points: [[0,-15,15],[-15,-10,15],[-30,-5,12],[-40,5,5],[-45,15,0]] },
        { name_cn: "大脑中动脉 MCA(右)", name_en: "Middle Cerebral Artery (R)", color: "#E55039", points: [[0,-15,15],[15,-10,15],[30,-5,12],[40,5,5],[45,15,0]] },
        { name_cn: "大脑后动脉 PCA(左)", name_en: "Posterior Cerebral Artery (L)", color: "#C0392B", points: [[0,-15,-10],[-8,-10,-15],[-15,-5,-25],[-12,5,-40]] },
        { name_cn: "大脑后动脉 PCA(右)", name_en: "Posterior Cerebral Artery (R)", color: "#C0392B", points: [[0,-15,-10],[8,-10,-15],[15,-5,-25],[12,5,-40]] },
        { name_cn: "基底动脉", name_en: "Basilar Artery", color: "#922B21", points: [[0,-20,-50],[0,-18,-40],[0,-16,-30],[0,-15,-15]] },
      ]
    },
  ]
};
