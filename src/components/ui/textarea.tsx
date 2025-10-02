// src/components/ui/textarea.tsx
import React from "react";

// Definimos props extendiendo las props nativas de textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea: React.FC<TextareaProps> = (props) => {
  return <textarea {...props} className="border rounded p-2 w-full" />;
};

export default Textarea;
