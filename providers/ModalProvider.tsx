"use client";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";

import { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMoundeted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMoundeted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <UploadModal />
    </>
  );
};

export default ModalProvider;
