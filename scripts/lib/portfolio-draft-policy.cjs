"use strict";

/**
 * True only for catalog entries intentionally withheld from public indexing.
 * A draft may be reachable for client review (live=true) while indexable=false.
 */
function isUnpublishedDraftPortfolio(item) {
  return Boolean(
    item &&
    item.status === "draft" &&
    (item.live === false || item.indexable === false)
  );
}

module.exports = { isUnpublishedDraftPortfolio };
