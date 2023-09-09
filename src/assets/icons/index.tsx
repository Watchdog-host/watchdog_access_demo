import { FC } from 'react'
import classes from './icon.module.scss'
import cn from 'classnames'
import { svgVariables } from 'constants/common'
type Props = {
  size?: number
}

export const AnimatedSuccessIcon: FC<Props> = ({ size = 16 }) => {
  return (
    <svg className={cn(classes.successAnimation, classes.animated)} xmlns="http://www.w3.org/2000/svg" width={size * 2} height={size * 2} viewBox="0 0 70 70">
      <path
        className={classes.successAnimationResult}
        fill="#D8D8D8"
        d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"
      />
      <circle className={classes.successAnimationCircle} cx="35" cy="35" r="24" stroke="#979797" strokeWidth="2" strokeLinecap="round" fill="transparent" />
      <polyline className={classes.successAnimationCheck} stroke="#979797" strokeWidth="2" points="23 34 34 43 47 27" fill="transparent" />
    </svg>
  )
}

export const AvatarIcon = ({ size = 40 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24">
    <path fill={svgVariables.$darkGray} d="M12 22.01c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z" />
    <path
      fill={'#f6f6f6'}
      d="M12 6.94c-2.07 0-3.75 1.68-3.75 3.75 0 2.03 1.59 3.68 3.7 3.74h.18a3.743 3.743 0 0 0 3.62-3.74c0-2.07-1.68-3.75-3.75-3.75ZM18.78 19.36A9.976 9.976 0 0 1 12 22.01c-2.62 0-5-1.01-6.78-2.65.24-.91.89-1.74 1.84-2.38 2.73-1.82 7.17-1.82 9.88 0 .96.64 1.6 1.47 1.84 2.38Z"
    />
  </svg>
)
