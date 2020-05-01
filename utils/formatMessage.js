function getClanName(clanName) {
  let output = ``;
  for (const letter of clanName.toLowerCase()) {
    output += `:regional_indicator_${letter}: `;
  }

  return output;
}

module.exports.getClanName = getClanName;
