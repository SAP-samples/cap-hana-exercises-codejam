import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'

export default {
  extends: Theme,
  Layout: () => h(Theme.Layout, null, {}),
}
