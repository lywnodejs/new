// components/handWrite/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    canvasName: {
      type: String,
      value: ''
    },
    status:{
      type:String,
      value:''
    },
    index:{
      type:Number,
    }
  },

  observers:{
    'status':function(val){
      console.log(val);
      if(val==='clear'){ //清空画布
        this.data.ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
        this.data.ctx.draw()
        this.setData({
          points:[],
          pointsAll:[],
          one:[]
        })
      } else if(val==='img'){
        this.saveCanvasAsImg();
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    ctx: '',
    ctx2:'',
    canvasWidth: 0,
    canvasHeight: 0,
    points:[],
    one:[],
    pointsAll:[]
  },

  /**
   * 组件的方法列表
   */
  ready() {
    let thas = this;
    thas.init();
    console.log(this.data.index);
  },
  methods: {
    init() {
      let {canvasName} = this.data
      let ctx = wx.createCanvasContext(canvasName, this)
      let ctx2 = wx.createCanvasContext(canvasName+'bg', this)
      //设置画笔样式
      var query = wx.createSelectorQuery();
      query.select('.handCenter').boundingClientRect(rect => {
        this.setData({
          canvasWidth: rect.width,
          canvasHeight: rect.height,
          ctx: ctx,
          ctx2: ctx2,
        })
        this.setCanvasBg();

      }).exec();

    },
    // 笔迹开始
    uploadScaleStart(e) {
    let startX = e.changedTouches[0].x;
				let startY = e.changedTouches[0].y;
				let startPoint = {X:startX,Y:startY};
        let line = this.data.points;
        line.push(startPoint)
        this.setData({
          points:line
        })
    },
    // 笔迹移动
    uploadScaleMove(e) {
      let moveX = e.changedTouches[0].x;
      let moveY = e.changedTouches[0].y;
      let movePoint = {X:moveX,Y:moveY};
      let line = this.data.points;
      line.push(movePoint)
      this.setData({
        points:line
      })  
      let len = this.data.points.length;
      if(len>=2){
        this.drawer();                   //绘制路径
      }
    },
    drawer() {
      let point1 = this.data.points[0]
        let point2 = this.data.points[1]
        let line = this.data.points;
        let one = this.data.one;
        line.shift()
        one.push(parseInt(line[0].X + this.data.canvasWidth* this.data.index));
        one.push(parseInt(line[0].Y));
        this.setData({
          points:line,
          one:one
        })
      this.data.ctx.setLineDash([0, 0]);
      this.data.ctx.setLineWidth(4)
        this.data.ctx.strokeStyle = '#000000';
        this.data.ctx.beginPath();
				this.data.ctx.moveTo(point1.X, point1.Y)
				this.data.ctx.lineTo(point2.X, point2.Y)
				this.data.ctx.stroke()
        this.data.ctx.draw(true)
    },
    // 笔迹结束
    uploadScaleEnd(e) {
      let one = this.data.one;
      one.push(-1)
      one.push(0)
      this.setData({
        points:[],
        one
      })
    },

    //生成图片
    saveCanvasAsImg() {
      let thas = this;
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: thas.data.canvasWidth,
        height: thas.data.canvasHeight,
        destWidth: thas.data.canvasWidth,
        destHeight: thas.data.canvasHeight,
        canvasId: thas.data.canvasName,
        success(res) {
          thas.triggerEvent('imageUrl',{
            imgUrl:res.tempFilePath,
            lineList:thas.data.one,
            index:thas.data.index,
            width: thas.data.canvasWidth,
            height:thas.data.canvasHeight,
          })
        },
        fail(err){
          console.log(err);
        }
      },this)
    },
    setCanvasBg() {
      this.data.ctx2.strokeStyle = '#e8e8e8';
      this.data.ctx2.beginPath();
      this.data.ctx2.setLineDash([4, 4]);
      this.data.ctx2.moveTo(0, 0);
      this.data.ctx2.lineTo(this.data.canvasWidth, this.data.canvasHeight);
      this.data.ctx2.stroke();
      this.data.ctx2.moveTo(this.data.canvasWidth, 0);
      this.data.ctx2.lineTo(0, this.data.canvasHeight);
      this.data.ctx2.stroke();
      this.data.ctx2.draw() //开画
    },
  }
})