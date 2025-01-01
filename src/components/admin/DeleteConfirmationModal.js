import React from "react";

// deleteDetail Step3: เรียกใข้งาน Modal
export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold text-gray-900"> {title} </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="flex justify-end space-x-4 p-4">
          {/* // deleteDetail Step4: เมื่อกด "Yes, I want to delete".*/}
          <button
            onClick={onConfirm}
            className="rounded-full bg-pink-100 px-6 py-2 text-pink-500 hover:bg-pink-200"
          >
            {confirmLabel}
          </button>
          {/*// deleteDetail Step3.1: การยกเลิก model: 1*/}
          {/* ปุ่ม Cancel: แสดงเฉพาะเมื่อ cancelLabel มีค่า */}
          {cancelLabel && (
            <button
              onClick={onClose}
              className="rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-600"
            >
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
