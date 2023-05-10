import styles from './spinner.module.css'

export default () => (
  <svg class={styles.spinner} width="65" height="65" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
    <circle class={`stroke-slate-500 ${styles.path}`} fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
  </svg>
)
