import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import config from '../config.json'
import '../styles/css/AuthForm.css'
import Button from './Button'
import Input from './Input'

const AuthForm: React.FC<IAuthFormProps> = ({
  formTitle,
  btnText,
  btnLink,
  onSubmit,
  err,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [inputType, setInputType] = useState<boolean>(false)

  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current!.type = inputType ? 'text' : 'password'

    if (!btnRef.current) return
    btnRef.current!.classList.remove(inputType ? 'closed' : 'opened')
    btnRef.current!.classList.add(inputType ? 'opened' : 'closed')
  }, [inputType])

  return (
    <div className="auth__form-container f-md">
      <div className="auth__form-subcontainer">
        <h1 className="f-hg">{formTitle}</h1>
        <form className="auth__form" method="post" onSubmit={onSubmit}>
          <div className="auth__form-groups">
            {err && (
              <span id="red">
                This username has already been taken or your credentials are
                incorrect
              </span>
            )}
            <div className="auth__form-group">
              <label htmlFor="username">
                Username
                <span className="f-smx" id="red">
                  *
                </span>
                :
              </label>
              <div className="auth__form-group__info f-smx">
                Can not be started with a digit. Must contain 5 to 20 characters
                without spaces:
                <i>'a-z/0-9/_'</i>
              </div>
              <Input
                width={'inherit'}
                height={45}
                name={'username'}
                pattern={config.PATTERNS.AUTH_FORM.USERNAME}
              />
            </div>
            <div className="auth__form-group">
              <label htmlFor="password">
                Password
                <span className="f-smx" id="red">
                  *
                </span>
                :
              </label>
              <div className="auth__form-group__info f-smx">
                Must contain 5 to 20 characters without spaces:
                <i>'a-z', 'A-Z', '0-9' and './_/!/@/#/$/%/^/&/*'</i>
              </div>
              <div className="auth__form-ipt__group">
                <Input
                  width={'inherit'}
                  height={45}
                  ref={inputRef}
                  name={'password'}
                  type={!inputType ? 'password' : ''}
                  pattern={config.PATTERNS.AUTH_FORM.PASSWORD}
                />
                <button
                  className="auth__form-ipt__group-btn closed"
                  ref={btnRef}
                  type="button"
                  onClick={() => setInputType(!inputType)}
                />
              </div>
            </div>
          </div>
          <div className="auth__form-btn__group">
            <Button
              isStatic={true}
              width={'min(200px, 100%)'}
              height={45}
              type={'submit'}
              content={'Submit'}
            />
            <Link className="lnk f-smx" id="grey" to={btnLink || '/'}>
              {btnText || 'Sign up'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthForm
