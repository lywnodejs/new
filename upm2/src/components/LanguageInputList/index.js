/**
 * July 2018
 * wujianjian created
 */

import { Input, Form } from 'antd';
import connect from '@utils/translateConnect';
import { PubSub } from 'pubsub-js'

const FormItem = Form.Item;
let subscribeToken

class LanguageInputList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    subscribeToken = PubSub.subscribe('languageChange', (msg, value) => {
      let temp = {}
      value.map((item, i) => {
        temp['languageItem_' + i] = item.name
      })
      
      this.setState({value})
      this.props.form.setFieldsValue({
        ...temp
      })
    })
  }

  componentWillMount(){
    let value = this.props.value || [{
      lang: 'zh',
      name: '',
      placeholder: '中文'
    }]
    
    this.setState({value})
  }

  changeHandler = e => {
    const target = e.target,
          index = target.getAttribute('index'),
          value = target.value,
          values = this.state.value
    
    values[index * 1].name = value
    this.setState({
      value: values
    })
  }

  componentWillUnmount(){
    PubSub.unsubscribe(subscribeToken)
  }

  render(){
    const { t, form, formItemLayout } = this.props;
    const { getFieldDecorator } = form;

    return (
      this.state.value.map((item, i) => {
        return(
          <FormItem key={i}
            {...(i === 0 ? (formItemLayout || {}) : {})}
            label={i === 0 ? t(this.props.title || t('功能名称')) : ''}
          >
          <div style={{display:'flex'}}>
            <label style={{lineHeight:'30px', whiteSpace:'nowrap', padding:'0 10px', textAlign:'center', border:'1px solid #d9d9d9', backgroundColor:'#c5c5c5', borderRight:'none'}}>{t(item.placeholder)}</label>
            {getFieldDecorator('languageItem_' + i, {
              rules: [{ required: true, message: t('请输入名称') }],
              initialValue: t(item.name)
            })(
               <Input 
                 disabled={this.props.disabled || false}
                 style={{borderLeft:'none'}}
                 placeholder={t('推荐与业务系统的功能名称保持一致')}
                 onChange={this.changeHandler}
                 index={i}
               />
            )}
            </div>
          </FormItem> 
        )
      })
    )
  }
}

export default connect(({ global }) => {
  return {}
})(LanguageInputList)