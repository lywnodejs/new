import React, {useEffect, useState} from 'react'
import Carousel, {Modal as ImageModal, ModalGateway} from 'react-images'

const ImageModalGateway = ({modalIsOpen, setModalIsOpen, previewImgs}) => {
  const toggleModal = () => {
    setModalIsOpen((modalIsOpen) => !modalIsOpen)
  }
  const Footer = ({currentView, modalProps}) => {
    return null
  }
  return (
    <ModalGateway>
      {modalIsOpen ? (
        <ImageModal onClose={toggleModal}>
          <Carousel views={previewImgs} components={{Footer}} />
        </ImageModal>
      ) : null}
    </ModalGateway>
  )
}

export default ImageModalGateway
