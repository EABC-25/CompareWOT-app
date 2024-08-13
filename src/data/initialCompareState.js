const compareStats = {
  general: ['tier', 'type', 'nation'],
  firepower: [
    'DPM',
    'penetration',
    'damage',
    'rate of fire',
    'reload time',
    'caliber',
    'ammo capacity',
    'potential damage',
  ],
  gunHandling: ['aim time', 'dispersion', 'elevation', 'depression'],
  mobility: [
    'forward speed',
    'reverse speed',
    'engine power',
    'weight',
    'auto siege on/off',
  ],
  armorAndHealth: ['hull armor', 'turret armor', 'health'],
  miscellaneous: ['view range', 'radio range', 'fire chance', 'tank cost'],
};

export default compareStats;
