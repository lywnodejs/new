/**
 * Created by lijian on 2018/9/15.
 */
var industryList = [
    "S3301 白色家电 B",
    "S2701 半导体 B",
    "S3602 包装印刷 B",
    "S4902 保险 B",
    "S6102 玻璃制造 B",
    "S2104 采掘服务 C",
    "S4604 餐饮 C",
    "S1107 畜禽养殖 C",
    "S6504 船舶制造 C",
    "S6503 地面兵装 D",
    "S6301 电机 D",
    "S4101 电力 D",
    "S6302 电气自动化设备 D",
    "S6303 电源设备 D",
    "S2705 电子制造 D",
    "S1108 动物保健 D",
    "S4903 多元金融 D",
    "S4301 房地产开发 F",
    "S6201 房屋建设 F",
    "S3501 纺织制造 F",
    "S3502 服装家纺 F",
    "S2301 钢铁 G",
    "S4201 港口 G",
    "S6304 高低压设备 G",
    "S4202 高速公路 G",
    "S2403 工业金属 G",
    "S4203 公交 G",
    "S2703 光学光电子 G",
    "S4204 航空运输 H",
    "S6502 航空装备 H",
    "S6501 航天装备 H",
    "S4206 航运 H",
    "S7203 互联网传媒 H",
    "S2204 化学纤维 H",
    "S2202 化学原料 H",
    "S2203 化学制品 H",
    "S3701 化学制药 H",
    "S4104 环保工程及服务 H",
    "S2404 黄金 H",
    "S4205 机场 J",
    "S6203 基础建设 J",
    "S7101 计算机设备 J",
    "S7102 计算机应用 J",
    "S3603 家用轻工 J",
    "S2402 金属非金属新材料 J",
    "S6404 金属制品 J",
    "S4601 景点 J",
    "S4602 酒店 J",
    "S1103 林业 L",
    "S4603 旅游综合 L",
    "S4502 贸易 M",
    "S2102 煤炭开采 M",
    "S1105 农产品加工 N",
    "S1106 农业综合 N",
    "S2103 其他采掘 Q",
    "S2704 其他电子 Q",
    "S6103 其他建材 Q",
    "S2804 其他交运设备 Q",
    "S3604 其他轻工制造 Q",
    "S4605 其他休闲服务 Q",
    "S2803 汽车服务 Q",
    "S2802 汽车零部件 Q",
    "S2801 汽车整车 Q",
    "S4103 燃气 R",
    "S4505 商业物业经营 S",
    "S3703 生物制品 S",
    "S2201 石油化工 S",
    "S2101 石油开采 S",
    "S3404 食品加工 S",
    "S3302 视听器材 S",
    "S6101 水泥制造 S",
    "S4102 水务 S",
    "S1104 饲料 S",
    "S2205 塑料 S",
    "S4207 铁路运输 T",
    "S7302 通信设备 T",
    "S7301 通信运营 T",
    "S6401 通用机械 T",
    "S7201 文化传媒 W",
    "S4208 物流 W",
    "S2405 稀有金属 X",
    "S2206 橡胶 X",
    "S4503 一般零售 Y",
    "S3706 医疗服务 Y",
    "S3705 医疗器械 Y",
    "S3704 医药商业 Y",
    "S6403 仪器仪表 Y",
    "S4801 银行 Y",
    "S3403 饮料制造 Y",
    "S7202 营销传播 Y",
    "S1102 渔业 Y",
    "S2702 元件 Y",
    "S6205 园林工程 Y",
    "S4302 园区开发 Y",
    "S6405 运输设备 Y",
    "S3601 造纸 Z",
    "S4901 证券 Z",
    "S3702 中药 Z",
    "S1101 种植业 Z",
    "S6204 专业工程 Z",
    "S4504 专业零售 Z",
    "S6402 专用设备 Z",
    "S6202 装修装饰 Z",
    "S5101 综合 Z"
];