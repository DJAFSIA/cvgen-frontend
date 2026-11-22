"""Convertit les PDF captures (premiere page) en PNG pour le film, puis supprime les PDF."""
import pathlib
import sys

import fitz

for dossier in sys.argv[1:]:
    for pdf in sorted(pathlib.Path(dossier).glob("*.pdf")):
        doc = fitz.open(pdf)
        doc[0].get_pixmap(dpi=150).save(pdf.with_suffix(".png"))
        print(pdf.with_suffix(".png").name, doc.page_count, "page(s)")
        doc.close()
        pdf.unlink()
