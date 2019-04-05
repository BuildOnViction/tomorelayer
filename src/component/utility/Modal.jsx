import React from 'react'

const Modal = ({
  children,
  containerClass,
  onBackgroundClick = void 0,
}) => (
  <div className="modal">
    <div className="modal__backround" onClick={onBackgroundClick} />
    <div className={`modal__container ${containerClass}`}>
      {children}
    </div>
  </div>
)

export default Modal
