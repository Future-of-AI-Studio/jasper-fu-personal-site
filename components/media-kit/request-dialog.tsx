"use client";

import { useRef } from "react";

import { MEDIA_KIT_INQUIRY_TYPE } from "../../lib/contact";
import { InquiryForm } from "../contact/inquiry-form";

const TITLE_ID = "media-kit-request-title";

/**
 * A native <dialog>, so Esc-to-close, the focus trap, and the backdrop come
 * from the platform rather than a library — the same reason the FAQ and the
 * mobile menu use <details>.
 */
export function MediaKitRequestDialog({ label }: { label: string }) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className="button-link"
        onClick={() => dialog.current?.showModal()}
        type="button"
      >
        {label}
      </button>

      <dialog
        aria-labelledby={TITLE_ID}
        className="request-dialog"
        // A click that lands on the dialog itself rather than the panel is a
        // click on the backdrop.
        onClick={(event) => {
          if (event.target === dialog.current) {
            dialog.current.close();
          }
        }}
        ref={dialog}
      >
        <div className="request-dialog__panel">
          <header className="request-dialog__head">
            <h2 id={TITLE_ID}>{label}</h2>
            <button
              aria-label="Close"
              className="request-dialog__close"
              onClick={() => dialog.current?.close()}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          {/* One request type on a page dedicated to it, so no type picker,
              and no Calendly: booking a call is for interviews, not for
              sending a kit. */}
          <InquiryForm
            defaultType={MEDIA_KIT_INQUIRY_TYPE}
            onCancel={() => dialog.current?.close()}
            showScheduling={false}
            types={[MEDIA_KIT_INQUIRY_TYPE]}
          />
        </div>
      </dialog>
    </>
  );
}
