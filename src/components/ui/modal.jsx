import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Modal = ({ children, isOpen, onClose, className }) => {
  // Close on escape key press
  React.useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={cn(
              "fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[90vw] max-w-lg overflow-hidden rounded-lg",
              className
            )}
            initial={{ opacity: 0, y: 20, x: "-50%", translateY: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%", translateY: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%", translateY: "-50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ModalContent = ({ children, className }) => {
  return (
    <div
      className={cn(
        "backdrop-blur-md bg-white/10 dark:bg-black/20 border-0 shadow-xl overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-lg" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const ModalHeader = ({ children, className, onClose }) => {
  return (
    <div
      className={cn("flex items-center justify-between p-6 pb-2", className)}
    >
      <div className="text-xl font-bold text-white">{children}</div>
      {onClose && (
        <motion.button
          className="text-white/70 hover:text-white rounded-full p-1"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  );
};

const ModalBody = ({ children, className }) => {
  return (
    <div className={cn("p-6 pt-2 text-white/90", className)}>{children}</div>
  );
};

const ModalFooter = ({ children, className }) => {
  return (
    <div
      className={cn("flex items-center justify-end gap-3 p-6 pt-2", className)}
    >
      {children}
    </div>
  );
};

export { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter };
