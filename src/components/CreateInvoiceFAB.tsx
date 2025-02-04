import React from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface CreateInvoiceFABProps {
  onClick?: () => void;
}

const CreateInvoiceFAB = ({ onClick = () => {} }: CreateInvoiceFABProps) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        onClick={onClick}
        size="lg"
        className="h-14 w-14 rounded-full bg-[#FF4545] hover:bg-[#ff6b6b] shadow-lg"
      >
        <Plus className="h-6 w-6 text-white" />
      </Button>
    </motion.div>
  );
};

export default CreateInvoiceFAB;
