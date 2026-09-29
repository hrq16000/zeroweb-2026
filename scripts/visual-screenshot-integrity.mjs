/**
 * Detecta um artefato específico do Chromium headless em que uma faixa do topo
 * do viewport é rasterizada novamente no rodapé da captura. Retorna o maior
 * número de linhas repetidas pixel a pixel; 0 significa captura íntegra.
 *
 * A faixa mínima é deliberadamente alta para não confundir padrões legítimos
 * pequenos. O chamador também exige página maior que o viewport antes de retry.
 */
export function repeatedTopStripRows(png, { minRows = 48, maxRows = 128 } = {}) {
  const width = Number(png?.width ?? 0);
  const height = Number(png?.height ?? 0);
  const data = png?.data;
  if (!width || !height || !data) return 0;

  const bytesPerRow = width * 4;
  const max = Math.min(maxRows, Math.floor(height / 2));
  const min = Math.max(1, Math.min(minRows, max));
  for (let rows = max; rows >= min; rows -= 1) {
    const bottomStart = (height - rows) * bytesPerRow;
    const bytes = rows * bytesPerRow;
    let equal = true;
    for (let i = 0; i < bytes; i += 1) {
      if (data[i] !== data[bottomStart + i]) {
        equal = false;
        break;
      }
    }
    if (equal) return rows;
  }
  return 0;
}
