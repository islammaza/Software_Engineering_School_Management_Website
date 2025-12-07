import { getReportDataForPdf, refreshReportSummary } from "../api/student_report";

// this is how to name the file : replace spaces with underscores; keep Arabic letters
function buildFilename(studentName: string) {
  const safe = studentName.trim().replace(/\s+/g, "_");
  return `${safe}_تقرير.pdf`;
}

// Wrap Arabic text in explicit RTL embedding to force correct ordering in pdfmake/PDFKit.
// Use Unicode RLE/PDF markers to ensure correct bidi rendering without manual reversing.
function rtl(text: string) {
  if (!text) return text;
  // Heuristic: if string contains any Arabic range characters, wrap it.
  const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
  if (!hasArabic) return text;
  // Normalize numerals and punctuation to Arabic forms to reduce bidi breaks
  const westernToArabicDigits: Record<string, string> = {
    "0": "\u0660", "1": "\u0661", "2": "\u0662", "3": "\u0663", "4": "\u0664",
    "5": "\u0665", "6": "\u0666", "7": "\u0667", "8": "\u0668", "9": "\u0669",
  };
  const punctMap: Record<string, string> = {
    ",": "\u060C", // Arabic comma
    ";": "\u061B", // Arabic semicolon
    "?": "\u061F", // Arabic question mark
    "-": "\u2010", // hyphen
    "(": "\uFD3E", // ornate left parenthesis for RTL
    ")": "\uFD3F", // ornate right parenthesis for RTL
  };
  let normalized = text.replace(/[0-9]/g, (d) => westernToArabicDigits[d] || d)
                       .replace(/[,:;?\-()]/g, (p) => punctMap[p] || p)
                       .replace(/\s+/g, (s) => s.replace(/ /g, "\u00A0")); // non-breaking space
  // Avoid double-wrapping
  if (normalized.startsWith("\u202B") && normalized.endsWith("\u202C")) return normalized;
  return `\u202B${normalized}\u202C`;
}

export async function exportStudentReportPdf(studentId: string) {
  await refreshReportSummary(studentId, { updateReportRow: true });
  const data = await getReportDataForPdf(studentId);

  // Robust dynamic import handling for ESM/CJS interop
  const rawPdfMake: any = await import("pdfmake/build/pdfmake");
  const pdfMake: any = rawPdfMake.default || rawPdfMake.pdfMake || rawPdfMake; // accommodate different bundler outputs
  const rawFonts: any = await import("pdfmake/build/vfs_fonts");
  const providedVfs = rawFonts.pdfMake?.vfs || rawFonts.vfs;
  pdfMake.vfs = providedVfs || pdfMake.vfs || {};

  const has = (name: string) => !!pdfMake.vfs[name];
  if (!has("Roboto-Medium.ttf") && has("Roboto-Regular.ttf")) {
    pdfMake.vfs["Roboto-Medium.ttf"] = pdfMake.vfs["Roboto-Regular.ttf"];
  }
  if (!has("Roboto-MediumItalic.ttf") && has("Roboto-Italic.ttf")) {
    pdfMake.vfs["Roboto-MediumItalic.ttf"] = pdfMake.vfs["Roboto-Italic.ttf"];
  }

  const fallbackKey = Object.keys(pdfMake.vfs)[0];
  const roboto = {
    normal: has("Roboto-Regular.ttf") ? "Roboto-Regular.ttf" : fallbackKey,
    bold: has("Roboto-Bold.ttf") ? "Roboto-Bold.ttf" : (has("Roboto-Regular.ttf") ? "Roboto-Regular.ttf" : fallbackKey),
    italics: has("Roboto-Italic.ttf") ? "Roboto-Italic.ttf" : (has("Roboto-Regular.ttf") ? "Roboto-Regular.ttf" : fallbackKey),
    bolditalics: has("Roboto-BoldItalic.ttf") ? "Roboto-BoldItalic.ttf" : (has("Roboto-Italic.ttf") ? "Roboto-Italic.ttf" : (has("Roboto-Bold.ttf") ? "Roboto-Bold.ttf" : (has("Roboto-Regular.ttf") ? "Roboto-Regular.ttf" : fallbackKey))),
  };

  const ensureArabicFont = async (): Promise<{ regular: string; bold: string; italic: string; bolditalic: string }> => {
    const regularKey = "Amiri-Regular.ttf";
    const boldKey = "Amiri-Bold.ttf";
    const italicKey = "Amiri-Italic.ttf";
    const boldItalicKey = "Amiri-BoldItalic.ttf";
    const haveAll = has(regularKey) && has(boldKey) && has(italicKey) && has(boldItalicKey);
    if (haveAll) return { regular: regularKey, bold: boldKey, italic: italicKey, bolditalic: boldItalicKey };

    // localStorage cache for each style
    const cacheNames = {
      regular: "pdf_amiri_regular_base64",
      bold: "pdf_amiri_bold_base64",
      italic: "pdf_amiri_italic_base64",
      bolditalic: "pdf_amiri_bolditalic_base64",
    } as const;

    const tryCached = (key: string, fontKey: string) => {
      if (has(fontKey)) return true;
      if (typeof window === "undefined") return false;
      const cached = window.localStorage.getItem(key);
      if (cached) {
        pdfMake.vfs[fontKey] = cached;
        return true;
      }
      return false;
    };

    tryCached(cacheNames.regular, regularKey);
    tryCached(cacheNames.bold, boldKey);
    tryCached(cacheNames.italic, italicKey);
    tryCached(cacheNames.bolditalic, boldItalicKey);
    const postCacheAll = has(regularKey) && has(boldKey) && has(italicKey) && has(boldItalicKey);
    if (postCacheAll) return { regular: regularKey, bold: boldKey, italic: italicKey, bolditalic: boldItalicKey };

    // Correct upstream paths (GitHub repo stores fonts directly under /fonts)
    const sources = [
      "/fonts/Amiri-Regular.ttf",
      "/fonts/Amiri-Bold.ttf",
      "/fonts/Amiri-Italic.ttf",
      "/fonts/Amiri-BoldItalic.ttf",
      // GitHub raw (main branch)
      "https://raw.githubusercontent.com/aliftype/amiri/main/fonts/Amiri-Regular.ttf",
      "https://raw.githubusercontent.com/aliftype/amiri/main/fonts/Amiri-Bold.ttf",
      "https://raw.githubusercontent.com/aliftype/amiri/main/fonts/Amiri-Italic.ttf",
      "https://raw.githubusercontent.com/aliftype/amiri/main/fonts/Amiri-BoldItalic.ttf",
      // jsDelivr (latest tag)
      "https://cdn.jsdelivr.net/gh/aliftype/amiri@latest/fonts/Amiri-Regular.ttf",
      "https://cdn.jsdelivr.net/gh/aliftype/amiri@latest/fonts/Amiri-Bold.ttf",
      "https://cdn.jsdelivr.net/gh/aliftype/amiri@latest/fonts/Amiri-Italic.ttf",
      "https://cdn.jsdelivr.net/gh/aliftype/amiri@latest/fonts/Amiri-BoldItalic.ttf",
    ];

    // Helper: convert ArrayBuffer -> base64 in chunks to avoid stack limits
    const toBase64 = (buf: ArrayBuffer) => {
      const bytes = new Uint8Array(buf);
      const chunkSize = 0x8000; // 32KB
      let binary = "";
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      return btoa(binary);
    };

    // TTF signature (0x00010000) or OpenType 'OTTO'
    const isValidTtf = (bytes: Uint8Array) => {
      if (bytes.length < 4) return false;
      const a = bytes[0], b = bytes[1], c = bytes[2], d = bytes[3];
      const isTtf = a === 0x00 && b === 0x01 && c === 0x00 && d === 0x00;
      const isOtf = a === 0x4f && b === 0x54 && c === 0x54 && d === 0x4f; // 'OTTO'
      return isTtf || isOtf;
    };

    // Map to style by filename
    const saveFont = (filename: string, base64: string) => {
      pdfMake.vfs[filename] = base64;
      if (typeof window !== "undefined") {
        const map: Record<string, string> = {
          [regularKey]: cacheNames.regular,
          [boldKey]: cacheNames.bold,
          [italicKey]: cacheNames.italic,
          [boldItalicKey]: cacheNames.bolditalic,
        };
        const cacheKey = map[filename];
        if (cacheKey) {
          try { window.localStorage.setItem(cacheKey, base64); } catch (_) {}
        }
      }
    };

    for (const url of sources) {
      const fileName = url.split("/").pop() || "";
      if (![regularKey, boldKey, italicKey, boldItalicKey].includes(fileName)) continue;
      if (has(fileName)) continue;
      try {
        const resp = await fetch(url);
        if (!resp.ok) continue;
        const buf = await resp.arrayBuffer();
        const bytes = new Uint8Array(buf);
        if (!isValidTtf(bytes)) continue;
        const base64 = toBase64(buf);
        saveFont(fileName, base64);
      } catch (_e) {
        // ignore and continue
      }
    }

    // Ensure at least regular exists
    if (!has(regularKey)) {
      // fallback to Roboto
      return { regular: roboto.normal, bold: roboto.bold, italic: roboto.italics, bolditalic: roboto.bolditalics };
    }
    // If bold/italic missing, alias to regular
    if (!has(boldKey)) pdfMake.vfs[boldKey] = pdfMake.vfs[regularKey];
    if (!has(italicKey)) pdfMake.vfs[italicKey] = pdfMake.vfs[regularKey];
    if (!has(boldItalicKey)) pdfMake.vfs[boldItalicKey] = pdfMake.vfs[regularKey];
    return { regular: regularKey, bold: boldKey, italic: italicKey, bolditalic: boldItalicKey };
  };

  const arabicFonts = await ensureArabicFont();
  const amiri = { normal: arabicFonts.regular, bold: arabicFonts.bold, italics: arabicFonts.italic, bolditalics: arabicFonts.bolditalic };

  // Define fonts ONLY via pdfMake.fonts (docDefinition should not contain a fonts section)
  pdfMake.fonts = { Amiri: amiri, Roboto: roboto };
  const effectiveFont = has(amiri.normal) ? "Amiri" : "Roboto";

  const studentName = data.student.full_name || "طالب";
  const finalNote = (data.computed_final_note ?? data.report.final_note ?? 0).toFixed(2);
  const today = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });

  // Fit-to-one-page heuristics
  const modulesCount = data.modules.length;
  // Automatically switch to landscape when there are many modules
  const landscapeThreshold = 9;
  const pageOrientation: "portrait" | "landscape" =
    modulesCount > landscapeThreshold ? "landscape" : "portrait";
  // Estimate "row-equivalents" including header, student info, summary boxes, and verse
  const extraRowBlocks = 6;
  const estimatedRows = modulesCount + extraRowBlocks;
  // Base maximum rows per orientation – used to drive the global scaling factor
  const baseMaxRows = pageOrientation === "portrait" ? 8 : 14;
  // Much more aggressive minimum scale to prioritize keeping everything on a single page
  const scale = Math.max(0.4, Math.min(1, baseMaxRows / Math.max(1, estimatedRows)));
  const s = (n: number) => Math.max(7, Math.round(n * scale));
  const isCompact = scale < 0.7;

  // Optionally clamp very long observation text to avoid overflow
  let observation = data.report.final_observation ?? "—";
  const maxObsChars = Math.floor(280 * scale);
  if (observation.length > maxObsChars) observation = observation.slice(0, Math.max(0, maxObsChars - 1)) + "…";

  // Adjust margins depending on scale to squeeze more if needed
  const pageMargins: [number, number, number, number] =
    scale < 0.55
      ? [18, 24, 18, 26]
      : scale < 0.8
      ? [24, 32, 24, 34]
      : [34, 44, 34, 46];
  const scoreColWidth = Math.max(
    56,
    Math.round((pageOrientation === "portrait" ? 80 : 96) * Math.max(0.78, scale))
  );
  // Content width used for decorative elements (depends on orientation)
  const contentWidth = pageOrientation === "portrait" ? 515 : 760;

  // Table body – hard cap on number of displayed modules to enforce single-page layout
  const tableBody: any[] = [
    [
      { text: rtl("الوحدة"), style: "tableHeader", alignment: "right" },
      { text: rtl("الدرجة"), style: "tableHeader", alignment: "center" },
      { text: rtl("ملاحظة"), style: "tableHeader", alignment: "right" },
    ],
  ];
  const maxModulesDisplayed = pageOrientation === "portrait" ? 10 : 16;
  const displayedModules = data.modules.slice(0, maxModulesDisplayed);
  displayedModules.forEach((mod) => {
    const assess = data.assessments.find((a) => a.module_id === mod.id);
    tableBody.push([
      { text: rtl(mod.name), style: "cell", alignment: "right" },
      { text: assess?.score != null ? assess.score.toString() : "—", style: "cell", alignment: "center" },
      { text: rtl(assess?.remark ?? "—"), style: "cell", alignment: "right" },
    ]);
  });
  const hiddenModulesCount = Math.max(0, data.modules.length - maxModulesDisplayed);
  if (hiddenModulesCount > 0) {
    tableBody.push([
      {
        text: rtl(`+ ${hiddenModulesCount} وحدات إضافية لم تُعرض في هذا التقرير المختصر`),
        style: "cell",
        alignment: "right",
        colSpan: 3,
      },
      {},
      {},
    ]);
  }

  const docDefinition = {
    pageSize: "A4",
    pageMargins,
    pageOrientation,
    info: {
      title: `${studentName} - تقرير الأداء`,
      author: "School System",
      subject: "Student Performance Report",
      keywords: "student report performance",
    },
    defaultStyle: {
      font: effectiveFont,
      alignment: "right",
      direction: "rtl",
    },
    styles: {
      title: { fontSize: s(24), bold: true, color: "#0d9488", margin: [0, 0, 0, s(6)], decoration: "underline", decorationStyle: "solid", decorationColor: "#14b8a6" },
      subtitle: { fontSize: s(14), bold: true, color: "#059669", margin: [0, s(6), 0, s(10)] },
      label: { fontSize: s(10), bold: true, color: "#6b7280", margin: [0, 0, 0, s(2)] },
      value: { fontSize: s(12), bold: true, color: "#1f2937", margin: [0, 0, 0, s(8)] },
      tableHeader: { fillColor: "#0d9488", color: "#ffffff", fontSize: s(12), bold: true, margin: [s(4), s(6), s(4), s(6)] },
      cell: { fontSize: s(11), margin: [s(4), s(4), s(4), s(4)], color: "#374151" },
      finalBoxLabel: { fontSize: s(10), bold: true, color: "#6b7280", margin: [0, 0, 0, s(2)] },
      finalBoxValue: { fontSize: s(26), bold: true, color: "#0d9488", margin: [0, s(2), 0, 0] },
      observationHeader: { fontSize: s(12), bold: true, color: "#0d9488", margin: [0, 0, 0, s(4)] },
      observationText: { fontSize: s(10), lineHeight: 1.4, color: "#4b5563", margin: [0, 0, 0, 0] },
      verse: { fontSize: s(12), italics: true, color: "#0d9488", margin: [0, s(12), 0, s(4)], lineHeight: 1.4 },
      verseRef: { fontSize: s(9), color: "#6b7280", italics: true },
      divider: { margin: [0, s(10), 0, s(10)] },
    },
    content: [
      // Header with decorative line
      {
        canvas: [
          {
            type: "rect",
            x: 0,
            y: 0,
            w: contentWidth,
            h: Math.max(2, Math.round(3 * scale)),
            color: "#0d9488",
          },
        ],
        margin: [0, 0, 0, isCompact ? s(10) : s(16)],
      },
      { text: rtl("تقرير أداء الطالب"), style: "title", alignment: "center" },
      
      // Divider
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: contentWidth,
            y2: 0,
            lineWidth: 1,
            lineColor: "#e5e7eb",
          },
        ],
        margin: [0, 0, 0, isCompact ? s(12) : s(20)],
      },
      
      // Student info section with background
      {
        table: {
          widths: ["*", "*"],
          body: [
            [
              {
                stack: [
                  { text: rtl("اسم الطالب"), style: "label", alignment: "right" },
                  { text: rtl(studentName), style: "value", alignment: "right" },
                ],
                border: [false, false, false, false],
                fillColor: "#f0fdfa",
                margin: [s(10), s(10), s(10), s(10)],
              },
              {
                stack: [
                  { text: rtl("الأستاذ"), style: "label", alignment: "right" },
                  { text: rtl(data.group?.teacher_name ?? "—"), style: "value", alignment: "right" },
                ],
                border: [false, false, false, false],
                fillColor: "#f0fdfa",
                margin: [s(10), s(10), s(10), s(10)],
              },
            ],
            [
              {
                stack: [
                  { text: rtl("المجموعة"), style: "label", alignment: "right" },
                  { text: rtl(data.group?.name ?? "—"), style: "value", alignment: "right" },
                ],
                border: [false, false, false, false],
                fillColor: "#f0fdfa",
                margin: [s(10), s(10), s(10), s(10)],
              },
              {
                stack: [
                  { text: rtl("التاريخ"), style: "label", alignment: "right" },
                  { text: rtl(today), style: "value", alignment: "right" },
                ],
                border: [false, false, false, false],
                fillColor: "#f0fdfa",
                margin: [s(10), s(10), s(10), s(10)],
              },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, isCompact ? s(14) : s(20)],
      },
      
      // Section header for modules
      { text: rtl("تفاصيل الوحدات الدراسية"), style: "observationHeader", margin: [0, 0, 0, s(10)] },
      {
        table: {
          headerRows: 1,
          widths: ["*", scoreColWidth, "*"],
          body: tableBody,
        },
        layout: {
          fillColor: (rowIndex: number) => {
            if (rowIndex === 0) return null;
            return rowIndex % 2 === 0 ? "#f0fdfa" : "#ffffff";
          },
          hLineColor: (i: number) => i === 0 || i === 1 ? "#0d9488" : "#d1d5db",
          vLineColor: () => "#d1d5db",
          hLineWidth: (i: number) => i === 0 || i === 1 ? 2 : 1,
          vLineWidth: () => 1,
          paddingLeft: () => s(6),
          paddingRight: () => s(6),
          paddingTop: () => s(4),
          paddingBottom: () => s(4),
        },
        margin: [0, 0, 0, s(24)],
      },
      // Final grade and observation section with styled boxes
      {
        columns: [
          {
            width: "*",
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    stack: [
                      { text: rtl("المعدل النهائي"), style: "finalBoxLabel", alignment: "center" },
                      { text: rtl(finalNote), style: "finalBoxValue", alignment: "center" },
                    ],
                    border: [true, true, true, true],
                    fillColor: "#f0fdfa",
                    margin: [12, 16, 12, 16],
                  },
                ],
              ],
            },
            layout: {
              hLineColor: () => "#14b8a6",
              vLineColor: () => "#14b8a6",
              hLineWidth: () => 2,
              vLineWidth: () => 2,
            },
          },
          {
            width: "*",
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    stack: [
                      { text: rtl("ملاحظة الأستاذ"), style: "finalBoxLabel", alignment: "right" },
                      { text: rtl(observation), style: "observationText", alignment: "right" },
                    ],
                    border: [true, true, true, true],
                    fillColor: "#fefce8",
                    margin: [s(12), s(16), s(12), s(16)],
                  },
                ],
              ],
            },
            layout: {
              hLineColor: () => "#ca8a04",
              vLineColor: () => "#ca8a04",
              hLineWidth: () => 2,
              vLineWidth: () => 2,
            },
          },
        ],
        columnGap: s(20),
        margin: [0, 0, 0, 0],
      },
      
      // Decorative divider before verse
      {
        canvas: [
          {
            type: "line",
            x1: 150,
            y1: 0,
            x2: pageOrientation === "portrait" ? 365 : 540,
            y2: 0,
            lineWidth: 1,
            dash: { length: 5, space: 3 },
            lineColor: "#cbd5e1",
          },
        ],
        margin: [0, isCompact ? s(16) : s(24), 0, isCompact ? s(12) : s(20)],
      },
      
      // Quranic verse with decorative styling (slightly compressed in compact mode)
      ...(isCompact
        ? [
            {
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      stack: [
                        { text: rtl("﴿فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۖ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ﴾"), style: "verse", alignment: "center" },
                        { text: rtl("سورة الزلزلة"), style: "verseRef", alignment: "center", margin: [0, 4, 0, 0] },
                      ],
                      border: [false, false, false, false],
                      fillColor: "#f9fafb",
                      margin: [s(12), s(8), s(12), s(8)],
                    },
                  ],
                ],
              },
              layout: "noBorders",
            },
          ]
        : [
            {
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      stack: [
                        { text: rtl("\"فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ۖ وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ\""), style: "verse", alignment: "center" },
                        { text: rtl("سورة الزلزلة"), style: "verseRef", alignment: "center", margin: [0, 6, 0, 0] },
                      ],
                      border: [false, false, false, false],
                      fillColor: "#f9fafb",
                      margin: [s(20), s(12), s(20), s(12)],
                    },
                  ],
                ],
              },
              layout: "noBorders",
            },
          ]),
      
      // Footer decorative line
      {
        canvas: [
          {
            type: "rect",
            x: 0,
            y: 0,
            w: contentWidth,
            h: 2,
            color: "#e5e7eb",
          },
        ],
        margin: [0, isCompact ? s(10) : s(16), 0, 0],
      },
    ],
  } as any;

  return new Promise<void>((resolve, reject) => {
    try {
      pdfMake.createPdf(docDefinition).download(buildFilename(studentName));
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
