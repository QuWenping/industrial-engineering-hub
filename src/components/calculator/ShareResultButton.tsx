"use client";

import { useState } from "react";
import { Share2, Copy, Check, Loader2, Mail } from "lucide-react";

interface Props {
  calculator: string;
  calculatorName: string;
  inputData: Record<string, number | string>;
  resultData: { value: number | string; unit: string; label: string };
  formula?: string;
}

export function ShareResultButton({ calculator, calculatorName, inputData, resultData, formula }: Props) {
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  async function handleShare() {
    setSharing(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calculator, calculatorName, inputData, resultData, formula }),
      });
      const data = await res.json();
      if (data.ok) {
        setShareUrl(data.url);
        setShowShare(true);
      }
    } catch (e) {
      console.error("Share failed:", e);
    }
    setSharing(false);
  }

  function handleCopyText() {
    const lines = [
      calculatorName + " - Calculation Result",
      "",
      "Inputs:",
      ...Object.entries(inputData).map(([k, v]) => "  " + k + ": " + v),
      "",
      "Result: " + resultData.value + " " + resultData.unit,
      "",
      "Calculated by Industrial Engineering Studio",
      "https://www.industrialengineeringstudio.com/tools/" + calculator,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const shareText = encodeURIComponent("Calculated " + resultData.label + ": " + resultData.value + " " + resultData.unit + " using " + calculatorName);
  const shareLink = encodeURIComponent(shareUrl);

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleShare}
          disabled={sharing}
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 transition-colors disabled:opacity-50"
        >
          {sharing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
          Share Result
        </button>
        <button
          onClick={handleCopyText}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy Result"}
        </button>
      </div>

      {showShare && shareUrl && (
        <div className="rounded-lg border border-engineering-blue/20 bg-engineering-blue/5 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
            />
            <button
              onClick={handleCopyLink}
              className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
          <div className="flex gap-2">
            <a
              href={"https://www.linkedin.com/sharing/share-offsite/?url=" + shareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-[#0077B5] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
            >
              <Share2 className="h-3 w-3" /> LinkedIn
            </a>
            <a
              href={"https://twitter.com/intent/tweet?text=" + shareText + "&url=" + shareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
            >
              <Share2 className="h-3 w-3" /> X
            </a>
            <a
              href={"mailto:?subject=" + encodeURIComponent(calculatorName + " Result") + "&body=" + shareText + "%0A%0A" + shareLink}
              className="inline-flex items-center gap-1 rounded-md bg-slate-600 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
            >
              <Mail className="h-3 w-3" /> Email
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
