const userLink = {
  functional: true,
  render(h, { props, children }) {
    if (props.email) {
      const user = props.email.split("@")[0]
      const href = `http://i.xiaojukeji.com/space/personal/${user}?lang=zh-CN`

      return <a target="_blank" href={href}>{children}</a>
    }
    return children
  }
}

const customTip = {
  functional: true,
  render(h, { props, children }) {
    if (props.value) {
      const [fir, sec] = props.value
      const content = fir + '/' + sec

      if (fir == 0 && sec == 0) {
        return <span style="color: #c0c4cc">{content}</span>
      } else if(fir == sec) {
        return <el-tooltip class="item" effect="light" placement="top">
          <div slot="content">{children}</div>
          <span style="color: green">{content}</span>
        </el-tooltip>
      }
      return <el-tooltip class="item" effect="light" placement="top">
        <div slot="content">{children}</div>
        <span style="color: red">{content}</span>
      </el-tooltip>
    }
    return ''
  }
}

export {
  userLink,
  customTip
}
