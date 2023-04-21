export const ZH = 'zh'
export const EN = 'en'

export const SDL_TASK_STATUS = [{ "value": "1221", "text": "待处理" },
{ "value": "1223", "text": "扫描中" },
{ "value": "1225", "text": "待审计" },
{ "value": "1226", "text": "审计中" },
{ "value": "1227", "text": "完成任务" },
{ "value": "1228", "text": "关闭任务" },
{ "value": "1229", "text": "取消任务" }]

export const SDL_AUDIT_STATUS = [
    {"value" : 1245, "text" : '未审计'},
    {"value" : 1247, "text" : '漏洞(人工)'},
    {"value" : 1249, "text" : '误报(人工)'},
    {"value" : 1251, "text" : '忽略'}
]

export const GIT_PREFIX = 'git@git.xiaojukeji.com:'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const NG_TRANSLATE_LANG_KEY = 'NG_TRANSLATE_LANG_KEY'

export const DATE_OPTIONS = {
    shortcuts: [{
        text: '最近一周',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '最近30天',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '最近90天',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
        }
    }, {
      text: '本月',
      onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setDate(1);
          start.setHours(0);
          start.setMinutes(0);
          start.setSeconds(0);
          start.setMilliseconds(0);
          picker.$emit('pick', [start, end]);
      }
  }, {
    text: '上月',
    onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);
        end.setDate(0);
        end.setHours(0);
        end.setMinutes(0);
        end.setSeconds(0);
        end.setMilliseconds(0);
        picker.$emit('pick', [start, end]);
    }
  }]
}
