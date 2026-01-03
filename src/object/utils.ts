const KNOWN_EXTENSIONS = new Set([
  "AI",
  "AIF",
  "AIFC",
  "AIFF",
  "ARJ",
  "ASF",
  "ASX",
  "AU",
  "AUDIO",
  "AVI",
  "BAK",
  "BMP",
  "BZ2",
  "C",
  "CLASS",
  "COM",
  "CPIO",
  "CPP",
  "CSS",
  "CXX",
  "DOC",
  "DOCX",
  "EXE",
  "FLAC",
  "GIF",
  "GZ",
  "H",
  "HPP",
  "HTML",
  "HTM",
  "ICO",
  "INI",
  "ISO",
  "JAR",
  "JAVA",
  "JPE",
  "JPEG",
  "JPG",
  "JS",
  "JSON",
  "LZH",
  "M3U",
  "M4A",
  "M4V",
  "MD",
  "MID",
  "MIDI",
  "MK3D",
  "MKA",
  "MKS",
  "MKV",
  "MOV",
  "MP2",
  "MP3",
  "MP4",
  "MPE",
  "MPEG",
  "MPG",
  "MPV",
  "O",
  "OBJ",
  "OGA",
  "OGG",
  "OGM",
  "OGV",
  "OTF",
  "PDF",
  "PNG",
  "PPTX",
  "PS",
  "PSD",
  "PY",
  "RA",
  "RAM",
  "RAR",
  "RB",
  "RM",
  "RMVB",
  "RPM",
  "RTF",
  "S3M",
  "SH",
  "SO",
  "SVG",
  "SWF",
  "TAR",
  "TBZ2",
  "TGZ",
  "TIFF",
  "TIF",
  "TTF",
  "TXT",
  "W64",
  "WAV",
  "WMA",
  "WMV",
  "WV",
  "XHTML",
  "XLS",
  "XLSX",
  "XML",
  "XZ",
  "ZIP",
  "WEBM",
]);

const SINGLE_DOT_FILES = new Set([".", ".."]);

export function getFileType(key: string): string {
  const filename = key.split("/").pop() ?? key;

  if (!filename || SINGLE_DOT_FILES.has(filename)) {
    return "—";
  }

  const lastDotIndex = filename.lastIndexOf(".");

  if (
    lastDotIndex === -1 ||
    lastDotIndex === 0 ||
    lastDotIndex === filename.length - 1
  ) {
    return "—";
  }

  const extension = filename.slice(lastDotIndex + 1).toUpperCase();

  if (KNOWN_EXTENSIONS.has(extension)) {
    return extension;
  }

  if (extension.length < 1 || extension.length > 10) {
    return "—";
  }

  if (/^[A-Z0-9]+$/.test(extension)) {
    return "BIN";
  }

  return "—";
}
