import {combineURLs} from 'utils'

let link

function createLink(path = '/static/style', file = 'index.css', theme) {
  if (link == null) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.getElementsByTagName('HEAD').item(0).appendChild(link);
  }
  link.href = combineURLs(path, `${theme}/${file}`);
}

export default function theme({store, path, file}) {
  const {theme} = store.state

  createLink(path, file, theme)
  store.watch(({theme}) => theme, theme => {
    createLink(path, file, theme)
  })

  return function (Components) {
    return {
      functional: true,
      render() {
        return (<Components />)
      }
    }
  }
}
