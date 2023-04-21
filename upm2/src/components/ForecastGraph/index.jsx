import React, { Component } from 'react';
import { Button, Popover, Icon } from 'antd';
import { addClass, removeClass } from './util/helper.js';
import { translate } from 'react-i18next';
import moment from 'moment';
import _ from 'lodash';
import './index.less';

let statusArr = ['待办理', '已完成'];
const statusColorArr = ['orange', 'green', 'blue'];

let FLAG_MAP = {
  INVOLVER: '知会',
  AGENT: '代理',
  SIGNER: '加签'
};

const getSvgDescriptor = () => {
  return {
    width: 0,
    scale: 1,
    oldPos: { x: 0, y: 0 },
    pos: { x: 0, y: 0 },
    mousePos: { x: 0, y: 0 }
  };
};

class ForecastGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      svgWidth: '100%',
      svgHeight: null,
      graphData: {
        elements: [],
        flows: []
      },
      beginX: '',
      beginY: '',
      elements: [],
      flows: [],
      isMouseDown: false,
      svgDescriptor: getSvgDescriptor()
      // showFormBtn: false,
    };
    this.svg = null;
    this.resetPosX = 0;
  }
  componentDidMount() {
    // 判断显示初始流程图,无登陆状态单独只显示流程图,发起后流程图,
    // this.getModelJson()

    const { workflowInfo } = this.props;
    if (!workflowInfo) return;
    this.init(workflowInfo);
    // const {bpmData} = this.props;
    // bpmData.flows.sort((e1, e2) => {
    // 	if (!e1.completed && !e1.forecast) {
    // 		return -1
    // 	} else if (e1.forecast) {
    // 		return 1
    // 	}
    // })
    // this.initGraph(bpmData)

    // const {svgDescriptor} = this.state;
    // let newSvgDescriptor = _.cloneDeep(svgDescriptor);
    // newSvgDescriptor.pos.x = 10
    // newSvgDescriptor.pos.y = 0
    // this.setState({
    // 	svgDescriptor: newSvgDescriptor
    // },()=>{
    // 	// this._origin = _.cloneDeep(bpmData)
    // 	this.initGraph(bpmData)
    // })
  }
  componentWillReceiveProps(nextProps) {
    const { workflowInfo } = nextProps;
    if (!workflowInfo) return;
    this.init(workflowInfo);
  }

  init(workflowInfo) {
    const newWorkflowInfo = _.cloneDeep(workflowInfo);
    newWorkflowInfo.flows.sort((e1, e2) => {
      if (!e1.completed && !e1.forecast) {
        return -1;
      } else if (e1.forecast) {
        return 1;
      }
    });
    this.initGraph(newWorkflowInfo);
  }

  initGraph = data => {
    const { svgDescriptor } = this.state;
    const svgWrapper = this.svg.parentNode;
    let newSvgDescriptor = _.cloneDeep(svgDescriptor);
    newSvgDescriptor.width = svgWrapper.offsetWidth;
    let svgWrapperWidth = svgWrapper.offsetWidth;
    let svgWidth = data.diagramWidth;
    if (svgWrapperWidth - svgWidth > 0) {
      const posX = (svgWrapper.offsetWidth - data.diagramWidth) / 2;
      newSvgDescriptor.pos.x = posX;
      this.resetPosX = posX;
      svgWidth = '100%';
    } else {
    }

    this.setState(
      {
        svgDescriptor: newSvgDescriptor,
        graphData: data,
        beginX: data.diagramBeginX,
        beginY: data.diagramBeginY,
        svgWidth,
        svgHeight: this.calcHeight(data)
      },
      () => {
        this.calcElements();
        this.calcFlows();
      }
    );
  };

  resetGraph = event => {
    const svgDescriptor = getSvgDescriptor();
    svgDescriptor.pos.x = this.resetPosX;
    this.setState({
      svgDescriptor
    });
    // event.nativeEvent.stopImmediatePropagation()
    // event.stopPropogation();

    // const { _origin } = this
    // if (_origin) {
    // 	this.setState({
    // 		svgDescriptor: getSvgDescriptor()
    // 	},()=>{
    // 		this.initGraph(_.cloneDeep(_origin))
    // 	})
    // }

    // setTimeout(() => {
    // 	const {svgDescriptor} = this.state;
    //   svgDescriptor.pos.x = 10
    // 	svgDescriptor.pos.y = 0
    // 	this.setState({
    // 		svgDescriptor
    // 	})
    // })
  };

  // svgReady () {
  //   console.log('svg ready')
  // }
  get viewPortTransform() {
    const { svgDescriptor } = this.state;
    let { scale, pos } = svgDescriptor;
    if (!scale) {
      scale = 1;
    }
    return `matrix(${scale} 0 0 ${scale} ${pos.x + 16} ${pos.y + 10})`;
  }
  calcTextDy(splitName, index, textHeight) {
    // const {length = 1} = splitName
    // textHeight / length
    return 5 + index * 12;
  }
  calcHeight(graphData) {
    const { svgDescriptor } = this.state;
    const { diagramWidth, diagramHeight, diagramBeginX } = graphData;
    const { width } = svgDescriptor;
    const ratio = width / diagramWidth;
    // 无登陆状态只显示跟踪图位置
    const url = window.location.href;
    // if (/trace/.test(url)) {
    //   svgDescriptor.pos.x = (1160 - diagramWidth + diagramBeginX) / 2
    //   svgDescriptor.pos.y = (400 - diagramHeight) / 2
    // }
    // svgDescriptor.pos.x
    if (ratio < 1) {
      svgDescriptor.scale = ratio;
    }
    this.setState({
      svgDescriptor
    });
    return diagramHeight;
  }
  handleMouseDown = event => {
    event.nativeEvent.stopImmediatePropagation();
    const { svgDescriptor } = this.state;
    this.setState({
      isMouseDown: true
    });
    const { mousePos, oldPos, pos } = svgDescriptor;
    mousePos.x = -event.clientX;
    mousePos.y = -event.clientY;
    oldPos.x = pos.x;
    oldPos.y = pos.y;
    this.setState({
      svgDescriptor
    });
    addClass(this.svg, 'cursor-move');
  };
  handleMouseUp = event => {
    event.nativeEvent.stopImmediatePropagation();
    this.setState({
      isMouseDown: false
    });
    removeClass(this.svg, 'cursor-move');
  };

  handleMouseMove = event => {
    event.nativeEvent.stopImmediatePropagation();
    const { isMouseDown, svgDescriptor } = this.state;
    if (!isMouseDown) return;
    const { mousePos, oldPos, pos } = svgDescriptor;
    const deltaX = mousePos.x + event.clientX + oldPos.x;
    const deltaY = mousePos.y + event.clientY + oldPos.y;
    pos.x = deltaX;
    pos.y = deltaY;
    this.setState({
      svgDescriptor
    });
  };

  changeScale(delta) {
    const step = 0.1;
    const { svgDescriptor } = this.state;
    svgDescriptor.scale += delta * step;
    this.setState({
      svgDescriptor
    });
  }

  // getModelJson = () => {
  // 	const {bpmData} = this.props;
  // 	bpmData.flows.sort((e1, e2) => {
  // 		if (!e1.completed && !e1.forecast) {
  // 			return -1
  // 		} else if (e1.forecast) {
  // 			return 1
  // 		}
  // 	})
  // 	const {svgDescriptor} = this.state;
  // 	let newSvgDescriptor = _.cloneDeep(svgDescriptor);
  // 	newSvgDescriptor.pos.x = 10
  // 	newSvgDescriptor.pos.y = 0
  // 	this.setState({
  // 		svgDescriptor: newSvgDescriptor
  // 	},()=>{
  // 		this._origin = _.cloneDeep(bpmData)
  // 		this.initGraph(bpmData)
  // 	})
  // 	// const { processInstanceName } = results
  // 	// const { processDefinitionName } = results
  // 	// this.$parent && (this.$parent.name = processInstanceName || processDefinitionName || '')
  // 	// this.$emit('getTenantId', results.tenantId)
  // }
  pos = item => {
    return `translate(${item.x}, ${item.y})`;
  };
  calcFlows() {
    const {
      graphData: { flows },
      svgDescriptor,
      beginX,
      beginY
    } = this.state;
    const { scale } = svgDescriptor;
    let newFlows = _.cloneDeep(flows);
    const l = newFlows.length;
    for (let i = 0; i < l; i++) {
      let onePath = newFlows[i].waypoints;
      onePath.forEach(i => {
        i.x -= beginX * scale;
        i.y -= beginY * scale;
      });
      newFlows[i].path = _.map(onePath, _.values).join(' ');
    }
    this.setState({
      flows: newFlows
    });
  }
  setEleColor(elem) {
    const { graphData } = this.state;
    const {
      completedActivities,
      currentActivities,
      forecastActivities
    } = graphData;
    if (
      completedActivities &&
      completedActivities.findIndex(i => i === elem.id) > -1
    ) {
      elem.borderColor = 'green';
    }
    if (
      currentActivities &&
      currentActivities.findIndex(i => i === elem.id) > -1
    ) {
      elem.borderColor = 'orange';
    }
    if (
      forecastActivities &&
      forecastActivities.findIndex(i => i === elem.id) > -1
    ) {
      elem.borderColor = 'blue';
    }
  }
  calcElements() {
    const { i18n } = this.props;
    const { language } = i18n;
    // const {graphData} = this.state;
    // this.setState({
    // 	elements: graphData.elements
    // })
    const {
      graphData: { elements },
      svgDescriptor,
      beginX,
      beginY
    } = this.state;
    const { scale } = svgDescriptor;
    let newElements = _.cloneDeep(elements);
    for (let element of newElements) {
      element.x -= beginX * scale;
      element.y -= beginY * scale;
      this.setEleColor(element);
      if (element.name) {
        element.splitName = this.splitName(element.name);
      }
      if (element.type !== 'UserTask' && element.type !== 'ReceiveTask') {
        continue;
      }
      const taskList = element.tasks;
      if (!taskList || !taskList.length) {
        element.hoverTip = {};
        element.hoverTip.template = null;
        continue;
      }
      let finalDomArr = [];
      for (let [index, item] of taskList.entries()) {
        let [assignees, acceptTime, endTime, durationTime, updateTime] = [
          [],
          [],
          [],
          [],
          []
        ];
        if (!_.isEmpty(item.assignees)) {
          const assigneesLength = item.assignees.length;
          assignees = _.orderBy(item.assignees, 'status').map((k, num) => {
            const dept = [k.dept1, k.dept2, k.dept3].filter(_ => _).join(' - ');
            const title = `办理人 ${assigneesLength > 1 ? num + 1 : ''}`;
            let others = (
              <div
                className={`status ${
                  statusColorArr[k.status] ? statusColorArr[k.status] : 'blue'
                }`}>
                {k.status === undefined ? '预测' : statusArr[k.status]}
              </div>
            );
            let dealerStatus = FLAG_MAP[k.userType] || '';
            if (k.userType === 'AGENT') {
              dealerStatus = `代${k.mandatorName +
                '(' +
                k.mandatorLdap +
                ')'}办理`;
            }
            if (k.userType === 'INVOLVER') {
              others = <div className="status"></div>;
            }
            const content = (
              <div>
                <p>
                  {language === 'zhCN' ? k.name : k.englishName}（{k.ldap}）
                  <span className="dealer-status">{dealerStatus}</span>
                </p>
                <p>{dept}</p>
              </div>
            );
            return this.createTableTr(title, content, others);
          });
        }
        item.startTime &&
          (acceptTime = this.createTableTr(
            '接收时间',
            moment(item.startTime).format('YYYY-MM-DD HH:mm:ss')
          ));
        item.endTime &&
          (endTime = this.createTableTr(
            '完成时间',
            moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')
          ));
        item.durationInMillis &&
          (durationTime = this.createTableTr(
            '办理时长',
            moment.duration(item.durationInMillis).humanize(true)
          ));
        let horizonLine = (
          <div className="horizon-line">
            <div className="h-title"></div>
            <div className="h-content"></div>
            <div className="h-status"></div>
          </div>
        );
        if (index === taskList.length - 1) {
          horizonLine = [];
        }
        finalDomArr = finalDomArr.concat(
          assignees,
          acceptTime,
          updateTime,
          endTime,
          durationTime,
          horizonLine
        );
      }
      element.hoverTip = {
        template: (
          <div className="hover-content">
            <div className="hover-table">{finalDomArr}</div>
          </div>
        ),
        title: <div className="hover-title">{'任务办理详情'}</div>
      };
      if (!finalDomArr.length) {
        element.hoverTip.template = null;
      }
    }
    this.setState({
      elements: newElements
    });
  }
  createTableTr(title, content, others = <div className="status"></div>) {
    return (
      <div className="inner-content" key={_.uniqueId()}>
        <div className="title">
          <span>{title}</span>
        </div>
        <div className="content">{content}</div>
        {others}
      </div>
    );
  }
  splitName(name) {
    let nameArr = [name];
    const step = 8;
    let rowNum = Math.ceil(name.length / step);
    if (rowNum > 1) {
      let start = 0;
      for (let i = 1; i < rowNum + 1; i++) {
        let end = i * step;
        if (end > name.length) {
          end = name.length;
        }
        nameArr[i - 1] = name.substring(start, end);
        start = end;
      }
    }
    return nameArr;
  }
  render() {
    const { svgWidth, svgHeight, graphData, elements, flows } = this.state;
    const getNode = item => {
      switch (item.type) {
        case 'UserTask':
          return (
            <Popover
              placement="right"
              content={item.hoverTip ? item.hoverTip.template || '未办理' : ''}
              title={item.hoverTip ? item.hoverTip.title : ''}>
              <g className="g">
                <rect
                  x="0"
                  y="0"
                  width={item.width}
                  height={item.height}
                  rx="10"
                  ry="10"
                  style={{ strokeWidth: '1px', fill: 'white' }}
                  className={item.borderColor}></rect>
                <text
                  fontSize="12"
                  x={item.width / 2}
                  y={item.height / 2}
                  align="middle center"
                  fittoelem="text_frame"
                  stroke="#373e48"
                  strokeWidth="0pt"
                  letterSpacing="-0.01px"
                  textAnchor="middle">
                  {item.splitName &&
                    item.splitName.length > 0 &&
                    item.splitName.map((name, k) => (
                      <tspan
                        x={item.width / 2}
                        y={item.height / 2}
                        dy={this.calcTextDy(item.splitName, k, item.height / 2)}
                        key={k}>
                        {name}
                      </tspan>
                    ))}
                </text>
                <g transform="translate(3, 3)">
                  <path
                    anchors="top left"
                    style={{ fill: '#d1b575', stroke: 'none' }}
                    d="m 1,17 16,0 0,-1.7778 -5.333332,-3.5555 0,-1.7778 c 1.244444,0 1.244444,-2.3111 1.244444,-2.3111 l 0,-3.0222 C 12.555557,0.8221 9.0000001,1.0001 9.0000001,1.0001 c 0,0 -3.5555556,-0.178 -3.9111111,3.5555 l 0,3.0222 c 0,0 0,2.3111 1.2444443,2.3111 l 0,1.7778 L 1,15.2222 1,17 17,17"></path>
                </g>
              </g>
            </Popover>
          );
          break;
        case 'ReceiveTask':
          return (
            <Popover
              trigger="click"
              placement="right"
              content={item.hoverTip ? item.hoverTip.template || '未办理' : ''}
              title={item.hoverTip ? item.hoverTip.title : ''}>
              <g className="g">
                <rect
                  x="0"
                  y="0"
                  width={item.width}
                  height={item.height}
                  rx="10"
                  ry="10"
                  style={{ strokeWidth: '1px', fill: 'white' }}
                  className={item.borderColor}></rect>
                <text
                  fontSize="12"
                  x={item.width / 2}
                  y={item.height / 2}
                  align="middle center"
                  fittoelem="text_frame"
                  stroke="#373e48"
                  strokeWidth="0pt"
                  letterSpacing="-0.01px"
                  textAnchor="middle">
                  {item.splitName &&
                    item.splitName.length > 0 &&
                    item.splitName.map((name, k) => (
                      <tspan
                        x={item.width / 2}
                        y={item.height / 2}
                        dy={this.calcTextDy(item.splitName, k, item.height / 2)}
                        key={k}>
                        {name}
                      </tspan>
                    ))}
                </text>
                <g transform="translate(3, 3)">
                  <path
                    anchors="top left"
                    fill="#16964d"
                    stroke="none"
                    d="M0.5,2.5L0.5,15.5L17.5,15.5L17.5,2.5ZM2,4L6.5,8.5L2,13ZM4,4L14,4L9,9ZM16,4L16,13L11.5,8.5ZM7.5,9.5L9,11L10.5,9.5L15,14L3,14Z"></path>
                </g>
              </g>
            </Popover>
          );
          break;
        case 'RestCallTask':
          return (
            <Popover
              placement="right"
              content={item.hoverTip ? item.hoverTip.template || '未办理' : ''}
              title={item.hoverTip ? item.hoverTip.title : ''}>
              <g className="g">
                <rect
                  x="0"
                  y="0"
                  width={item.width}
                  height={item.height}
                  rx="10"
                  ry="10"
                  style={{ strokeWidth: '1px', fill: 'white' }}
                  className={item.borderColor}></rect>
                <text
                  fontSize="12"
                  x={item.width / 2}
                  y={item.height / 2}
                  align="middle center"
                  fittoelem="text_frame"
                  stroke="#373e48"
                  strokeWidth="0pt"
                  letterSpacing="-0.01px"
                  textAnchor="middle">
                  {item.splitName &&
                    item.splitName.length > 0 &&
                    item.splitName.map((name, k) => (
                      <tspan
                        x={item.width / 2}
                        y={item.height / 2}
                        dy={this.calcTextDy(item.splitName, k, item.height / 2)}
                        key={k}>
                        {name}
                      </tspan>
                    ))}
                </text>
                <g transform="translate(3, 3)">
                  <path
                    anchors="top left"
                    style={{ fill: '#16964d', stroke: 'none' }}
                    d="m 16.704699,5.9229055 q 0.358098,0 0.608767,0.2506681 0.250669,0.250668 0.250669,0.6087677 0,0.3580997 -0.250669,0.6087677 -0.250669,0.2506679 -0.608767,0.2506679 -0.358098,0 -0.608767,-0.2506679 -0.250669,-0.250668 -0.250669,-0.6087677 0,-0.3580997 0.250669,-0.6087677 0.250669,-0.2506681 0.608767,-0.2506681 z m 2.578308,-2.0053502 q -2.229162,0 -3.854034,0.6759125 -1.624871,0.6759067 -3.227361,2.2694472 -0.716197,0.725146 -1.575633,1.7457293 L 7.2329969,8.7876913 Q 7.0897576,8.8055849 7.000233,8.9309334 L 4.9948821,12.368677 q -0.035811,0.06267 -0.035811,0.143242 0,0.107426 0.080572,0.205905 l 0.5729577,0.572957 q 0.125334,0.116384 0.2864786,0.07162 l 2.4708789,-0.760963 2.5156417,2.515645 -0.76096,2.470876 q -0.009,0.02687 -0.009,0.08057 0,0.125338 0.08058,0.205905 l 0.572957,0.572958 q 0.170096,0.152194 0.349146,0.04476 l 3.437744,-2.005351 q 0.125335,-0.08953 0.143239,-0.232763 l 0.17905,-3.392986 q 1.02058,-0.859435 1.745729,-1.575629 1.67411,-1.6830612 2.309735,-3.2049805 0.635625,-1.5219191 0.635625,-3.8585111 0,-0.1253369 -0.08505,-0.2148575 -0.08505,-0.089526 -0.201431,-0.089526 z"
                    id="sid-1B4A8059-423B-42D1-96F8-490329020137path3413"></path>
                </g>
              </g>
            </Popover>
          );
          break;
        case 'IntermediateCatchEvent':
          return (
            <Popover
              placement="right"
              content={item.hoverTip ? item.hoverTip.template || '未办理' : ''}
              title={item.hoverTip ? item.hoverTip.title : ''}>
              <g>
                <g className="stencils" transform="translate(0, 0)">
                  <g className="me">
                    <g
                      pointerEvents="fill"
                      title="BPMN-EDITOR.ITEM.INTERMEDIATE-TIMER-CATCH-EVENT.TITLE">
                      <circle
                        cx="16"
                        cy="16"
                        r="15"
                        stroke="#585858"
                        fill="#ffffff"
                        strokeWidth="1"
                        style={{ strokeDasharray: '5.5, 3' }}></circle>

                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        stroke="#585858"
                        fill="none"
                        strokeWidth="1"
                        style={{ strokeDasharray: '4.5, 3' }}></circle>

                      <circle
                        cx="16"
                        cy="16"
                        r="15"
                        stroke="#585858"
                        fill="none"
                        strokeWidth="1"></circle>
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        stroke="#585858"
                        fill="none"
                        strokeWidth="1"></circle>

                      <path
                        id="sid-4D1C79FA-762B-4330-808B-43592314E89Apath1"
                        transform="translate(6,6)"
                        d="M 10 0 C 4.4771525 0 0 4.4771525 0 10 C 0 15.522847 4.4771525 20 10 20 C 15.522847 20 20 15.522847 20 10 C 20 4.4771525 15.522847 1.1842379e-15 10 0 z M 9.09375 1.03125 C 9.2292164 1.0174926 9.362825 1.0389311 9.5 1.03125 L 9.5 3.5 L 10.5 3.5 L 10.5 1.03125 C 15.063526 1.2867831 18.713217 4.9364738 18.96875 9.5 L 16.5 9.5 L 16.5 10.5 L 18.96875 10.5 C 18.713217 15.063526 15.063526 18.713217 10.5 18.96875 L 10.5 16.5 L 9.5 16.5 L 9.5 18.96875 C 4.9364738 18.713217 1.2867831 15.063526 1.03125 10.5 L 3.5 10.5 L 3.5 9.5 L 1.03125 9.5 C 1.279102 5.0736488 4.7225326 1.4751713 9.09375 1.03125 z M 9.5 5 L 9.5 8.0625 C 8.6373007 8.2844627 8 9.0680195 8 10 C 8 11.104569 8.8954305 12 10 12 C 10.931981 12 11.715537 11.362699 11.9375 10.5 L 14 10.5 L 14 9.5 L 11.9375 9.5 C 11.756642 8.7970599 11.20294 8.2433585 10.5 8.0625 L 10.5 5 L 9.5 5 z "
                        fill="#585858"
                        stroke="none"></path>

                      {/* <text x={item.width/2} y={item.height/2} fontSize="11" oryx:align="top center" activiti:max-width="150" activiti:max-height="50" stroke="#373e48" strokeWidth="0pt" letterSpacing="-0.01px" transform="rotate(0 16 33)" oryx:fontSize="11" textAnchor="middle"> */}
                      <text
                        x={item.width / 2}
                        y={item.height / 2}
                        fontSize="11"
                        stroke="#373e48"
                        strokeWidth="0pt"
                        letterSpacing="-0.01px"
                        transform="rotate(0 16 33)"
                        textAnchor="middle"></text>
                    </g>
                  </g>
                  <g className="children" style={{ overflow: 'hidden' }}></g>
                  <g className="edge"></g>
                </g>
                <g className="controls">
                  <g className="dockers"></g>
                  <g className="magnets" transform="translate(505.5, 324.5)">
                    <g
                      pointerEvents="all"
                      display="none"
                      transform="translate(8, 8)">
                      <circle
                        cx="8"
                        cy="8"
                        r="4"
                        stroke="none"
                        fill="red"
                        fillOpacity="0.3"></circle>
                    </g>
                  </g>
                </g>
              </g>
            </Popover>
          );
          break;
        // case 'IntermediateCatchEvent':
        // 	return (
        // 		<Popover placement="right" content={item.hoverTip?item.hoverTip.template||'未办理':''} title={item.hoverTip?item.hoverTip.title:''}>
        // 			<g>
        // 				<g className="stencils" transform="translate(0, 0)">
        // 					<g className="me">
        // 						<g pointer-events="fill" title="BPMN-EDITOR.ITEM.INTERMEDIATE-TIMER-CATCH-EVENT.TITLE">
        // 							<circle cx="16" cy="16" r="15" stroke="#585858" fill="#ffffff" strokeWidth="1" style={{strokeDasharray: '5.5, 3'}}></circle>

        // 							<circle cx="16" cy="16" r="12" stroke="#585858" fill="none" strokeWidth="1" style={{strokeDasharray: '4.5, 3'}}></circle>

        // 							<circle cx="16" cy="16" r="15" stroke="#585858" fill="none" strokeWidth="1"></circle>
        // 							<circle cx="16" cy="16" r="12" stroke="#585858" fill="none" strokeWidth="1"></circle>

        // 							<path id="sid-4D1C79FA-762B-4330-808B-43592314E89Apath1" transform="translate(6,6)" d="M 10 0 C 4.4771525 0 0 4.4771525 0 10 C 0 15.522847 4.4771525 20 10 20 C 15.522847 20 20 15.522847 20 10 C 20 4.4771525 15.522847 1.1842379e-15 10 0 z M 9.09375 1.03125 C 9.2292164 1.0174926 9.362825 1.0389311 9.5 1.03125 L 9.5 3.5 L 10.5 3.5 L 10.5 1.03125 C 15.063526 1.2867831 18.713217 4.9364738 18.96875 9.5 L 16.5 9.5 L 16.5 10.5 L 18.96875 10.5 C 18.713217 15.063526 15.063526 18.713217 10.5 18.96875 L 10.5 16.5 L 9.5 16.5 L 9.5 18.96875 C 4.9364738 18.713217 1.2867831 15.063526 1.03125 10.5 L 3.5 10.5 L 3.5 9.5 L 1.03125 9.5 C 1.279102 5.0736488 4.7225326 1.4751713 9.09375 1.03125 z M 9.5 5 L 9.5 8.0625 C 8.6373007 8.2844627 8 9.0680195 8 10 C 8 11.104569 8.8954305 12 10 12 C 10.931981 12 11.715537 11.362699 11.9375 10.5 L 14 10.5 L 14 9.5 L 11.9375 9.5 C 11.756642 8.7970599 11.20294 8.2433585 10.5 8.0625 L 10.5 5 L 9.5 5 z " fill="#585858" stroke="none"></path>

        // 							{/* <text x={item.width/2} y={item.height/2} fontSize="11" oryx:align="top center" activiti:max-width="150" activiti:max-height="50" stroke="#373e48" strokeWidth="0pt" letterSpacing="-0.01px" transform="rotate(0 16 33)" oryx:fontSize="11" textAnchor="middle"> */}
        // 							<text x={item.width/2} y={item.height/2} fontSize="11" stroke="#373e48" strokeWidth="0pt" letterSpacing="-0.01px" transform="rotate(0 16 33)" textAnchor="middle">
        // 							</text>
        // 						</g>
        // 					</g>
        // 					<g className="children" style={{overflow:'hidden'}}></g>
        // 					<g className="edge"></g>
        // 				</g>
        // 				<g className="controls">
        // 					<g className="dockers"></g>
        // 					<g className="magnets" transform="translate(505.5, 324.5)">
        // 						<g pointer-events="all" display="none" transform="translate(8, 8)">
        // 							<circle cx="8" cy="8" r="4" stroke="none" fill="red" fill-opacity="0.3"></circle>
        // 						</g>
        // 					</g>
        // 				</g>
        // 			</g>
        // 		</Popover>
        // 	);
        // 	break;
        case 'BoundaryEvent':
          return (
            <Popover
              placement="right"
              content={item.hoverTip ? item.hoverTip.template || '未办理' : ''}
              title={item.hoverTip ? item.hoverTip.title : ''}>
              <g id="svg-sid-59ABCD0B-66A7-43B3-B204-23068ABE3C43">
                <g className="stencils" transform="translate(0, 0)">
                  <g className="me">
                    <g
                      pointerEvents="fill"
                      id="sid-7A898A5B-6B25-4467-82CB-053B57263B23"
                      title="BPMN-EDITOR.ITEM.BOUNDARY-TIMER-EVENT.TITLE">
                      <circle
                        id="sid-7A898A5B-6B25-4467-82CB-053B57263B23bg_frame"
                        cx="16"
                        cy="16"
                        r="15"
                        stroke="#585858"
                        fill="#ffffff"
                        strokeWidth="1"
                        style={{ strokeDasharray: '5.5, 3' }}></circle>

                      <circle
                        id="sid-7A898A5B-6B25-4467-82CB-053B57263B23frame2_non_interrupting"
                        cx="16"
                        cy="16"
                        r="12"
                        stroke="#585858"
                        fill="none"
                        strokeWidth="1"
                        style={{ strokeDasharray: '4.5, 3' }}></circle>

                      <circle
                        id="sid-7A898A5B-6B25-4467-82CB-053B57263B23frame"
                        cx="16"
                        cy="16"
                        r="15"
                        stroke="#585858"
                        fill="none"
                        strokeWidth="1"
                        display="inherit"></circle>
                      <circle
                        id="sid-7A898A5B-6B25-4467-82CB-053B57263B23frame2"
                        cx="16"
                        cy="16"
                        r="12"
                        stroke="#585858"
                        fill="none"
                        strokeWidth="1"
                        display="inherit"></circle>

                      <path
                        id="sid-7A898A5B-6B25-4467-82CB-053B57263B23path1"
                        transform="translate(6,6)"
                        d="M 10 0 C 4.4771525 0 0 4.4771525 0 10 C 0 15.522847 4.4771525 20 10 20 C 15.522847 20 20 15.522847 20 10 C 20 4.4771525 15.522847 1.1842379e-15 10 0 z M 9.09375 1.03125 C 9.2292164 1.0174926 9.362825 1.0389311 9.5 1.03125 L 9.5 3.5 L 10.5 3.5 L 10.5 1.03125 C 15.063526 1.2867831 18.713217 4.9364738 18.96875 9.5 L 16.5 9.5 L 16.5 10.5 L 18.96875 10.5 C 18.713217 15.063526 15.063526 18.713217 10.5 18.96875 L 10.5 16.5 L 9.5 16.5 L 9.5 18.96875 C 4.9364738 18.713217 1.2867831 15.063526 1.03125 10.5 L 3.5 10.5 L 3.5 9.5 L 1.03125 9.5 C 1.279102 5.0736488 4.7225326 1.4751713 9.09375 1.03125 z M 9.5 5 L 9.5 8.0625 C 8.6373007 8.2844627 8 9.0680195 8 10 C 8 11.104569 8.8954305 12 10 12 C 10.931981 12 11.715537 11.362699 11.9375 10.5 L 14 10.5 L 14 9.5 L 11.9375 9.5 C 11.756642 8.7970599 11.20294 8.2433585 10.5 8.0625 L 10.5 5 L 9.5 5 z "
                        fill="#585858"
                        stroke="none"></path>

                      {/* <text x={item.width/2} y={item.height/2} fontSize="11" id="sid-7A898A5B-6B25-4467-82CB-053B57263B23text_name" oryx:align="top center" activiti:max-width="150" activiti:max-height="50" stroke="#373e48" strokeWidth="0pt" letterSpacing="-0.01px" transform="rotate(0 16 33)" oryx:fontSize="11" textAnchor="middle"> */}
                      <text
                        x={item.width / 2}
                        y={item.height / 2}
                        fontSize="11"
                        id="sid-7A898A5B-6B25-4467-82CB-053B57263B23text_name"
                        stroke="#373e48"
                        strokeWidth="0pt"
                        letterSpacing="-0.01px"
                        transform="rotate(0 16 33)"
                        textAnchor="middle"></text>
                    </g>
                  </g>
                  <g className="children" style={{ overflow: 'hidden' }}></g>
                  <g className="edge"></g>
                </g>
                <g className="controls">
                  <g className="dockers"></g>
                  <g
                    className="magnets"
                    transform="translate(390.7353131983772, 119.27042614792467)">
                    <g
                      pointerEvents="all"
                      display="none"
                      transform="translate(8, 8)">
                      <circle
                        cx="8"
                        cy="8"
                        r="4"
                        stroke="none"
                        fill="red"
                        fillOpacity="0.3"></circle>
                    </g>
                  </g>
                </g>
              </g>
            </Popover>
          );
          break;
        case 'ServiceTask':
          return (
            <Popover
              placement="right"
              content={item.hoverTip ? item.hoverTip.template || '未办理' : ''}
              title={item.hoverTip ? item.hoverTip.title : ''}>
              <g tip="item.hoverTip" className="g">
                <rect
                  x="0"
                  y="0"
                  width={item.width}
                  height={item.height}
                  rx="10"
                  ry="10"
                  style={{ strokeWidth: '1px', fill: 'white' }}
                  className={item.borderColor}></rect>
                <text
                  fontSize="12"
                  x={item.width / 2}
                  y={item.height / 2}
                  align="middle center"
                  fittoelem="text_frame"
                  stroke="#373e48"
                  strokeWidth="0pt"
                  letterSpacing="-0.01px"
                  textAnchor="middle">
                  {item.splitName &&
                    item.splitName.length > 0 &&
                    item.splitName.map((name, k) => (
                      <tspan
                        x={item.width / 2}
                        y={item.height / 2}
                        dy={this.calcTextDy(item.splitName, k, item.height / 2)}
                        key={k}>
                        {name}
                      </tspan>
                    ))}
                </text>
                <g transform="translate(3, 3)">
                  <path
                    anchors="top left"
                    style={{ fill: '#72a7d0', stroke: 'none' }}
                    d="M 8,1 7.5,2.875 c 0,0 -0.02438,0.250763 -0.40625,0.4375 C 7.05724,3.330353 7.04387,3.358818 7,3.375 6.6676654,3.4929791 6.3336971,3.6092802 6.03125,3.78125 6.02349,3.78566 6.007733,3.77681 6,3.78125 5.8811373,3.761018 5.8125,3.71875 5.8125,3.71875 l -1.6875,-1 -1.40625,1.4375 0.96875,1.65625 c 0,0 0.065705,0.068637 0.09375,0.1875 0.002,0.00849 -0.00169,0.022138 0,0.03125 C 3.6092802,6.3336971 3.4929791,6.6676654 3.375,7 3.3629836,7.0338489 3.3239228,7.0596246 3.3125,7.09375 3.125763,7.4756184 2.875,7.5 2.875,7.5 L 1,8 l 0,2 1.875,0.5 c 0,0 0.250763,0.02438 0.4375,0.40625 0.017853,0.03651 0.046318,0.04988 0.0625,0.09375 0.1129372,0.318132 0.2124732,0.646641 0.375,0.9375 -0.00302,0.215512 -0.09375,0.34375 -0.09375,0.34375 L 2.6875,13.9375 4.09375,15.34375 5.78125,14.375 c 0,0 0.1229911,-0.09744 0.34375,-0.09375 0.2720511,0.147787 0.5795915,0.23888 0.875,0.34375 0.033849,0.01202 0.059625,0.05108 0.09375,0.0625 C 7.4756199,14.874237 7.5,15.125 7.5,15.125 L 8,17 l 2,0 0.5,-1.875 c 0,0 0.02438,-0.250763 0.40625,-0.4375 0.03651,-0.01785 0.04988,-0.04632 0.09375,-0.0625 0.332335,-0.117979 0.666303,-0.23428 0.96875,-0.40625 0.177303,0.0173 0.28125,0.09375 0.28125,0.09375 l 1.65625,0.96875 1.40625,-1.40625 -0.96875,-1.65625 c 0,0 -0.07645,-0.103947 -0.09375,-0.28125 0.162527,-0.290859 0.262063,-0.619368 0.375,-0.9375 0.01618,-0.04387 0.04465,-0.05724 0.0625,-0.09375 C 14.874237,10.52438 15.125,10.5 15.125,10.5 L 17,10 17,8 15.125,7.5 c 0,0 -0.250763,-0.024382 -0.4375,-0.40625 C 14.669647,7.0572406 14.641181,7.0438697 14.625,7 14.55912,6.8144282 14.520616,6.6141566 14.4375,6.4375 c -0.224363,-0.4866 0,-0.71875 0,-0.71875 L 15.40625,4.0625 14,2.625 l -1.65625,1 c 0,0 -0.253337,0.1695664 -0.71875,-0.03125 l -0.03125,0 C 11.405359,3.5035185 11.198648,3.4455201 11,3.375 10.95613,3.3588185 10.942759,3.3303534 10.90625,3.3125 10.524382,3.125763 10.5,2.875 10.5,2.875 L 10,1 8,1 z m 1,5 c 1.656854,0 3,1.3431458 3,3 0,1.656854 -1.343146,3 -3,3 C 7.3431458,12 6,10.656854 6,9 6,7.3431458 7.3431458,6 9,6 z"
                    id="sid-D5F9FEF1-92C8-467C-8E0E-0A318CFFC629_sid-D5F9FEF1-92C8-467C-8E0E-0A318CFFC629_17"></path>
                </g>
              </g>
            </Popover>
          );
          break;
        case 'CallActivity':
          return (
            <g className="g">
              <rect
                x="0"
                y="0"
                width={item.width}
                height={item.height}
                rx="10"
                ry="10"
                style={{ strokeWidth: '1px', fill: 'white' }}
                className={item.borderColor}></rect>
              <text
                fontSize="12"
                x={item.width / 2}
                y={item.height / 2}
                align="middle center"
                fittoelem="text_frame"
                stroke="#373e48"
                strokeWidth="0pt"
                letterSpacing="-0.01px"
                textAnchor="middle">
                {item.splitName &&
                  item.splitName.length > 0 &&
                  item.splitName.map((name, k) => (
                    <tspan
                      x={item.width / 2}
                      y={item.height / 2}
                      dy={this.calcTextDy(item.splitName, k, item.height / 2)}
                      key={k}>
                      {name}
                    </tspan>
                  ))}
              </text>
            </g>
          );
          break;
        case 'StartEvent':
          return (
            <g>
              <circle
                cx="15"
                cy="15"
                r={item.width / 2}
                stroke="#585858"
                fill="#ffffff"
                strokeWidth="1"
                className={item.borderColor}></circle>
            </g>
          );
          break;
        case 'EndEvent':
          return (
            <g>
              <circle
                cx="14"
                cy="14"
                r="14"
                stroke="#585858"
                fill="#ffffff"
                strokeWidth="3"
                className={item.borderColor}></circle>
            </g>
          );
          break;
        case 'ExclusiveGateway':
          return (
            <g>
              <path
                d=" M0 20.5  L20.5 0  L40 20.5  L20.5 40  z"
                fill="#ffffff"
                stroke="#585858"
                style={{ strokeWidth: '1' }}
                className={item.borderColor}></path>
              <path
                stroke="#585858"
                fill="#585858"
                d=" M13.25 12.05  L17.25 12.05  L27.65 28.95  L23.75 28.95  z"
                style={{ strokeWidth: '1' }}></path>
              <path
                stroke="#585858"
                fill="#585858"
                d=" M13.25 28.95  L23.75 12.05  L27.65 12.05  L17.25 28.95  z"
                style={{ strokeWidth: '1' }}></path>
            </g>
          );
          break;
        case 'ParallelGateway':
          return (
            <g>
              <path
                d=" M0 20.5  L20.5 0  L40 20.5  L20.5 40  z"
                fill="#ffffff"
                stroke="#585858"
                style={{ strokeWidth: '1' }}
                className={item.borderColor}></path>
              <path
                d=" M11.25 20.5  L30.25 20.5  M20.5 11.25  L20.5 30.25 "
                id="sid-586F7FA9-EBC0-4772-A73C-7485A6295045path9"
                stroke="#585858"
                style={{ fill: 'none', strokeWidth: '3' }}></path>
            </g>
          );
          break;
        case 'InclusiveGateway':
          return (
            <g>
              <path
                d=" M0 20.5  L20.5 0  L40 20.5  L20.5 40  z"
                fill="#ffffff"
                stroke="#585858"
                style={{ strokeWidth: '1' }}
                className={item.borderColor}></path>
              <circle
                stroke="#585858"
                cx="20.5"
                cy="20.5"
                r="9.75"
                style={{ fill: 'none', strokeWidth: '2.5' }}></circle>
              {/* <text x="30" y="30" oryx:align="left top" activiti:max-width="150" activiti:max-height="50" strokeWidth="0pt" letterSpacing="-0.01px" transform="rotate(0 30 30)" oryx:fontSize="12" textAnchor="start"></text> */}
              <text
                x="30"
                y="30"
                strokeWidth="0pt"
                letterSpacing="-0.01px"
                transform="rotate(0 30 30)"
                textAnchor="start"></text>
            </g>
          );
          break;
        case 'ServiceTask':
          return (
            <g v-if="item.type === 'EventGateway'">
              <path
                d=" M0 20.5  L20.5 0  L40 20.5  L20.5 40  z"
                fill="#ffffff"
                stroke="#585858"
                style={{ strokeWidth: '1' }}
                className={item.borderColor}></path>
              <circle
                cx="20.5"
                cy="20.5"
                r="11"
                stroke="#585858"
                style={{ fill: 'none', strokeWidth: '1' }}></circle>
              <path
                d=" M24.827514 26.844972  L15.759248000000001 26.844216  L12.957720300000002 18.219549  L20.294545 12.889969  L27.630481000000003 18.220774  L24.827514 26.844972  z"
                id="sid-7D4A51E6-2E31-41F1-B64E-931DC76C8259middlePolygon2"
                stroke="#585858"
                style={{
                  fill: 'none',
                  fillOpacity: '1',
                  strokeWidth: '1.39999998',
                  strokeLinejoin: 'bevel',
                  strokeOpacity: '1'
                }}></path>
            </g>
          );
          break;
        default:
          return null;
      }
    };
    return (
      <div className="flow-graph-container">
        <div className="svg-wrapper">
          <svg
            className="svg-container"
            width={svgWidth}
            height={svgHeight}
            ref={ref => (this.svg = ref)}
            onTouchStart={this.handleMouseDown}
            onTouchEnd={this.handleMouseUp}
            onTouchMove={() => {
              this.setState({ isMouseDown: false });
            }}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseLeave={() => {
              this.setState({ isMouseDown: false });
            }}
            onMouseMove={this.handleMouseMove}>
            <defs>
              <marker
                id="markerArrow"
                markerUnits="userSpaceOnUse"
                markerWidth="8"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto">
                <path
                  d="M 0 0 L 8 4 L 0 8 z"
                  stroke="#909090"
                  fill="#909090"></path>
              </marker>
              <marker
                id="markerArrow_green"
                markerUnits="userSpaceOnUse"
                markerWidth="8"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto">
                <path
                  d="M 0 0 L 8 4 L 0 8 z"
                  stroke="#4ac455"
                  fill="#4ac455"></path>
              </marker>
              <marker
                id="markerArrow_blue"
                markerUnits="userSpaceOnUse"
                markerWidth="8"
                markerHeight="8"
                refX="8"
                refY="4"
                orient="auto">
                <path
                  d="M 0 0 L 8 4 L 0 8 z"
                  stroke="rgb(69, 69, 168)"
                  fill="rgb(69, 69, 168)"></path>
              </marker>
              <marker
                id="markerend"
                refX="15"
                refY="6"
                markerUnits="userSpaceOnUse"
                markerWidth="15"
                markerHeight="12"
                orient="auto">
                <path
                  d="M 0 1 L 15 6 L 0 11z"
                  fill="#585858"
                  stroke="#585858"
                  strokeLinejoin="round"
                  strokeWidth="2"></path>
              </marker>
              <marker
                id="markerstart"
                refX="1"
                refY="5"
                markerUnits="userSpaceOnUse"
                markerWidth="17"
                markerHeight="11"
                orient="auto">
                <path
                  d="M 5 0 L 11 10"
                  fill="white"
                  stroke="#585858"
                  strokeWidth="1"
                  display="none"></path>
              </marker>
            </defs>
            <g className="viewport" transform={this.viewPortTransform}>
              {elements.map((item, index) => (
                <g
                  className="d-element-group"
                  transform={this.pos(item)}
                  key={index + 'forecast'}>
                  {getNode(item)}
                </g>
              ))}
              // 线段的颜色
              {flows.map((item, index) => (
                <g className="d-line-group" key={index}>
                  <polyline
                    fill="none"
                    stroke={
                      item.forecast
                        ? 'rgb(69, 69, 168)'
                        : item.completed
                        ? '#4ac455'
                        : '#909090'
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd={
                      item.forecast
                        ? 'url(#markerArrow_blue)'
                        : item.completed
                        ? 'url(#markerArrow_green)'
                        : 'url(#markerArrow)'
                    }
                    markerStart="url(#markerstart)"
                    points={item.path}></polyline>
                </g>
              ))}
            </g>
          </svg>
        </div>
        <ul className="scale-svg-btns">
          <li>
            <Button onClick={() => this.changeScale(1)}>
              <Icon type="zoom-in" />
            </Button>
          </li>
          <li>
            <Button onClick={() => this.changeScale(-1)}>
              <Icon type="zoom-out" />
            </Button>
          </li>
          <li>
            <Button onClick={this.resetGraph}>
              <Icon type="undo" />
            </Button>
          </li>
        </ul>
      </div>
    );
  }
}

// export default connect(({workflow})=>{
// 	return {
//     workflowInfo: workflow.workflowInfo
//   };

// })(ForecastGraph);
export default translate()(ForecastGraph);
