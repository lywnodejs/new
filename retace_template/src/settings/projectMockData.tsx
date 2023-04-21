/**
 * ! The Mock Data for the Whole Project
 */

// project dependence
import { TextBadge } from '../components/common';
import Button from '@material-ui/core/Button';
import { TitleComponentOption, SingleAxisComponentOption, ScatterSeriesOption } from 'echarts';

// import img
import actionStandardImg from '../assets/image/standard/actionStandard.jpg';
import dataStandardImg from '../assets/image/standard/dataStandard.jpg';
import dataAPIImg from '../assets/image/standard/dataAPI.jpg';
import knowledgeMapImg from '../assets/image/standard/knowledgeMap.jpg';
import educationIndexImg from '../assets/image/dataIndex/educationIndex.jpg';
import knowledgeGraphImg from '../assets/image/dataIndex/knowledgeGraph.jpg';
import userPicture from '../assets/image/users/3.jpg';
import educationalModel1 from '../assets/image/models/ModelExample1.jpg';
import educationalModel2 from '../assets/image/models/ModelExample2.jpg';
import educationalModel3 from '../assets/image/models/ModelExample3.jpg';
import appImg from '../assets/image/apps/appImg.png'
import appImg1 from '../assets/image/apps/appImage1.jpg'
import appImg2 from '../assets/image/apps/appImage2.jpg'
import appImg3 from '../assets/image/apps/appImage3.jpg'
import appImg4 from '../assets/image/apps/appImage4.jpg'
import barSimpleGraph from '../assets/image/charts/bar-simple.png'


//icon
import DraftsIcon from '@material-ui/icons/Drafts';
import CastForEducationIcon from '@material-ui/icons/CastForEducation';
import BookIcon from '@material-ui/icons/Book';


/**
 * ! Router: /appsManage/infoManage
 * * The Mock Data for Info of Apps
 */
export const infoApps: any[][] = [
  [
    '智能黑板板书分析工具',
    '浙江大华技术股份有限公司',
    <TextBadge text="交互类型工具" color="secondary" />,
    <TextBadge text="教师" color="info" />
  ],
  [
    '专课专练',
    '上海有我科技有限公司',
    <TextBadge text="测评类型工具" color="primary" />,
    <TextBadge text="学生" color="success" />
  ],
  [
    '录播视频行为分析工具',
    '浙江大华技术股份有限公司',
    <TextBadge text="测评类型工具" color="primary" />,
    <TextBadge text="教师" color="info" />
  ],
  [
    '学生成长档案',
    '科大讯飞',
    <TextBadge text="内容类型工具" color="error" />,
    <TextBadge text="学生" color="success" />
  ],
  [
    '智能黑板板书分析工具',
    '浙江大华技术股份有限公司',
    <TextBadge text="交互类型工具" color="secondary" />,
    <TextBadge text="教师" color="info" />
  ],
  [
    '专课专练',
    '上海有我科技有限公司',
    <TextBadge text="测评类型工具" color="primary" />,
    <TextBadge text="学生" color="success" />
  ],
  [
    '录播视频行为分析工具',
    '浙江大华技术股份有限公司',
    <TextBadge text="测评类型工具" color="primary" />,
    <TextBadge text="教师" color="info" />
  ],
  [
    '学生成长档案',
    '科大讯飞',
    <TextBadge text="内容类型工具" color="error" />,
    <TextBadge text="学生" color="success" />
  ],
  [
    '智能黑板板书分析工具',
    '浙江大华技术股份有限公司',
    <TextBadge text="交互类型工具" color="secondary" />,
    <TextBadge text="教师" color="info" />
  ],
  [
    '专课专练',
    '上海有我科技有限公司',
    <TextBadge text="测评类型工具" color="primary" />,
    <TextBadge text="学生" color="success" />
  ],
];

/**
 * ! Router: /appsManage/xmlStandard
 * * Standard Document Mock Data: Provide 4 types of standard documents
 */
export const standardListMockData: {}[] = [
  {
    img: actionStandardImg,
    title: '教师板书行为数据采集标准',
    introduce: '本标准详细界定了教师常态化教学中最为常见的教学行为：板书行为的内容、形式、属性与语义。通过分区块的方式实现对教师板书的数字化采集，并结合背后的学科知识图谱实现板书的教学语义化分析。',
    actionName: '查看标准',
    actionKey: 'actionStandard',
  },
  {
    img: dataStandardImg,
    title: '学生行为数据XML格式规范',
    introduce: '本标准界定了学习者在线学习行为的具体行为结构，包括行动者、施动对象、时间、结果等属性，通过界定学习者的行为标准，并采用XML的格式记录存储学习者行为，为后续的学习者行为诊断、解析与预测提供数据基础。',
    actionName: '查看标准',
    actionKey: 'dataStandard',
  },
  {
    img: knowledgeMapImg,
    title: '数学学科知识图谱规范',
    introduce: '本标准从本体论、知识论的角度出发，对小学数学学科的知识本体结构、属性、关系、目标、活动等进行详细的界定，构建了小学数学学科的知识图谱，是为行为采集、特征处理、模型分析赋予教学语义的关键。',
    actionName: '查看标准',
    actionKey: 'knowledgeMap',
  },
  {
    img: dataAPIImg,
    title: '数据传输接口规范',
    introduce: '本标准规范详细界定了第三方厂商的应用工具所采用的数据传输方式、数据格式、数据文档命名规范等基本内容，是将深入一线教学应用的工具所采集的数据汇聚到数据治理平台并进行智能诊断的关键环节。',
    actionName: '查看标准',
    actionKey: 'dataAPI',
  },
];
export const actionStandardMockData: any[][] = [
  [
    '教师板书行为数据采集标准XML文档-2021年版',
    <><TextBadge text="行为采集" color="secondary" /> <TextBadge text="XML标准" color="info" /></>,
    'e2lab',
    '2021年6月20日',
  ],
  [
    '教师板书行为数据采集标准XML文档-2020年版',
    <><TextBadge text="行为采集" color="secondary" /> <TextBadge text="XML标准" color="info" /></>,
    'e2lab',
    '2020年3月21日',
  ],
  [
    '教师板书行为数据采集标准XML文档-2019版',
    <><TextBadge text="行为采集" color="secondary" /> <TextBadge text="XML标准" color="info" /></>,
    'e2lab',
    '2019年12月25日',
  ],
];
export const dataStandardMockData: any[][] = [
  [
    '学生行为数据XML格式规范文档-2021年版',
    <><TextBadge text="数据规范" color="secondary" /> <TextBadge text="XML标准" color="info" /></>,
    'e2lab',
    '2021年6月20日',
  ],
  [
    '学生行为数据XML格式规范文档-2020年版',
    <><TextBadge text="数据规范" color="secondary" /> <TextBadge text="XML标准" color="info" /></>,
    'e2lab',
    '2020年3月21日',
  ],
  [
    '学生行为数据XML格式规范文档-2019版',
    <><TextBadge text="数据规范" color="secondary" /> <TextBadge text="XML标准" color="info" /></>,
    'e2lab',
    '2019年12月25日',
  ],
];
export const knowledgeMapMockData: any[][] = [
  [
    '数学学科知识图谱规范文档-2021年版',
    <><TextBadge text="知识图谱" color="error" /> <TextBadge text="XML标准" color="info" /></>,
    'e2lab',
    '2021年6月20日',
  ],
  [
    '数学学科知识图谱规范文档-2020年版',
    <><TextBadge text="知识图谱" color="error" /> <TextBadge text="XML标准" color="info" /></>,
    'e2lab',
    '2020年3月21日',
  ],
  [
    '数学学科知识图谱规范文档-2019版',
    <><TextBadge text="知识图谱" color="error" /> <TextBadge text="XML标准" color="info" /></>,
    'e2lab',
    '2019年12月25日',
  ],
];
export const dataAPIMockData: any[][] = [
  [
    '数据传输接口规范文档-2021年版',
    <TextBadge text="接口规范" color="success" />,
    'e2lab',
    '2021年6月20日',
  ],
  [
    '数据传输接口规范文档-2020年版',
    <TextBadge text="接口规范" color="success" />,
    'e2lab',
    '2020年3月21日',
  ],
  [
    '数据传输接口规范文档-2019版',
    <TextBadge text="接口规范" color="success" />,
    'e2lab',
    '2019年12月25日',
  ],
];

/**
 * ! Router: /appsManage/dataManage
 * * XML Mock Data: Gather from third party applications, including XML
 */
export const xmlDocumentList: any[][] = [
  [
    '20210910-第一中学教师板书数据.xml',
    '智能黑板板书分析工具',
    <TextBadge text="交互类" color="secondary" />,
    '2021/09/10 14:13:23',
  ],
  [
    '20210911-第一中学教师板书数据.xml',
    '智能黑板板书分析工具',
    <TextBadge text="交互类" color="secondary" />,
    '2021/09/11 15:12:13',
  ],
  [
    '20210911-第十一中学教师板书数据.xml',
    '智能黑板板书分析工具',
    <TextBadge text="交互类" color="secondary" />,
    '2021/09/11 17:24:56',
  ],
  [
    '20210912-大同中学学生数学成绩数据.xml',
    '专课专练',
    <TextBadge text="测评类" color="info" />,
    '2021/09/12 07:03:23',
  ],
  [
    '20210913-大同中学学生数学成绩数据.xml',
    '专课专练',
    <TextBadge text="测评类" color="info" />,
    '2021/09/13 07:53:05',
  ],
  [
    '20210914-华师附小学生数学成绩数据.xml',
    '专课专练',
    <TextBadge text="测评类" color="info" />,
    '2021/09/14 04:03:23',
  ],
];
export const xml =
  `<?xml version="1.0" encoding="ISO-8859-1"?>
<bookstore>
    <book category="COOKING">
        <title lang="en">Everyday Italian</title>
        <author>Giada De Laurentiis</author>
        <year>2005</year>
        <price>30.00</price>
    </book>
    <book category="childrenREN">
        <title lang="en">Harry Potter</title>
        <author>J K. Rowling</author>
        <year>2005</year>
        <price>29.99</price>
    </book>
    <book category="WEB">
        <title lang="en">XQuery Kick Start</title>
        <author>James McGovern</author>
        <author>Per Bothner</author>
        <author>Kurt Cagle</author>
        <author>James Linn</author>
        <author>Vaidyanathan Nagarajan</author>
        <year>2003</year>
        <price>49.99</price>
    </book>
    <book category="WEB">
        <title lang="en">Learning XML</title>
        <author>Erik T. Ray</author>
        <year>2003</year>
        <price>39.95</price>
    </book>
</bookstore>`;

/**
 * ! Router: /appsManage/actionMonitor
 * * Apps Data Monitor
 */
export const appsActions: any[][] = [
  [
    'APP001',
    '大华-智慧黑板',
    '192.168.68.2',
    '修改XML格式并重新上传',
    '2021/07/15 21:36:35:02'
  ],
  [
    'APP002',
    '专课专练',
    '192.168.34.1',
    '登录系统',
    '2021/07/21 12:32:15:42'
  ],
  [
    'ADM001',
    '系统管理员01',
    '192.126.62.2',
    '审核XML数据信息',
    '2021/07/22 01:06:55:02'
  ],
  [
    'APP001',
    '大华-智慧黑板',
    '192.168.68.2',
    '修改XML格式并重新上传',
    '2021/07/15 21:36:35:02'
  ],
  [
    'APP002',
    '专课专练',
    '192.168.34.1',
    '登录系统',
    '2021/07/21 12:32:15:42'
  ],
  [
    'ADM001',
    '系统管理员01',
    '192.126.62.2',
    '审核XML数据信息',
    '2021/07/22 01:06:55:02'
  ],
];
export const errorDataMonitor: any[][] = [
  [
    '大华智慧黑板',
    '数据文件过大, 可能存储异常数据',
    '2021/09/15 13:32:23',
  ],
  [
    '大华智慧黑板',
    '数据格式有误, 已提示第三方厂商进行修改',
    '2021/09/15 17:12:33',
  ],
  [
    '专课专练',
    '数据文件异常, 文件中未记录任何数据信息',
    '2021/09/16 08:22:11',
  ],
  [
    '大华智慧黑板',
    '数据文件过大, 可能存储异常数据',
    '2021/09/15 13:32:23',
  ],
  [
    '大华智慧黑板',
    '数据格式有误, 已提示第三方厂商进行修改',
    '2021/09/15 17:12:33',
  ],
  [
    '专课专练',
    '数据文件异常, 文件中未记录任何数据信息',
    '2021/09/16 08:22:11',
  ],
];

/**
 * ! Router: /modelManage/basicData
 * * basic mock data
 */
export const basicMockDatabaseTree = [
  {
    title: '大同中学数据库',
    id: '1',
    icon: 'database',
    children: [
      {
        title: '101班',
        id: '2',
        icon: 'class',
        children: [
          {
            title: '教师数据1',
            icon: 'data',
            id: '3',
          },
          {
            title: '学生数据1',
            icon: 'data',
            id: '4',
          }
        ]
      },
      {
        title: '102班',
        id: '5',
        icon: 'class',
        children: [
          {
            title: '教师数据2',
            icon: 'data',
            id: '6',
          },
          {
            title: '学生数据2',
            icon: 'data',
            id: '7',
          }
        ]
      },
    ]
  },
  {
    title: '中心小学数据库',
    id: '8',
    icon: 'database',
    children: [
      {
        title: '201班',
        id: '9',
        icon: 'class',
        children: [
          {
            title: '教师数据3',
            icon: 'data',
            id: '10',
          },
          {
            title: '学生数据3',
            icon: 'data',
            id: '11',
          }
        ]
      },
      {
        title: '202班',
        id: '12',
        icon: 'class',
        children: [
          {
            title: '教师数据4',
            icon: 'data',
            id: '13',
          },
          {
            title: '学生数据4',
            icon: 'data',
            id: '14',
          }
        ]
      },
    ]
  },
  {
    title: '第一中学数据库',
    id: '15',
    icon: 'database',
    children: [
      {
        title: '301班',
        id: '16',
        icon: 'class',
        children: [
          {
            title: '教师数据5',
            icon: 'data',
            id: '17',
          },
          {
            title: '学生数据5',
            icon: 'data',
            id: '18',
          }
        ]
      },
      {
        title: '302班',
        id: '19',
        icon: 'class',
        children: [
          {
            title: '教师数据6',
            icon: 'data',
            id: '20',
          },
          {
            title: '学生数据7',
            icon: 'data',
            id: '21',
          }
        ]
      },
    ]
  },
];
export const basicMockData: any[][] = [
  [
    'teach001',
    '发布投票',
    '2021/09/17 16:30:12',
    '教师发起投票：请选出你心目中最佳的作品'
  ],
  [
    'teach001',
    '发放练习题',
    '2021/09/17 16:33:15',
    '教师发布课堂练习题：1...2...'
  ],
  [
    'teach001',
    '共享资源',
    '2021/09/17 16:34:32',
    '教师向全体学生发布资源：课后练习题'
  ],
  [
    'teach001',
    '发起讨论',
    '2021/09/17 16:34:53',
    '请大家一起讨论，是否有更好的方法解决本节课提出的问题？请说出你的看法。'
  ],
];

/**
 * ! Router: /modelManage/basicClassify
 * * 分类体系假数据
 */
export const basicMockClassifyTree = [
  {
    title: '学生发展理论模型',
    id: 'stu-model',
    icon: 'database',
    children: [
      {
        title: '学生德育分析模型',
        id: 'stu1',
        icon: 'folderSpecial',
      },
      {
        title: '学生智育分析模型',
        id: 'stu2',
        icon: 'folderSpecial',
      },
      {
        title: '学生体育分析模型',
        id: 'stu3',
        icon: 'folderSpecial',
      },
      {
        title: '学生美育分析模型',
        id: 'stu4',
        icon: 'folderSpecial',
      },
      {
        title: '学生劳育分析模型',
        id: 'stu6',
        icon: 'folderSpecial',
      },
      {
        title: '学生核心素养分析模型',
        id: 'stu7',
        icon: 'folderSpecial',
      },
    ]
  },
  {
    title: '教师发展理论模型',
    id: 'teacher-model',
    icon: 'database',
    children: [
      {
        title: '教师教案分析模型',
        id: 'teach1',
        icon: 'folderSpecial',
      },
      {
        title: '教师听评课分析模型',
        id: 'teach2',
        icon: 'folderSpecial',
      },
      {
        title: '教师专业发展分析模型',
        id: 'teach3',
        icon: 'folderSpecial',
      },
    ]
  },
];

/**
 * ! Router: /modelManage/basicModel
 * * Feature Engineering Models & Data Mining Models
 */
export const analysisModels = [
  {
    id: 'featureEngineer',
    title: '特征工程模型',
    icon: 'category',
    children: [
      {
        title: '主成分分析',
        id: 'pca',
        icon: 'folderSpecial',
      },
      {
        title: '因子分析',
        id: 'fa',
        icon: 'folderSpecial',

      },
      {
        title: '奇异值分解',
        id: 'svd',
        icon: 'folderSpecial',
      }
    ],
  },
  {
    id: 'dataMining',
    title: '数据分析模型',
    icon: 'accountTree',
    children: [
      {
        title: '可视化分析模型集',
        id: 'visual',
        icon: 'layer',
        children: [
          {
            title: '条形图',
            id: 'bar',
            icon: 'folderSpecial',
          },
          {
            title: '折线图',
            id: 'line',
            icon: 'folderSpecial',
          },
          {
            title: '雷达图',
            id: 'radar',
            icon: 'folderSpecial',
          },
        ],
      },
      {
        title: '监督学习模型集',
        id: 'supervised',
        icon: 'layer',
        children: [
          {
            title: '线性回归',
            id: 'regression',
            icon: 'folderSpecial',
          },
          {
            title: '决策树',
            id: 'tree',
            icon: 'folderSpecial',
          },
          {
            title: '朴素贝叶斯',
            id: 'navBayes',
            icon: 'folderSpecial',
          },
        ],
      },
      {
        title: '无监督学习模型集',
        id: 'unsupervised',
        icon: 'layer',
        children: [
          {
            title: 'k均值聚类',
            id: 'kMeans',
            icon: 'folderSpecial',
          },
          {
            title: '层次聚类',
            id: 'hac',
            icon: 'folderSpecial',
          },
          {
            title: 'GMM聚类',
            id: 'gmm',
            icon: 'folderSpecial',
          },
        ],
      },
      {
        title: '集成学习模型集',
        id: 'integrated',
        icon: 'layer',
        children: [
          {
            title: '袋装法',
            id: 'bagging',
            icon: 'folderSpecial',
          },
          {
            title: '提升法',
            id: 'boosting',
            icon: 'folderSpecial',
          },
          {
            title: '随机森林',
            id: 'randomForest',
            icon: 'folderSpecial',
          },
        ],
      },
      {
        title: '关联挖掘模型集',
        id: 'associated',
        icon: 'layer',
        children: [
          {
            title: '关联规则分析',
            id: 'associateRule',
            icon: 'folderSpecial',
          },
          {
            title: '滞后序列分析',
            id: 'lagSequence',
            icon: 'folderSpecial',
          },
          {
            title: '网络分析',
            id: 'network',
            icon: 'folderSpecial',
          },
        ],
      },
    ],
  }
];


/**
 * ! Router: /modelManage/dataIndex
 * * Provide two kinds of data index: 知识图谱 & 质量指标
 */
export const dataIndexIntroduction = [
  {
    title: '学科知识图谱库',
    img: knowledgeGraphImg,
    introduce: '学科知识图谱将从知识的本质、属性与关联等抽象理论的角度出发，对学科知识结构、知识关联、知识属性等进行梳理，以构建学科知识图谱，为解析行为含义等提供基础',
    actionName: '查看知识图谱库',
    actionKey: 'knowledgeGraphPage',
  },
  {
    title: '教育评价指标库',
    img: dataStandardImg,
    introduce: '教育评价指标是在学科知识图谱的基础上，为每个知识点、技能点、达成方法与目标等进行量化，从而界定知识、技能达成的基本标准与能力的等级水平指标',
    actionName: '查看评价指标库',
    actionKey: 'educationIndexPage',
  },
];
export const KnowledgeGraphTree = [
  {
    title: '核心素养指标库',
    id: '核心素养指标库',
    icon: 'database',
    children: [
      {
        title: '文化基础',
        id: '文化基础',
        icon: 'class',
        children: [
          {
            title: '人文底蕴',
            icon: 'idea',
            id: '人文底蕴',
          },
          {
            title: '科学精神',
            icon: 'idea',
            id: '科学精神',
          }
        ],
      },
      {
        title: '自主发展',
        id: '自主发展',
        icon: 'class',
        children: [
          {
            title: '学会学习',
            icon: 'idea',
            id: '学会学习',
          },
          {
            title: '健康生活',
            icon: 'idea',
            id: '健康生活',
          }
        ],
      },
      {
        title: '社会参与',
        id: '社会参与',
        icon: 'class',
        children: [
          {
            title: '责任担当',
            icon: 'idea',
            id: '责任担当',
          },
          {
            title: '实践创新',
            icon: 'idea',
            id: '实践创新',
          }
        ],
      },
    ],
  },
];
export const EducationIndexTree = [
  {
    title: '数学学科知识图谱',
    id: '数学学科知识图谱',
    icon: 'database',
    children: [
      {
        title: '简易方程',
        id: '简易方程',
        icon: 'class',
      },
      {
        title: '平面几何',
        id: '平面几何',
        icon: 'class'
      },
      {
        title: '统计与概率',
        id: '统计与概率',
        icon: 'class'
      },
    ],
  },
  {
    title: '语文学科知识图谱',
    id: '语文学科知识图谱',
    icon: 'database',
    children: [
      {
        title: '语法',
        id: '语法',
        icon: 'class',
      },
      {
        title: '古诗词',
        id: '古诗词',
        icon: 'class'
      },
    ],
  },
];

/**
 * ! Router: /modelManage/featureEngineering
 * * Provide Feature Variables Tables & The Process to do Feature Engineer
 */
export const MockFeatureVariableTable = [
  {
    title: '学生课堂行为变量表',
    img: knowledgeGraphImg,
    introduce: '通过输入学生在课堂中的各类行为表现，运用特征模型输出五类关键特征行为：听讲、阅读与练习、发言、讨论、无关行为',
    actionName: '查看特征变量表',
    actionKey: '学生课堂行为变量表',
  },
  {
    title: '数学学科能力变量表',
    img: educationIndexImg,
    introduce: '输出四类学生数学学科关键特征能力：问题分析能力、数学建模能力、计算分析能力、数据解释能力',
    actionName: '查看特征变量表',
    actionKey: '数学学科能力变量表',
  },
  {
    title: '课堂互动特征变量表',
    img: knowledgeMapImg,
    introduce: '对学生和教师的课堂互动进行抽取，输出四类特征变量：生生互动、教师提问、学生回应、无关行为',
    actionName: '查看特征变量表',
    actionKey: '课堂互动特征变量表',
  },
  {
    title: '教师教学行为变量表',
    img: dataStandardImg,
    introduce: '对教师教学行为进行分析，输出五类关键教学行为变量：讲解、提问、巡视、组织活动、无关行为',
    actionName: '查看特征变量表',
    actionKey: '教师教学行为变量表',
  },
];
export const MockFeatureVariableData = [
  // '学生id','听讲行为频次','阅读与练习频次','发言频次','讨论频次','无关行为频次','所属图谱','所属知识点'
  [
    'stu2021001',
    '0.60',
    '0.20',
    '0.05',
    '0.12',
    '0.03',
    '数学-统计与概率',
    '柱状图'
  ],
  [
    'stu2021002',
    '0.30',
    '0.10',
    '0.05',
    '0.12',
    '0.43',
    '数学-统计与概率',
    '柱状图'
  ],
  [
    'stu2021003',
    '0.50',
    '0.10',
    '0.15',
    '0.22',
    '0.03',
    '数学-统计与概率',
    '柱状图'
  ],
  [
    'stu2021004',
    '0.70',
    '0.10',
    '0.05',
    '0.12',
    '0.03',
    '数学-统计与概率',
    '柱状图'
  ],
  [
    'stu2021005',
    '0.90',
    '0.00',
    '0.05',
    '0.15',
    '0.00',
    '数学-统计与概率',
    '柱状图'
  ],
  [
    'stu2021006',
    '0.70',
    '0.30',
    '0.00',
    '0.00',
    '0.00',
    '数学-统计与概率',
    '柱状图'
  ],
]
export const MockFeatureEngineerResult = [
  // '学生id','听讲行为频次','阅读与练习频次','发言频次','讨论频次','无关行为频次'
  [
    'stu2021001',
    '0.60',
    '0.20',
    '0.05',
    '0.12',
    '0.03',
  ],
  [
    'stu2021002',
    '0.30',
    '0.10',
    '0.05',
    '0.12',
    '0.43',
  ],
  [
    'stu2021003',
    '0.50',
    '0.10',
    '0.15',
    '0.22',
    '0.03',
  ],
  [
    'stu2021004',
    '0.70',
    '0.10',
    '0.05',
    '0.12',
    '0.03',
  ],
  [
    'stu2021005',
    '0.90',
    '0.00',
    '0.05',
    '0.15',
    '0.00',
  ],
  [
    'stu2021006',
    '0.70',
    '0.30',
    '0.00',
    '0.00',
    '0.00',
  ],
];

/**
 * ! Router: /modelManage/educationalModel
 * * Provide Current Educational Models & To Create New Educational Models
 */
export const MockEducationModelsList = [
  // {
  //   title: '101班学生美育数据分析',
  //   img: educationalModel2,
  //   introduce: '对学生美育指标下的美术课程、音乐课程、校内艺术活动和校外艺术活动进行统计分析',
  //   actionName: '查看数据模型',
  //   actionKey: '101班学生美育数据分析',
  // },
  {
    title: '第一小学教师教案分析',
    img: educationalModel1,
    introduce: '针对教师教案中的教学目标、教学活动设计、教学评价设计等6个指标对教案进行全面的分析与统计',
    actionName: '查看数据模型',
    actionKey: '第一小学教师教案分析',
  },
  {
    title: '三年级语文学科教案数据分析图',
    img: educationalModel3,
    introduce: '三年级语文学科教案数据分析图',
    actionName: '查看数据模型',
    actionKey: '第一小学教师教案分析',
  },
];

const labelOption = {
  show: true,
  // position: app.config.position,
  // distance: app.config.distance,
  // align: app.config.align,
  // verticalAlign: app.config.verticalAlign,
  // rotate: app.config.rotate,
  // formatter: '{c}  {name|{a}}',
  // fontSize: 16,
  // rich: {
  //   name: {}
  // }
};

const scaleTip = [
  {
    title: '教学目标的得分',
    tip: `
      <div style="word-wrap: break-word; white-space: pre-wrap; width: 500px">
        <div><b>等级五</b>：教案设计中新课程改革倡导的“三维目标＂体现明显，从行为主体、行为动词、行为条件、行为程度四个方面进行分析</div>
        <div><b>等级四</b>：教案设计中体现了新课程改革倡导的“三维目标＂，但进行目标陈述时只有一半按照行为主体、行为动词、行为条件、行为程度四个方面进行分析</div>
        <div><b>等级三</b>：教案设计中体现了新课程改革倡导的“三维目标＂，但目标陈述没有从行为主体、行为动词、行为条件、行为程度四个方面进行分析</div>
        <div><b>等级四</b>：教案设计中有教学目标，但没遵循新课程改革倡导的“三维目标”</div>
        <div><b>等级一</b>：教案设计中没有教学目标或者体现不明显</div>
      </div>
      `
  },
  {
    title: '教学内容的得分',
    tip: `
      <div style="word-wrap: break-word; white-space: pre-wrap; width: 500px">
        <div><b>等级五</b>：教学内容源于教科书，并结合学生的生活经验和知识，围绕教学目标，对教材中的教学内容进行调整、重组与整合；教学重点来源于课程目标，遵循学科知识体系，考虑了学生认知发展水平</div>
        <div><b>等级四</b>：教学内容源于教科书，并结合学生的生活经验和知识，围绕教学目标对教材的教学内容进行调整；教学重点部分参照/来源于课程目标，对学生认知发展水平考虑不够；</div>
        <div><b>等级三</b>：教学内容源于教科书，有部分结合学生的生活经验和知识，围绕教学目标对教材的教学内容进行调整；但教学重点的选取没有考虑学生认知发展水平</div>
        <div><b>等级四</b>：教学内容源于教科书，但没有结合学生的生活经验、知识以及教学目标对教材的教学内容进行调整；教学重点选取不恰当</div>
        <div><b>等级一</b>：教学内容选取不源于教科书，教学重点选取不恰当</div>
      </div>
      `
  },
  {
    title: '学习活动任务设计的得分',
    tip: `
      <div style="word-wrap: break-word; white-space: pre-wrap; width: 500px">
        <div><b>等级五</b>：学习活动任务紧扣教学目标，教学重难点描述部分所使用的行为动词或者是体验型动词在设计合理的基础上，运用了可测性较高的动词，提供针对教学重难点的学习活动任务，并辅以类似＂脚手架＂的梯度教学方式</div>
        <div><b>等级四</b>：学习活动任务紧扣教学目标，教学重难点描述部分所使用的行为动词或者是体验型动词均可测，针对教学重难点学习活动任务提供教学方式，但没有体现“脚手架”形式</div>
        <div><b>等级三</b>：学习活动任务紧扣教学目标，教学重难点描述部分所使用的行为动词或者是体验型动词可测性较低，学习活动任务设计的得分脚手架教学方式体现不明显</div>
        <div><b>等级四</b>：学习活动任务紧扣教学目标，教学重难点描述部分所使用的行为动词或者是体验型动词不可测，提供了学习活动任务，但与教学重难点结合度不高</div>
        <div><b>等级一</b>：学习活动任务紧扣教学目标，教学重难点描述部分所使用的行为动词或者是体验型动词不可测，没有提供学习活动任务</div>
      </div>
      `
  },
  {
    title: '学习活动方式设计的得分',
    tip: `
      <div style="word-wrap: break-word; white-space: pre-wrap; width: 500px">
        <div><b>等级五</b>：学习活动方式的运用与教学目标的表述相一致，活动方式多样能照顾到各类学生，创设了自主探究、小组合作的学习活动方式，发挥了学习者的主观能动性</div>
        <div><b>等级四</b>：学习活动方式的运用与教学目标的表述相一致，学习活动方式设计的得分比较多样，有自主探究、小组合作的学习活动方式，但不能照顾大多数学生</div>
        <div><b>等级三</b>：学习活动方式的运用与教学目标的表述相一致，学习活动方式设计的得分单一，学生可选择的自主探究活动方式较少，不能照顾大多数学生</div>
        <div><b>等级四</b>：学习活动方式的运用与教学目标的表述接近一致，学习活动方式设计的得分单一，学生可选择的自主探究活动方式较少，不能照顾一半学生</div>
        <div><b>等级一</b>：学习活动方式的运用与教学目标的表述不一致，学习活动方式不能照顾一小半学生，课堂学习活动方式单一，没有提供学生自主探究任务</div>
      </div>
      `
  },
  {
    title: '资源媒体使用的得分',
    tip: `
      <div style="word-wrap: break-word; white-space: pre-wrap; width: 500px">
        <div><b>等级五</b>：教学设计中资源媒体的使用包括传统媒体和现代媒体，呈现多样化，符合学科特色、学生认知发展规律以及课程教学规律</div>
        <div><b>等级四</b>：教学设计中传统媒体和现代媒体的使用呈现多样，有一半能够与学科特点、学生认知发展规律以及课程教学相联系</div>
        <div><b>等级三</b>：教学设计中有设计使用传统媒体和现代媒体，但呈现较少，没有与学科特点、学生认知发展规律以及课程教学相联系</div>
        <div><b>等级四</b>：教学设计中传统媒体和现代媒体的使用单一，没有与学科特点、学生认知发展规律以及课程教学相联系</div>
        <div><b>等级一</b>：教学设计中没有涉及到传统媒体和现代媒体的使用，资源的使用没有与学科特点、学生认知发展规律以及课程教学相联系</div>
      </div>
      `
  },
  {
    title: '学习评价的设计',
    tip: `
      <div style="word-wrap: break-word; white-space: pre-wrap; width: 500px">
        <div><b>等级五</b>：学习评价渗透在教学过程中，围绕知识目标、关注过程性目标、关注情感态度价值观目标，学习评价方式具有激励性（带有激励性措施、鼓励性评价语言）、评价主体多元化</div>
        <div><b>等级四</b>：学习评价渗透在教学过程中，围绕知识目标、关注过程性目标、情感态度价值观目标，学习评价方式具有激励性、评价主体单一</div>
        <div><b>等级三</b>：学习评价渗透在教学过程中，但是没有围绕知识目标、过程性目标、情感态度价值观目标或者是学习评价目标定位不准确，学习评价方式不具有激励性、评价主体单一</div>
        <div><b>等级四</b>：学习评价没有渗透在教学过程中，提供了有待解决的知识联系实际生活，特别是实践和动手操作能力训练的方面的问题</div>
        <div><b>等级一</b>：学习评价没有渗透在教学过程中，没有提供有待解决的知识联系实际生活，特别是实践和动手操作能力训练的方面的问题</div>
      </div>
      `
  },
];

export const MockEducationModelsResult = {
  title:{
    subtext: '来自教师教学设计模型',
  },
  tooltip: {
    // trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params) {
      let series = params.seriesName;
      let tip = '';
      switch (series) {
        case '教学目标的得分':
          tip = scaleTip[0].tip;
          break;
        case '教学内容的得分':
          tip = scaleTip[1].tip;
          break;
        case '学习活动任务设计的得分':
          tip = scaleTip[2].tip;
          break;
        case '学习活动方式设计的得分':
          tip = scaleTip[3].tip;
          break;
        case '资源媒体使用的得分':
          tip = scaleTip[4].tip;
          break;
        case '学习评价的设计':
          tip = scaleTip[5].tip;
          break;
        default:
        // code
      }
      return (tip);
    }
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: ['教学目标的得分', '教学内容的得分', '学习活动任务设计的得分', '学习活动方式设计的得分', '资源媒体使用的得分', '学习评价的设计']
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['张三', '李四', '王五']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '教学目标的得分',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 5, 2]
    },
    {
      name: '教学内容的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [3, 4, 5]
    },
    {
      name: '学习活动任务设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [5, 4, 3]
    },
    {
      name: '学习活动方式设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 2, 2]
    },
    {
      name: '资源媒体使用的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 4, 4]
    },
    {
      name: '学习评价的设计',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 3, 4]
    },
  ]
};
export const MockEducationModelsResultLevel1 = {
  title:{
    subtext: '来自教师教学设计模型',
  },
  tooltip: {
    // trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params) {
      let series = params.seriesName;
      let tip = '';
      switch (series) {
        case '教学目标的得分':
          tip = scaleTip[0].tip;
          break;
        case '教学内容的得分':
          tip = scaleTip[1].tip;
          break;
        case '学习活动任务设计的得分':
          tip = scaleTip[2].tip;
          break;
        case '学习活动方式设计的得分':
          tip = scaleTip[3].tip;
          break;
        case '资源媒体使用的得分':
          tip = scaleTip[4].tip;
          break;
        case '学习评价的设计':
          tip = scaleTip[5].tip;
          break;
        default:
        // code
      }
      return (tip);
    }
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: ['教学目标的得分', '教学内容的得分', '学习活动任务设计的得分', '学习活动方式设计的得分', '资源媒体使用的得分', '学习评价的设计']
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['张三', '李四', '王五']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '教学目标的得分',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 5, 2]
    },
    {
      name: '教学内容的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [3, 4, 5]
    },
    {
      name: '学习活动任务设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [5, 4, 3]
    },
    {
      name: '学习活动方式设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 2, 2]
    },
    {
      name: '资源媒体使用的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 4, 4]
    },
    {
      name: '学习评价的设计',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 3, 4]
    },
    {
      type: 'bar',
      markLine: {
        silent: true,
        label: {
          show: true,
          position: 'start',
          formatter: '标准级别'
        },
        lineStyle: {
          // color: '#FF4040'
        },
        data: [{
          yAxis: 1
        }]
      }
    },
  ]
};
export const MockEducationModelsResultLevel2 = {
  title:{
    subtext: '来自教师教学设计模型',
  },
  tooltip: {
    // trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params) {
      let series = params.seriesName;
      let tip = '';
      switch (series) {
        case '教学目标的得分':
          tip = scaleTip[0].tip;
          break;
        case '教学内容的得分':
          tip = scaleTip[1].tip;
          break;
        case '学习活动任务设计的得分':
          tip = scaleTip[2].tip;
          break;
        case '学习活动方式设计的得分':
          tip = scaleTip[3].tip;
          break;
        case '资源媒体使用的得分':
          tip = scaleTip[4].tip;
          break;
        case '学习评价的设计':
          tip = scaleTip[5].tip;
          break;
        default:
        // code
      }
      return (tip);
    }
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: ['教学目标的得分', '教学内容的得分', '学习活动任务设计的得分', '学习活动方式设计的得分', '资源媒体使用的得分', '学习评价的设计']
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['张三', '李四', '王五']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '教学目标的得分',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 5, 2]
    },
    {
      name: '教学内容的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [3, 4, 5]
    },
    {
      name: '学习活动任务设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [5, 4, 3]
    },
    {
      name: '学习活动方式设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 2, 2]
    },
    {
      name: '资源媒体使用的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 4, 4]
    },
    {
      name: '学习评价的设计',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 3, 4]
    },
    {
      type: 'bar',
      markLine: {
        silent: true,
        label: {
          show: true,
          position: 'start',
          formatter: '标准级别'
        },
        lineStyle: {
          // color: '#FF4040'
        },
        data: [{
          yAxis: 2
        }]
      }
    },
  ]
};
export const MockEducationModelsResultLevel3 = {
  title:{
    subtext: '来自教师教学设计模型',
  },
  tooltip: {
    // trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params) {
      let series = params.seriesName;
      let tip = '';
      switch (series) {
        case '教学目标的得分':
          tip = scaleTip[0].tip;
          break;
        case '教学内容的得分':
          tip = scaleTip[1].tip;
          break;
        case '学习活动任务设计的得分':
          tip = scaleTip[2].tip;
          break;
        case '学习活动方式设计的得分':
          tip = scaleTip[3].tip;
          break;
        case '资源媒体使用的得分':
          tip = scaleTip[4].tip;
          break;
        case '学习评价的设计':
          tip = scaleTip[5].tip;
          break;
        default:
        // code
      }
      return (tip);
    }
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: ['教学目标的得分', '教学内容的得分', '学习活动任务设计的得分', '学习活动方式设计的得分', '资源媒体使用的得分', '学习评价的设计']
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['张三', '李四', '王五']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '教学目标的得分',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 5, 2]
    },
    {
      name: '教学内容的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [3, 4, 5]
    },
    {
      name: '学习活动任务设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [5, 4, 3]
    },
    {
      name: '学习活动方式设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 2, 2]
    },
    {
      name: '资源媒体使用的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 4, 4]
    },
    {
      name: '学习评价的设计',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 3, 4]
    },
    {
      type: 'bar',
      markLine: {
        silent: true,
        label: {
          show: true,
          position: 'start',
          formatter: '标准级别'
        },
        lineStyle: {
          // color: '#FF4040'
        },
        data: [{
          yAxis: 3
        }]
      }
    },
  ]
};
export const MockEducationModelsResultLevel4 = {
  title:{
    subtext: '来自教师教学设计模型',
  },
  tooltip: {
    // trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params) {
      let series = params.seriesName;
      let tip = '';
      switch (series) {
        case '教学目标的得分':
          tip = scaleTip[0].tip;
          break;
        case '教学内容的得分':
          tip = scaleTip[1].tip;
          break;
        case '学习活动任务设计的得分':
          tip = scaleTip[2].tip;
          break;
        case '学习活动方式设计的得分':
          tip = scaleTip[3].tip;
          break;
        case '资源媒体使用的得分':
          tip = scaleTip[4].tip;
          break;
        case '学习评价的设计':
          tip = scaleTip[5].tip;
          break;
        default:
        // code
      }
      return (tip);
    }
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: ['教学目标的得分', '教学内容的得分', '学习活动任务设计的得分', '学习活动方式设计的得分', '资源媒体使用的得分', '学习评价的设计']
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['张三', '李四', '王五']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '教学目标的得分',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 5, 2]
    },
    {
      name: '教学内容的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [3, 4, 5]
    },
    {
      name: '学习活动任务设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [5, 4, 3]
    },
    {
      name: '学习活动方式设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 2, 2]
    },
    {
      name: '资源媒体使用的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 4, 4]
    },
    {
      name: '学习评价的设计',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 3, 4]
    },
    {
      type: 'bar',
      markLine: {
        silent: true,
        label: {
          show: true,
          position: 'start',
          formatter: '标准级别'
        },
        lineStyle: {
          // color: '#FF4040'
        },
        data: [{
          yAxis: 4
        }]
      }
    },
  ]
};
export const MockEducationModelsResultLevel5 = {
  title:{
    subtext: '来自教师教学设计模型',
  },
  tooltip: {
    // trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params) {
      let series = params.seriesName;
      let tip = '';
      switch (series) {
        case '教学目标的得分':
          tip = scaleTip[0].tip;
          break;
        case '教学内容的得分':
          tip = scaleTip[1].tip;
          break;
        case '学习活动任务设计的得分':
          tip = scaleTip[2].tip;
          break;
        case '学习活动方式设计的得分':
          tip = scaleTip[3].tip;
          break;
        case '资源媒体使用的得分':
          tip = scaleTip[4].tip;
          break;
        case '学习评价的设计':
          tip = scaleTip[5].tip;
          break;
        default:
        // code
      }
      return (tip);
    }
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: ['教学目标的得分', '教学内容的得分', '学习活动任务设计的得分', '学习活动方式设计的得分', '资源媒体使用的得分', '学习评价的设计']
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['张三', '李四', '王五']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '教学目标的得分',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 5, 2]
    },
    {
      name: '教学内容的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [3, 4, 5]
    },
    {
      name: '学习活动任务设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [5, 4, 3]
    },
    {
      name: '学习活动方式设计的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 2, 2]
    },
    {
      name: '资源媒体使用的得分',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [1, 4, 4]
    },
    {
      name: '学习评价的设计',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [2, 3, 4]
    },
    {
      type: 'bar',
      markLine: {
        silent: true,
        label: {
          show: true,
          position: 'start',
          formatter: '标准级别'
        },
        lineStyle: {
          // color: '#FF4040'
        },
        data: [{
          yAxis: 5
        }]
      }
    },
  ]
};


// mock 折线图
export const MockLineChart = {
  tooltip:{},
  xAxis: {
    type: 'category',
    data: ['9月', '10月', '11月', '12月', '1月', '3月', '4月']
  },
  yAxis: {
    type: 'value',
    min: 2,
    max: 5,
  },
  series: [
    {
      data: [2.5, 3.6, 4.3, 4.1, 4.5, 3.8, 3.3],
      type: 'line',
      symbol: 'circle',
      symbolSize: 16,
      lineStyle: {
        color: '#5470C6',
        width: 4,
        type: 'dashed'
      },
      itemStyle: {
        borderWidth: 3,
        borderColor: '#EE6666',
        color: 'yellow'
      }
    }
  ]
}

/**
 * ! Router: /modelManage/dataClassify
 * * 数据分层假数据
 */
export const MockClassifyDataList = [
  {
    title: '学生课堂行为分类规范',
    img: educationalModel2,
    introduce: '对学生课堂学习行为按照布鲁姆教育目标分类进行归类',
    actionName: '查看数据分类',
    actionKey: '学生课堂行为分类规范',
  },
  {
    title: '师生课堂互动行为分类规范',
    img: educationalModel1,
    introduce: '对师生间的课堂互动行为按照弗兰德斯互动分类系统进行归类',
    actionName: '查看数据分类',
    actionKey: '师生课堂互动行为分类规范',
  },
];
export const MockClassifyData = [
  // 数据分类，数据项，所属分类体系
  [
    '知道',
    '阅读, 观看视频, 浏览资源',
    '布鲁姆-认知领域分类',
  ],
  [
    '分析',
    '提出问题, 提出质疑',
    '布鲁姆-认知领域分类',
  ],
  [
    '创新',
    '制作作品, 修改项目',
    '布鲁姆-动作技能领域分类'
  ]
];
export const MockClassifyDataTable = [
  { title: '大同中学-101班-教师板书行为数据表' },
  { title: '大同中学-101班-学生课堂互动行为数据表' },
  { title: '大同中学-101班-学生课后练习数据表' },
  { title: '大同中学-101班-师生课堂交互数据表' },
  // { title: '大同中学-102班-教师板书行为数据表' },
  // { title: '大同中学-102班-学生课堂互动行为数据表' },
  // { title: '大同中学-102班-学生课后练习数据表' },
  // { title: '大同中学-102班-师生课堂交互数据表' },
];

/**
 * ! Router: /modelManage/decisionSupport
 * * 决策支持服务配置
 */
export const MockDecisionSupportList = [
  // {
  //   title: '101班学生美育数据分析',
  //   img: knowledgeMapImg,
  //   introduce: '对学生美育指标下的美术课程、音乐课程、校内艺术活动和校外艺术活动进行统计分析',
  //   actionName: '查看数据模型',
  //   actionKey: '101班学生美育数据分析',
  // },
  {
    title: '第一小学教师教案分析',
    img: educationalModel1,
    introduce: '针对教师教案中的教学目标、教学活动设计、教学评价设计等6个指标对教案进行全面的分析与统计',
    actionName: '查看数据模型',
    actionKey: '第一小学教师教案分析',
  },
];

/**
 * ! Router: /userSpace/decisionSpace
 * * The Mock Data for decisions
 */
export interface decisionListItem {
  img: string,
  title: string,
  introduce: string,
  actionName: string,
  actionKey: string,
  category: string,
}
export const decisionListMockData: decisionListItem[] = [
  {
    img: actionStandardImg,
    title: '智能黑板',
    introduce: '将基于教学场景中的智能黑板采集到的实体信息与数据,进行决策分析',
    actionName: '查看决策分析',
    actionKey: 'smartBlackboard',
    category: 'teachSceneBased',

  },
  {
    img: dataStandardImg,
    title: '教学行为分析',
    introduce: '将基于教学行为分析采集到的实体信息与数据,进行决策分析',
    actionName: '查看决策分析',
    actionKey: 'teachingBehavior',
    category: 'teachSceneBased',
  },
  {
    img: knowledgeMapImg,
    title: '专课专练',
    introduce: '将基于专课专练采集到的实体信息与数据,进行决策分析',
    actionName: '查看决策分析',
    actionKey: 'specialTraining',
    category: 'teachSceneBased',
  },
  {
    img: dataAPIImg,
    title: '学科分析',
    introduce: '将基于学科分析进行决策分析',
    actionName: '查看决策分析',
    actionKey: 'subjectAnalysis',
    category: 'subjectOrClassBased',
  },
  {
    img: dataAPIImg,
    title: '班级分析',
    introduce: '将基于班级分析进行决策分析',
    actionName: '查看决策分析',
    actionKey: 'classAnalysis',
    category: 'subjectOrClassBased',
  },
  {
    img: dataAPIImg,
    title: '学校分析',
    introduce: '将基于学校分析进行决策分析',
    actionName: '查看决策分析',
    actionKey: 'schoolAnalysis',
    category: 'subjectOrClassBased',
  },
];


/**
 * ! Router: /userSpace/decisionSpace
 * * The Mock Data for decisions' echarts - gauge chart
 */
export const gaugeData = [{
  value: 20,
  name: '完成率',
  title: {
    offsetCenter: ['-40%', '80%']
  },
  detail: {
    offsetCenter: ['-40%', '95%']
  }
},
{
  value: 40,
  name: '达标率',
  title: {
    offsetCenter: ['0%', '80%']
  },
  detail: {
    offsetCenter: ['0%', '95%']
  }
},
{
  value: 60,
  name: '优秀率',
  title: {
    offsetCenter: ['40%', '80%']
  },
  detail: {
    offsetCenter: ['40%', '95%']
  }
}
];

export const gaugeOption = {
  series: [{
    type: 'gauge',
    anchor: {
      show: true,
      showAbove: true,
      size: 18,
      itemStyle: {
        color: '#FAC858'
      }
    },
    pointer: {
      icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
      width: 8,
      length: '80%',
      offsetCenter: [0, '8%']
    },
    progress: {
      show: true,
      overlap: true,
      roundCap: true
    },
    axisLine: {
      roundCap: true
    },
    data: gaugeData,
    title: {
      fontSize: 14
    },
    detail: {
      width: 40,
      height: 14,
      fontSize: 14,
      color: '#fff',
      backgroundColor: 'auto',
      borderRadius: 3,
      formatter: '{value}%'
    }
  }]
};

/**
 * ! Router: /userSpace/decisionSpace
 * * The Mock Data for decisions' echarts - radar chart
 */
export const radarOption = {
  legend: {
    data: ['Allocated Budget', 'Actual Spending']
  },
  radar: {
    // shape: 'circle',
    indicator: [{
      name: 'Sales',
      max: 6500
    },
    {
      name: 'Administration',
      max: 16000
    },
    {
      name: 'Information Technology',
      max: 30000
    },
    {
      name: 'Customer Support',
      max: 38000
    },
    {
      name: 'Development',
      max: 52000
    },
    {
      name: 'Marketing',
      max: 25000
    }
    ]
  },
  series: [{
    name: 'Budget vs spending',
    type: 'radar',
    data: [{
      value: [4200, 3000, 20000, 35000, 50000, 18000],
      name: '预算分配(Allocated Budget)'
    },
    {
      value: [5000, 14000, 28000, 26000, 42000, 21000],
      name: '实际开销(Actual Spending)'
    }
    ]
  }]
};
/**
 * ! Router: /userSpace/decisionSpace
 * * The Mock Data for decisions' echarts - mix line & bar chart
 */
export const mixLineBarOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  legend: {
    data: ['交互次数', '掌握的知识点数量', '学习时长']
  },
  xAxis: [{
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisPointer: {
      type: 'shadow'
    }
  }],
  yAxis: [{
    type: 'value',
    name: '交互次数',
    min: 0,
    max: 250,
    interval: 50,
    axisLabel: {
      formatter: '{value}'
    }
  },
  {
    type: 'value',
    name: '学习时长',
    min: 0,
    max: 25,
    interval: 5,
    axisLabel: {
      formatter: '{value} min'
    }
  }
  ],
  series: [
    {
      name: '交互次数',
      type: 'bar',
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
      ]
    },
    {
      name: '掌握的知识点数量',
      type: 'bar',
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
      ]
    },
    {
      name: '学习时长',
      type: 'line',
      yAxisIndex: 1,
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
    }
  ]
};


/**
 * ! Router: /userSpace/decisionSpace
 * * The Mock Data for decisions' echarts - scatterchart
 */
const hours = [
  '12a', '1a', '2a', '3a', '4a', '5a', '6a',
  '7a', '8a', '9a', '10a', '11a',
  '12p', '1p', '2p', '3p', '4p', '5p',
  '6p', '7p', '8p', '9p', '10p', '11p'
];

const days = [
  'Saturday', 'Friday', 'Thursday',
  'Wednesday', 'Tuesday', 'Monday', 'Sunday'
];

// prettier-ignore
const data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]];

const title: TitleComponentOption[] = [];
const singleAxis: SingleAxisComponentOption[] = [];
const series: ScatterSeriesOption[] = [];

days.forEach(function (day, idx) {
  title.push({
    textBaseline: 'middle',
    top: ((idx + 0.5) * 100) / 7 + '%',
    text: day
  });
  singleAxis.push({
    left: 150,
    type: 'category',
    boundaryGap: false,
    data: hours,
    top: (idx * 100) / 7 + 5 + '%',
    height: 100 / 7 - 10 + '%',
    axisLabel: {
      interval: 2
    }
  });
  series.push({
    singleAxisIndex: idx,
    coordinateSystem: 'singleAxis',
    type: 'scatter',
    data: [],
    symbolSize: function (dataItem) {
      return dataItem[1] * 4;
    }
  });
});
data.forEach(function (dataItem) {
  (series as any)[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
});

export const scatterOption = {
  tooltip: {
    position: 'top'
  },
  title: title,
  singleAxis: singleAxis,
  series: series
};



/**
 * ! Router: /userSpace/decisionSpace
 * * The Mock Data for decisions' echarts - heatmap chart
 */
const students = [
  'stu01', 'stu02', 'stu03', 'stu04', 'stu05', 'stu06', 'stu07',
  'stu08', 'stu09', 'stu10', 'stu11', 'stu12',
  'stu13', 'stu14', 'stu15', 'stu16', 'stu17', 'stu18',
  'stu19', 'stu20', 'stu21', 'stu22', 'stu23', 'stu24'
];
const knowledges = [
  '知识点1', '知识点2', '知识点3',
  '知识点4', '知识点5', '知识点6', '知识点7'
];
const heatData = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]].map(function (item) {
  return [item[1], item[0], item[2] || '-'];
});
export const heatmapOption = {
  tooltip: {
    position: 'top'
  },
  grid: {
    height: '50%',
    top: '10%'
  },
  xAxis: {
    type: 'category',
    data: students,
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    data: knowledges,
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: 10,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '15%',
    inRange: {
      color: ['#fff', '#1a5678'] //From smaller to bigger value ->
    }
  },
  series: [{
    name: 'Punch Card',
    type: 'heatmap',
    data: heatData,
    label: {
      show: true
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      }
    }
  }]
};

/**
 * ! Router: /userSpace/growthFile
 * * The Mock Data for user profile
 */
//主页上发的动态的格式
interface profilePostProps {
  title: string,
  content: string,
  likeNum: number,
  commentNum: number,
  commentList: {}[]
  imgList?: string[],
  type: 'text' | 'pics', //纯文字or带图片
}
//主页上的用户信息格式
interface myProfileProps {
  username: string,
  // school: string,
  // grade: string,
  // group: string,
  // title: string,
  career: string,
  info: string,
  // email: string,
  studentNum: number,
  rankInTeam: number,
  teamMemberSum: number,
  visits: number,
  avatar: string,
  loginLog: LoginLogProps[],
  tableList: TableItemProps[],
  commonUsedModel: ModelProps[],
  latestGraph: string,

}
interface TableItemProps {
  title: string
}

interface LoginLogProps {
  loginTime: string,
  username: string,
  role: string,
  location: string,
  ip: string,
  device: string
}

interface ModelProps {
  icon: any,
  name: string,
  description: string,
  creator?: string,
  updateTime?: string,
}

export const myProfileMockData: myProfileProps = {
  username: '李老师',
  career: '诸暨市荣怀实验学校-三年级-语文组-副高级教师',
  info: '个人简介个人简介个人简介个人简介个人简介个人简介个人简介个人简介个人简介个人简介个人简介',
  // email: 'info@example.com',
  studentNum: 56,
  rankInTeam: 8,
  teamMemberSum: 24,
  visits: 2223,
  avatar: userPicture,
  latestGraph: barSimpleGraph,
  loginLog: [
    {
      loginTime: '2021-12-14 12:00',
      username: '李老师',
      role: '教师',
      location: '上海市普陀区',
      ip: '192.168.123.100',
      device: 'windows10/Firefox'
    }, {

      loginTime: '2021-10-02 12:00',
      username: '李老师',
      role: '教师',
      location: '上海市普陀区',
      ip: '192.168.123.100',
      device: 'windows10/Firefox'
    }, {

      loginTime: '2021-05-02 12:00',
      username: '李老师',
      role: '教师',
      location: '上海市普陀区',
      ip: '192.168.123.100',
      device: 'windows10/Firefox'
    }
  ],
  tableList: [{
    title: '三年级语文学科教案数据分析表',
  }, {
    title: '三年级语文学科教案数据',
  }, {
    title: '三年级2班全体学生美育数据'
  },{
    title: '三年级3班全体学生美育数据'
  }],
  commonUsedModel: [
    {
      icon: DraftsIcon,
      name: '教师教案分析模型',
      description: '教师教案分析模型是对教师教案质量进行评估，服务于教学反思，有针对性的提升教师教学设计能力。教案分析模型通过对教案的教学目标、教学内容、学习活动任务设计、学习活动方式设计、资源媒体的运用、学习评价设计这六个方面进行综合分析，来评估教师教案质量所处层级。',
      creator: '凤蝶精英小分队',
      updateTime: '5 小时前',
    }, {
      icon: BookIcon,
      name: '学生艺术素养分析模型',
      description: '学生艺术素养分析模型是对学生美育表现进行评估，通过对学生美术课程、音乐课程、校内艺术活动、校外艺术活动情况进行记录，并按照一定规则进行统计分析，来评估学生当前艺术素养所处层级。',
    },
  ]
}

export const appFunctions = [
  {
    title: '学习管理活动',
    img: educationalModel2,
    introduce: '该工具中能够提供学习管理活动支持的功能模块',
    actionName: '查看功能模块',
  },
  {
    title: '成果产出活动',
    img: educationalModel1,
    introduce: '该工具中能够提供成果产出活动支持的功能模块',
    actionName: '查看功能模块',
  },
]

// export interface funcDetailItemProps{
//     title: string,
//     rect: [number, number, number, number],
//     description: string,
// }
export interface funcDetailProps {
  image: string,
  func: funcDetailItemProps[]
}
// export const functionDetail:funcDetailProps = {
//     image: appImg,
//     func: [
//         {
//             title:'功能模块1',
//             rect: [330, 90, 850, 680],
//             description: '视频学习区域，能够帮助学生了解知识点'
//         },{
//             title:'功能模块2',
//             rect: [1500, 5, 400, 900],
//             description: '目录区域，了解整体架构'
//         }
//     ]
// }

export interface funcDetailItemProps {
  image: string,
  title: string,
  rect: [number, number, number, number],
  description: string
}

export const functionDetail: funcDetailItemProps[] = [
  {
    image: appImg1,
    title: '功能模块1',
    rect: [0, 1300, 1080, 600],
    description: '视频学习区域，能够帮助学生了解知识点'
  }, {
    image: appImg2,
    title: '功能模块2',
    rect: [0, 450, 1080, 600],
    description: '描述描述'
  }, {
    image: appImg3,
    title: '功能模块3',
    rect: [0, 1150, 1080, 400],
    description: '描述描述描述描述描述描述'
  }, {
    image: appImg4,
    title: '功能模块4',
    rect: [0, 250, 1080, 1750],
    description: '描述描述描述描述描述描述描述描述描述描述'
  },
]


export const cascaderOptions = [
  {
    value: "shangHai",
    label: "上海",
    children: [
      {
        value: "PuTuo",
        label: "普陀",
        children: [
          {
            value: "xx",
            label: "xx中学",
            image: dataStandardImg,
            description: '普陀区xx中学 ',
            teacherSum: 100,
            studentSum: 1000,
            courseSum: 50,
            selectAbled: true,

            type: 'school'
          },
          {
            value: "xy",
            label: "xy中学",
            image: educationalModel2,
            description: '普陀区xy中学 ',
            teacherSum: 100,
            studentSum: 1000,
            courseSum: 50,
            selectAbled: true,
            type: 'school'
          },
          {
            value: "yy",
            label: "yy中学",
            image: educationalModel1,
            description: '普陀区yy中学 ',
            teacherSum: 100,
            studentSum: 1000,
            courseSum: 50,
            selectAbled: true,
            type: 'school'
          },
        ],
        image: actionStandardImg,
        description: '普陀区，隶属于上海市，位于上海中心城区西北部，是沪宁发展轴线的起点，也是上海连接长三角及内地的重要陆上门户和交通枢纽。 ',
        schoolSum: 100,
        teacherSum: 1313,
        studentSum: 100000,
        courseSum: 5000,
        selectAbled: true,
        type: 'district'
      },
      {
        value: "minHang",
        label: "闵行",
        children: [
        ],
        image: actionStandardImg,
        description: '闵行区 ',
        schoolSum: 100,
        teacherSum: 1313,
        studentSum: 100000,
        courseSum: 5000,
        selectAbled: true,
        type: 'district'
      },
    ],
  },
  {
    value: "zhejiang",
    label: "浙江",
    children: [
      {
        value: "hangzhou",
        label: "杭州",
      },
      {
        value: "wenZhou",
        label: "温州",
        children: [
          {
            value: "luCheng",
            label: "鹿城",
            children: [
              {
                value: "wenZhouZhongXue",
                label: "温州中学",
              },
              {
                value: "wenZhouErZhong",
                label: "温州二中",
              },
            ],
            image: actionStandardImg,
            description: '鹿城区',
            schoolSum: 100,
            teacherSum: 1313,
            studentSum: 100000,
            courseSum: 5000,
            selectAbled: true,
            type: 'district'
          },
          {
            value: "ouHai",
            label: "瓯海",
            children: [
              {
                value: "ouHaiZhongXue",
                label: "瓯海中学",
              },
            ],
            image: actionStandardImg,
            description: '瓯海区',
            schoolSum: 100,
            teacherSum: 1313,
            studentSum: 100000,
            courseSum: 5000,
            selectAbled: true,
            type: 'district'
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "江苏",
    children: [
      {
        value: "nanjing",
        label: "南京",
      },
    ],
  },
];

export const schoolData = [
  {
    value: "grade1",
    label: "一年级",
    children: [
      {
        value: "class1",
        label: "一班",
        image: actionStandardImg,
        description: '普陀区，隶属于上海市，位于上海中心城区西北部，是沪宁发展轴线的起点，也是上海连接长三角及内地的重要陆上门户和交通枢纽。 ',
        schoolSum: 100,
        teacherSum: 1313,
        studentSum: 100000,
        courseSum: 5000,
        selectAbled: true,
        type: 'district'
      },
      {
        value: "class2",
        label: "二班",
        children: [
        ],
        image: actionStandardImg,
        description: '闵行区 ',
        schoolSum: 100,
        teacherSum: 1313,
        studentSum: 100000,
        courseSum: 5000,
        selectAbled: true,
        type: 'district'
      },
    ],
  },
  {
    value: "grade2",
    label: "二年级",
    children: [
      {
        value: "class1",
        label: "一班",
        image: actionStandardImg,
        description: '普陀区，隶属于上海市，位于上海中心城区西北部，是沪宁发展轴线的起点，也是上海连接长三角及内地的重要陆上门户和交通枢纽。 ',
        schoolSum: 100,
        teacherSum: 1313,
        studentSum: 100000,
        courseSum: 5000,
        selectAbled: true,
        type: 'district'
      },
      {
        value: "class2",
        label: "二班",
        children: [
        ],
        image: actionStandardImg,
        description: '闵行区 ',
        schoolSum: 100,
        teacherSum: 1313,
        studentSum: 100000,
        courseSum: 5000,
        selectAbled: true,
        type: 'district'
      },
    ],
  },
  {
    value: "grade3",
    label: "三年级",
    children: [
      {
        value: "class1",
        label: "一班",
        image: actionStandardImg,
        description: '普陀区，隶属于上海市，位于上海中心城区西北部，是沪宁发展轴线的起点，也是上海连接长三角及内地的重要陆上门户和交通枢纽。 ',
        schoolSum: 100,
        teacherSum: 1313,
        studentSum: 100000,
        courseSum: 5000,
        selectAbled: true,
        type: 'district'
      },
      {
        value: "class2",
        label: "二班",
        children: [
        ],
        image: actionStandardImg,
        description: '闵行区 ',
        schoolSum: 100,
        teacherSum: 1313,
        studentSum: 100000,
        courseSum: 5000,
        selectAbled: true,
        type: 'district'
      },
    ],
  },
];


export const thirdPartyAppTable = [
  {
    id: 1,
    tool: "工具1",
    company: "大华",
    frequency: 12300,
    status: "Success",
    updateTime: "2021-09-11",
  },
  {
    id: 2,
    tool: "工具2",
    company: "大华",
    frequency: 12300,
    status: "Success",
    updateTime: "2021-09-11",
  },
  {
    id: 3,
    tool: "工具3",
    company: "大华",
    frequency: 12300,
    status: "Success",
    updateTime: "2021-09-11",
  },
  {
    id: 4,
    tool: "工具4",
    company: "大华",
    frequency: 12300,
    status: "Success",
    updateTime: "2021-09-11",
  },
  {
    id: 5,
    tool: "工具1",
    company: "大华",
    frequency: 12300,
    status: "Success",
    updateTime: "2021-09-11",
  },
  {
    id: 6,
    tool: "工具1",
    company: "大华",
    frequency: 12300,
    status: "Success",
    updateTime: "2021-09-11",
  },
  {
    id: 7,
    tool: "工具1",
    company: "大华",
    frequency: 12300,
    status: "Success",
    updateTime: "2021-09-11",
  },
  {
    id: 8,
    tool: "工具1",
    company: "大华",
    frequency: 12300,
    status: "Success",
    updateTime: "2021-09-11",
  },
  {
    id: 9,
    tool: "工具1",
    company: "大华",
    frequency: 12300,
    status: "Success",
    updateTime: "2021-09-11",
  },
  {
    id: 10,
    tool: "工具1",
    company: "大华",
    frequency: 12300,
    status: "Success",
    updateTime: "2021-09-11",
  },
];

export const defaultColsProps = [
  {
    field: "id",
    // hide: true,
    headerName: '序号'
  },
  {
    field: "tool",
    renderCell: 'cellExpand',
    flex: 1,
    minWidth: 150,
    headerName: '教学工具'

  },
  {
    editable: false,
    field: "company",
    flex: 1,
    minWidth: 150,
    headerName: '厂商名称'
  },
  {
    field: "frequency",
    flex: 0.5,
    headerName: '服务调用次数'
  },
  {
    field: "status",
    flex: 0.5,
    minWidth: 100,
    renderCell: 'status',
    headerName: '状态'
  },
  {
    field: "updateTime",
    flex: 0.5,
    minWidth: 100,
    headerName: '更新时间'
  },
  {
    headerName: "操作",
    field: "action",
    flex: 1,
    minWidth: 150,
    // valueGetter:
    renderCell: 'actions',
  },
]


export const defaultField2Name = {
  id: "序号",
  tool: "教学工具",
  company: "厂商名称",
  frequency: "服务调用次数",
  status: "状态",
  updateTime: "更新时间",
  action: "操作",
};



export const appBehaviorListColsProps = [
  {
    field: "id",
    // hide: true,
    headerName: '序号'
  },
  {
    field: "tool",
    renderCell: 'cellExpand',
    flex: 1,
    minWidth: 150,
    headerName: '教学工具'

  },
  {
    editable: false,
    field: "company",
    flex: 1,
    minWidth: 150,
    headerName: '厂商名称'
  },
  {
    field: "behaviorName",
    flex: 0.5,
    headerName: '行为名称'
  },
  {
    field: "pageFunctionIntro",
    flex: 0.5,
    minWidth: 100,
    renderCell: 'cellExpand',
    headerName: '页面功能介绍'
  },
  {
    field: "updateTime",
    flex: 0.5,
    minWidth: 100,
    headerName: '更新时间'
  },
  {
    headerName: "操作",
    field: "action",
    flex: 1,
    minWidth: 150,
    // valueGetter:
    renderCell: 'actions',
  },
]

export const appBehaviorListTable = [
  {
    id: 1,
    tool: "工具1",
    company: "大华",
    behaviorName: '行为名字',
    pageFunctionIntro: "功能介绍",
    updateTime: "2021-09-11",
  },
];


export const behaviorRelationListColsProps = [
  {
    field: "id",
    // hide: true,
    headerName: '序号'
  },
  {
    field: "tool",
    renderCell: 'cellExpand',
    flex: 1,
    minWidth: 150,
    headerName: '教学工具'

  },
  {
    editable: false,
    field: "company",
    flex: 1,
    minWidth: 150,
    headerName: '厂商名称'
  },
  {
    field: "behaviorName",
    flex: 0.5,
    headerName: '行为名称'
  },
  {
    field: "modelName",
    flex: 0.5,
    minWidth: 100,
    headerName: '模型名称'
  }, {
    field: "attribute",
    flex: 0.5,
    minWidth: 100,
    headerName: '属性'
  },
  {
    field: "updateTime",
    flex: 0.5,
    minWidth: 100,
    headerName: '更新时间'
  },
  {
    headerName: "操作",
    field: "action",
    flex: 1,
    minWidth: 150,
    // valueGetter:
    renderCell: 'actions',
  },
]

export const behaviorRelationListTable = [
  {
    id: 1,
    tool: "工具1",
    company: "大华",
    behaviorName: '行为名字',
    modelName: "学生艺术素养分析模型",
    attribute: '学期末美术基础知识笔试得分',
    updateTime: "2021-09-11",
  },
];

export const reportList = [
  {
    title: '三年级语文学科教案数据分析报告',
    updateTime: '2分钟前',
    avatar: userPicture,
  }, {

    title: '三年级2班全体学生美育分析',
    updateTime: '5小时前',
    avatar: knowledgeGraphImg,
  }
]

export const studentBasicDataTableColProps = [
  {
    field: "province",
    headerName: '省',
    // hide: true,
  }, {
    field: 'city',
    headerName: '市',
  }, {
    field: 'area',
    headerName: '县级市/区/县',
  }, {
    field: 'school',
    headerName: '学校名称',
  }, {
    field: 'grade',
    headerName: '年级',
  }, {
    field: 'class',
    headerName: '班级',
  }, {
    field: 'id',
    headerName: '教职工号',
  }, {
    field: 'name',
    headerName: '姓名',
  }, {
    field: 'subject',
    headerName: '任教学科',
  }, 
]
export const studentBasicDataTable = [
  {
    "province": "浙江省",
    "city": "绍兴市",
    "area": "诸暨市",
    "school": "诸暨市荣怀实验学校",
    "grade": "三年级",
    "class": "三一班",
    "id": "001",
    "name": "张三",
    "subject": "语文",
  },
  {
    "province": "浙江省",
    "city": "绍兴市",
    "area": "诸暨市",
    "school": "诸暨市荣怀实验学校",
    "grade": "三年级",
    "class": "三二班",
    "id": "002",
    "name": "李四",
    "subject": "语文",
  },
  {
    "province": "浙江省",
    "city": "绍兴市",
    "area": "诸暨市",
    "school": "诸暨市荣怀实验学校",
    "grade": "三年级",
    "class": "三三班",
    "id": "003",
    "name": "王五",
    "subject": "语文",
  },
]



//数据管理-教学数据表
export const teacherTable = [
  {
    id: 1,
    time: "2021-11-6",
    facultyID: "001",
    name: "张三", 
    class: "三（一）班",
    subject: '语文',
    objectionScore: 3,
    contentScore: 12,
    activityDesignScore: 25,
    methodDesignScore: 4,
    mediaScore: 6,
    evaluationScore: 6,
  },
  {

    id: 2,
    time: "2021-11-6",
    facultyID: "002",
    name: "李四",
    class: "三（二）班",
    subject: '语文',
    objectionScore: 15,
    contentScore: 16,
    activityDesignScore: 20,
    methodDesignScore: 4,
    mediaScore: 12,
    evaluationScore: 9,
  },
  {
    id: 3,

    time: "2021-11-6",
    facultyID: "003",
    name: "王五",
    class: "三（三）班",
    subject: '语文',
    objectionScore: 6,
    contentScore: 20,
    activityDesignScore: 15,
    methodDesignScore: 6,
    mediaScore: 12,
    evaluationScore: 12,
  },
];

export const teacherColProps = [
  {
    field: "time",
    headerName: '时间',
    // hide: true,
  }, {
    field: 'facultyID',
    headerName: '教职工号',
  }, {
    field: 'name',
    headerName: '姓名',
  }, {
    field: 'class',
    headerName: '任教班级',
  }, {
    field: 'subject',
    headerName: '任教学科',
  }, {
    field: 'objectionScore',
    headerName: '教学目标的得分',
  }, {
    field: 'contentScore',
    headerName: '教学内容的得分',
  }, {
    field: 'activityDesignScore',
    headerName: '学习活动任务设计的得分',
  }, {
    field: 'methodDesignScore',
    headerName: '学习活动方式设计的得分',
  }, {
    field: 'mediaScore',
    headerName: '资源媒体运用的得分',
  }, {
    field: 'evaluationScore',
    headerName: '学习评价的设计的得分',
  },
]

export const filterData = {
  年级: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"],
  学科: ["语文", "数学", "英语", "科学", "音乐", "美术"],
  班级: ["一班", "二班", "三班", "四班", "五班"],
  学期: ["2021年下半学期", "2021年上半学期", "2020年下半学期"],
  教师: ["李晓红", "张小明", "赵大海"],
};

export const filterType = ["年级", "学科", "班级", "学期", "教师",];

export const educationDataList = [
  "学生德育数据",
  "学生学业水平数据",
  "学生身心健康数据",
  "学生艺术素养数据",
  "学生成长体验数据",
  "学生个性技能数据",
  "学生核心素养数据",
  "教师教案数据",
  "教师听评课数据",
  "教师专业发展数据",
]

export const modelList = ["学生美育分析模型", "教师教案分析模型"];

export const attributes = {
  学生美育分析模型: [
    {
      name: "美术课程",
      children: [
        {
          name: "美术课程期末成绩",
          children: [
            {
              name: "学期末美术课程基础知识（笔试）",
              children: [
                {
                  name: "学期末美术基础知识笔试得分",
                },
              ],
            },
            {
              name: "学期末美术作品基本技能掌握（美术作品）",
              children: [
                {
                  name: "学期末美术作品构图得分",
                },
                {
                  name: "学期末美术作品色彩得分",
                },
                {
                  name: "学期末美术作品内容得分",
                },
                {
                  name: "学期末美术作品创意得分",
                },
              ],
            },
          ],
        },
        {
          name: "美术课程平时作业成绩",
          children: [
            {
              name: "平时美术作品基本技能掌握",
              children: [
                {
                  name: "平时美术作品构图得分",
                },
                {
                  name: "平时美术作品色彩得分",
                },
                {
                  name: "平时美术作品内容得分",
                },
                {
                  name: "平时美术作品创意得分",
                },
              ],
            },
            {
              name: "美术课程出勤",
              children: [
                {
                  name: "美术课程出勤得分",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "音乐课程",
      children: [
        {
          name: "音乐课程期末成绩",
          children: [
            {
              name: "学期末音乐基本技能掌握（歌曲）",
              children: [
                {
                  name: "学期末歌唱知识技能（音高、节奏）得分",
                },
                {
                  name: "学期末歌唱演唱技能（发声方法、呼吸方法）得分",
                },
              ],
            },
          ],
        },
        {
          name: "音乐课程平时成绩",
          children: [
            {
              name: "平时音乐作品基本技能掌握（音乐作品）",
              children: [
                {
                  name: "平时歌唱知识技能（音高、节奏）得分",
                },
                {
                  name: "平时歌唱演唱技能（发声方法、呼吸方法）得分",
                },
                {
                  name: "平时歌唱艺术表现（演唱仪态）得分",
                },
              ],
            },
            {
              name: "音乐课程出勤",
              children: [
                {
                  name: "音乐课程出勤得分",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  教师教案分析模型: [{
    name: "教师目标的质量",
    children: [
      {
        name: "教学目标陈述的全面性"
      },{
        name: "教学目标陈述的清晰性"
      },{
        name: "教学目标设置的合理性"
      },
    ]
  },{
    name:"教学内容的质量",
    children: [
      {
        name: "教学内容的来源"
      },{
        name: "教学重点确定的合理性"
      },{
        name: "教学难点确定的合理性"
      },
    ]
  },{
    name:"学习活动任务的质量",
    children: [
      {
        name: "学习活动任务与教学目标的关联"
      },{
        name: "学习活动任务重点的突出"
      },{
        name: "学习活动任务难点的突破"
      },
    ]
  },{
    name:"学习活动方式的质量",
    children: [
      {
        name: "学习活动方式运用与教学目标的表述"
      },{
        name: "学习活动方式运用与学生主体性"
      }
    ]
  },{
    name:"资源媒体的质量",
    children: [
      {
        name: "教学中资源媒体使用的多样性"
      },{
        name: "资源媒体运用的合理性"
      }
    ]
  },{
    name:"学习评价的质量",
    children: [
      {
        name: "教学过程中学习评价的提供"
      },{
        name: "学习评价与教学目标的关联"
      },{
        name: "学习评价的激励性"
      },{
        name: "学习评价主体的多元性"
      }
    ]
  }],
};

interface ScaleProps {
  banner: string,
  title: string,
  description: string,
  recommendRate: number,
  avatar: string,
}
export const scaleList: ScaleProps[] = [
  {
    banner: actionStandardImg,
    title: '教师教案评价评价量规',
    description: '教师教案评价量规主要对教师教案质量进行评价，主要包括教学目标达成情况，教学内容完成情况，学习活动任务设计完成情况，学习活动方式设计完成情况，资源媒体运用情况，学习评价设计情况这几个方面。',
    recommendRate: 97,
    avatar: userPicture,
  },
  {
    banner: dataStandardImg,
    title: '教学评价设计量规2',
    description: '一句话描述一句话描述',
    recommendRate: 94,
    avatar: userPicture,
  },
  {
    banner: actionStandardImg,
    title: '教学评价设计量规3',
    description: '一句话描述一句话描述',
    recommendRate: 92,
    avatar: userPicture,
  },
  {
    banner: actionStandardImg,
    title: '教学评价设计量规4',
    description: '一句话描述一句话描述',
    recommendRate: 92,
    avatar: userPicture,
  }
]

export const analysisMethod = [
  {
    category: "描述性分析", //类别
    methods: ["频数分析", "描述性统计", "分类汇总", "正态性分布","相关性分析"], //里面具体的方法名字
  },
  {
    category: "差异性分析",
    methods: ["方差分析","独立样本T检验","单样本T检验","配对样本T检验","卡方检验"],
  },
  {
    category: "差统计建模",
    methods: ["方线性回归（最小二乘法）","因子分析（探索性）","聚类分析","主成分分析","时间序列分析"],
  },
  {
    category: "问卷分析",
    methods: ["信度分析","效度分析","多选分析","交叉分析","时间序列分析","区分度分析"],
  },
];

export const methodDescription = {
  '频数分析': '对落入指定区域内的定类的频数进行统计，了解其数据分布状况',
  '描述性统计': '对数据进行描述性统计',
  
}

const fieldTypeList = [
  '基础','基础','基础','基础','教学','教学','教学','教学','教学','教学','教学','教学','教学'
]



export const relatedTableHeader = [
  "时间",
  "教职工号",
  "姓名",
  "任教班级",
  "任教学科",
  "教学目标的得分",
  "教学目标的得分的等级",
  "教学目标的得分的等级描述",
  "教学内容的得分",
  "教学内容的得分的等级",
  "教学内容的得分的等级描述",
  "学习活动任务设计的得分",
  "学习活动任务设计的得分的等级",
  "学习活动任务设计的得分的等级描述",
  "学习活动方式设计的得分",
  "学习活动方式设计的得分的等级",
  "学习活动方式设计的得分的等级描述",
  "资源媒体运用的得分",
  "资源媒体运用的得分的等级",
  "资源媒体运用的得分的等级描述",
  "学习评价的设计的得分",
  "学习评价的设计的得分的等级",
  "学习评价的设计的得分的等级描述",
];
export const relatedTableData = [
  [
    "2021-11-6",
    "001",
    "张三",
    "三（一）班",
    "语文",
    "3",
    "等级一",
    "教案设计中新课程改革倡导的“三维目标＂体现明显，从行为主体、行为动词、行为条件、行为程度四个方面进行分析；",
    "12",
    "等级三",
    "教学内容源于教科书，并结合学生的生活经验和知识，围绕教学目标，对教材中的教学内容进行调整、重组与整合；教学重点来源于课程目标，遵循学科知识体系，考虑了学生认知发展水平； ",
    "25",
    "等级五",
    "学习活动任务紧扣教学目标，教学重难点描述部分所使用的行为动词或者是体验型动词在设计合理的基础上，运用了可测性较高的动词，提供针对教学重难点的学习活动任务，并辅以类似＂脚手架＂的梯度教学方式",
    "4",
    "等级二",
    "学习活动方式的运用与教学目标的表述相一致，活动方式多样能照顾到各类学生，创设了自主探究、小组合作的学习活动方式，发挥了学习者的主观能动性",
    "6",
    "等级一",
    "教学设计中资源媒体的使用包括传统媒体和现代媒体，呈现多样化，符合学科特色、学生认知发展规律以及课程教学规律",
    "6",
    "等级二",
    "学习评价渗透在教学过程中，围绕知识目标、关注过程性目标、关注情感态度价值观目标，学习评价方式具有激励性（带有激励性措施、鼓励性评价语言）、评价主体多元化",
  ],
  [
    "2021-11-6",
    "002",
    "李四",
    "三（二）班",
    "语文",
    "15",
    "等级五",
    "教案设计中体现了新课程改革倡导的“三维目标＂，但进行目标陈述时只有一半按照行为主体、行为动词、行为条件、行为程度四个方面进行分析；",
    "16",
    "等级四",
    "教学内容源于教科书，并结合学生的生活经验和知识，围绕教学目标对教材的教学内容进行调整；",
    "20",
    "等级四",
    "学习活动任务紧扣教学目标，教学重难点描述部分所使用的行为动词或者是体验型动词均可测，针对教学重难点学习活动任务提供教学方式，但没有体现“脚手架”形式",
    "4",
    "等级二",
    "学习活动方式的运用与教学目标的表述相一致，活动方式多样能照顾到各类学生，创设了自主探究、小组合作的学习活动方式，发挥了学习者的主观能动性",
    "12",
    "等级四",
    "教学设计中传统媒体和现代媒体的使用呈现多样，有一半能够与学科特点、学生认知发展规律以及课程教学相联系",
    "9",
    "等级三",
    "学习评价渗透在教学过程中，围绕知识目标、关注过程性目标、关注情感态度价值观目标，学习评价方式具有激励性（带有激励性措施、鼓励性评价语言）、评价主体多元化",
  ],
  [
    "2021-11-6",
    "003",
    "王五",
    "三（三）班",
    "语文",
    "6",
    "等级二",
    "教案设计中体现了新课程改革倡导的“三维目标＂，但目标陈述没有从行为主体、行为动词、行为条件、行为程度四个方面进行分析；",
    "20",
    "等级五",
    "教学内容源于教科书，有部分结合学生的生活经验和知识，围绕教学目标对教材的教学内容进行调整；但教学重点的选取没有考虑学生认知发展水平；",
    "15",
    "等级三",
    "学习活动任务紧扣教学目标，教学重难点描述部分所使用的行为动词或者是体验型动词均可测，针对教学重难点学习活动任务提供教学方式，但没有体现“脚手架”形式",
    "4",
    "等级二",
    "学习活动方式的运用与教学目标的表述相一致，活动方式多样能照顾到各类学生，创设了自主探究、小组合作的学习活动方式，发挥了学习者的主观能动性",
    "12",
    "等级四",
    "教学设计中传统媒体和现代媒体的使用呈现多样，有一半能够与学科特点、学生认知发展规律以及课程教学相联系",
    "12",
    "等级四",
    "学习评价渗透在教学过程中，围绕知识目标、关注过程性目标、关注情感态度价值观目标，学习评价方式具有激励性（带有激励性措施、鼓励性评价语言）、评价主体多元化",
  ],
];


export const analysisFieldList = relatedTableHeader.map((el, idx) => ({
  field: el,
  type: fieldTypeList[idx],
  id: 'item' + idx,
}))
