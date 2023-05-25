---
title: react初识
date: 2017-05-22
categories: react
cover_picture: images/react.png
author: lyw
tags:
    - react
---
> React 起源于 Facebook 的内部项目，因为该公司对市场上所有 JavaScript MVC 框架，都不满意，就决定自己写一套，用来架设 Instagram 的网站。做出来以后，发现这套东西好用，就在2013年5月开源了
-----------------------
# ReactDOM.render()
    ReactDOM.render 是 React 的最基本方法，用于将模板转为 HTML 语言，并插入指定的 DOM 节点。

```
ReactDOM.render(
    <h1>hello world ！ </h1>,
    document.getElementById("app") //将h1插入到真是dom元素里
)
```
> 下面代码体现了 JSX 的基本语法规则：遇到 HTML 标签（以 < 开头），就用 HTML 规则解析；遇到代码块（以 { 开头），就用 JavaScript 规则解析。
```
var names=["array","number","data"]
     ReactDOM.render(
         <div>
         {
            names.map(function (name) {
                return <div>hello {name}</div> ////上面代码的names变量是一个数组，结果 JSX 会把它的所有成员，添加到模版
            })
         }
         </div>,
        document.getElementById("app") 
    )
```
-----------------------
# React.createClass 
> React 允许将代码封装成组件（component），然后像插入普通 HTML 标签一样，在网页中插入这个组件。React.createClass 方法就用于生成一个组件类
```
var Hello=React.createClass({
    render:function () {
        return <h1>我是组件 {this.props.name}</h1>;//组件的属性可以在组件类的 this.props 对象上获取，比如 name 属性就可以通过 this.props.name 读取
      }
});
ReactDOM.render(
    <Hello name="join"/>,
    document.getElementById("app")  
)
```
>  上面代码中，变量 Hello 就是一个组件类。模板插入 <app /> 时，会自动生成 app 的一个实例.所有组件类都必须有自己的 render 方法，用于输出组件。
> 注意，组件类的第一个字母必须大写，否则会报错，另外，组件类只能包含一个顶层标签，否则也会报错。添加组件属性，有一个地方需要注意，就是 class 属性需要写成 className ，for 属性需要写成 htmlFor ，这是因为 class 和 for 是 JavaScript 的保留字。
-----------------------
# this.props.children
> this.props.children 属性。它表示组件的所有子节点
```
var Hello2=React.createClass({
    render:function () { 
        return (
            <ol>
                {
                    React.Children.map(this.props.children,function (child) {
                        return <li>{child}</li>;
                      })
                }
            </ol>
        )
     }
})
ReactDOM.render(
    <Hello2>
        <span>hello</span>
        <span>world</span>
    </Hello2>,
    document.body
)
```
> 这里需要注意， this.props.children 的值有三种可能：如果当前组件没有子节点，它就是 undefined ;如果有一个子节点，数据类型是 object ；如果有多个子节点，数据类型就是 array 。所以，处理 this.props.children 的时候要小心。React 提供一个工具方法 React.Children 来处理 this.props.children 。我们可以用 React.Children.map 来遍历子节点，而不用担心 this.props.children 的数据类型是 undefined 还是 object。

-----------------------------
# getDefaultProps & PropTypes
```
var MyTitle = React.createClass({
    getDefaultProps:function () {//getDefaultProps 方法可以用来设置组件属性的默认值。
        return {
            title:"hello world"
        };
      },
  propTypes: {
    title: React.PropTypes.string.isRequired,
  },//上面的Mytitle组件有一个title属性。PropTypes 告诉 React，这个 title 属性是必须的，而且它的值必须是字符串。

  render: function() {
     return <h1> {this.props.title} </h1>;
   }
});
ReactDOM.render(
  <MyTitle />,
  document.body
  //上面代码会输出"Hello World"。
);
```
------------------------------------
# ref
>组件并不是真实的 DOM 节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM （virtual DOM）。只有当它插入文档以后，才会变成真实的 DOM 。根据 React 的设计，所有的 DOM 变动，都先在虚拟 DOM 上发生，然后再将实际发生变动的部分，反映在真实 DOM上，这种算法叫做 DOM diff ，它可以极大提高网页的性能表现。
> 但是，有时需要从组件获取真实 DOM 的节点，这时就要用到 ref 属性
```
var MyComponent = React.createClass({
  handleClick: function(value) {
    this.refs.myTextInput.focus();
    console.log(this.refs.myTextInput.value)
  },
  render: function() {
    return (
      <div>
        <input type="text" ref="myTextInput" />
        <input type="button" value="Focus the text input" onClick={this.handleClick} />
      </div>
    );
  }
});

ReactDOM.render(
  <MyComponent />,
  document.body
);
```
> 上面代码中，组件 MyComponent 的子节点有一个文本输入框，用于获取用户的输入。这时就必须获取真实的 DOM 节点，虚拟 DOM 是拿不到用户输入的。为了做到这一点，文本输入框必须有一个 ref 属性，然后 this.refs.[refName] 就会返回这个真实的 DOM 节点。需要注意的是，由于 this.refs.[refName] 属性获取的是真实 DOM ，所以必须等到虚拟 DOM 插入文档以后，才能使用这个属性，否则会报错。上面代码中，通过为组件指定 Click 事件的回调函数，确保了只有等到真实 DOM 发生 Click 事件之后，才会读取 this.refs.[refName] 属性。React 组件支持很多事件，除了 Click 事件以外，还有 KeyDown 、Copy、Scroll 等

# this.state

> 组件免不了要与用户互动，React 的一大创新，就是将组件看成是一个状态机，一开始有一个初始状态，然后用户互动，导致状态变化，从而触发重新渲染 UI
```
var Buttons=React.createClass({
    getInitialState:function () {
        return {live:true}
    },
    handleClick:function () {
        this.setState({live:!this.state.live})    
    },
    render:function () {
        var text=this.state.live ? "你好" : "你们好"
        return (
            <div onClick={this.handleClick}>{text},</div>
        )
    }
})
ReactDOM.render(
    <Buttons/>,
    document.body
)
```
> 上面代码是一个 Buttons 组件，它的 getInitialState 方法用于定义初始状态，也就是一个对象，这个对象可以通过 this.state 属性读取。当用户点击组件，导致状态变化，this.setState 方法就修改状态值，每次修改以后，自动调用 this.render 方法，再次渲染组件。
> 由于 this.props 和 this.state 都用于描述组件的特性，可能会产生混淆。一个简单的区分方法是，this.props 表示那些一旦定义，就不再改变的特性，而 this.state 是会随着用户互动而产生变化的特性。
----------------------------
# 表单
> 用户在表单填入的内容，属于用户跟组件的互动，所以不能用 this.props 读取
```
var Input=React.createClass({
        getInitialState:function(){
            return {value:"hello"};
        },
        handleChange:function(event){
            this.setState({value:event.target.value});
        },
        render:function(){
            var value=this.state.value;
            return (
                <div>
                    <input type="text" value={value} onChange={this.handleChange} />
                    <p>{value}</p>
                </div>
            )
        }
    });
    ReactDOM.render(
        <Input />,
        document.body
    )
```
> 上面代码中，文本输入框的值，不能用 this.props.value 读取，而要定义一个 onChange 事件的回调函数，通过 event.target.value 读取用户输入的值。textarea 元素、select元素、radio元素都属于这种情况，更多介绍请参考官方文档。
--------------------------
# 组件的生命周期
>     组件的生命周期分成三个状态：
>     Mounting：已插入真实 DOM
>     Updating：正在被重新渲染
>     Unmounting：已移出真实 DOM

>React 为每个状态都提供了两种处理函数，will 函数在进入状态之前调用，did 函数在进入状态之后调用，三种状态共计五种处理函数。
> componentWillMount()
> componentDidMount()
> componentWillUpdate(object nextProps, object nextState)
> componentDidUpdate(object prevProps, object prevState)
> componentWillUnmount()

> 此外，React 还提供两种特殊状态的处理函数。
> componentWillReceiveProps(object nextProps)：已加载组件收到新的参数时调用
> shouldComponentUpdate(object nextProps, object nextState)：组件判断是否重新渲染时调用
```
var Hello=React.createClass({
        getInitialState:function () {
            return {opacity:1.0}
        },
        componentDidMount:function (){
            this.timer=setInterval(function () {
                var opacity=this.state.opacity;
                opacity-=0.1;
                if(opacity<0.1){opacity=1.0}
                this.setState({
                    opacity:opacity
                })
            }.bind(this),100)
        },
        render:function () {
            return (
                <div style={{opacity:this.state.opacity}}>hello {this.props.name}</div>
            )
        }
    })
    ReactDOM.render(
        <Hello name="world" />,
        document.body
    )
```
>上面代码在hello组件加载以后，通过 componentDidMount 方法设置一个定时器，每隔100毫秒，就重新设置组件的透明度，从而引发重新渲染。
-------------------
# 文档声明 

> 转载自阮一峰的 [React 入门实例教程](http://www.ruanyifeng.com/blog/2015/03/react.html)