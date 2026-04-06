export const REGIONS = [
  // ===== 脑叶类 =====
  { id: 'frontal-lobe', categoryId: 'lobes', colorKey: 'frontal', nameZh: '额叶', nameEn: 'Frontal Lobe', descZh: '位于大脑前部，负责高级认知功能，包括计划、决策、工作记忆、语言表达和运动控制。是大脑最大的脑叶。' },
  { id: 'parietal-lobe', categoryId: 'lobes', colorKey: 'parietal', nameZh: '顶叶', nameEn: 'Parietal Lobe', descZh: '位于大脑顶部中后方，负责处理躯体感觉信息，包括触觉、温度、疼痛和空间定位。' },
  { id: 'temporal-lobe', categoryId: 'lobes', colorKey: 'temporal', nameZh: '颞叶', nameEn: 'Temporal Lobe', descZh: '位于大脑两侧，负责听觉处理、语言理解、记忆形成和情绪调节。' },
  { id: 'occipital-lobe', categoryId: 'lobes', colorKey: 'occipital', nameZh: '枕叶', nameEn: 'Occipital Lobe', descZh: '位于大脑最后方，是视觉皮层的所在地，负责处理和解读视觉信息。' },
  { id: 'insular-lobe', categoryId: 'lobes', colorKey: 'insular', nameZh: '岛叶', nameEn: 'Insular Lobe', descZh: '隐藏在外侧沟深处，参与意识、情绪、内感觉和自主神经调节。' },
  { id: 'limbic-lobe', categoryId: 'lobes', colorKey: 'limbic', nameZh: '边缘叶', nameEn: 'Limbic Lobe', descZh: '位于大脑内侧面，包含扣带回和海马旁回，参与情绪、记忆和动机行为。' },

  // ===== 脑回类 =====
  { id: 'precentral-gyrus', categoryId: 'gyri', colorKey: 'precentralGyrus', nameZh: '中央前回', nameEn: 'Precentral Gyrus', descZh: '初级运动皮层所在地，控制对侧身体的随意运动。位于中央沟前方。' },
  { id: 'postcentral-gyrus', categoryId: 'gyri', colorKey: 'postcentralGyrus', nameZh: '中央后回', nameEn: 'Postcentral Gyrus', descZh: '初级躯体感觉皮层所在地，接收对侧身体的触觉、痛觉等感觉信息。' },
  { id: 'superior-frontal-gyrus', categoryId: 'gyri', colorKey: 'superiorFrontalGyrus', nameZh: '额上回', nameEn: 'Superior Frontal Gyrus', descZh: '参与自我意识、高级认知功能和工作记忆。' },
  { id: 'middle-frontal-gyrus', categoryId: 'gyri', colorKey: 'middleFrontalGyrus', nameZh: '额中回', nameEn: 'Middle Frontal Gyrus', descZh: '参与注意力控制、工作记忆和执行功能。' },
  { id: 'inferior-frontal-gyrus', categoryId: 'gyri', colorKey: 'inferiorFrontalGyrus', nameZh: '额下回', nameEn: 'Inferior Frontal Gyrus', descZh: '左侧包含 Broca 区，是语言产生的关键区域。参与语言、抑制控制。' },
  { id: 'superior-temporal-gyrus', categoryId: 'gyri', colorKey: 'superiorTemporalGyrus', nameZh: '颞上回', nameEn: 'Superior Temporal Gyrus', descZh: '包含初级听觉皮层和 Wernicke 区，负责听觉处理和语言理解。' },
  { id: 'middle-temporal-gyrus', categoryId: 'gyri', colorKey: 'middleTemporalGyrus', nameZh: '颞中回', nameEn: 'Middle Temporal Gyrus', descZh: '参与语义记忆、语言处理和视觉感知。' },
  { id: 'inferior-temporal-gyrus', categoryId: 'gyri', colorKey: 'inferiorTemporalGyrus', nameZh: '颞下回', nameEn: 'Inferior Temporal Gyrus', descZh: '参与视觉物体识别、面部识别和视觉记忆。' },
  { id: 'superior-parietal-lobule', categoryId: 'gyri', colorKey: 'superiorParietalLobule', nameZh: '顶上小叶', nameEn: 'Superior Parietal Lobule', descZh: '参与空间定向、躯体感觉整合和视觉运动协调。' },
  { id: 'inferior-parietal-lobule', categoryId: 'gyri', colorKey: 'inferiorParietalLobule', nameZh: '顶下小叶', nameEn: 'Inferior Parietal Lobule', descZh: '包含缘上回和角回，参与语言、数学和空间认知。' },
  { id: 'supramarginal-gyrus', categoryId: 'gyri', colorKey: 'supramarginalGyrus', nameZh: '缘上回', nameEn: 'Supramarginal Gyrus', descZh: '参与音韵处理、触觉识别和语言感知。' },
  { id: 'angular-gyrus', categoryId: 'gyri', colorKey: 'angularGyrus', nameZh: '角回', nameEn: 'Angular Gyrus', descZh: '参与阅读、语义理解、数学运算和空间认知。' },
  { id: 'cingulate-gyrus', categoryId: 'gyri', colorKey: 'cingulateGyrus', nameZh: '扣带回', nameEn: 'Cingulate Gyrus', descZh: '边缘系统重要组成部分，参与情绪调节、疼痛感知和认知控制。' },
  { id: 'lingual-gyrus', categoryId: 'gyri', colorKey: 'lingualGyrus', nameZh: '舌回', nameEn: 'Lingual Gyrus', descZh: '位于枕叶内侧面，参与视觉处理，尤其是文字和颜色的识别。' },
  { id: 'fusiform-gyrus', categoryId: 'gyri', colorKey: 'fusiformGyrus', nameZh: '梭状回', nameEn: 'Fusiform Gyrus', descZh: '位于颞叶和枕叶底面，是面部识别的关键区域（梭状回面孔区）。' },

  // ===== 血管类 =====
  { id: 'aca', categoryId: 'vasculature', colorKey: 'aca', nameZh: '大脑前动脉', nameEn: 'Anterior Cerebral Artery', descZh: '供应大脑内侧面和额叶顶叶的内侧部分，包括运动和感觉皮层的下肢区域。' },
  { id: 'mca', categoryId: 'vasculature', colorKey: 'mca', nameZh: '大脑中动脉', nameEn: 'Middle Cerebral Artery', descZh: '大脑最大的动脉分支，供应大脑外侧面大部分区域，包括语言区和运动感觉区上肢面部区域。' },
  { id: 'pca', categoryId: 'vasculature', colorKey: 'pca', nameZh: '大脑后动脉', nameEn: 'Posterior Cerebral Artery', descZh: '供应枕叶和颞叶内侧面，包括视觉皮层。' },
  { id: 'circle-of-willis', categoryId: 'vasculature', colorKey: 'circleOfWillis', nameZh: 'Willis 环', nameEn: 'Circle of Willis', descZh: '位于脑底部的动脉环，连接前后循环，是脑血液供应的重要侧支通路。' },
  { id: 'basilar-artery', categoryId: 'vasculature', colorKey: 'basilarArtery', nameZh: '基底动脉', nameEn: 'Basilar Artery', descZh: '由两侧椎动脉汇合而成，沿脑桥腹侧上行，供应脑干和小脑。' },
  { id: 'vertebral-artery', categoryId: 'vasculature', colorKey: 'vertebralArtery', nameZh: '椎动脉', nameEn: 'Vertebral Artery', descZh: '经椎骨横突孔上行进入颅腔，在脑桥下缘汇合成基底动脉。' },

  // ===== 皮层功能区 =====
  { id: 'motor-cortex', categoryId: 'functional', colorKey: 'motorCortex', nameZh: '初级运动皮层', nameEn: 'Primary Motor Cortex', descZh: 'Brodmann 4 区，位于中央前回，直接控制对侧肢体的随意运动。运动体部定位呈倒置人形分布。' },
  { id: 'sensory-cortex', categoryId: 'functional', colorKey: 'sensoryCortex', nameZh: '初级感觉皮层', nameEn: 'Primary Somatosensory Cortex', descZh: 'Brodmann 3、1、2 区，位于中央后回，接收对侧身体的触觉、痛觉和本体感觉信息。' },
  { id: 'broca-area', categoryId: 'functional', colorKey: 'brocaArea', nameZh: 'Broca 区', nameEn: "Broca's Area", descZh: 'Brodmann 44、45 区，位于左侧额下回后部，负责语言的产生和语法处理。损伤导致运动性失语。' },
  { id: 'wernicke-area', categoryId: 'functional', colorKey: 'wernickeArea', nameZh: 'Wernicke 区', nameEn: "Wernicke's Area", descZh: 'Brodmann 22 区后部，位于左侧颞上回后部，负责语言的理解。损伤导致感觉性失语。' },
  { id: 'visual-cortex', categoryId: 'functional', colorKey: 'visualCortex', nameZh: '初级视觉皮层', nameEn: 'Primary Visual Cortex', descZh: 'Brodmann 17 区（V1），位于枕叶距状沟两侧，是视觉信息处理的第一站。' },
  { id: 'auditory-cortex', categoryId: 'functional', colorKey: 'auditoryCortex', nameZh: '初级听觉皮层', nameEn: 'Primary Auditory Cortex', descZh: 'Brodmann 41、42 区，位于颞上回（Heschl 回），接收和处理来自双侧耳蜗的声音信号。' },
  { id: 'prefrontal-cortex', categoryId: 'functional', colorKey: 'prefrontal', nameZh: '前额叶皮层', nameEn: 'Prefrontal Cortex', descZh: '额叶最前方区域，参与执行功能、决策、社会行为、人格表达和计划。是人类最高级的认知中枢。' },

  // ===== 脑干与小脑 =====
  { id: 'midbrain', categoryId: 'brainstem', colorKey: 'midbrain', nameZh: '中脑', nameEn: 'Midbrain', descZh: '连接间脑和脑桥，包含上丘（视觉反射）、下丘（听觉中继）、大脑脚和黑质。控制眼球运动和瞳孔反射。' },
  { id: 'pons', categoryId: 'brainstem', colorKey: 'pons', nameZh: '脑桥', nameEn: 'Pons', descZh: '连接中脑和延髓，是大脑皮层和小脑之间的中继站。包含呼吸调节中枢和多对脑神经核。' },
  { id: 'medulla', categoryId: 'brainstem', colorKey: 'medulla', nameZh: '延髓', nameEn: 'Medulla Oblongata', descZh: '脑干最下部，连接脑桥和脊髓。包含心血管中枢、呼吸中枢和呕吐中枢等生命中枢。' },
  { id: 'cerebellum-anterior', categoryId: 'brainstem', colorKey: 'cerebellumAnterior', nameZh: '小脑前叶', nameEn: 'Anterior Cerebellum', descZh: '小脑前部，主要参与肢体运动的协调和肌张力调节。' },
  { id: 'cerebellum-posterior', categoryId: 'brainstem', colorKey: 'cerebellumPosterior', nameZh: '小脑后叶', nameEn: 'Posterior Cerebellum', descZh: '小脑最大部分，参与运动计划、认知功能和语言处理。' },
  { id: 'vermis', categoryId: 'brainstem', colorKey: 'vermis', nameZh: '小脑蚓部', nameEn: 'Vermis', descZh: '连接左右小脑半球的中线结构，参与躯干平衡和姿势控制。' },

  // ===== 核团 =====
  { id: 'thalamus', categoryId: 'nuclei', colorKey: 'thalamus', nameZh: '丘脑', nameEn: 'Thalamus', descZh: '间脑最大的结构，是几乎所有感觉信息（嗅觉除外）的中继站，将信息传递到相应的大脑皮层区域。' },
  { id: 'hypothalamus', categoryId: 'nuclei', colorKey: 'hypothalamus', nameZh: '下丘脑', nameEn: 'Hypothalamus', descZh: '位于丘脑下方，调节体温、饥饿、口渴、昼夜节律、内分泌和自主神经功能。是神经系统和内分泌系统的桥梁。' },
  { id: 'caudate', categoryId: 'nuclei', colorKey: 'caudate', nameZh: '尾状核', nameEn: 'Caudate Nucleus', descZh: '基底神经节的C形结构，参与运动控制、学习和记忆。与奖赏系统密切相关。' },
  { id: 'putamen', categoryId: 'nuclei', colorKey: 'putamen', nameZh: '壳核', nameEn: 'Putamen', descZh: '基底神经节的重要组成部分，参与运动调节和运动学习，在帕金森病中受到显著影响。' },
  { id: 'globus-pallidus', categoryId: 'nuclei', colorKey: 'globusPallidus', nameZh: '苍白球', nameEn: 'Globus Pallidus', descZh: '基底神经节的输出核团，分为内侧和外侧两部分，调控运动的启动和抑制。' },
  { id: 'amygdala', categoryId: 'nuclei', colorKey: 'amygdala', nameZh: '杏仁核', nameEn: 'Amygdala', descZh: '位于颞叶内侧深部，杏仁形结构。是情绪处理（尤其是恐惧）和情绪记忆的关键中枢。' },
  { id: 'hippocampus', categoryId: 'nuclei', colorKey: 'hippocampus', nameZh: '海马体', nameEn: 'Hippocampus', descZh: '位于颞叶内侧，形似海马。是短期记忆转化为长期记忆的关键结构，也参与空间导航。' },

  // ===== 脑室系统 =====
  { id: 'lateral-ventricle-l', categoryId: 'ventricles', colorKey: 'lateralVentricleL', nameZh: '左侧脑室', nameEn: 'Left Lateral Ventricle', descZh: 'C形腔室，位于左侧大脑半球内，包含前角、体部、后角和下角，产生和循环脑脊液。' },
  { id: 'lateral-ventricle-r', categoryId: 'ventricles', colorKey: 'lateralVentricleR', nameZh: '右侧脑室', nameEn: 'Right Lateral Ventricle', descZh: 'C形腔室，位于右侧大脑半球内，结构与左侧脑室对称，通过室间孔与第三脑室相通。' },
  { id: 'third-ventricle', categoryId: 'ventricles', colorKey: 'thirdVentricle', nameZh: '第三脑室', nameEn: 'Third Ventricle', descZh: '位于两侧丘脑之间的狭窄腔室，通过中脑导水管与第四脑室相连。' },
  { id: 'fourth-ventricle', categoryId: 'ventricles', colorKey: 'fourthVentricle', nameZh: '第四脑室', nameEn: 'Fourth Ventricle', descZh: '位于脑桥、延髓与小脑之间的菱形腔室，脑脊液从此流入蛛网膜下腔。' },
  { id: 'cerebral-aqueduct', categoryId: 'ventricles', colorKey: 'cerebralAqueduct', nameZh: '中脑导水管', nameEn: 'Cerebral Aqueduct', descZh: '连接第三和第四脑室的狭窄通道，穿过中脑。阻塞可导致脑积水。' },

  // ===== 脑膜 =====
  { id: 'dura-mater', categoryId: 'meninges', colorKey: 'duraMater', nameZh: '硬脑膜', nameEn: 'Dura Mater', descZh: '最外层脑膜，坚韧致密的结缔组织，紧贴颅骨内面。形成大脑镰和小脑幕等结构。' },
  { id: 'arachnoid', categoryId: 'meninges', colorKey: 'arachnoid', nameZh: '蛛网膜', nameEn: 'Arachnoid Mater', descZh: '中间层脑膜，半透明薄膜。蛛网膜下腔充满脑脊液，对大脑起缓冲保护作用。' },
  { id: 'pia-mater', categoryId: 'meninges', colorKey: 'piaMater', nameZh: '软脑膜', nameEn: 'Pia Mater', descZh: '最内层脑膜，薄而富含血管，紧贴脑表面并深入脑沟。为大脑提供营养。' },

  // ===== 白质纤维束 =====
  { id: 'corpus-callosum', categoryId: 'whiteMatter', colorKey: 'corpusCallosum', nameZh: '胼胝体', nameEn: 'Corpus Callosum', descZh: '连接左右大脑半球最大的白质纤维束，约包含2-2.5亿条神经纤维，协调两半球间的信息传递。' },
  { id: 'internal-capsule', categoryId: 'whiteMatter', colorKey: 'internalCapsule', nameZh: '内囊', nameEn: 'Internal Capsule', descZh: '位于丘脑和基底神经节之间的V形白质带，是皮质脊髓束等重要传导束的必经之路。' },
  { id: 'corona-radiata', categoryId: 'whiteMatter', colorKey: 'coronaRadiata', nameZh: '放射冠', nameEn: 'Corona Radiata', descZh: '内囊纤维向大脑皮层呈扇形放射展开的白质区域，连接大脑皮层与脑干。' },
  { id: 'arcuate-fasciculus', categoryId: 'whiteMatter', colorKey: 'arcuateFasciculus', nameZh: '弓状束', nameEn: 'Arcuate Fasciculus', descZh: '连接 Broca 区和 Wernicke 区的弧形纤维束，是语言功能的关键白质通路。' },

  // ===== 脑神经 =====
  { id: 'cn1', categoryId: 'cranialNerves', colorKey: 'cn1', nameZh: 'I 嗅神经', nameEn: 'CN I - Olfactory', descZh: '传导嗅觉信息，从鼻腔嗅上皮穿过筛板到达嗅球。是唯一不经过丘脑的感觉神经。' },
  { id: 'cn2', categoryId: 'cranialNerves', colorKey: 'cn2', nameZh: 'II 视神经', nameEn: 'CN II - Optic', descZh: '传导视觉信息，从视网膜经视交叉到达外侧膝状体。严格来说是中枢神经系统的延伸。' },
  { id: 'cn3', categoryId: 'cranialNerves', colorKey: 'cn3', nameZh: 'III 动眼神经', nameEn: 'CN III - Oculomotor', descZh: '控制大部分眼外肌运动、上睑提肌和瞳孔括约肌。起自中脑。' },
  { id: 'cn4', categoryId: 'cranialNerves', colorKey: 'cn4', nameZh: 'IV 滑车神经', nameEn: 'CN IV - Trochlear', descZh: '最细的脑神经，支配上斜肌。唯一从脑干背侧出脑的脑神经。' },
  { id: 'cn5', categoryId: 'cranialNerves', colorKey: 'cn5', nameZh: 'V 三叉神经', nameEn: 'CN V - Trigeminal', descZh: '最大的脑神经，分三支：眼支、上颌支和下颌支。传导面部感觉，控制咀嚼肌运动。' },
  { id: 'cn6', categoryId: 'cranialNerves', colorKey: 'cn6', nameZh: 'VI 展神经', nameEn: 'CN VI - Abducens', descZh: '支配外直肌，使眼球外展。起自脑桥。' },
  { id: 'cn7', categoryId: 'cranialNerves', colorKey: 'cn7', nameZh: 'VII 面神经', nameEn: 'CN VII - Facial', descZh: '控制面部表情肌，传导舌前2/3味觉，支配泪腺和唾液腺分泌。' },
  { id: 'cn8', categoryId: 'cranialNerves', colorKey: 'cn8', nameZh: 'VIII 前庭蜗神经', nameEn: 'CN VIII - Vestibulocochlear', descZh: '分蜗神经（听觉）和前庭神经（平衡觉）两部分，从内耳传入信息。' },
  { id: 'cn9', categoryId: 'cranialNerves', colorKey: 'cn9', nameZh: 'IX 舌咽神经', nameEn: 'CN IX - Glossopharyngeal', descZh: '传导舌后1/3味觉和咽部感觉，参与吞咽反射，监测颈动脉窦的血压。' },
  { id: 'cn10', categoryId: 'cranialNerves', colorKey: 'cn10', nameZh: 'X 迷走神经', nameEn: 'CN X - Vagus', descZh: '分布最广的脑神经，支配心、肺、胃肠等内脏器官。调节心率、消化和呼吸。' },
  { id: 'cn11', categoryId: 'cranialNerves', colorKey: 'cn11', nameZh: 'XI 副神经', nameEn: 'CN XI - Accessory', descZh: '支配胸锁乳突肌和斜方肌，控制头部旋转和肩部上提。' },
  { id: 'cn12', categoryId: 'cranialNerves', colorKey: 'cn12', nameZh: 'XII 舌下神经', nameEn: 'CN XII - Hypoglossal', descZh: '支配舌肌运动，控制舌头的伸缩和侧向运动。对言语和吞咽至关重要。' },
];
