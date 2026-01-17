'use client'
import React from "react";
import Modal from "../common/modal";
import LoginForm from "@/forms/login.form";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: IProps) => {
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} title="Login" size="md">
        <LoginForm onClose={onClose} />
      </Modal>
    </div>
  );
};

export default LoginModal;
