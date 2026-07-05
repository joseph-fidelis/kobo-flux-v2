import * as XLSX from 'xlsx'

export interface ParsedXlsxSheet {
  headers: string[]
  dataRows: (string | number)[][]
  sheetName: string
}

export function parseXlsxBuffer(buffer: ArrayBuffer): ParsedXlsxSheet {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    throw new Error('Workbook has no sheets')
  }

  const sheet = workbook.Sheets[sheetName]
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`)
  }

  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, {
    header: 1,
    defval: '',
  })

  const headers = (rows[0] ?? [])
    .map((cell) => String(cell).trim())
    .filter(Boolean)

  const dataRows = rows
    .slice(1)
    .filter((row) => row.some((cell) => String(cell).trim() !== ''))

  return { headers, dataRows, sheetName }
}

export async function parseXlsxFile(file: File): Promise<ParsedXlsxSheet> {
  return parseXlsxBuffer(await file.arrayBuffer())
}

export async function parseXlsxBlob(blob: Blob): Promise<ParsedXlsxSheet> {
  return parseXlsxBuffer(await blob.arrayBuffer())
}

export function buildXlsxBlob(headers: string[], rows: (string | number)[][] = []) {
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'data')
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}
