import React from 'react';
import PortalEmpleoView from './PortalEmpleoView';

export default function PortalEmpleoModal({ isOpen, onClose, dark = false, selectedJob = null }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[2500] bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="fixed inset-0 z-[2510] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <div
          id="portal-empleo-modal"
          className={`w-full max-w-4xl rounded-[2rem] shadow-2xl border transition-all animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto no-scroll my-auto ${
            dark ? 'bg-zinc-950/98 border-zinc-800 text-white' : 'bg-white/98 border-zinc-200 text-zinc-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <PortalEmpleoView
            dark={dark}
            onClose={onClose}
            embedded={false}
            initialJobId={selectedJob?.id || null}
          />
        </div>
      </div>
    </>
  );
}
