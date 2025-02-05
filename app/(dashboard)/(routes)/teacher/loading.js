import { Loader2 } from 'lucide-react';
import React from 'react'

const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <Loader2 className="h-16 w-16 animate-spin text-slate-800 dark:text-slate-100" />
    </div>
  )
}

export default Loading;