var ARTC_LABELS = {
    281: '32028100',
    282: '32028200',
    29: '32029000',
    30: '32030000',
    31: '32031000'
};
function getSuitArtc(artc) {
    return ARTC_LABELS[artc];
}
console.log(getSuitArtc('282'));
