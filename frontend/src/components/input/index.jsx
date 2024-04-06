import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Input = ({
    onChange,
    placeholder,
    label,
    disabled,
    type = 'text',
    inputClassName,
    labelClassName,
    className,
    name,
    required,
    onFocus,
    onBlur,
    value = ''
  }) => {

  const [ inputValue, setInputValue ] = useState(value)
  const handleValueChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    onChange(e)
  }
  useEffect(_ => {
    if (value !== inputValue) {
      setInputValue(value)
    }
  }, [value])


  return <div className='mb-3'>
    <label className='col-sm-2 col-form-label'>
      {label && <div className='mb-3'>
        {label}
      </div>}
      <input
        type={type}
        required={required}
        name={name}
        className='form-control'
        onChange={e => {
          handleValueChange(e)
        }}
        onFocus={onFocus}
        value={inputValue}
        onBlur={onBlur}
      />
    </label>
  </div>
}

export default Input
