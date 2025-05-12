import React, {useState} from 'react';
import { TextInput, StyleSheet} from 'react-native';
import ModalSelector from 'react-native-modal-selector'

const DropdownPicker = ({ placeholder, onSelectValue, pickableValues }) => {

  const [displayValue, setDisplayValue] = useState('')

  return (
    <ModalSelector
      data={pickableValues}
      keyExtractor={item => item}
      labelExtractor={item => item}
      initValue={placeholder}
      onChange={(option) => {
        option === "Non-Binary" ? onSelectValue("NonBinary") : onSelectValue(option)
        setDisplayValue(option)
      }}
      style={styles.pickerStyle}
      optionTextStyle={styles.optionTextStyle}
      cancelText='Cancel'
      optionContainerStyle={styles.sectionStyle}
      cancelStyle={styles.sectionStyle}
    >
      <TextInput
        editable={false}
        placeholder={placeholder}
        placeholderTextColor={'black'}
        value={displayValue} 
        style={styles.displayTextStyle}
        />

    </ ModalSelector>
  )
}

const styles = StyleSheet.create({
  pickerStyle: {
    alignContent: 'flex-end',
    justifyContent: 'flex-start',
    borderWidth: 2,
    borderRadius: 35,
    height: 48,
    marginBottom: 12,
    paddingLeft: 20,
    paddingTop: 12
  },
  optionTextStyle: {
    color: 'black'
  },
  displayTextStyle: {
    color: 'black',
    marginBottom: 12,
  },
  sectionStyle: {
    backgroundColor: 'white',
  },
})

export default DropdownPicker