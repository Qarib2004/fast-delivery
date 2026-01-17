'use client'
import React from 'react'
import Modal from '../common/modal';
import RegistrationForm from '@/forms/registration.form';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;

}

const RegistrationModal = ({ isOpen, onClose ,onSwitchToLogin}: IProps) => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Registration"
        size="md"
      >
        <RegistrationForm onSwitchToLogin={onSwitchToLogin} onClose={onClose} />
      </Modal>
    );
}

export default RegistrationModal;
