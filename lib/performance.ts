// Global animation settings for better performance
export const FAST_TRANSITION = {
  duration: 0.3,
  ease: "easeOut"
}

export const QUICK_TRANSITION = {
  duration: 0.2,
  ease: "easeOut"
}

export const INSTANT_TRANSITION = {
  duration: 0.1,
  ease: "easeOut"
}

export const STAGGER_DELAY = 0.05

export const REDUCED_MOTION = {
  duration: 0.2,
  ease: "easeOut"
}

export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const imageLoader = ({ src }: { src: string }) => {
  return src
}