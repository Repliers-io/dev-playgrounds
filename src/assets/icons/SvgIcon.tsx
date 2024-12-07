import { type SVGAttributes } from 'react'

type SvgProps = SVGAttributes<SVGElement> & {
  size?: number
}

export type IconProps = SvgProps & {
  color?: string
}

const SvgIcon = ({ size = 20, children, ...rest }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      {children}
    </svg>
  )
}

export default SvgIcon
