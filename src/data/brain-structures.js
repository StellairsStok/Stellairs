export const BRAIN_DATA = [
  {
    id: 'lobes', label_cn: '脑叶', label_en: 'Lobes', brainOpacity: 0.25,
    structures: [
      { name_cn: '额叶', name_en: 'Frontal Lobe', color: '#4A90D9', pos: [0,45,25], sc: [55,50,45], desc: '中央沟前方。运动、计划、决策、工作记忆、人格' },
      { name_cn: '顶叶', name_en: 'Parietal Lobe', color: '#50B86C', pos: [0,-15,45], sc: [45,35,30], desc: '中央沟后方、顶枕沟前方。躯体感觉、空间定位' },
      { name_cn: '颞叶', name_en: 'Temporal Lobe', color: '#F5C242', pos: [50,5,-10], sc: [20,45,25], desc: '外侧裂下方。听觉、语言理解、记忆', bi: true },
      { name_cn: '枕叶', name_en: 'Occipital Lobe', color: '#E05555', pos: [0,-55,15], sc: [35,25,30], desc: '大脑最后方。视觉处理' },
      { name_cn: '岛叶', name_en: 'Insula', color: '#9B59B6', pos: [35,10,5], sc: [5,25,20], desc: '外侧裂深处。内感受、疼痛、味觉、情绪', bi: true },
    ]
  },
  {
    id: 'cortical', label_cn: '皮层功能区', label_en: 'Cortical Areas', brainOpacity: 0.5,
    structures: [
      { name_cn: '初级运动皮层 M1', name_en: 'Primary Motor Cortex', color: '#2E86C1', pos: [0,18,50], sc: [40,8,8], desc: '中央前回。控制对侧随意运动', marker: true },
      { name_cn: '初级躯体感觉皮层 S1', name_en: 'Primary Somatosensory Cortex', color: '#28B463', pos: [0,12,50], sc: [40,8,8], desc: '中央后回。接收对侧躯体感觉', marker: true },
      { name_cn: '初级视觉皮层 V1', name_en: 'Primary Visual Cortex', color: '#E74C3C', pos: [0,-65,10], sc: [20,10,10], desc: '枕叶距状裂两侧。视觉信息初级处理', marker: true },
      { name_cn: '初级听觉皮层 A1', name_en: 'Primary Auditory Cortex', color: '#F39C12', pos: [50,-5,8], sc: [6,10,6], desc: '颞横回 Heschl gyrus。听觉信息初级处理', bi: true, marker: true },
      { name_cn: 'Broca区', name_en: "Broca's Area", color: '#1ABC9C', pos: [-48,20,12], sc: [8,10,8], desc: '左侧额下回后部(BA44/45)。语言产生，损伤→非流利性失语', marker: true },
      { name_cn: 'Wernicke区', name_en: "Wernicke's Area", color: '#16A085', pos: [-55,-25,10], sc: [8,12,8], desc: '左侧颞上回后部(BA22)。语言理解，损伤→流利性失语', marker: true },
      { name_cn: '前额叶皮层', name_en: 'Prefrontal Cortex', color: '#5DADE2', pos: [0,58,15], sc: [35,20,25], desc: '额叶最前部。执行功能、决策、抑制控制', marker: true },
      { name_cn: '前扣带皮层', name_en: 'Anterior Cingulate Cortex', color: '#EB984E', pos: [0,30,25], sc: [4,15,10], desc: '扣带回前部。错误检测、冲突监测、注意', marker: true },
      { name_cn: '角回', name_en: 'Angular Gyrus', color: '#82E0AA', pos: [-42,-55,30], sc: [8,8,8], desc: '顶叶后下方。阅读、计算、语义整合', marker: true },
      { name_cn: '梭状回', name_en: 'Fusiform Gyrus', color: '#F1948A', pos: [35,-40,-18], sc: [8,15,5], desc: '颞枕叶底面。面孔识别(FFA)，损伤→面孔失认症', bi: true, marker: true },
    ]
  },
  {
    id: 'basal_ganglia', label_cn: '基底核', label_en: 'Basal Ganglia', brainOpacity: 0.12,
    structures: [
      { name_cn: '尾状核', name_en: 'Caudate Nucleus', color: '#FF6B6B', pos: [12,10,12], sc: [6,30,8], desc: 'C形，环绕侧脑室。认知/运动整合', bi: true },
      { name_cn: '壳核', name_en: 'Putamen', color: '#EE5A24', pos: [25,5,5], sc: [8,18,14], desc: '尾状核外侧。运动执行', bi: true },
      { name_cn: '苍白球外侧段', name_en: 'GPe', color: '#F8B739', pos: [18,3,4], sc: [4,14,10], desc: '壳核内侧。间接通路中间站', bi: true },
      { name_cn: '苍白球内侧段', name_en: 'GPi', color: '#F5A623', pos: [14,3,4], sc: [3,12,9], desc: 'GPe内侧。基底核主要输出核→丘脑VL', bi: true },
      { name_cn: '伏隔核', name_en: 'Nucleus Accumbens', color: '#FF4757', pos: [8,18,-5], sc: [5,5,4], desc: '腹侧纹状体。奖赏、成瘾核心结构', bi: true },
    ]
  },
  {
    id: 'limbic', label_cn: '边缘系统', label_en: 'Limbic System', brainOpacity: 0.12,
    structures: [
      { name_cn: '海马', name_en: 'Hippocampus', color: '#2ECC71', pos: [25,-18,-10], sc: [8,22,6], desc: '颞叶内侧。陈述性记忆形成', bi: true },
      { name_cn: '杏仁核', name_en: 'Amygdala', color: '#E74C3C', pos: [22,2,-16], sc: [7,7,7], desc: '颞叶前内侧。恐惧条件反射、情绪记忆', bi: true },
      { name_cn: '扣带回', name_en: 'Cingulate Gyrus', color: '#E67E22', pos: [0,0,28], sc: [5,50,8], desc: '胼胝体上方内侧面弓形。情绪、疼痛、Papez回路' },
      { name_cn: '乳头体', name_en: 'Mammillary Bodies', color: '#F39C12', pos: [3,-2,-18], sc: [4,4,4], desc: '下丘脑后底部。Korsakoff综合征相关', bi: true },
      { name_cn: '内嗅皮层', name_en: 'Entorhinal Cortex', color: '#1ABC9C', pos: [22,-8,-18], sc: [8,10,4], desc: '海马旁回前部。网格细胞。AD最早受累', bi: true },
      { name_cn: '隔区', name_en: 'Septal Nuclei', color: '#D4AC0D', pos: [0,20,5], sc: [4,5,5], desc: '胼胝体前下方。奖赏、快感' },
    ]
  },
  {
    id: 'diencephalon', label_cn: '间脑', label_en: 'Diencephalon', brainOpacity: 0.12,
    structures: [
      { name_cn: '丘脑', name_en: 'Thalamus', color: '#8E44AD', pos: [8,-8,8], sc: [10,14,10], desc: '几乎所有感觉的中继站(嗅觉除外)', bi: true },
      { name_cn: '外侧膝状体', name_en: 'LGN', color: '#A569BD', pos: [22,-22,0], sc: [4,4,3], desc: '丘脑后下方。视觉中继→V1', bi: true },
      { name_cn: '内侧膝状体', name_en: 'MGN', color: '#BB8FCE', pos: [15,-22,0], sc: [4,4,3], desc: '丘脑后下方。听觉中继→A1', bi: true },
      { name_cn: '下丘脑', name_en: 'Hypothalamus', color: '#E74C3C', pos: [0,2,-8], sc: [10,10,8], desc: '自主神经、内分泌、体内稳态总司令' },
      { name_cn: '视交叉上核', name_en: 'SCN', color: '#FF6348', pos: [0,8,-10], sc: [2,2,2], desc: '昼夜节律主时钟', marker: true },
      { name_cn: '松果体', name_en: 'Pineal Gland', color: '#1E90FF', pos: [0,-18,14], sc: [3,4,3], desc: '分泌褪黑素melatonin，调节睡眠', marker: true },
      { name_cn: '底丘脑核', name_en: 'STN', color: '#D35400', pos: [10,-8,-4], sc: [4,3,2], desc: '间接通路关键。DBS靶点(帕金森)', bi: true },
    ]
  },
  {
    id: 'brainstem', label_cn: '脑干', label_en: 'Brainstem', brainOpacity: 0.15,
    structures: [
      { name_cn: '上丘', name_en: 'Superior Colliculus', color: '#F39C12', pos: [5,-20,-18], sc: [5,4,3], desc: '视觉反射、眼球运动引导', bi: true },
      { name_cn: '下丘', name_en: 'Inferior Colliculus', color: '#E67E22', pos: [5,-20,-22], sc: [5,4,3], desc: '听觉中继站→MGN', bi: true },
      { name_cn: '中脑导水管周围灰质', name_en: 'PAG', color: '#D68910', pos: [0,-18,-20], sc: [4,4,8], desc: '内源性疼痛调控、防御行为', geo: 'cylinder' },
      { name_cn: '红核', name_en: 'Red Nucleus', color: '#C0392B', pos: [5,-14,-22], sc: [4,4,4], desc: '红核脊髓束→屈肌运动', bi: true },
      { name_cn: '黑质致密部', name_en: 'SNc', color: '#2C3E50', pos: [10,-12,-25], sc: [6,8,2], desc: 'DA神经元→纹状体。变性→帕金森病', bi: true },
      { name_cn: '腹侧被盖区', name_en: 'VTA', color: '#1ABC9C', pos: [3,-12,-25], sc: [4,5,3], desc: '中脑边缘DA通路→伏隔核(奖赏)', bi: true },
      { name_cn: '脑桥核', name_en: 'Pontine Nuclei', color: '#5DADE2', pos: [0,0,-34], sc: [15,10,6], desc: '皮层-脑桥-小脑通路中继' },
      { name_cn: '蓝斑', name_en: 'Locus Coeruleus', color: '#2980B9', pos: [5,-18,-32], sc: [2,3,2], desc: '全脑NE的主要来源。觉醒、注意', bi: true, marker: true },
      { name_cn: '延髓锥体', name_en: 'Pyramids', color: '#D5F5E3', pos: [4,2,-48], sc: [4,4,10], desc: '皮质脊髓束经过', bi: true, geo: 'cylinder' },
      { name_cn: '下橄榄核', name_en: 'Inferior Olive', color: '#73C6B6', pos: [8,0,-46], sc: [5,6,5], desc: '攀缘纤维→小脑，运动学习', bi: true },
    ]
  },
  {
    id: 'cerebellum', label_cn: '小脑', label_en: 'Cerebellum', brainOpacity: 0.2,
    structures: [
      { name_cn: '小脑蚓部', name_en: 'Cerebellar Vermis', color: '#1E8449', pos: [0,-40,-25], sc: [8,15,12], desc: '小脑中线。躯干平衡和姿势控制' },
      { name_cn: '小脑半球', name_en: 'Cerebellar Hemispheres', color: '#27AE60', pos: [25,-40,-25], sc: [20,18,12], desc: '外侧。四肢精细运动协调', bi: true },
      { name_cn: '绒球小结叶', name_en: 'Flocculonodular Lobe', color: '#2ECC71', pos: [10,-30,-35], sc: [8,5,4], desc: '最古老部分。前庭功能、平衡', bi: true },
      { name_cn: '齿状核', name_en: 'Dentate Nucleus', color: '#229954', pos: [18,-40,-25], sc: [5,5,4], desc: '小脑最大深部核→丘脑VL→运动皮层', bi: true },
    ]
  },
  {
    id: 'ventricles', label_cn: '脑室系统', label_en: 'Ventricles', brainOpacity: 0.1,
    structures: [
      { name_cn: '侧脑室', name_en: 'Lateral Ventricles', color: '#85C1E9', pos: [15,0,15], sc: [10,40,12], desc: 'C形。含前角、体部、后角、下角。脉络丛产生CSF', bi: true, opacity: 0.35 },
      { name_cn: '第三脑室', name_en: 'Third Ventricle', color: '#7FB3D8', pos: [0,-5,5], sc: [2,15,12], desc: '两侧丘脑之间的狭缝状腔', opacity: 0.35 },
      { name_cn: '中脑导水管', name_en: 'Cerebral Aqueduct', color: '#5499C7', pos: [0,-18,-20], sc: [1.5,1.5,8], desc: '连接第三与第四脑室。阻塞→脑积水', geo: 'cylinder', opacity: 0.35 },
      { name_cn: '第四脑室', name_en: 'Fourth Ventricle', color: '#2E86C1', pos: [0,-18,-36], sc: [8,6,8], desc: '脑桥/延髓与小脑之间', opacity: 0.35 },
    ]
  },
  {
    id: 'vasculature', label_cn: '脑血管', label_en: 'Vasculature', brainOpacity: 0.2,
    tubes: [
      { name_cn: '大脑前动脉', name_en: 'ACA', color: '#FF6B6B', pts: [[12,15,-5],[5,25,5],[0,30,15],[0,10,35]], r: 1.5, desc: '供应内侧面(下肢运动/感觉区)', bi: true },
      { name_cn: '大脑中动脉', name_en: 'MCA', color: '#E55039', pts: [[18,10,-5],[30,10,0],[45,5,10]], r: 1.5, desc: '最常见卒中血管。供应外侧面', bi: true },
      { name_cn: '大脑后动脉', name_en: 'PCA', color: '#C0392B', pts: [[5,-5,-18],[10,-20,-10],[10,-40,0],[5,-55,10]], r: 1.5, desc: '供应枕叶、颞叶底面', bi: true },
      { name_cn: '基底动脉', name_en: 'Basilar Artery', color: '#922B21', pts: [[0,0,-50],[0,0,-30],[0,-5,-18]], r: 2, desc: '两侧椎动脉汇合→分为PCA' },
      { name_cn: '前交通动脉', name_en: 'AComm', color: '#F1948A', pts: [[-5,25,-2],[5,25,-2]], r: 1, desc: '连接两侧ACA。最常见动脉瘤好发部位' },
      { name_cn: '后交通动脉', name_en: 'PComm', color: '#F5B7B1', pts: [[15,5,-10],[10,-5,-15]], r: 1, desc: '连接ICA与PCA。Willis环组成', bi: true },
    ]
  },
  {
    id: 'white_matter', label_cn: '白质纤维束', label_en: 'White Matter', brainOpacity: 0.12,
    tubes: [
      { name_cn: '胼胝体', name_en: 'Corpus Callosum', color: '#F0E68C', pts: [[0,30,15],[0,0,20],[0,-25,15]], r: 4, desc: '连接两半球最大连合纤维。分膝部、体部、压部' },
      { name_cn: '弓状束', name_en: 'Arcuate Fasciculus', color: '#00CED1', pts: [[-48,20,12],[-45,-5,30],[-55,-25,10]], r: 2, desc: '连接Broca区与Wernicke区。损伤→传导性失语' },
      { name_cn: '穹窿', name_en: 'Fornix', color: '#98FB98', pts: [[0,-15,-5],[0,5,18],[0,15,12],[0,5,-8]], r: 2, desc: '连接海马→乳头体。Papez回路关键' },
      { name_cn: '前连合', name_en: 'Anterior Commissure', color: '#DDA0DD', pts: [[-20,5,-2],[0,5,-2],[20,5,-2]], r: 1.5, desc: '连接两侧颞叶' },
    ]
  },
  {
    id: 'cranial_nerves', label_cn: '脑神经', label_en: 'Cranial Nerves', brainOpacity: 0.18,
    structures: [
      { name_cn: 'I 嗅神经', name_en: 'CN I Olfactory', color: '#F7DC6F', pos: [8,30,-15], sc: [3,3,3], desc: '嗅觉。唯一不经丘脑', bi: true, marker: true },
      { name_cn: 'II 视神经', name_en: 'CN II Optic', color: '#F0B27A', pos: [10,18,-12], sc: [3,3,3], desc: '视觉。实为CNS延伸', bi: true, marker: true },
      { name_cn: 'III 动眼神经', name_en: 'CN III Oculomotor', color: '#82E0AA', pos: [5,-4,-22], sc: [2,2,2], desc: '大部分眼外肌+瞳孔缩小', bi: true, marker: true },
      { name_cn: 'IV 滑车神经', name_en: 'CN IV Trochlear', color: '#85C1E9', pos: [5,-20,-24], sc: [2,2,2], desc: '上斜肌。唯一从背侧出脑', bi: true, marker: true },
      { name_cn: 'V 三叉神经', name_en: 'CN V Trigeminal', color: '#C39BD3', pos: [18,-2,-32], sc: [3,3,3], desc: '面部感觉+咀嚼肌运动', bi: true, marker: true },
      { name_cn: 'VI 展神经', name_en: 'CN VI Abducens', color: '#F1948A', pos: [5,2,-38], sc: [2,2,2], desc: '外直肌（眼球外展）', bi: true, marker: true },
      { name_cn: 'VII 面神经', name_en: 'CN VII Facial', color: '#AED6F1', pos: [10,0,-38], sc: [2,2,2], desc: '面部表情肌+舌前2/3味觉', bi: true, marker: true },
      { name_cn: 'VIII 前庭蜗神经', name_en: 'CN VIII Vestibulocochlear', color: '#D7BDE2', pos: [12,-4,-38], sc: [2,2,2], desc: '听觉+平衡', bi: true, marker: true },
      { name_cn: 'IX 舌咽神经', name_en: 'CN IX Glossopharyngeal', color: '#A3E4D7', pos: [10,-4,-44], sc: [2,2,2], desc: '舌后1/3味觉+咽感觉', bi: true, marker: true },
      { name_cn: 'X 迷走神经', name_en: 'CN X Vagus', color: '#F9E79F', pos: [10,-4,-46], sc: [2,2,2], desc: '最长脑神经。心肺消化副交感', bi: true, marker: true },
      { name_cn: 'XI 副神经', name_en: 'CN XI Accessory', color: '#FADBD8', pos: [12,-6,-50], sc: [2,2,2], desc: '胸锁乳突肌+斜方肌', bi: true, marker: true },
      { name_cn: 'XII 舌下神经', name_en: 'CN XII Hypoglossal', color: '#E8DAEF', pos: [6,0,-48], sc: [2,2,2], desc: '舌肌运动', bi: true, marker: true },
    ]
  },
  {
    id: 'meninges', label_cn: '脑膜', label_en: 'Meninges', brainOpacity: 0.0,
    shells: [
      { name_cn: '硬脑膜', name_en: 'Dura Mater', color: '#BDC3C7', offset: 1.08, opacity: 0.12, desc: '最外层。含大脑镰、小脑幕' },
      { name_cn: '蛛网膜', name_en: 'Arachnoid Mater', color: '#D5DBDB', offset: 1.05, opacity: 0.08, desc: '中间层。蛛网膜下腔含CSF' },
      { name_cn: '软脑膜', name_en: 'Pia Mater', color: '#FADBD8', offset: 1.02, opacity: 0.08, desc: '最内层，紧贴脑表面' },
    ]
  },
];
