'use client'
import { toast } from 'sonner'
import { AlertTriangle, X } from 'lucide-react'

export const confirmAction = (
  message: string,
  options?: {
    title?: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
  }
): Promise<boolean> => {
  const {
    title = 'Confirm Action',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
  } = options || {}

  const variantStyles = {
    danger: {
      bg: 'bg-red-50',
      icon: 'bg-red-100 text-red-600',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      ring: 'ring-red-100'
    },
    warning: {
      bg: 'bg-amber-50',
      icon: 'bg-amber-100 text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
      ring: 'ring-amber-100'
    },
    info: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100 text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      ring: 'ring-blue-100'
    }
  }

  const styles = variantStyles[variant]

  return new Promise<boolean>((resolve) => {
    toast.custom(
      (toastId) => (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden transform transition-all animate-scale-in">
          <div className="relative">
            <button
              onClick={() => {
                toast.dismiss(toastId)
                resolve(false)
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.icon} flex items-center justify-center`}>
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="flex-1 pt-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                onClick={() => {
                  toast.dismiss(toastId)
                  resolve(false)
                }}
              >
                {cancelText}
              </button>
              <button
                className={`flex-1 px-4 py-2.5 rounded-xl ${styles.button} text-white font-medium shadow-lg active:scale-95 transition-all focus:outline-none focus:ring-2 ${styles.ring} focus:ring-offset-2`}
                onClick={() => {
                  toast.dismiss(toastId)
                  resolve(true)
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      ),
      { 
        duration: Infinity,
        position: 'top-center',
      }
    )
  })
}

