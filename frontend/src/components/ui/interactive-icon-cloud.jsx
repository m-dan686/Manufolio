import { useEffect, useMemo, useState } from "react"
import { useTheme } from "../../context/ThemeContext"
import {
  Cloud,
  fetchSimpleIcons,
  renderSimpleIcon,
} from "react-icon-cloud"

export const cloudProps = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 10,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.08, -0.08],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.03,
    minSpeed: 0.01,
  },
}

export const renderCustomIcon = (icon, theme) => {
  // Use our bold theme colors for background/fallback contrast
  const bgHex = theme === "light" ? "#f4fff8" : "#050a08"
  const fallbackHex = theme === "light" ? "#ff7a00" : "#1f9d55"
  const minContrastRatio = theme === "dark" ? 2 : 1.2

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e) => e.preventDefault(),
    },
  })
}

export function IconCloud({ iconSlugs }) {
  const [data, setData] = useState(null)
  const { theme } = useTheme()

  useEffect(() => {
    fetchSimpleIcons({ slugs: iconSlugs }).then(setData)
  }, [iconSlugs])

  const renderedIcons = useMemo(() => {
    if (!data) return null

    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon, theme || "dark"),
    )
  }, [data, theme])

  return (
    <Cloud {...cloudProps}>
      <>{renderedIcons}</>
    </Cloud>
  )
}
