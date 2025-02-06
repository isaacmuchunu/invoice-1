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
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={onClick}
          size="lg"
          className="h-16 px-6 bg-[#FF4545] hover:bg-[#ff6b6b] shadow-lg rounded-full flex items-center space-x-2 transform-gpu hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-6 w-6 text-white" />
          <span className="text-white font-medium">New Invoice</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default CreateInvoiceFAB;
