import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

const Button = ({ style, displayText, textStyle, onPress, disabled=false }) => {

  return (
    <TouchableOpacity
      style={style}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyle}>{displayText}</Text>
    </TouchableOpacity>
  )
}

export default Button