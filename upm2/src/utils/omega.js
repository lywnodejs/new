
import {
  isPreRelease, isQa, isOverseaTest
} from '../config/env';

export function trackEvent(...args) {
  if (isPreRelease || isQa || isOverseaTest) return
  window.Omega &&  window.Omega.trackEvent(...args)
}
