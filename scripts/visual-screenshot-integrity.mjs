/**
 * Detecta um artefato específico do Chromium headless em que uma faixa do topo
 * do viewport é rasterizada novamente no rodapé da captura. Retorna o maior
 * número de linhas repetidas pixel a pixel; 0 significa captura íntegra.
 *
 * A faixa mínima é deliberadamente alta para não confundir padrões legítimos
 * pequenos. O chamador também exige página maior que o viewport antes de retry.
 */
function topStripHasVisualSignal(data, width, rows) {
  const bytesPerRow = width * 4;
  let strongEdges = 0;
  const needed = Math.max(24, Math.floor((width * rows) * 0.0005));

  for (let y = 0; y < rows; y += 2) {
    const row = y * bytesPerRow;
    for (let x = 2; x < width; x += 2) {
      const i = row + x * 4;
      const p = i - 8;
      const delta =
        Math.abs(data[i] - data[p]) +
        Math.abs(data[i + 1] - data[p + 1]) +
        Math.abs(data[i + 2] - data[p + 2]);
      if (delta > 36) {
        strongEdges += 1;
        if (strongEdges >= needed) return true;
      }
    }
  }
  return false;
}

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
    if (equal && topStripHasVisualSignal(data, width, rows)) return rows;
  }
  return 0;
}
