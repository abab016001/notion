type SUIT_ARTC_CD = '281' | '282' | '29' | '30' | '31';

const ARTC_LABELS: Record<SUIT_ARTC_CD, string> = {
    281: '32028100',
    282: '32028200',
    29:  '32029000',
    30:  '32030000',
    31:  '32031000'
};

function getSuitArtc(artc: SUIT_ARTC_CD): string {
    return ARTC_LABELS[artc];
}

console.log(getSuitArtc('282'));