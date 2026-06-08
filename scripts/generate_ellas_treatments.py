"""
Genera data/treatments.ts desde el Excel de Tratamientos Capilares Ellas.
Ejecutar desde la raíz del proyecto: python scripts/generate_ellas_treatments.py
"""
from __future__ import annotations

import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = Path(r"d:\UNAD_Maestria\Copia de Ingredientes naturales.xlsx")
OUT = ROOT / "data" / "treatments.ts"


def slugify(name: str) -> str:
    s = name.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def extract_afro(s: object) -> dict[str, str]:
    if not s or not isinstance(s, str):
        return {}
    text = str(s)
    markers = list(re.finditer(r"(?i)(?:Cabello\s*)?4([ABC])\s*\(", text))
    d: dict[str, str] = {}
    for i, m in enumerate(markers):
        start = m.end()
        end = markers[i + 1].start() if i + 1 < len(markers) else len(text)
        inner = text[start:end].strip().rstrip(")").strip()
        inner = re.sub(r"\)\s*\.\s*$", "", inner).strip()
        inner = re.sub(r"\s+", " ", inner)
        letter = "4" + m.group(1).upper()
        d[letter] = inner
    # Limpieza CHONTAHAIR: a veces queda texto mezclado 4B/4C
    if "4B" in d and "4C" not in d and "cabello 4c" in d["4B"].lower():
        parts = re.split(r"(?i)cabello\s*4c\s*", d["4B"], maxsplit=1)
        if len(parts) == 2:
            d["4B"] = parts[0].replace(")", "").strip()
            d["4C"] = parts[1].replace(")", "").strip()
    return d


def benefits_to_list(b: object) -> list[str]:
    if not b or not isinstance(b, str):
        return []
    t = re.sub(r"\s+", " ", b.strip())
    if not t:
        return []
    chunks = re.split(r",(?=[^,]{0,80}$)|,\s+", t)
    out = [c.strip() for c in chunks if c.strip()]
    if len(out) > 6:
        return [t[:200] + ("…" if len(t) > 200 else "")]
    return out[:8] if out else [t]


def infer_symptoms(
    benefits_blob: str, product: str, ingredients: str
) -> list[str]:
    text = f"{benefits_blob} {product} {ingredients}".lower()
    sym: list[str] = []

    def add(s: str) -> None:
        if s not in sym:
            sym.append(s)

    if re.search(r"caida|caída|prevenir la caida", text):
        add("Caída o debilitamiento")
    if re.search(r"crecimient", text):
        add("Crecimiento lento")
    if re.search(r"sequedad|seco|hidrata|hidrat", text):
        add("Sequedad")
    if re.search(r"rotura|quiebre|fragil|puntas|repar", text):
        add("Rotura o puntas abiertas")
    if re.search(r"frizz|encresp|encresp", text):
        add("Encrespamiento")
    if re.search(r"caspa", text):
        add("Caspa o picor leve")
    if re.search(r"brillo", text):
        add("Falta de brillo")
    if re.search(r"electric|rebelde|manejabilidad", text):
        add("Pelo rebelde o con electricidad estática")
    if not sym:
        add("Falta de brillo")
    return sym


def ts_escape(s: str) -> str:
    return (
        s.replace("\\", "\\\\")
        .replace("'", "\\'")
        .replace("\n", " ")
        .replace("\r", "")
    )


def row_tuple(r: tuple) -> str:
    return str(r)


def main() -> None:
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    ws = wb["Hoja1"]
    rows = [tuple(c for c in row) for row in ws.iter_rows(min_row=2, values_only=True)]
    wb.close()

    from collections import defaultdict

    groups: dict[str, list[tuple]] = defaultdict(list)
    for r in rows:
        if r[1] is None:
            continue
        groups[str(r[1])].append(r)

    lines: list[str] = [
        "/**",
        " * Catálogo Tratamientos Capilares Ellas (exportado desde Excel).",
        " * Regenerar: `python scripts/generate_ellas_treatments.py`",
        " */",
        "",
        'export type AfroSubType = "4A" | "4B" | "4C";',
        "",
        "export type TreatmentRecord = {",
        "  id: string;",
        "  /** Nombre comercial del producto */",
        "  name: string;",
        "  ingredients: string[];",
        "  benefits: string[];",
        "  symptoms: string[];",
        "  vitamins?: string;",
        "  afroBenefitByType?: Partial<Record<AfroSubType, string>>;",
        "  chemicallyTreatedNote?: string;",
        "  generalNote?: string;",
        "};",
        "",
        "export const TREATMENTS: readonly TreatmentRecord[] = [",
    ]

    for pname in sorted(groups.keys(), key=lambda x: (groups[x][0][0] or 0, x)):
        gr = groups[pname]
        first = gr[0]
        n, name, fruit, vitamins, benefits, tipo_afro, chem, general = (
            first[0],
            first[1],
            first[2],
            first[3],
            first[4],
            first[5],
            first[6],
            first[7],
        )

        if len(gr) > 1 and pname == "BOTANIHAIR BLEND":
            ingredients: list[str] = []
            vit_parts: list[str] = []
            ben_parts: list[str] = []
            for sub in gr:
                fr, vt, be = sub[2], sub[3], sub[4]
                if fr:
                    ingredients.append(f"{fr}: {be or ''}".strip(": ").strip())
                if vt:
                    vit_parts.append(f"{fr}: {vt}" if fr else str(vt))
                if be:
                    ben_parts.append(str(be))
            benefits_list = benefits_to_list("; ".join(ben_parts))
            vitamins_s = "; ".join(vit_parts) if vit_parts else ""
            afro = extract_afro(gr[0][5]) if gr[0][5] else {}
            chem_s = str(gr[0][6]) if gr[0][6] else ""
            gen_s = " ".join(
                str(x[7]) for x in gr if x[7] and str(x[7]).strip()
            ).strip()
        else:
            ingredients = [str(fruit)] if fruit else [name]
            benefits_list = benefits_to_list(benefits)
            vitamins_s = str(vitamins) if vitamins else ""
            afro = extract_afro(tipo_afro)
            chem_s = str(chem) if chem else ""
            gen_s = str(general) if general else ""

        benefits_blob = str(benefits or "") + " " + " ".join(benefits_list)
        symptoms = infer_symptoms(
            benefits_blob, str(name), " ".join(ingredients)
        )

        pid = slugify(str(name))

        lines.append("  {")
        lines.append(f"    id: '{ts_escape(pid)}',")
        lines.append(f"    name: '{ts_escape(str(name))}',")
        lines.append("    ingredients: [")
        for ing in ingredients:
            lines.append(f"      '{ts_escape(ing)}',")
        lines.append("    ],")
        lines.append("    benefits: [")
        for b in benefits_list:
            lines.append(f"      '{ts_escape(b)}',")
        lines.append("    ],")
        lines.append("    symptoms: [")
        for s in symptoms:
            lines.append(f"      '{ts_escape(s)}',")
        lines.append("    ],")
        if vitamins_s:
            lines.append(f"    vitamins: '{ts_escape(vitamins_s)}',")
        if afro:
            lines.append("    afroBenefitByType: {")
            for k in ("4A", "4B", "4C"):
                if k in afro:
                    lines.append(f"      '{k}': '{ts_escape(afro[k])}',")
            lines.append("    },")
        if chem_s.strip():
            lines.append(
                f"    chemicallyTreatedNote: '{ts_escape(chem_s.strip())}',"
            )
        if gen_s.strip():
            lines.append(f"    generalNote: '{ts_escape(gen_s.strip())}',")
        lines.append("  },")

    lines.append("] as const;")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
