
const Button = ({
  children,
  modifier = 'style_light-blue',
  href,
  clickHandler,
  className,
  disabled,
  type = 'button'
}) => {

  if (href) {
    return <a
      className=''
      href={href}
    >
      {children}
    </a>
  }
  return <button
    className='form-control'
    disabled={disabled}
    onClick={_ => clickHandler && clickHandler()}
  >
    {children}
  </button>
}


export default Button