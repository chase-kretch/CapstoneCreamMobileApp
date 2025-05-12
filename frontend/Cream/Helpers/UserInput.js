import React from 'react';
import { TextInput } from 'react-native';


const UserInput = ({ onChangeText, keyboardType='default', placeholder, style, maxLength=50, value=undefined, isSecureTextEntry=false }) => {

  return ( 
    <TextInput
      style={style}
      keyboardType={keyboardType}
      secureTextEntry={isSecureTextEntry}
      placeholder={placeholder}
      placeholderTextColor="#000"
      onChangeText={(val) => onChangeText(val)}
      maxLength={maxLength}
      value={value}
    />
  )
}

export default UserInput;