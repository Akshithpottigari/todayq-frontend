import { Loader2 } from "lucide-react";
import React from "react";

type Props = {};

function Loading({}: Props) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>
  );
}

export default Loading;
