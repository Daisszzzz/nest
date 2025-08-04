import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  easing: 'ease',         // Animation style
  speed: 500,             // Speed of progress bar increase
  showSpinner: false,     // Whether to show the loading spinner
  trickleSpeed: 200,      // Auto-increment interval
  minimum: 0.3,           // Minimum percentage when initialized
})

export default NProgress
