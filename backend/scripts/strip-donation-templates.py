"""
Builds the base PDFs used by DonationCertificateService and
DonationReceiptService from the designer's sample exports.

The samples have a real donor's details baked in ("Jerin Philip", "10,000",
...) as outlined shapes plus an invisible text layer. This removes everything
lying fully inside the regions below, keeping the background, logos, panels,
dividers, table lines and fixed wording, so the services can draw each
donor's details in the same places.

    python scripts/strip-donation-templates.py

Requires PyMuPDF (pip install pymupdf).
"""
import re
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent
SOURCES = ROOT / "scripts" / "donation-templates"
OUT = ROOT / "src" / "assets" / "certificates"

# Regions in PDF units (origin top-left) of each template page
TEMPLATES = {
    "certificate-base.pdf": (
        "certificate-of-donation.pdf",
        [
            fitz.Rect(1300, 1765, 5000, 2160),  # donor name
            fitz.Rect(1300, 2190, 5000, 2450),  # "has generously contributed towards the <category> ..."
            # values row, one region per column between the dividers
            fitz.Rect(870, 3095, 1660, 3260),
            fitz.Rect(1710, 3095, 2490, 3260),
            fitz.Rect(2535, 3095, 3390, 3260),
            fitz.Rect(3440, 3095, 4670, 3260),
            fitz.Rect(4715, 3095, 5650, 3260),
        ],
    ),
    "receipt-base.pdf": (
        "donation-receipt.pdf",
        [
            fitz.Rect(300, 345, 945, 391),  # "We confirm the receipt of donation from <name>."
            fitz.Rect(300, 391, 945, 437),  # "ONLINE <amount>/- Dated <date>"
            # table values, one region per row between the row lines
            *[fitz.Rect(700, top, 1135, top + 52) for top in (519, 592, 665, 738, 811, 884, 957)],
            # 80G note body: drawn by the service so the wording can be corrected in code
            fitz.Rect(140, 1128, 1135, 1232),
        ],
    ),
}


def strip(src: Path, dst: Path, regions: list[fitz.Rect]) -> None:
    doc = fitz.open(src)
    page = doc[0]
    for rect in regions:
        page.add_redact_annot(rect, fill=False)
    page.apply_redactions(
        images=fitz.PDF_REDACT_IMAGE_NONE,
        graphics=fitz.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED,
    )
    # The export also carries an invisible text layer (selectable/searchable
    # copy of the sample donor's details) that redaction doesn't catch; the
    # visible artwork is all outlines, so dropping every text object is safe.
    for xref in page.get_contents():
        content = doc.xref_stream(xref).decode("latin-1")
        doc.update_stream(xref, re.sub(r"\bBT\b.*?\bET\b", "", content, flags=re.S).encode("latin-1"))
    doc.save(dst, garbage=4, deflate=True)
    print(f"{src.name} -> {dst.relative_to(ROOT)} ({len(regions)} regions cleared)")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for out_name, (src_name, regions) in TEMPLATES.items():
        strip(SOURCES / src_name, OUT / out_name, regions)


if __name__ == "__main__":
    main()
