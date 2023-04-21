export default {
  buttons: {
    toggle: '收起',
    query: '查询',
    delete: '删除',
    add: '添加',
    save: 'save',
    pageHint: '{0}条记录，共{1}页',
    toggleDetail: '收起详情',
    action: '操作',
    showDetail: '查看详情',
    checkOnly: '仅查看',
    link: '查看',
    judge: '研判',
    hint: '提示信息',
    ok: '是',
    sure: '确定',
    upload: '上传文件',
    chooseFile: '选择文件',
    files: '上传的文件是',
    audit: '人工审计完成，提交结果',
    reset: '重置',
    edit: '编辑',
    undo: '撤销',
    submit: '提交',
    back: '返回',
    confirm: '确认',
    cancel: '取消',
    import: '导入数据',
    export: '导出数据',
    update: 'update',
    offset: 'close',
    clear: '清空',
    start: '启动',
    evaluation: '评估',
    check: '检查',
    appeal: '申诉',
    undoAppeal: '撤销申诉',
    security_incident:"Security incident entry standards",
    "安全管理平台":"Security Management Platform",
    "我们专注":"We focus on providing one-stop security services, creating a first-class security platform, building top security service capabilities, and escorting Didi's information security, business security and customer safety.",
    "反馈邮箱":"Feedback email",
    "扫码加入D-Chat反馈群":"Scan code to join d-Chat feedback group"
  },

  hint: {
    loading: '载入中…',
    select: '—— 请选择 ——',
    no_detail: '找不到可以展示的内容',
    success: '操作成功',
    upload: '请选择要上传的文件',
    notXlsx: '您上传的文件不是支持的类型，请上传Excel文件',
    upload_fail: '文件上传失败',
    no_record: '很遗憾，没有相关数据！',
    processing: '正在处理中，请稍后……',
    not_null: '{field}不能为空！',
    vagues_search: '支持模糊搜索'
  },

  sdl: {
    task: {
      title: '任务列表',
      detail: '任务详情',
      module_name: '模块名称',
      project_id: '项目编号',
      git_url: 'Git路径',
      git_branch: 'Git分支',
      git_relative_path: '相对路径',
      git_version: '项目版本',
      task_create_time: '任务创建时间',
      task_end_time: '任务结束时间',
      scan_begin_time: '扫描开始时间',
      scan_end_time: '扫描结束时间',
      department: '所属部门名称',
      code_lines: '代码行数',
      vulns: '漏洞数量',
      new_vulns: '新确认漏洞数量',
      level: '项目级别编码',
      level_name: '项目级别',
      rd: '研发负责人',
      se: '安全工程师',
      status: '扫描任务状态',
      status_name: '扫描任务状态',
      hosts: '部署地址',
      project: '关联项目',
      vulner: '漏洞信息',
      odin_node: 'odin部署地址',
      odin_job_url: 'odin任务工单',
      checkmax_url: 'checkmarx链接',
      check_task: '仅查看',
      get_task: '请确认是否认领此任务?',
      1003: '代码扫描任务不存在',
      1004: '代码扫描任务状态异常',
      1005: '代码扫描任务已被认领',
      continue_audit: '继续进行手工审计？',
      source_name: '数据来源'
    },

    project: {
      title: '项目列表',
      name: '项目名称',
      create_time: '创建时间',
      last_check_time: '最后检测时间',
      last_odin_job_id: '最后odin部署任务编号',
      task: '历史任务',
      vulner: '历史漏洞'
    },

    vulner: {
      task: '本次任务',
      history: '历史漏洞',
      vuln_id: '漏洞编号',
      title: '漏洞信息',
      found_time: '漏洞发现时间',
      level_name: '漏洞级别',
      type_name: '漏洞类型',
      type2_name: '漏洞类型',
      sf_path: '来源文件',
      sf_line: '来源文件行号',
      sf_code: '来源文件代码',
      df_path: '目标文件',
      df_line: '目标文件行号',
      df_code: '目标文件代码',
      status_name: '漏洞状态',
      sf_path_code: '来源文件[行号]',
      df_path_code: '目标文件[行号]',
      audit: '审计结果',
      complete: '代码扫描任务已被认领',
      1004: '任务已完成，无法提交',
      1005: '任务已取消，无法提交',
      1006: '任务已关闭，无法提交',
      1007: '任务状态异常，无法提交',
      success_vulner: '漏洞审计成功，结果已提交',
      success_task: '任务审计成功，结果已提交',
      checkmax_url: '查看Checkmarx扫描页面'
    },

    rule: {
      title: '规则列表',
      rule_id: '规则编号',
      rule_name: '规则名称',
      type_name: '漏洞类型名称',
      level_name: '漏洞级别名称',
      language: '语言类型',
      description: '漏洞描述',
      harm: '漏洞危害',
      advice: '修复建议',
      evaluate_name: '可信度',
      knowledge_id: '知识库编号'
    }
  },
  // 上报安全事件
  report: {
    title: '我上报的可疑事件列表',
    id: '事件编号',
    create_time: '上报时间',
    name: '事件标题',
    event_time: '发现时间',
    status: '事件状态',
    status_name: '事件状态',
    add_event: '安全事件上报',
    description: '事件描述',
    event_detail_title: '可疑事件详细信息',
    undo_tip: '请确认是否需要撤销上报告警？'
  },

  // 可疑事件管理
  alarm: {
    alarm_ids: '告警编号',
    id: 'AlarmId',
    alarmTime: 'AlarmTime',
    occuredTime: 'OccuredTime',
    type: 'AlarmType',
    level: 'AlarmLevel',
    list: '告警列表',
    state_name: '处理状态',
    update_time: '处理时间',
    merge_num: '归并数量',
    first_login_time: '第一次登陆时间',
    first_login_ip: '第一次登陆IP',
    first_login_address: '第一次登陆位置',
    second_login_time: '第二次登陆时间',
    second_login_ip: '第二次登陆IP',
    second_login_address: '第二次登陆位置',
    audit_name: '研判结果',
    mode_name: '处理方式',
    relative_to_event: '关联事件',
    1001: '安全事件',
    1002: '误报',
    1003: '已受理',
    2000: 'S0(严重)',
    2001: 'S1(高危)',
    2002: 'S2(中危)',
    2003: 'S3(低危)',
    2004: 'S4(忽略)',
    event: {
      title: '可疑事件列表',
      number: '事件编号',
      name: '事件标题',
      description: '事件描述',
      status: '事件状态',
      createTime: '上报时间',
      eventTime: '发现时间',
      creator: '上报人',
      auditor: '受理人',
      auditTime: '受理时间',
      detail: '可疑事件详细信息',
      result: '研判结果',
      remark: '备注'
    }
  },

  order: {
    orderId: 'OrderId',
    alarmType: 'AlarmType',
    riskLevel: 'RiskLevel',
    name: 'OrderName',
    postTime: 'ReportTime',

},

  // 安全事件管理
  manage: {
    toggle: 'Collapse all',
    query: 'Search',
    delete: 'Delete',
    add: 'Add',
    save: 'Save',
    pageHint: 'Total {0}，{1} pages',
    toggleDetail: 'CollapseDetail',
    action: 'Action',
    showDetail: 'ViewDetails',
    checkOnly: 'View',
    link: 'Detail',
    disable: 'disable',
    enable: 'start',
    judge: 'Judge',
    hint: 'ToolTips',
    ok: 'OK',
    sure: 'Yes',
    upload: 'UploadFile',
    supportFile: 'Only support pdf、excel、word、zip',
    chooseFile: 'ChooseFile',
    files: 'Files',
    audit: 'Manual audit completed and results submitted',
    reset: 'Reset',
    edit: 'Edit',
    undo: 'Undo',
    submit: 'Submit',
    back: 'Back',
    review: 'Review',
    confirm: 'Confirm',
    cancel: 'Cancel',
    import: 'Import',
    export: 'Export',
    update: 'Update',
    offset: 'Close',
    clear: 'Clear',
    add_event: 'Add Incident',
    add_event_title: 'Add Incident',
    update_event_title: 'ModifyIncident',
    detail_event_title: 'IncidentDetail',
    title: 'IncidentsList',
    detail: 'IncidentDetail',
    event_no: 'Incident ID',
    name: 'Name',
    event_time: 'OccurredTime',
    create_time: 'EntryTime',
    confirm_time: 'ConfirmedTime',
    event_type: 'IncidentType',
    repair_time: 'RepairedTime',
    repair_survey_time: 'SurveyEndTime',
    serious_level: 'Severity',
    found_source: 'DetectMode',
    department: 'Department',
    event_status: 'State',
    member: 'Employee',
    system_source: 'Source',
    hint_department: 'DepartmentName',
    hint_member: 'EmployeeName',
    survey_result: 'Findings',
    punish_result: 'OtherFeedback',
    remark: 'Remarks',
    import_title: 'UploadFile',
    mttd: 'MTTD(Hour)',
    mttr: 'MTTR(Hour)',
    mttxx: 'MTTH(Hour)',
    relative_to_alarm: 'AlarmId',
    relative_to_order: 'OrderId',
    auth_label: 'AuthLabel',
    rccd: 'RCCDResult',
    rccd_time: 'RCCDNoticeTime',
    create_user: 'Creator',
    close_time: 'CloseTime',
    submit_rccd: 'SubmitRCCD',

    founder: 'Creator',
    survey_members: 'Investigators',

    add_order: 'Add WorkOrder',

    levelFourHint: 'The Level4(serious) incident has not yet entered the Processing, is it entering the Processing?',
    sureLevelFourHint: 'Confirm that the incident has entered the state of Processing, and the ReviewPersonnel is:',

    appeal_event_title: '安全事件申诉',

    reviewer: {
      leader: 'ReviewPersonnel',
      safeTitle: 'Information Security review',
      businessTitle: 'Business Line Review',
      wetherReview: 'Review',
      reviewTime: 'ReviewTime',
      participant: 'Participant',
      reviewResult: 'ReviewResult',
      file: 'Attachment',
      notReviewReason: 'Reason',
      warning: {
        isReviewRequired: 'Please select whether to submit RCCD',
        reviewTimeRequired: 'Please select review time',
        reviewParticipantRequired: 'Please select Participant',
        reviewResultRequired: 'Please enter review result',
        fileRequired: 'Please upload attachments',
        notReviewReasonRequired: 'Please enter the reasons for not review',
      },
    },

    alarm: {
      add_title: 'AddAlarm',
      alarm: 'AlarmList',
      detail_title: 'AlarmDetail'
    },
    label_ids: 'Violation label',
    select: 'Please select',
    selectDate: 'Please select date',
    vagues_search: 'Support for fuzzy search',
    startTime: 'Start time',
    endTime: 'End time',
    rangeSep: '-',
    notify: {
      name: 'Configuration name',
      user: 'notify party',
      creator: 'founder',
      modifier: 'modifier',
      modifyTime: 'modification time',
      createTime: 'creation time',
      status: 'Data status',
      batchEnable: 'Batch enable',
      batchDisable: 'Batch disable',
      batchRemove: 'batch deletion',
      addConfig: 'Add configuration',
      detailTitle: 'Notification configuration details',
      updateTitle: 'Change notification configuration',
      addTitle: 'Add notification configuration',
      hint: {
        success: 'Operate successfully',
        error: 'Operation failure',
        empty: 'Please select data',
        confirm: 'Are you sure to delete this data?',
        batchConfirm: 'Are you sure to delete these data?'
      }
    },
    warning: {
      event: {
        "nameRequired": "Please enter the Name",
        "nameMax": "Enter a maximum of 100 characters",
        "confirmTimeRequired": "Please select the ConfirmedTime",
        "typeRequired": "Please select the IncidentType",
        "levelRequired": "Please select the Severity",
        "sourceRequired": "Please select the DetectMode",
        "statusRequired": "Please select the State",
        "tagRequired": "Please select the employee violation label",
        "surveyMembers": "Please select the survey leader",
        "sbumitRCCD": "Please choose whether to submit RCCD",
        "rccdTimeRequired": 'Please select the RCCD NoticeTime',
        "rccdRequired": 'Please select the RCCD result'
      },
      format:'format: PDF , doc , zip , jpeg, png'
    }
  },

  deptInterfacer: {
    title: '接口人管理',
    deptName: '部门名称',
    userName: '接口人',
    interfacerUserName: '接口人姓名',
    interfacerEmail: '接口人邮箱',
    interfacerJob: '接口人职务',
    listTitle: '修改接口人信息({0})',
    userAccount: '用户账号',
    name: '姓名',
    email: '邮箱',
    dName: '所属部门',
    job: '职务'
  },

  // 安全合规
  compliance: {
    evaluation: {
      projectName: '项目名称',
      projectNumber: '项目编号',
      department: '业务部门',
      follower: '关注人',
      creator: '项目创建人',
      createTime: '创建时间',
      startTime: '项目启动时间',
      endTime: '项目结束时间',
      remark: '备注',
      evalBusiness: '评估业务',
      evalTarget: '评估对象',
      evaluate: '安全评估',
      threat: '安全隐患列表',
      businessName: '业务名称',
      businessManager: '业务负责人',
      infoSecInterface: '信息安全接口人',
      productTechManager: '产品技术负责人',
      productInterface: '产品对接人',
      qaInterface: 'QA对接人',
      biInterface: 'BI对接人',
      accountManager: '账号管理员',
      businessInterface: '业务接口人',
      address: '地址信息',
      evalInterface: '评估接口人',
      highRisk: '高危',
      middleRisk: '中危',
      lowRisk: '低危',
      conform: '符合',
      exclusion: '不适用',
      evalContent: '评估内容',
      evalManager: '评估负责人',
      evalSchedule: '评估进度',
      evalEndTime: '评估完成时间',
      reformSchedule: '整改进度',
      evalState: '评估状态',
      title: '安全评估列表',
      createUserName: '创建人',
      status: '状态',
      riskTotal: '合计',
      reformManager: '整改负责人',
      reformPlan: '整改计划',
      reformEndTime: '整改完成时间',
      reformState: '整改状态',
      evalState: '评估状态',
      selfCheck: '自评结果',
      riskLevel: '风险等级',
      description: '问题描述',
      proposal: '整改建议',
      planTime: '计划完成时间',
      checkList: '检查项',
      checkType: '检查分类',
      checkSubType: '检查子类',
      checkItem: '检查项',

      selfEval: '自评估',
      msgFeedback: '信息反馈',
      feedback: '反馈',
      feedbackStatus: '反馈状态',
      outerDomain: '外网域名列表',
      internalDomain: '内网域名列表',
      internalIp: '内网IP列表',
      computerRoom: '机房位置',
      sysDescription: '系统功能描述',
      sensitiveInterface: '敏感接口列表',
      rdLeader: '开发负责人',
      qaLeader: '测试负责人',
      proLeader: '产品负责人',
      sysAdmin: '系统管理员',
      sysUser: '系统使用人群',
      sysSensitive: '系统敏感性',
      accountSys: '账号管理方式',
      permissionSys: '权限管理方式',
      permissionLevel: '权限控制级别',
      logAccess: '操作日志是否接入信息安全',
      interfaceDoc: '完整接口文档',
      interfaceDocAddr: '接口文档地址',
      isOpen: '是否对外',
      dataLevel: '数据级别',
      qaURL: '测试环境地址',
      qaAccount: '测试账号',
      qaPassward: '测试账号密码',
      moudleInfo: '模块信息'
    },
    evaluationChecklist: {
      batchForbidden: '批量禁用',
      batchStart: '批量启用',
      batchDelete: '批量删除',
      creatCheckItem: '创建检查项',
      checkItemType: '检查项类型',
      checkItemChildType: '检查项子类',
      checkState: '数据状态'
    }
  }
}
