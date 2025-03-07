import iconPathMap from "@/assets/iconPaths";
import { CSSProperties } from "react";

interface IconProps {
  // name per the icon path defined in assets/iconPath
  name?: string;
  // relative size of the icon
  size?: string; // in px
  // hex or css name
  color?: string;
}

// simple handler for svg's to allow easier styling
const BaseIcon: React.FC<IconProps> = ({name = "file", size = "16", color = "white"}) => {
  const iconPath = iconPathMap.get(name)
  const iconSizeStyle: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`
  }

  return (
    <i style={ iconSizeStyle } className="flex align-center justify-center">
      {iconPath 
        ? // icon exists
          <svg height={`${size}`} fill={color} viewBox="0 0 24 24">
            <title>{name}</title>
            <path d={iconPath} />
          </svg>
        : // bad icon name
          <svg height={`${size}`} fill={color} viewBox="0 0 24 24">
            <title>Missing Icon</title>
            <path d={ iconPathMap.get("broken_image")} />
          </svg>
      }
    </i>
  )
}

export default BaseIcon